// Initialize the map
const map = L.map('map').setView([30.2672, -97.7431], 10); // Example: Austin, TX

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Example marker for a cleanup location
L.marker([30.2672, -97.7431])
  .addTo(map)
  .bindPopup('Downtown Cleanup Spot<br>Join us here!')
  .openPopup();
