var map = L.map('map', {
    center: [37.7749, -122.4194],
    zoom: 12,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
    tap: false // disables touch tapping zoom on some mobile browsers
});

var greenIcon = L.icon({
    iconUrl: 'images/finder.png', // Default marker icon
    iconSize: [65, 65],  // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Default shadow image
    shadowSize: [41, 41], // Size of the shadow
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a> contributors'
}).addTo(map);


var locations = [
    {
        lat: 37.7749, lng: -122.4194,
        title: "Downtown San Francisco Cleanup",
        volunteersNeeded: 10,
        volunteersHave: 6,
        intensity: "High",
        datetime: "2025-04-10 10:00 AM",
        address: "123 Market St, San Francisco, CA"
    },
    {
        lat: 37.7849, lng: -122.4294,
        title: "Mission District Cleanup",
        volunteersNeeded: 5,
        volunteersHave: 2,
        intensity: "Medium",
        datetime: "2025-04-11 1:00 PM",
        address: "456 Castro St, San Francisco, CA"
    },
    {
        lat: 37.7949, lng: -122.4394,
        title: "Marina Neighborhood Sweep",
        volunteersNeeded: 8,
        volunteersHave: 8,
        intensity: "Low",
        datetime: "2025-04-12 9:00 AM",
        address: "789 Lombard St, San Francisco, CA"
    }
];

var locationList = document.getElementById("location-list");

locations.forEach(function(location, index) {
    var marker = L.marker([location.lat, location.lng], { icon: greenIcon })
        .addTo(map)
        .bindPopup(`<strong>${location.title}</strong><br>${location.address}`);

    var intensityClass = {
        "High": "intensity-high",
        "Medium": "intensity-medium",
        "Low": "intensity-low"
    }[location.intensity] || "";

    var item = document.createElement("div");
    item.innerHTML = `
        <img src="${location.photo}" alt="${location.title}" style="width: 100%; border-radius: 6px; margin-bottom: 10px;">
        <h3>${location.title}</h3>
        <p><strong>Address:</strong> ${location.address}</p>
        <p><strong>Date & Time:</strong> ${location.datetime}</p>
        <p><strong>Volunteers:</strong> ${location.volunteersHave} / ${location.volunteersNeeded}</p>
        <p><strong>Intensity:</strong> <span class="${intensityClass}">${location.intensity}</span></p>
        <button class="join-btn">Join</button>
    `;

    // Event listener for when a location card is clicked
    item.addEventListener("click", function(e) {
        if (e.target.classList.contains("join-btn")) return; // Don't trigger map change on Join button click
        map.setView([location.lat, location.lng], 14); // Center map on clicked location with zoom level 14
        marker.openPopup(); // Open the popup for the clicked marker
    });

    item.querySelector(".join-btn").addEventListener("click", function(e) {
        e.stopPropagation();
        alert(`You've joined the cleanup at ${location.title}!`);
    });

    locationList.appendChild(item);
});

