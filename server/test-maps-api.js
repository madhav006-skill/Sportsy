// Test Google Maps API
import 'dotenv/config';

const testMapsAPI = async () => {
  console.log('🧪 Testing Google Maps API Integration\n');
  
  // Check if API key is loaded
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  console.log('1️⃣ API Key Check:');
  console.log('   Key loaded:', apiKey ? '✅ Yes' : '❌ No');
  if (apiKey) {
    console.log(`   Key preview: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 5)}`);
  }
  console.log('');

  if (!apiKey) {
    console.error('❌ GOOGLE_MAPS_API_KEY not found in environment');
    process.exit(1);
  }

  // Test coordinates - Delhi, India Gate
  const testLocations = [
    { name: 'Delhi - India Gate', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai - Gateway of India', lat: 18.9220, lng: 72.8347 },
    { name: 'Bangalore - Cubbon Park', lat: 12.9762, lng: 77.5993 }
  ];

  for (const location of testLocations) {
    console.log(`2️⃣ Testing: ${location.name}`);
    console.log(`   Coordinates: ${location.lat}, ${location.lng}`);
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&keyword=turf&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(`   API Status: ${data.status}`);
      
      if (data.status === 'OK') {
        console.log(`   ✅ Success! Found ${data.results.length} turfs`);
        if (data.results.length > 0) {
          console.log(`   First result: "${data.results[0].name}"`);
          console.log(`   Address: ${data.results[0].vicinity}`);
          console.log(`   Rating: ${data.results[0].rating || 'N/A'}`);
        }
      } else if (data.status === 'ZERO_RESULTS') {
        console.log(`   ⚠️  No turfs found in this area`);
      } else {
        console.log(`   ❌ Error: ${data.error_message || data.status}`);
      }
      console.log('');
    } catch (error) {
      console.error(`   ❌ Request failed: ${error.message}\n`);
    }
  }

  console.log('✅ Test completed!');
};

testMapsAPI();
