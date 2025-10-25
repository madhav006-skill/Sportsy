import express from 'express';
import fetch from 'node-fetch';
import Turf from '../models/Turf.js';

const router = express.Router();

// POST /api/turfs - Create a new turf (organizer only)
router.post('/', async (req, res) => {
  try {
    const { name, location, sportType, coordinates, address, city, state, country, postalCode, description, facilities, pricePerHour } = req.body;

    // Validate required fields
    if (!name || !location || !sportType) {
      return res.status(400).json({
        success: false,
        message: 'Name, location, and sport type are required'
      });
    }

    // Get user ID from session/auth
    const userId = req.user?._id || req.session?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Create new turf
    const turf = new Turf({
      name,
      location,
      sportType,
      createdBy: userId,
      coordinates,
      address,
      city,
      state,
      country,
      postalCode,
      description,
      facilities,
      pricePerHour
    });

    await turf.save();

    console.log(`✅ New turf created: ${name} at ${location}`);

    return res.status(201).json({
      success: true,
      turf,
      message: 'Turf created successfully'
    });
  } catch (error) {
    console.error('Create turf error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create turf'
    });
  }
});

// GET /api/turfs/search-by-location - Search turfs by city/location name using Places API Text Search
router.get('/search-by-location', async (req, res) => {
  try {
    const { location, radius = 5000 } = req.query;

    if (!location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Location parameter is required' 
      });
    }

    const useMock = (process.env.USE_MOCK_TURFS ?? 'true').toString().toLowerCase() !== 'false';

    // If mock mode, return mock data
    if (useMock) {
      console.log(`🎭 MOCK MODE: Searching turfs in "${location}"`);
      // Return generic mock data
      const mockTurfs = [
        {
          place_id: `mock_${location}_001`,
          name: `${location} Sports Arena`,
          vicinity: `Main Area, ${location}`,
          rating: 4.5,
          user_ratings_total: 234,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 0, lng: 0 } }
        }
      ];

      return res.json({
        success: true,
        results: mockTurfs,
        coordinates: { lat: 0, lng: 0 },
        mock: true,
        message: `Using mock data for ${location}`
      });
    }

    // Real Google Places API - Text Search
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('❌ GOOGLE_MAPS_API_KEY not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Maps API not configured' 
      });
    }

    console.log(`🔍 Searching for turfs in: "${location}"`);

    // Use Places API Text Search - searches for "turf" + location name
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=turf+in+${encodeURIComponent(location)}&key=${apiKey}`;
    const textSearchResponse = await fetch(textSearchUrl);
    const textSearchData = await textSearchResponse.json();

    if (textSearchData.status === 'OK' && textSearchData.results && textSearchData.results.length > 0) {
      // Get the first result's coordinates as the center point
      const centerPoint = textSearchData.results[0].geometry.location;
      
      console.log(`✅ Found ${textSearchData.results.length} turfs in ${location}`);
      console.log(`📍 Center coordinates: ${centerPoint.lat}, ${centerPoint.lng}`);

      return res.json({
        success: true,
        results: textSearchData.results,
        coordinates: centerPoint,
        status: textSearchData.status,
        mock: false
      });
    } else if (textSearchData.status === 'ZERO_RESULTS') {
      console.log(`⚠️ No turfs found in ${location}`);
      return res.json({
        success: true,
        results: [],
        status: textSearchData.status,
        mock: false,
        message: `No turfs found in ${location}`
      });
    } else {
      console.error('Places API error:', textSearchData);
      return res.status(500).json({
        success: false,
        message: textSearchData.error_message || 'Failed to search turfs',
        status: textSearchData.status
      });
    }
  } catch (error) {
    console.error('Turf search by location error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// GET /api/turfs/search - Search nearby turfs (mock by default, Google Places when enabled)
router.get('/search', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    const useMock = (process.env.USE_MOCK_TURFS ?? 'true').toString().toLowerCase() !== 'false';

    // If mock mode is enabled, return mock data
    if (useMock) {
      console.log('🎭 Using MOCK turf data for development');
      console.log(`📍 Search location: ${lat}, ${lng} (radius: ${radius}m)`);
    
      const mockTurfs = [
        {
          place_id: 'mock_gen_001',
          name: 'City Sports Arena',
          vicinity: 'Near your location',
          rating: 4.4,
          user_ratings_total: 234,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: parseFloat(lat) + 0.01, lng: parseFloat(lng) + 0.01 } }
        }
      ];

      return res.json({
        success: true,
        results: mockTurfs,
        status: 'OK',
        mock: true,
        message: 'Using mock turf data'
      });
    }

    // Real Google Maps API mode
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('❌ GOOGLE_MAPS_API_KEY not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Maps API not configured. Set GOOGLE_MAPS_API_KEY or enable USE_MOCK_TURFS.' 
      });
    }

    // Google Places API - Nearby Search
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=turf&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
      return res.json({
        success: true,
        results: data.results || [],
        status: data.status,
        mock: false
      });
    } else {
      console.error('Google Places API error:', data);
      return res.status(500).json({
        success: false,
        message: data.error_message || 'Failed to search turfs',
        status: data.status
      });
    }
  } catch (error) {
    console.error('Turf search error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// GET /api/turfs/details/:placeId - Get detailed info about a specific turf
router.get('/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Place ID is required' 
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: 'Maps API not configured' 
      });
    }

    // Google Places API - Place Details
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,reviews,photos,website&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return res.json({
        success: true,
        result: data.result
      });
    } else {
      return res.status(500).json({
        success: false,
        message: data.error_message || 'Failed to get turf details',
        status: data.status
      });
    }
  } catch (error) {
    console.error('Turf details error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// GET /api/turfs?query=search_term - Search turfs by name or location
router.get('/', async (req, res) => {
  try {
    const { query, sportType, limit = 20 } = req.query;

    let searchFilter = { isActive: true };

    // If query provided, search by name or location (case-insensitive)
    if (query && query.trim()) {
      searchFilter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ];
    }

    // Filter by sport type if provided
    if (sportType && sportType.trim()) {
      searchFilter.sportType = { $regex: sportType, $options: 'i' };
    }

    const turfs = await Turf.find(searchFilter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username email')
      .lean();

    console.log(`🔍 Turf search: "${query || 'all'}" - Found ${turfs.length} results`);

    return res.json({
      success: true,
      turfs,
      count: turfs.length
    });
  } catch (error) {
    console.error('Search turfs error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to search turfs'
    });
  }
});

// GET /api/turfs/:id - Get a specific turf by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const turf = await Turf.findById(id)
      .populate('createdBy', 'username email')
      .lean();

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    return res.json({
      success: true,
      turf
    });
  } catch (error) {
    console.error('Get turf error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to get turf details'
    });
  }
});

// PUT /api/turfs/:id - Update a turf (organizer who created it only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.session?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const turf = await Turf.findById(id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Check if user is the creator
    if (turf.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update turfs you created'
      });
    }

    // Update fields
    const updateFields = ['name', 'location', 'sportType', 'coordinates', 'address', 'city', 'state', 'country', 'postalCode', 'description', 'facilities', 'pricePerHour', 'isActive'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        turf[field] = req.body[field];
      }
    });

    await turf.save();

    console.log(`✅ Turf updated: ${turf.name}`);

    return res.json({
      success: true,
      turf,
      message: 'Turf updated successfully'
    });
  } catch (error) {
    console.error('Update turf error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update turf'
    });
  }
});

// DELETE /api/turfs/:id - Delete a turf (soft delete by setting isActive to false)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.session?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const turf = await Turf.findById(id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Check if user is the creator
    if (turf.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete turfs you created'
      });
    }

    // Soft delete
    turf.isActive = false;
    await turf.save();

    console.log(`🗑️ Turf deleted: ${turf.name}`);

    return res.json({
      success: true,
      message: 'Turf deleted successfully'
    });
  } catch (error) {
    console.error('Delete turf error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete turf'
    });
  }
});

export default router;
