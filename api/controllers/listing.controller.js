import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import axios from "axios";

// Function to get geolocation from an address
const getGeolocation = async (address) => {
    const apiKey = process.env.GOOGLE_GEOCODING_API_KEY; // Store your API key in environment variables
    console.log(apiKey);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
  
    if (response.data.status === 'OK') {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error('Unable to fetch geolocation data');
    }
  };

// Create Listing with Geolocation
export const createListing = async (req, res, next) => {
    try {
      const { address } = req.body;
      
      // Get geolocation from address
      const geoLocation = await getGeolocation(address);
  
      const listing = await Listing.create({
        ...req.body,
        geoLocation, // Add geolocation data to the listing
      });
  
      return res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  };

export const deleteListing = async (req,res,next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch(error) {
        next(error);
    }
}

// Update Listing with Geolocation
export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const { address } = req.body;
      
      // Get geolocation if address is updated
      let geoLocation = listing.geoLocation; // Default to existing geolocation
      if (address && address !== listing.address) {
        geoLocation = await getGeolocation(address);
      }
  
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        { ...req.body, geoLocation },
        { new: true }
      );
  
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }

        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = {$in: [false, true]};
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
          }
      
          let parking = req.query.parking;
      
          if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
          }

          let type = req.query.type;

          if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
          }

          const searchTerm = req.query.searchTerm || '';

          const sort = req.query.sort || 'createdAt';
      
          const order = req.query.order || 'desc';

          const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
          })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

            return res.status(200).json(listings);
        

    } catch (error) {
        next(error);
    }
}