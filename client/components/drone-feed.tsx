'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart } from './line-chart'
import type { SurveyData } from "@/types/drone"
import { Button } from './ui/button'
import { Battery, MapPin, Wifi } from 'lucide-react'
import Link from 'next/link'

interface DroneFeedProps {
  droneId: string
}

export function DroneFeed({ droneId }: DroneFeedProps) {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    frontView: '/placeholder-front.jpg',
    topView: '/placeholder-top.jpg',
    telemetry: {
      altitude: 100,
      speed: 15,
      battery: 75,
      signal: 90
    },
    coordinates: {
      lat: 28.9845,
      lng: 77.7064
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Drone {droneId}</h2>
          <span className="rounded-full bg-success/20 px-2 py-0.5 text-sm text-success-foreground">
            Available
          </span>
        </div>
        <Link href="/drones">
          <Button variant="outline">Back to Drones</Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-lg bg-secondary p-4"
          >
            <h3 className="text-lg font-medium mb-2">Drone Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="font-medium">Model:</span> DJI Mavic 3</li>
              <li><span className="font-medium">Serial Number:</span> DJI123456789</li>
              <li><span className="font-medium">Last Maintenance:</span> 2023-05-15</li>
              <li><span className="font-medium">Flight Hours:</span> 120</li>
            </ul>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-lg bg-secondary p-4"
          >
            <h3 className="text-lg font-medium mb-2">Current Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <Battery className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Battery: {surveyData.telemetry.battery}%</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <Wifi className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Signal: {surveyData.telemetry.signal}%</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Altitude: {surveyData.telemetry.altitude}m</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 20H11V8L5.5 13.5L4.08 12.08L12 4.16L19.92 12.08L18.5 13.5L13 8V20Z" fill="currentColor"/>
                </svg>
                <span className="text-sm text-muted-foreground">Speed: {surveyData.telemetry.speed}km/h</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-lg bg-muted overflow-hidden h-[300px]"
        >
          <div className="p-4 text-muted-foreground">Live Location</div>
          <div className="h-full w-full bg-[url('/map-background.png')] bg-cover bg-center" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Front View</span>
            <span className="text-xs text-primary">Recording</span>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={surveyData.frontView}
              alt="Front view"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Top View</span>
            <span className="text-xs text-primary">Processing</span>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={surveyData.topView}
              alt="Top view"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-lg border p-4"
      >
        <div className="text-sm text-muted-foreground font-medium mb-2">Telemetry Data</div>
        <LineChart />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-end gap-4"
      >
        <Button variant="outline">Cancel Survey</Button>
        <Link href={`/drones/${droneId}/conclude`}>
          <Button className="bg-primary hover:bg-primary/90">
            Conclude Survey
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}