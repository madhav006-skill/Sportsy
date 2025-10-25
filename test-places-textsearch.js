// Test Google Places API Text Search (which is already enabled)
const GOOGLE_API_KEY = 'AIzaSyA2W3pDSJTdf274jBQmqoe_2P32BaDw4KI';

const testLocations = [
  'Kolkata',
  'Mumbai', 
  'Chennai',
  'Bangalore',
  'Delhi',
  'Jaipur'
];

console.log('🧪 Testing Google Places API Text Search...\n');
console.log(`🔑 API Key: ${GOOGLE_API_KEY.substring(0, 10)}...\n`);

async function testPlacesTextSearch(location) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=turf+in+${encodeURIComponent(location)}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const firstResult = data.results[0];
      const { lat, lng } = firstResult.geometry.location;
      console.log(`✅ ${location.padEnd(15)} → Found ${data.results.length} turfs`);
      console.log(`   📍 First turf: ${firstResult.name}`);
      console.log(`   🗺️  Location: ${firstResult.formatted_address}`);
      console.log(`   📊 Coordinates: ${lat}, ${lng}`);
      return true;
    } else if (data.status === 'ZERO_RESULTS') {
      console.log(`⚠️  ${location.padEnd(15)} → No turfs found`);
      return false;
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
    const success = await testPlacesTextSearch(location);
    if (success) successCount++;
    console.log(''); // Empty line
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(`📊 Results: ${successCount}/${testLocations.length} locations found turfs successfully`);
  console.log('='.repeat(70));
  
  if (successCount === testLocations.length) {
    console.log('✅ ALL TESTS PASSED! Places API Text Search is working perfectly!');
  } else if (successCount > 0) {
    console.log('⚠️  PARTIAL SUCCESS - Some locations found turfs');
  } else {
    console.log('❌ ALL TESTS FAILED - Check API key permissions');
  }
}

runTests();
