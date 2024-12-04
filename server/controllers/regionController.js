import Region from "../models/Region.js";
import createSingleHexagonBoundary from "../utils/hexagonHelper.js";
import { checkOverlap } from "../utils/overlapChecker.js";
import Site from '../models/Site.js';
import Report from '../models/Report.js';
import User from '../models/User.js'
import * as h3 from 'h3-js';

import Drone from '../models/Drone.js';

export const createRegion = async (req, res) => {
  try {
    const { title, lat, lon, resolution, apiId } = req.body;

    if (!title || !lat || !lon) {
      return res
        .status(400)
        .json({ message: "Title, lat, and lon are required." });
    }

    const newBoundary = createSingleHexagonBoundary(lat, lon, resolution || 6);
    

    const drones = [];
    for (let x = 1; x <= 5; x++) {
      const droneTitle = `${title.split(" ")[0]}-Drone-00${x}`;
      const newDrone = new Drone({
        title: droneTitle,
        region: null,
       
        surveyQueue: [],
        surveyedSites: [],
        operationTime: null,
        status: 'charging',
      });

      drones.push(newDrone);
    }

    const newRegion = new Region({
      title,
      boundaries: newBoundary, 
      apiId,
      geolocation: [[lat, lon]],
      drones: [],
      sites: [],
      reports: [],
    });

    const savedRegion = await newRegion.save();

    const droneIds = [];
    for (const drone of drones) {
      drone.region = savedRegion._id;
      const savedDrone = await drone.save();
      droneIds.push(savedDrone._id);
    }

    savedRegion.drones = droneIds;
    await savedRegion.save();

    return res.status(201).json(savedRegion);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Could not create region." });
  }
};


export const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find().populate("drones sites reports");
    return res.status(200).json(regions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Could not fetch regions." });
  }
};

export const getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
  

    const region = await Region.findById(id).populate("drones sites reports");
    
    if (!region) {
      return res.status(404).json({ message: "Region not found." });
    }

    return res.status(200).json(region);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Could not fetch region." });
  }
};


import mongoose from "mongoose";

export const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid region ID." });
    }

    const updates = req.body;

    const updatedRegion = await Region.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedRegion) {
      return res.status(404).json({ message: "Region not found." });
    }

    return res.status(200).json(updatedRegion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Could not update region." });
  }
};


export const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Region ID is required." });
    }

    const region = await Region.findById(id);

    if (!region) {
      return res.status(404).json({ message: "Region not found." });
    }

    // Delete all associated drones
    await Drone.deleteMany({ _id: { $in: region.drones } });

    // Delete the region
    await Region.findByIdAndDelete(id);

    return res.status(200).json({ message: "Region and associated drones deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Could not delete region." });
  }
};
