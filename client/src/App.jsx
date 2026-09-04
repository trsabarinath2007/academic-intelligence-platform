import { useEffect, useState } from "react";
import API from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const response = await API.get("/");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Backend connection failed:", error);
        setMessage("Unable to connect to backend");
      }
    };

    fetchBackend();
  }, []);

  return (
    <div>
      <h1>Academic Intelligence Platform</h1>
      <p>{message || "Connecting to backend..."}</p>
    </div>
  );
}

export default App;