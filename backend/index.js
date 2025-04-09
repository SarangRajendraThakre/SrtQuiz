const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const userRoute = require("./Routes/userRoute");
const quizRoutes = require("./Routes/quizRoutes");
const uploadRoute = require("./Routes/uploadRoute");
const retrievRoute = require("./Routes/retrivequiz");
const Quiz = require('./Models/quiz'); // Import your Quiz model

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

// CORS configuration
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
app.use("/api", userRoute);
app.use("/api", quizRoutes);
app.use('/api/quizzes', quizRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/getquiz", retrievRoute);
app.use('/uploads', express.static('uploads'));

// Simple Home Route
app.get("/", (req, res) => {
  res.send("Welcome to our chat");
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

// Define the LiveQuiz model inside this file

const liveQuizSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  totalParticipants: { type: Number, default: 0 },
  users: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [{
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions' },
      answer: String,
      isCorrect: Boolean
    }],
    totalScore: { type: Number, default: 0 }
  }]
});

const LiveQuiz = mongoose.model("LiveQuiz", liveQuizSchema);

// Socket.IO communication
io.on("connection", (socket) => {
  console.log('A player connected:', socket.id);

  // Handle room creation
  socket.on("create room", (roomCode) => {
    socket.join(roomCode);
    console.log(`Room created: ${roomCode}`);
  });

  // Handle joining room
  socket.on("join room", (roomCode, callback) => {
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (room) {
      socket.join(roomCode);
      console.log(`Player ${socket.id} joined room ${roomCode}`);
      callback({ status: 'joined', roomCode });
    } else {
      socket.emit('error', 'Room does not exist');
      callback({ status: 'error', message: 'Room does not exist' });
    }
  });

  // Start quiz
 // Start quiz
 socket.on("start quiz", async ({ roomCode, quizId, duration }) => {
  try {
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (room) {
      const quiz = await Quiz.findById(quizId).select("questions title description");

      if (!quiz) {
        return socket.emit("error", "Quiz not found");
      }

      let liveQuiz = new LiveQuiz({
        roomCode,
        quizId,
        totalParticipants: room.size,
      });
      await liveQuiz.save();

      const questionsData = quiz.questions.map((q, index) => ({
        id: index + 1,
        questionId: q._id,
        question: q.questionText,
        options: q.options,
        answer: q.correctAnswers,
        timer: q.timer || duration || 20,
        explanation: q.explanation || "",
      }));

      // Emit quiz start to clients
      io.to(roomCode).emit("quiz started", {
        roomCode,
        title: quiz.title,
        description: quiz.description,
        duration,
        questions: questionsData,
      });

      // ⏰ Set a timer to end the quiz after `duration` seconds
      const durationInMs = (duration || 60) * 1000;
      setTimeout(async () => {
        const liveQuiz = await LiveQuiz.findOne({ roomCode });
        if (liveQuiz) {
          const results = liveQuiz.users.map(user => ({
            userId: user.userId,
            totalScore: user.totalScore,
          }));

          io.to(roomCode).emit("quiz ended", { results });
          console.log(`Quiz in room ${roomCode} ended automatically after ${duration} seconds`);
        }
      }, durationInMs);

    } else {
      socket.emit("error", "Room does not exist");
    }
  } catch (error) {
    console.error("Error starting quiz:", error);
    socket.emit("error", "An error occurred while starting the quiz");
  }
});


  // Handle answer submission and scoring
socket.on("submit answer", async ({ roomCode, userId, questionId, answer }) => {
  try {
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (!room) {
      return socket.emit("error", "Room not found");
    }

    let liveQuiz = await LiveQuiz.findOne({ roomCode });
    if (!liveQuiz) {
      return socket.emit("error", "Live quiz not found");
    }

    // Find or add user
    let user = liveQuiz.users.find(u => u.userId.toString() === userId);
    if (!user) {
      user = { userId, answers: [], totalScore: 0 };
      liveQuiz.users.push(user);
    }

    const quiz = await Quiz.findById(liveQuiz.quizId);
    const question = quiz.questions.id(questionId);

    if (!question) {
      return socket.emit("error", "Question not found");
    }

    const isCorrect = question.correctAnswers.includes(answer);

    // Check if already answered
    const alreadyAnswered = user.answers.find(a => a.questionId.toString() === questionId);
    if (!alreadyAnswered) {
      user.answers.push({ questionId, answer, isCorrect });
      user.totalScore += isCorrect ? 1 : 0;
    }

    await liveQuiz.save();

    // Emit updated score for that user
    io.to(roomCode).emit("answer submitted", {
      userId,
      questionId,
      isCorrect,
      totalScore: user.totalScore,
    });

    // 🔄 Emit live leaderboard (optional, if you want real-time leaderboard)
    const leaderboard = liveQuiz.users.map(u => ({
      userId: u.userId,
      totalScore: u.totalScore,
    }));
    io.to(roomCode).emit("leaderboard update", { leaderboard });

    // ✅ Optional Auto-Redirect to Leaderboard When All Questions Are Answered
    const totalQuestions = quiz.questions.length;
    const allAnswered = liveQuiz.users.every(u => u.answers.length === totalQuestions);

    if (allAnswered) {
      // Sort results by score
      const finalResults = leaderboard.sort((a, b) => b.totalScore - a.totalScore);
      io.to(roomCode).emit("quiz ended", { results: finalResults });
    }

  } catch (error) {
    console.error("Error submitting answer:", error);
    socket.emit("error", "An error occurred while submitting the answer");
  }
});

  
  // Handle score submission when the quiz ends
  socket.on("submit score", async ({ roomCode }) => {
    try {
      const room = io.sockets.adapter.rooms.get(roomCode);
      if (room) {
        let liveQuiz = await LiveQuiz.findOne({ roomCode });
  
        if (liveQuiz) {
          // Ensure all users' scores are correctly updated
          await liveQuiz.save();
  
          // Prepare final results
          const results = liveQuiz.users.map(user => ({
            userId: user.userId,
            totalScore: user.totalScore,
          }));
  
          // Emit results with a slight delay to ensure proper rendering
          setTimeout(() => {
            io.to(roomCode).emit("quiz ended", { results });
          }, 2000); // Add delay to ensure frontend receives and displays results properly
        }
      } else {
        socket.emit("error", "Room does not exist");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      socket.emit("error", "An error occurred while submitting the score");
    }
  });

  socket.on("quiz ended", ({ results }) => {
    console.log("Final Results:", results);
    setShowResults(true); // Ensure this state controls the final score display
    setFinalScores(results);
  });
  
  

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
