// Test Google Geocoding API with different cities
import 'dotenv/config';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyAz8ZYuo1Hh0U1Y898HKyNzf6lREbkk-ww';

const testLocations = [
  'Kolkata',
  'Mumbai', 
  'Chennai',
  'Bangalore',
  'Jaipur',
  'Goa',
  'Patna',
  'Varanasi'
];

console.log('🧪 Testing Google Geocoding API...\n');
console.log(`🔑 API Key: ${GOOGLE_API_KEY ? GOOGLE_API_KEY.substring(0, 10) + '...' : 'NOT FOUND'}\n`);

async function testGeocoding(location) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      console.log(`✅ ${location.padEnd(15)} → Lat: ${lat}, Lng: ${lng}`);
      console.log(`   📍 Address: ${result.formatted_address}`);
      return true;
    } else {
      console.log(`❌ ${location.padEnd(15)} → Status: ${data.status}`);
      if (data.error_message) {
        console.log(`   Error: ${data.error_message}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`❌ ${location.padEnd(15)} → Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  let successCount = 0;
  
  for (const location of testLocations) {
    const success = await testGeocoding(location);
    if (success) successCount++;
    console.log(''); // Empty line for readability
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Results: ${successCount}/${testLocations.length} locations found successfully`);
  console.log('='.repeat(60));
}

runTests();
