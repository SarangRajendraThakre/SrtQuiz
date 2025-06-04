// socketHandler.js
const LiveQuiz = require("../Models/LiveQuiz"); // Adjust path as needed
const Quiz = require("../Models/quiz");       // Adjust path as needed
const User = require("../Models/userModel");       // Adjust path as needed

module.exports = function (io) {
  const connectedPlayers = new Map(); // Optional: to track connected players by socket.id

  io.on("connection", (socket) => {
    console.log('A player connected:', socket.id);

    // --- Room Management ---
    socket.on("create room", (roomCode) => {
      socket.join(roomCode);
      console.log(`[Room] Host created room: ${roomCode}`);
    });

    socket.on("join room", (roomCode, callback) => {
      const room = io.sockets.adapter.rooms.get(roomCode);
      if (room) {
        socket.join(roomCode);
        console.log(`[Room] Player ${socket.id} joined room ${roomCode}`);
        callback({ status: 'joined', roomCode });
      } else {
        console.log(`[Room Error] Player ${socket.id} tried to join non-existent room: ${roomCode}`);
        socket.emit('error', 'Room does not exist');
        callback({ status: 'error', message: 'Room does not exist' });
      }
    });

    // --- Player Info (Sent once on join - primarily for logging/initial display) ---
    // The username is stored in LiveQuiz.users on first answer now.
    socket.on('player info', ({ roomCode, userId, userName }) => {
        if (userId && userName && roomCode) {
            connectedPlayers.set(socket.id, { userId, userName, roomCode });
            console.log(`[Player Info] Player ${userName} (${userId}) is active in room ${roomCode}.`);
            // Optional: Broadcast to others in the room that a new player joined
            // io.to(roomCode).emit('player joined', { userId, userName, socketId: socket.id });
        } else {
            console.warn(`[Player Info Warning] Received incomplete player info from socket ${socket.id}. Data:`, { userId, userName, roomCode });
        }
    });

    // --- Quiz Start ---
    socket.on("start quiz", async ({ roomCode, quizId, duration }) => {
      try {
        const room = io.sockets.adapter.rooms.get(roomCode);
        if (room) {
          const quiz = await Quiz.findById(quizId).select("questions title description");

          if (!quiz) {
            console.log(`[Start Quiz Error] Quiz not found for ID: ${quizId}`);
            return socket.emit("error", "Quiz not found");
          }

          let liveQuiz = new LiveQuiz({
            roomCode,
            quizId,
            totalParticipants: room.size, // Initial participants (number of sockets in the room)
          });
          await liveQuiz.save();

          const questionsData = quiz.questions.map((q, index) => ({
            id: index + 1,        // Frontend-friendly sequential ID
            questionId: q._id,    // Mongoose ObjectId for backend lookups
            question: q.questionText,
            options: q.options,
            timer: q.timer || duration || 20, // Use question-specific timer or overall duration
            explanation: q.explanation || "",
          }));

          // Emit quiz start to all clients in the room
          io.to(roomCode).emit("quiz started", {
            roomCode,
            title: quiz.title,
            description: quiz.description,
            duration, // Overall quiz duration
            questions: questionsData,
          });
          console.log(`[Quiz State] Quiz for room ${roomCode} (Quiz ID: ${quizId}) started.`);

          // ⏰ Set a timer to end the quiz automatically
          const durationInMs = (duration || 60) * 1000;
          console.log(`[Backend Timer] Setting quiz end timer for room ${roomCode} for ${durationInMs / 1000} seconds.`);
          setTimeout(async () => {
            console.log(`[Backend Timer] Quiz end timer fired for room ${roomCode}. Attempting to end quiz.`);
            const liveQuiz = await LiveQuiz.findOne({ roomCode });
            if (liveQuiz) {
              // Populate user names for the final results directly from the stored liveQuiz.users
              const results = liveQuiz.users.map(user => ({
                userId: user.userId,
                userName: user.userName, // Directly use stored userName
                totalScore: user.totalScore,
              }));
              results.sort((a, b) => b.totalScore - a.totalScore); // Sort final results

              io.to(roomCode).emit("quiz ended", { results });
              console.log(`[Backend Timer] Emitting 'quiz ended' for room ${roomCode}.`);
              console.log(`[Quiz State] Quiz in room ${roomCode} ended automatically after ${duration} seconds.`);
            } else {
                console.log(`[Backend Timer] Live quiz document not found when timer fired for room ${roomCode}.`);
            }
          }, durationInMs);

        } else {
          socket.emit("error", "Room does not exist");
          console.log(`[Start Quiz Error] Host tried to start quiz in non-existent room: ${roomCode}`);
        }
      } catch (error) {
        console.error("Error starting quiz:", error);
        socket.emit("error", "An error occurred while starting the quiz");
      }
    });

// socketHandler.js (within the io.on("connection", (socket) => { ... }) block)

    socket.on("submit answer", async ({ roomCode, userId, userName, questionId, answer }) => {
      try {
        console.log(`[Submit Answer Received] Room: ${roomCode}, User: ${userName} (${userId}), Question: ${questionId}, Answer: "${answer}"`);

        const room = io.sockets.adapter.rooms.get(roomCode);
        if (!room) {
          console.log(`[Submit Answer Error] Room ${roomCode} not found.`);
          return socket.emit("error", "Room not found");
        }

        let liveQuiz = await LiveQuiz.findOne({ roomCode });
        if (!liveQuiz) {
          console.log(`[Submit Answer Error] Live quiz for room ${roomCode} not found.`);
          return socket.emit("error", "Live quiz not found");
        }

        // Find or add user to liveQuiz.users array
        let userEntry = liveQuiz.users.find(u => u.userId.toString() === userId);
        if (!userEntry) {
          // If user is new, create entry including userName
          userEntry = { userId, userName, answers: [], totalScore: 0 }; // <--- userName stored here on first answer
          liveQuiz.users.push(userEntry);
          console.log(`[Submit Answer] User ${userName} (${userId}) added to liveQuiz for room ${roomCode}.`);
        } else {
          console.log(`[Submit Answer] User ${userName} (${userId}) found in liveQuiz for room ${roomCode}.`);
          // OPTIONAL: If username can change mid-quiz, uncomment to update it on subsequent answers
          // userEntry.userName = userName;
        }

        const quiz = await Quiz.findById(liveQuiz.quizId);
        if (!quiz) {
          console.log(`[Submit Answer Error] Associated quiz ${liveQuiz.quizId} not found for scoring.`);
          return socket.emit("error", "Associated quiz not found for scoring.");
        }

        const question = quiz.questions.id(questionId);

        if (!question) {
          console.log(`[Submit Answer Error] Question ${questionId} not found in quiz ${liveQuiz.quizId}.`);
          return socket.emit("error", "Question not found in quiz for scoring.");
        }

        // --- CORRECTED ANSWER CHECKING LOGIC ---
        // Your correctAnswers array stores the INDEX of the correct option as a string (e.g., "2")
        // Your question.options array stores the actual option texts.

        // Assuming there's only one correct answer for MCQ, take the first element.
        const correctOptionIndex = parseInt(question.correctAnswers[0], 10);

        // Get the text of the correct answer using the index
        // Add a check to ensure the index is valid and within bounds
        const correctAnswerText = (correctOptionIndex >= 0 && correctOptionIndex < question.options.length)
                                  ? question.options[correctOptionIndex]
                                  : null; // Handle invalid index (e.g., if correct index is out of bounds)

        let isCorrect = false;
        if (correctAnswerText !== null) {
            isCorrect = (answer === correctAnswerText); // <--- Correct comparison: compare submitted text with correct option text
        } else {
            console.error(`[Submit Answer Error] Invalid correct answer index for question ${questionId}: ${question.correctAnswers[0]}. Options length: ${question.options.length}`);
            socket.emit("error", "Error validating answer: Invalid question data.");
            // Treat as incorrect if correct answer text cannot be determined due to bad data
            isCorrect = false;
        }
        // --- END CORRECTED ANSWER CHECKING LOGIC ---


        console.log(`[Submit Answer Logic] Question "${question.questionText}", Submitted: "${answer}", Expected: "${correctAnswerText}", Is Correct: ${isCorrect}`);

      const alreadyAnswered = userEntry.answers.find(a => a.questionId.toString() === questionId);
        if (!alreadyAnswered) {
            const newAnswerObject = { questionId, answer, isCorrect };
            userEntry.answers.push(newAnswerObject);
            userEntry.totalScore += isCorrect ? 1 : 0; // Score updated in memory here
            console.log(`[Answer Stored Success] User ${userName} (${userId}) | Stored Answer Object:`, newAnswerObject);
            console.log(`[Answer Stored Success] User ${userName} (${userId}) | New Total Score: ${userEntry.totalScore}`);
        } else {
            console.log(`[Answer Skipped] User ${userName} (${userId}) already answered question ${questionId}. Skipping storage.`);
            return socket.emit("info", "You have already answered this question.");
        }

        // --- CRITICAL STEP: Ensure save completes before emitting leaderboard ---
        try {
            await liveQuiz.save(); // <--- This line is essential for persistence
            console.log(`[DB Save] LiveQuiz document for room ${roomCode} saved successfully to DB.`);
        } catch (saveError) {
            console.error(`[DB Save Error] Failed to save LiveQuiz document for room ${roomCode}:`, saveError);
            // You might want to emit an error to the client or log this more prominently
            socket.emit("error", "Failed to save quiz progress.");
            return; // Stop further processing if save fails
        }

        // Emit updated score for that user to their socket only
        socket.emit("answer submitted", {
            questionId,
            isCorrect,
            totalScore: userEntry.totalScore, // This now reflects the saved score
        });

        // 🔄 Emit live leaderboard (construct this *after* the save is complete)
        const leaderboardWithNames = liveQuiz.users.map(u => ({
            userId: u.userId,
            userName: u.userName,
            totalScore: u.totalScore, // This totalScore comes from the `liveQuiz` object that was just saved
        }));
        leaderboardWithNames.sort((a, b) => b.totalScore - a.aoTalScore);
        io.to(roomCode).emit("leaderboard update", { leaderboard: leaderboardWithNames });





        // ✅ Optional Auto-End Quiz When All Questions Are Answered by All Participants
        const totalQuestions = quiz.questions.length;
        const allParticipantsAnsweredAllQuestions = liveQuiz.users.every(u => u.answers.length === totalQuestions);

        // This condition implies all current participants *in the liveQuiz document* have answered all questions.
        // It's a secondary ending condition to the timer.
        if (allParticipantsAnsweredAllQuestions && liveQuiz.users.length > 0) {
            io.to(roomCode).emit("quiz ended", { results: leaderboardWithNames }); // Already sorted
            console.log(`[Quiz State] Quiz in room ${roomCode} ended because all questions were answered by all participants.`);
        }

      } catch (error) {
        console.error("Error submitting answer:", error);
        socket.emit("error", "An error occurred while submitting the answer");
      }
    });
    // --- Disconnect Handling ---
    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
      const playerInfo = connectedPlayers.get(socket.id);
      if (playerInfo) {
          console.log(`[Disconnect] Player ${playerInfo.userName} (${playerInfo.userId}) disconnected from room ${playerInfo.roomCode}.`);
          connectedPlayers.delete(socket.id);
          // Optional: Notify other players that someone left
          io.to(playerInfo.roomCode).emit('player left', { userId: playerInfo.userId, userName: playerInfo.userName });
      }
    });
  });
};