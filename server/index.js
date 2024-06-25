const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = 8000;
const client = new Client({});
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function fetchDriverLocations() {
  try {
    const response = await axios.get(
      "http://185.203.217.168/api/get_devices?lang=en&user_api_hash=$2y$10$F4RpJGDpBDWO2ie448fQAu2Zo0twdwyBdMmnbeSqFbEkjGYocP.Y6"
    );
    
    const devices = response.data.reduce((acc, group) => {
      return acc.concat(group.items.map(item => ({
        id: item.id,
        name: item.name,
        lat: item.lat,
        lng: item.lng,
      })));
    }, []);

    return devices;
  } catch (error) {
    console.error("Error fetching driver locations:", error);
    return [];
  }
}

async function fetchClosestDrivers(driverLocations, shopLocations) {
  const origins = driverLocations.map(driver => ({
    lat: driver.lat,
    lng: driver.lng,
  }));
  const destinations = shopLocations.map(shop => ({
    lat: shop.lat,
    lng: shop.lng,
  }));

  try {
    const response = await client.distancematrix({
      params: {
        origins,
        destinations,
        key: API_KEY,
      },
    });

    const distanceData = response.data.rows.map((row, i) => {
      return row.elements.map((element, j) => {
        if (element.status === "OK") {
          return {
            driverId: driverLocations[i].id,
            driverName: driverLocations[i].name,
            shopId: shopLocations[j].id,
            shopName: shopLocations[j].name,
            distance: element.duration.text,
            distanceValue: element.duration.value,
          };
        } else {
          return null;
        }
      }).filter(item => item !== null);
    });

    return distanceData.flat();
  } catch (error) {
    console.error("Error fetching distances from Google Maps API:", error);
    return [];
  }
}

io.on('connection', (socket) => {
  console.log('New client connected');

  const sendDriverLocations = async () => {
    const driverLocations = await fetchDriverLocations();
    socket.emit('driverLocations', driverLocations);
  };

  sendDriverLocations();
  const interval = setInterval(sendDriverLocations, 5000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

app.get("/", async (req, res) => {
  res.send("Socket.IO server running.");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
