import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dgram from 'dgram';
import { Server } from 'socket.io';
import wait from 'waait';
import throttle from 'lodash/throttle.js';

import regionRoutes from './routes/regionRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();
const http = new (await import('http')).Server(app);
const io = new Server(http, {
  cors: {
    origin: ["http://localhost:3000", "*"],
  }
});

app.use(express.json());
app.use(cors());

app.use('/api/region', regionRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/report', reportRoutes);

const PORT = process.env.PORT || 8001;
const MONGODB_URI = process.env.MONGODB_URI;

const dronePort = 8889;
const droneHost = '192.168.10.1';
const drone = dgram.createSocket('udp4');
drone.bind(dronePort);

const droneState = dgram.createSocket('udp4');
droneState.bind(8890);

const videoStream = dgram.createSocket('udp4');
videoStream.bind(11111);

// Parse Drone State
function parseState(state) {
  return state
    .split(';')
    .map(x => x.split(':'))
    .reduce((data, [key, value]) => {
      data[key] = value;
      return data;
    }, {});
}

drone.on('message', message => {
  console.log(`🤖 Drone Message: ${message}`);
  io.sockets.emit('status', message.toString()); // Emit drone message to frontend
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.emit('status', 'CONNECTED');

  socket.on('command', (command) => {
    console.log(`Command from browser: ${command}`);
    drone.send(command, 0, command.length, dronePort, droneHost, (err) => {
      if (err) {
        console.log('Error sending command:', err);
      }
    });
  });

  socket.on('startVideoStream', () => {
    drone.send('streamon', 0, 'streamon'.length, dronePort, droneHost, (err) => {
      if (err) {
        console.log('Error starting video stream:', err);
      }
    });
    console.log('Video stream started.');
  });
});

droneState.on('message', throttle((state) => {
  const formattedState = parseState(state.toString());
  io.sockets.emit('dronestate', formattedState);
}, 100));

videoStream.on('message', (msg) => {
  console.log('Video Stream Data:', msg);
  
    const base64Data = msg.toString('base64');
    console.log(base64Data)

    io.sockets.emit('videoStream', base64Data); 
});


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
    http.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
