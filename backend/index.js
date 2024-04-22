const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const quizRoutes = require("./Routes/quizRoutes");
const uploadRoute = require("./Routes/uploadRoute"); // Import the upload route
const retrievRoute = require("./Routes/retrivequiz");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cors()); // Use cors middleware

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api", quizRoutes);
app.use('/api/quizzes', quizRoutes);

app.use("/api/upload", uploadRoute); // Mount the upload route
app.use("/api/getquiz",retrievRoute);
app.use('/uploads', express.static('uploads'));


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
