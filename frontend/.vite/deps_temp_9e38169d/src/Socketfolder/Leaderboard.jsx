import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

// Replace with your actual backend URL
const socket = io("http://localhost:5000");

export default function Leaderboard() {
  const { state } = useLocation();
  const [results, setResults] = useState(state?.results || []);

  useEffect(() => {
    // Listen for real-time leaderboard updates
    socket.on("leaderboard update", ({ leaderboard }) => {
      setResults(leaderboard);
    });

    // If redirected due to quiz end
    socket.on("quiz ended", ({ results }) => {
      setResults(results);
    });

    return () => {
      socket.off("leaderboard update");
      socket.off("quiz ended");
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🏆 Leaderboard</h1>
      {results.length === 0 ? (
        <p>Loading leaderboard...</p>
      ) : (
        <ul style={styles.list}>
          {results
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((user, index) => (
              <li key={user.userId} style={styles.listItem}>
                <strong>#{index + 1}</strong> - <span>User:</span> {user.userId} | <span>Score:</span> {user.totalScore}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "32px",
    color: "#333",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    background: "#f9f9f9",
    padding: "10px 15px",
    margin: "10px 0",
    borderRadius: "5px",
    fontSize: "18px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
};
