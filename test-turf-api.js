// Test script for Turf Management API
// Run this with: node test-turf-api.js

const API_BASE = 'http://localhost:5000';

async function testTurfAPI() {
  console.log('🧪 Testing Turf Management API\n');

  // Test 1: Search all turfs
  console.log('Test 1: Search all turfs');
  try {
    const response = await fetch(`${API_BASE}/api/turfs`);
    const data = await response.json();
    console.log('✅ Result:', data.success ? `Found ${data.count} turfs` : 'Failed');
    console.log('   Turfs:', data.turfs?.map(t => t.name).join(', ') || 'None');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  console.log('');

  // Test 2: Search with query
  console.log('Test 2: Search turfs with query "bangalore"');
  try {
    const response = await fetch(`${API_BASE}/api/turfs?query=bangalore`);
    const data = await response.json();
    console.log('✅ Result:', data.success ? `Found ${data.count} turfs` : 'Failed');
    console.log('   Turfs:', data.turfs?.map(t => `${t.name} - ${t.location}`).join('\n          ') || 'None');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  console.log('');

  // Test 3: Search by sport type
  console.log('Test 3: Search turfs for "football"');
  try {
    const response = await fetch(`${API_BASE}/api/turfs?sportType=football`);
    const data = await response.json();
    console.log('✅ Result:', data.success ? `Found ${data.count} football turfs` : 'Failed');
    console.log('   Turfs:', data.turfs?.map(t => t.name).join(', ') || 'None');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  console.log('');

  // Test 4: Create a new turf (requires authentication)
  console.log('Test 4: Create new turf (will fail without auth)');
  try {
    const response = await fetch(`${API_BASE}/api/turfs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Arena',
        location: 'Test Location, Bangalore',
        sportType: 'football',
        pricePerHour: 1500
      })
    });
    const data = await response.json();
    console.log(data.success ? '✅ Created successfully' : '⚠️ Expected:', data.message);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  console.log('');

  console.log('🎯 Test Summary:');
  console.log('- Search endpoints are working if you see turfs listed above');
  console.log('- Create endpoint requires authentication (expected to fail in this test)');
  console.log('- To test create/update/delete, use the frontend with a logged-in user');
  console.log('\n✨ Run the dev server and try creating a match to test the full flow!');
}

// Run tests
testTurfAPI().catch(console.error);
