const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require("axios");
const cors = require("cors"); // Add this line
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Add this line

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true
  }
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
      console.log('====================================');
      console.log(data);
      console.log('====================================');
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
