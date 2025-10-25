// Seed script to populate database with sample turfs
// This helps test the search functionality
// 
// To run this script:
// 1. Make sure your server is running (npm run dev)
// 2. You need to be logged in as an organizer
// 3. Use the API directly or run this through your backend

const sampleTurfs = [
  {
    name: "Champions Sports Arena",
    location: "Koramangala 5th Block",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "football",
    pricePerHour: 1500,
    description: "Premium football turf with international standard facilities",
    facilities: ["Floodlights", "Parking", "Changing Rooms", "First Aid"]
  },
  {
    name: "Elite Cricket Ground",
    location: "HSR Layout Sector 2",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "cricket",
    pricePerHour: 2000,
    description: "Well-maintained cricket turf with professional equipment",
    facilities: ["Nets", "Pitch", "Pavilion", "Scoreboard"]
  },
  {
    name: "PlayZone Football Hub",
    location: "Indiranagar 100 Feet Road",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "football",
    pricePerHour: 1200,
    description: "Indoor football arena, perfect for evening matches",
    facilities: ["Indoor", "AC", "Parking", "Cafeteria"]
  },
  {
    name: "SportVille Multi-Sport Complex",
    location: "Whitefield Main Road",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "basketball",
    pricePerHour: 800,
    description: "Multi-sport facility with basketball courts",
    facilities: ["Multiple Courts", "Seating", "Water", "Parking"]
  },
  {
    name: "Green Field Tennis Courts",
    location: "Jayanagar 4th Block",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "tennis",
    pricePerHour: 600,
    description: "Clay and grass tennis courts",
    facilities: ["4 Courts", "Coaching Available", "Equipment Rental"]
  },
  {
    name: "Ace Badminton Arena",
    location: "BTM Layout Stage 2",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "badminton",
    pricePerHour: 400,
    description: "Indoor badminton courts with synthetic flooring",
    facilities: ["6 Courts", "AC", "Shuttle Service", "Pro Shop"]
  },
  {
    name: "Victory Sports Ground",
    location: "Electronic City Phase 1",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "football",
    pricePerHour: 1000,
    description: "Open-air football ground with modern amenities",
    facilities: ["Floodlights", "Seating", "Parking"]
  },
  {
    name: "Striker Football Academy",
    location: "Marathahalli Outer Ring Road",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "football",
    pricePerHour: 1800,
    description: "Professional training ground with FIFA approved turf",
    facilities: ["FIFA Turf", "Coaching", "Video Analysis", "Gym"]
  },
  {
    name: "Court Kings Basketball Arena",
    location: "Bellandur Junction",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "basketball",
    pricePerHour: 900,
    description: "NBA standard basketball court",
    facilities: ["Indoor", "Wooden Floor", "Scoreboard", "Lockers"]
  },
  {
    name: "Smash Point Badminton Club",
    location: "Banashankari 3rd Stage",
    city: "Bangalore",
    state: "Karnataka",
    sportType: "badminton",
    pricePerHour: 500,
    description: "Premium badminton club with expert coaching",
    facilities: ["8 Courts", "AC", "Coaching", "Equipment Store"]
  }
];

// Instructions for adding these turfs:
console.log('📝 Sample Turfs Data\n');
console.log('To add these turfs to your database:');
console.log('1. Log in to your application as an organizer');
console.log('2. Use the browser console or Postman');
console.log('3. Send POST requests to http://localhost:5000/api/turfs');
console.log('4. Or use the "Create New Turf" button in the UI\n');

console.log('Sample turfs to create:');
sampleTurfs.forEach((turf, index) => {
  console.log(`\n${index + 1}. ${turf.name}`);
  console.log(`   Location: ${turf.location}, ${turf.city}`);
  console.log(`   Sport: ${turf.sportType.toUpperCase()}`);
  console.log(`   Price: ₹${turf.pricePerHour}/hour`);
});

console.log('\n\n💡 Quick Test:');
console.log('After adding these turfs, try searching:');
console.log('- "koramangala" → Should find Champions Sports Arena');
console.log('- "football" → Should find 4 football turfs');
console.log('- "hsr" → Should find Elite Cricket Ground');
console.log('- "badminton" → Should find 2 badminton courts');

// Export for use in other scripts
export default sampleTurfs;
