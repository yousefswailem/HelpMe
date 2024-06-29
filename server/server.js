const express = require("express");
const http = require("http");
const axios = require("axios");
const socketIo = require("socket.io");
const readline = require("readline");
const cors = require("cors");
const { Client } = require("@googlemaps/google-maps-services-js");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

const port = 8000;
const client = new Client({});
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let currentDestination = null;
let tasks = []; // Array to hold tasks

const askForDestination = () => {
  rl.question("Enter a new destination (latitude,longitude): ", (answer) => {
    currentDestination = answer;
    console.log(`New destination set: ${currentDestination}`);
    io.emit("newOrder", currentDestination);
    askForDestination();
  });
};

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get("/directions", async (req, res) => {
  try {
    if (!currentDestination) {
      return res.status(400).send("Destination not set");
    }

    const { origin } = req.query; // Get origin coordinates from client

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${currentDestination}&key=${GOOGLE_MAPS_API_KEY}`;

    console.log(`Requesting URL: ${url}`); // Log the URL for debugging

    const response = await axios.get(url);

    if (response.data.routes.length) {
      const route = response.data.routes[0].overview_polyline.points;
      res.json({ route });
    } else {
      console.log("No routes found");
      res.status(404).send("No routes found");
    }
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).send("Error fetching directions");
  }
});

app.post('/form', (req, res) => {
  const { task } = req.body;
  tasks.push(task);
  io.emit('newTask', task); // Emit new task to all clients
  res.status(200).send('Task added successfully');
});

// Function to poll the API and check for task updates
const pollTasks = async () => {
  try {
    const response = await axios.get(
      "http://185.203.217.168/api/get_tasks?user_api_hash=$2y$10$F4RpJGDpBDWO2ie448fQAu2Zo0twdwyBdMmnbeSqFbEkjGYocP.Y6"
    );
    const newTasks = response.data.items.data;

    // Emit new tasks to all clients if there are changes
    if (JSON.stringify(newTasks) !== JSON.stringify(tasks)) {
      tasks = newTasks;
      io.emit("newOrder", tasks);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

// Poll the API every 30 seconds
setInterval(pollTasks, 30000);

const fetchDriverLocations = async () => {
  try {
    const response = await axios.get(
      "http://185.203.217.168/api/get_devices?lang=en&user_api_hash=$2y$10$F4RpJGDpBDWO2ie448fQAu2Zo0twdwyBdMmnbeSqFbEkjGYocP.Y6"
    );
    const devices = response.data.reduce((acc, group) => {
      return acc.concat(
        group.items.map((item) => ({
          id: item.id,
          name: item.name,
          lat: item.lat,
          lng: item.lng,
        }))
      );
    }, []);
    return devices;
  } catch (error) {
    console.error("Error fetching driver locations:", error);
    return [];
  }
};

// Socket.IO handling
io.on("connection", (socket) => {
  console.log("New client connected");

  const sendDriverLocations = async () => {
    const driverLocations = await fetchDriverLocations();
    socket.emit("driverLocations", driverLocations);
  };

  sendDriverLocations();
  const interval = setInterval(sendDriverLocations, 1000);

  socket.on("showRoute", async ({ pickupLat, pickupLng }) => {
    const origin = `${pickupLat},${pickupLng}`;
    io.emit("fetchRoute", origin); // Emit to all clients to fetch the route

    // Fetch directions from Google Maps API
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${currentDestination}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.routes.length) {
        const route = response.data.routes[0].overview_polyline.points;
        io.emit("routeFetched", { route });
      } else {
        console.log("No routes found");
        io.emit("routeError", "No routes found");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      io.emit("routeError", "Error fetching directions");
    }
  });

  socket.emit("currentTasks", tasks);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  askForDestination();
});
