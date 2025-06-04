const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// Import your route files
const userRoute = require("./Routes/userRoute");
const quizRoutes = require("./Routes/quizRoutes");
const uploadRoute = require("./Routes/uploadRoute");
const retrievRoute = require("./Routes/retrivequiz");

// Import the new socket handler
const setupSocketHandlers = require('./socketHandlers/liveSockethandler'); // Adjust path as needed

// Make sure your Mongoose models are imported if needed in other parts of index.js
// If LiveQuiz is defined here, move it to its own file.
// const Quiz = require('./Models/quiz'); // Already there
// const LiveQuiz = require('./Models/LiveQuiz'); // This should be in Models/LiveQuiz.js

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://srtcoder.com", "http://localhost:5173", "http://192.168.45.188:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("dotenv").config();

app.use(express.json());

// CORS configuration for Express routes
const allowedOrigins = ["http://srtcoder.com", "http://localhost:5173", "http://192.168.45.188:5173"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));

// API Routes
app.use("/api/users", userRoute);
app.use("/api", userRoute); // Potentially redundant if /api/users covers all user routes
app.use("/api", quizRoutes); // Potentially redundant
app.use('/api/quizzes', quizRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/getquiz", retrievRoute);
app.use('/uploads', express.static('uploads'));

// Simple Home Route
app.get("/", (req, res) => {
  res.send("Welcome to our quiz API");
});

// MongoDB connection
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database is working"))
  .catch((error) => console.log("MongoDB connection failed: check whether there is internet or not", error.message));

// Pass the io instance to your Socket.IO handler function
setupSocketHandlers(io);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});