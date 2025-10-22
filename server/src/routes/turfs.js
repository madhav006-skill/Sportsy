import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

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
    
      // Detect city based on coordinates (rough approximation)
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
    
    let mockTurfs = [];
    let detectedCity = 'GENERIC';
    
    // Bangalore: ~12.9716° N, 77.5946° E
    if (userLat >= 12.5 && userLat <= 13.5 && userLng >= 77.0 && userLng <= 78.0) {
      detectedCity = 'BANGALORE';
      mockTurfs = [
        {
          place_id: 'mock_blr_001',
          name: 'Champions Sports Arena',
          vicinity: 'Koramangala 5th Block, Bangalore',
          rating: 4.5,
          user_ratings_total: 234,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 12.9352, lng: 77.6245 } }
        },
        {
          place_id: 'mock_blr_002',
          name: 'PlayZone Football Turf',
          vicinity: 'Indiranagar, Bangalore',
          rating: 4.3,
          user_ratings_total: 189,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 12.9716, lng: 77.6412 } }
        },
        {
          place_id: 'mock_blr_003',
          name: 'SportVille Cricket & Football Ground',
          vicinity: 'Whitefield, Bangalore',
          rating: 4.7,
          user_ratings_total: 412,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 12.9698, lng: 77.7499 } }
        },
        {
          place_id: 'mock_blr_004',
          name: 'Elite Sports Complex',
          vicinity: 'HSR Layout, Bangalore',
          rating: 4.6,
          user_ratings_total: 321,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 12.9116, lng: 77.6473 } }
        },
        {
          place_id: 'mock_blr_005',
          name: 'Green Field Turf',
          vicinity: 'Jayanagar 4th Block, Bangalore',
          rating: 4.2,
          user_ratings_total: 156,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 12.9250, lng: 77.5838 } }
        },
        {
          place_id: 'mock_blr_006',
          name: 'Star Sports Arena',
          vicinity: 'Electronic City Phase 1, Bangalore',
          rating: 4.4,
          user_ratings_total: 278,
          opening_hours: { open_now: false },
          price_level: 2,
          geometry: { location: { lat: 12.8456, lng: 77.6603 } }
        }
      ];
    }
    // Mumbai: ~19.0760° N, 72.8777° E
    else if (userLat >= 18.5 && userLat <= 19.5 && userLng >= 72.5 && userLng <= 73.5) {
      detectedCity = 'MUMBAI';
      mockTurfs = [
        {
          place_id: 'mock_mum_001',
          name: 'Andheri Sports Arena',
          vicinity: 'Andheri West, Mumbai',
          rating: 4.6,
          user_ratings_total: 345,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 19.1136, lng: 72.8697 } }
        },
        {
          place_id: 'mock_mum_002',
          name: 'Bandra Football Hub',
          vicinity: 'Bandra East, Mumbai',
          rating: 4.4,
          user_ratings_total: 267,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 19.0596, lng: 72.8395 } }
        },
        {
          place_id: 'mock_mum_003',
          name: 'Powai Sports Complex',
          vicinity: 'Powai, Mumbai',
          rating: 4.5,
          user_ratings_total: 298,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 19.1176, lng: 72.9060 } }
        },
        {
          place_id: 'mock_mum_004',
          name: 'Goregaon Turf Ground',
          vicinity: 'Goregaon East, Mumbai',
          rating: 4.3,
          user_ratings_total: 198,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 19.1663, lng: 72.8526 } }
        },
        {
          place_id: 'mock_mum_005',
          name: 'Thane Sports Arena',
          vicinity: 'Thane West, Mumbai',
          rating: 4.2,
          user_ratings_total: 176,
          opening_hours: { open_now: false },
          price_level: 2,
          geometry: { location: { lat: 19.2183, lng: 72.9781 } }
        },
        {
          place_id: 'mock_mum_006',
          name: 'Malad Football Turf',
          vicinity: 'Malad West, Mumbai',
          rating: 4.1,
          user_ratings_total: 145,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 19.1864, lng: 72.8481 } }
        }
      ];
    }
    // Delhi/NCR: ~28.6139° N, 77.2090° E
    else if (userLat >= 28.0 && userLat <= 29.0 && userLng >= 76.5 && userLng <= 77.5) {
      detectedCity = 'DELHI/NCR';
      mockTurfs = [
        {
          place_id: 'mock_del_001',
          name: 'Champions Sports Arena',
          vicinity: 'Sector 18, Noida, Uttar Pradesh',
          rating: 4.5,
          user_ratings_total: 234,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 28.5706, lng: 77.3272 } }
        },
        {
          place_id: 'mock_del_002',
          name: 'PlayZone Football Turf',
          vicinity: 'Greater Kailash, New Delhi',
          rating: 4.3,
          user_ratings_total: 189,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 28.5494, lng: 77.2426 } }
        },
        {
          place_id: 'mock_del_003',
          name: 'SportVille Cricket & Football Ground',
          vicinity: 'Dwarka Sector 10, New Delhi',
          rating: 4.7,
          user_ratings_total: 412,
          opening_hours: { open_now: false },
          price_level: 2,
          geometry: { location: { lat: 28.5921, lng: 77.0460 } }
        },
        {
          place_id: 'mock_del_004',
          name: 'Elite Sports Complex',
          vicinity: 'Saket, South Delhi',
          rating: 4.6,
          user_ratings_total: 321,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 28.5244, lng: 77.2066 } }
        },
        {
          place_id: 'mock_del_005',
          name: 'Green Field Turf',
          vicinity: 'Vasant Kunj, New Delhi',
          rating: 4.2,
          user_ratings_total: 156,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 28.5167, lng: 77.1598 } }
        },
        {
          place_id: 'mock_del_006',
          name: 'Star Sports Arena',
          vicinity: 'Rohini Sector 15, New Delhi',
          rating: 4.4,
          user_ratings_total: 278,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 28.7455, lng: 77.0691 } }
        }
      ];
    }
    // Pune: ~18.5204° N, 73.8567° E
    else if (userLat >= 18.0 && userLat <= 19.0 && userLng >= 73.5 && userLng <= 74.5) {
      detectedCity = 'PUNE';
      mockTurfs = [
        {
          place_id: 'mock_pun_001',
          name: 'Koregaon Park Sports Ground',
          vicinity: 'Koregaon Park, Pune',
          rating: 4.5,
          user_ratings_total: 198,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 18.5362, lng: 73.8937 } }
        },
        {
          place_id: 'mock_pun_002',
          name: 'Viman Nagar Turf Arena',
          vicinity: 'Viman Nagar, Pune',
          rating: 4.3,
          user_ratings_total: 167,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 18.5679, lng: 73.9143 } }
        },
        {
          place_id: 'mock_pun_003',
          name: 'Wakad Sports Complex',
          vicinity: 'Wakad, Pune',
          rating: 4.4,
          user_ratings_total: 234,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 18.5990, lng: 73.7685 } }
        },
        {
          place_id: 'mock_pun_004',
          name: 'Hinjewadi Football Ground',
          vicinity: 'Hinjewadi Phase 1, Pune',
          rating: 4.2,
          user_ratings_total: 145,
          opening_hours: { open_now: false },
          price_level: 2,
          geometry: { location: { lat: 18.5912, lng: 73.7396 } }
        },
        {
          place_id: 'mock_pun_005',
          name: 'Baner Sports Arena',
          vicinity: 'Baner, Pune',
          rating: 4.6,
          user_ratings_total: 289,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 18.5590, lng: 73.7870 } }
        },
        {
          place_id: 'mock_pun_006',
          name: 'Kothrud Turf Ground',
          vicinity: 'Kothrud, Pune',
          rating: 4.1,
          user_ratings_total: 134,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 18.5074, lng: 73.8077 } }
        }
      ];
    }
    // Hyderabad: ~17.3850° N, 78.4867° E
    else if (userLat >= 17.0 && userLat <= 18.0 && userLng >= 78.0 && userLng <= 79.0) {
      detectedCity = 'HYDERABAD';
      mockTurfs = [
        {
          place_id: 'mock_hyd_001',
          name: 'Hitech City Sports Arena',
          vicinity: 'Hitech City, Hyderabad',
          rating: 4.5,
          user_ratings_total: 267,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 17.4485, lng: 78.3908 } }
        },
        {
          place_id: 'mock_hyd_002',
          name: 'Gachibowli Football Hub',
          vicinity: 'Gachibowli, Hyderabad',
          rating: 4.4,
          user_ratings_total: 234,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 17.4399, lng: 78.3487 } }
        },
        {
          place_id: 'mock_hyd_003',
          name: 'Banjara Hills Turf',
          vicinity: 'Banjara Hills, Hyderabad',
          rating: 4.6,
          user_ratings_total: 298,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: 17.4239, lng: 78.4738 } }
        },
        {
          place_id: 'mock_hyd_004',
          name: 'Kondapur Sports Ground',
          vicinity: 'Kondapur, Hyderabad',
          rating: 4.3,
          user_ratings_total: 189,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 17.4614, lng: 78.3646 } }
        },
        {
          place_id: 'mock_hyd_005',
          name: 'Madhapur Football Arena',
          vicinity: 'Madhapur, Hyderabad',
          rating: 4.2,
          user_ratings_total: 176,
          opening_hours: { open_now: false },
          price_level: 2,
          geometry: { location: { lat: 17.4483, lng: 78.3915 } }
        },
        {
          place_id: 'mock_hyd_006',
          name: 'Kukatpally Sports Complex',
          vicinity: 'Kukatpally, Hyderabad',
          rating: 4.1,
          user_ratings_total: 145,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: 17.4943, lng: 78.4143 } }
        }
      ];
    }
    // Default: Generic location data
    else {
      mockTurfs = [
        {
          place_id: 'mock_gen_001',
          name: 'City Sports Arena',
          vicinity: 'Near your location',
          rating: 4.4,
          user_ratings_total: 234,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: userLat + 0.01, lng: userLng + 0.01 } }
        },
        {
          place_id: 'mock_gen_002',
          name: 'PlayZone Football Turf',
          vicinity: 'Near your location',
          rating: 4.3,
          user_ratings_total: 189,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: userLat + 0.02, lng: userLng - 0.01 } }
        },
        {
          place_id: 'mock_gen_003',
          name: 'SportVille Ground',
          vicinity: 'Near your location',
          rating: 4.5,
          user_ratings_total: 267,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: userLat - 0.015, lng: userLng + 0.02 } }
        },
        {
          place_id: 'mock_gen_004',
          name: 'Elite Sports Complex',
          vicinity: 'Near your location',
          rating: 4.6,
          user_ratings_total: 321,
          opening_hours: { open_now: true },
          price_level: 3,
          geometry: { location: { lat: userLat - 0.01, lng: userLng - 0.02 } }
        },
        {
          place_id: 'mock_gen_005',
          name: 'Green Field Turf',
          vicinity: 'Near your location',
          rating: 4.2,
          user_ratings_total: 156,
          opening_hours: { open_now: false },
          price_level: 2,
          geometry: { location: { lat: userLat + 0.005, lng: userLng - 0.015 } }
        },
        {
          place_id: 'mock_gen_006',
          name: 'Star Sports Arena',
          vicinity: 'Near your location',
          rating: 4.4,
          user_ratings_total: 278,
          opening_hours: { open_now: true },
          price_level: 2,
          geometry: { location: { lat: userLat + 0.03, lng: userLng + 0.005 } }
        }
      ];
    }

      console.log(`🏙️ Detected city: ${detectedCity}`);
      console.log(`📊 Returning ${mockTurfs.length} turfs for ${detectedCity}`);

      return res.json({
        success: true,
        results: mockTurfs,
        status: 'OK',
        mock: true,
        city: detectedCity,
        message: `Using location-based mock data for ${detectedCity}`
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

export default router;
