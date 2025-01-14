const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const quizRoutes = require("./Routes/quizRoutes");
const uploadRoute = require("./Routes/uploadRoute"); // Import the upload route
const retrievRoute = require("./Routes/retrivequiz");

const app = express();

require("dotenv").config();
// this code is  from the srt coders

app.use(express.json());

const allowedOrigins = [
  "http://srtcoder.com",
  "http://localhost:5173",
  "http://192.168.45.188:5173/",
  "http://192.168.45.188:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use("/api/users", userRoute);
app.use("/api", userRoute);
app.use("/api", quizRoutes);
app.use("/api/quizzes", quizRoutes);

app.use("/api/upload", uploadRoute); // Mount the upload route
app.use("/api/getquiz", retrievRoute);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Welcome to our chat");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Database is working"))
  .catch((error) => console.log("MongoDB connection failed:", error.message));
