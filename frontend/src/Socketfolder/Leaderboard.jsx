// Leaderboard.jsx
import { useEffect, useState, useMemo, useContext } from 'react'; // Added useContext
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { baseUrl1 } from '../utils/services';
import { AuthContext } from '../context/AuthContext'; // Assuming AuthContext provides user info

// Use useMemo to ensure socket instance is stable across re-renders
const socket = io(baseUrl1);

export default function Leaderboard() {
  const { state } = useLocation();
  const { user } = useContext(AuthContext); // Get current user from AuthContext

  console.log('Leaderboard Component Mounted: useLocation.state ->', state);

  // Initialize results based on navigation state or empty array
  // Correctly access finalResults from state
  const [results, setResults] = useState(state?.finalResults || []);
  const roomCode = state?.roomCode; // Get roomCode if passed by host

  // State to hold the current user's specific leaderboard entry
  const [currentUserLeaderboardEntry, setCurrentUserLeaderboardEntry] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    // If roomCode is available (e.g., from host), join the room to receive updates
    if (roomCode) {
        socket.emit("join room", roomCode, (response) => {
            if (response.status === 'joined') {
                console.log(`Leaderboard: Joined room ${roomCode} for live updates.`);
            } else {
                console.error(`Leaderboard: Failed to join room ${roomCode}: ${response.message}`);
            }
        });
    }

    // Function to process and update results and current user's info
    const updateLeaderboard = (leaderboardData) => {
      const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.totalScore - a.totalScore);
      setResults(sortedLeaderboard);

      if (user && user._id) { // Check if user and user._id exist
        const currentUserEntry = sortedLeaderboard.find(entry => entry.userId === user._id);
        setCurrentUserLeaderboardEntry(currentUserEntry);
        if (currentUserEntry) {
          const rank = sortedLeaderboard.findIndex(entry => entry.userId === user._id) + 1;
          setCurrentUserRank(rank);
        } else {
          setCurrentUserRank(null);
        }
      }
    };

    // Listen for real-time leaderboard updates
    socket.on("leaderboard update", ({ leaderboard }) => {
      console.log('Leaderboard: "leaderboard update" received ->', leaderboard);
      updateLeaderboard(leaderboard);
    });

    // Listen for the quiz end event (both players and hosts will receive this for final results)
    socket.on("quiz ended", ({ results: finalResults }) => { // Renamed 'results' to 'finalResults' to avoid conflict
      console.log('Leaderboard: "quiz ended" received ->', finalResults);
      updateLeaderboard(finalResults); // Update with final results
    });

    // Initial processing if data is already available from useLocation state
    if (state?.finalResults?.length > 0) {
      updateLeaderboard(state.finalResults);
    }


    return () => {
      socket.off("leaderboard update");
      socket.off("quiz ended");
      // Optional: leave room when component unmounts if it's a host or temporary view
      // if (roomCode) { socket.emit("leave room", roomCode); }
    };
  }, [socket, roomCode, user, state]); // Add user to dependencies

  // Filter out the current user from the main list so they are not duplicated
  const otherPlayers = results.filter(entry => user ? entry.userId !== user._id : true);


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🏆 Leaderboard {roomCode && `(Room: ${roomCode})`}</h1>

      {results.length === 0 ? (
        <p style={styles.loadingMessage}>Loading leaderboard... {roomCode && "Waiting for players to answer..."}</p>
      ) : (
        <>
          {/* Current User's Score at Top */}
          {currentUserLeaderboardEntry && currentUserRank !== null && (
            <div style={{ ...styles.currentUserCard, ...styles.goldBackground }}>
              <h2 style={styles.currentUserHeading}>Your Score & Rank</h2>
              <p style={styles.currentUserText}>
                <span style={styles.boldText}>Rank:</span> <span style={styles.rankNumber}>#{currentUserRank}</span>
              </p>
              <p style={styles.currentUserText}>
                <span style={styles.boldText}>Score:</span> <span style={styles.scoreNumber}>{currentUserLeaderboardEntry.totalScore}</span>
              </p>
            </div>
          )}

          {/* All Players by Rank */}
          <h2 style={styles.subHeading}>All Players</h2>
          <ul style={styles.list}>
            {otherPlayers.map((userEntry, index) => (
              <li key={userEntry.userId} style={styles.listItem}>
                <strong>#{results.findIndex(entry => entry.userId === userEntry.userId) + 1}</strong> -{" "}
                <span style={styles.playerName}>{userEntry.userName || 'Unknown User'}</span> |{" "}
                <span style={styles.score}>Score: {userEntry.totalScore}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "700px", // Slightly wider for better layout
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#eef2f5",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "36px",
    color: "#2c3e50",
    textShadow: "1px 1px 2px rgba(0,0,0,0.05)",
  },
  subHeading: {
    textAlign: "center",
    marginTop: "30px",
    marginBottom: "20px",
    fontSize: "28px",
    color: "#34495e",
  },
  loadingMessage: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  currentUserCard: {
    backgroundColor: "#ffe082", // Gold-like background for current user
    padding: "20px",
    margin: "15px 0",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    textAlign: "center",
    border: "2px solid #ffb300",
  },
  currentUserHeading: {
    fontSize: "24px",
    color: "#e65100", // Darker orange
    marginBottom: "10px",
  },
  currentUserText: {
    fontSize: "22px",
    color: "#333",
    margin: "5px 0",
  },
  boldText: {
    fontWeight: "bold",
    color: "#444",
  },
  rankNumber: {
    fontWeight: "bold",
    color: "#c0392b", // Red for rank
    fontSize: "26px",
  },
  scoreNumber: {
    fontWeight: "bold",
    color: "#27ae60", // Green for score
    fontSize: "26px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    background: "#ffffff",
    padding: "12px 20px",
    margin: "8px 0",
    borderRadius: "8px",
    fontSize: "18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "5px solid #3498db", // Blue accent
  },
  playerName: {
    flexGrow: 1,
    marginLeft: "10px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  score: {
    fontWeight: "bold",
    color: "#27ae60",
  },
  // Added for consistent gold styling, not directly used in HTML but good for reference
  goldBackground: {
    // This is already applied by currentUserCard, but could be a separate utility style
  }
};