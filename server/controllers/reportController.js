import Report from '../models/Report.js';
import Site from '../models/Site.js';
import Region from '../models/Region.js';
import { checkOverlap } from '../utils/overlapChecker.js';

import User from '../models/User.js';

export const createReport = async (req, res) => {
  try {
    const { user, siteGeolocation, image, description, isAnonymous } = req.body;

    if (!user || !siteGeolocation || !siteGeolocation.lat || !siteGeolocation.lon) {
      return res
        .status(400)
        .json({ message: 'User and geolocation (latitude, longitude) are required.' });
    }

    const newSite = new Site({
      geolocation: siteGeolocation,
      suspectType: 'user',
    });

    const savedSite = await newSite.save();

    const newReport = new Report({
      user,
      site: savedSite._id,
      image,
      description,
      isAnonymous,
    });

    const savedReport = await newReport.save();

    const userDoc = await User.findById(user);
    if (userDoc) {
      userDoc.reports.push(savedReport._id);
      await userDoc.save();
    }

    return res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Could not create report.' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user', 'name email')
      .populate('site')
      .exec();

    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: 'No reports found.' });
    }

    return res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Could not retrieve reports.' });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'name email')
      .populate('site')
      .exec();

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Could not retrieve report.' });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { image, description, status } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    if (image) {
      report.image = image;
    }
    if (description) {
      report.description = description;
    }
    if (status) {
      report.status = status;
      report.statusUpdate = new Date();
    }

    const updatedReport = await report.save();
    return res.status(200).json(updatedReport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Could not update report.' });
  }
};

export const deleteReport = async (req, res) => {
    try {
      const { id } = req.params;
  
      const report = await Report.findById(id);
  
      if (!report) {
        return res.status(404).json({ message: 'Report not found.' });
      }
  
      const userDoc = await User.findById(report.user);
      if (userDoc) {
        userDoc.reports.pull(report._id);
        await userDoc.save();
      }
  
      // Remove the report itself
      await report.remove();
  
      return res.status(200).json({ message: 'Report deleted successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error. Could not delete report.' });
    }
  };
  
