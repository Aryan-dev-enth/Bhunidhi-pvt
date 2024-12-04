import Site from '../models/Site.js';
import Region from '../models/Region.js';
import { checkOverlap } from '../utils/overlapChecker.js';

export const createSite = async (req, res) => {
  try {
    const { geolocation, suspectType } = req.body;

    if (!geolocation || !geolocation.lat || !geolocation.lon) {
      return res
        .status(400)
        .json({ message: 'Geolocation (latitude and longitude) is required.' });
    }

    // Check if a site with the same geolocation already exists
    const existingSite = await Site.findOne({
      'geolocation.lat': geolocation.lat,
      'geolocation.lon': geolocation.lon,
    });

    if (existingSite) {
      return res
        .status(409)
        .json({ message: 'A site with the same geolocation already exists.' });
    }

    const regions = await Region.find();
    
    const foundRegion = regions.find(region =>
        checkOverlap(region.boundaries, geolocation.lat, geolocation.lon)
      );

    if (!foundRegion) {
      return res
        .status(404)
        .json({ message: 'No region found for the given geolocation.' });
    }

    const newSite = new Site({
      geolocation,
      suspectType: suspectType ?? 'system',
      region: foundRegion._id,
    });

    console.log(newSite)

    const savedSite = await newSite.save();

    // Update the region with the new site
    foundRegion.sites.push(savedSite._id);
    await foundRegion.save();

    return res.status(201).json(savedSite);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Could not create site.' });
  }
};


export const getAllSites = async (req, res) => {
    try {
      const sites = await Site.find()
        .populate('region')
        .exec();
  
      if (!sites || sites.length === 0) {
        return res.status(404).json({ message: 'No sites found.' });
      }
  
      return res.status(200).json(sites);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error. Could not retrieve sites.' });
    }
  };

  export const getSiteById = async (req, res) => {
    try {
      const site = await Site.findById(req.params.id)
        .populate('region')
        .exec();
  
      if (!site) {
        return res.status(404).json({ message: 'Site not found.' });
      }
  
      return res.status(200).json(site);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error. Could not retrieve site.' });
    }
  };

  export const updateSite = async (req, res) => {
    try {
      const { geolocation, suspectType, metaData, permitInfo } = req.body;
  
      const site = await Site.findById(req.params.id);
      
      if (!site) {
        return res.status(404).json({ message: 'Site not found.' });
      }
  
      if (geolocation) {
        site.geolocation = geolocation;
      }
  
      if (suspectType) {
        site.suspectType = suspectType;
      }
  
      if (metaData) {
        site.metaData = metaData;
      }
  
      if (permitInfo) {
        site.permitInfo = permitInfo;
      }
  
      await site.save();
      return res.status(200).json(site);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error. Could not update site.' });
    }
  };


export const deleteSite = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);

    if (!site) {
      return res.status(404).json({ message: 'Site not found.' });
    }

    const region = await Region.findById(site.region);

    if (region) {
      region.sites.pull(site._id);
      await region.save();
    }

    await site.remove();
    return res.status(200).json({ message: 'Site deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Could not delete site.' });
  }
};
