import { useEffect, useMemo, useState } from "react";
import "./App.css";
import io from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [socketID, setSocketID] = useState("");
  const [roomName, setRoomName] = useState("");

  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("User connected", socket.id);
      setSocketID(socket.id);
    });

    socket.on("greeting", (data) => {
      console.log(data);
    });

    socket.emit("greeting2", "Hello from the client");

    socket.on("receivedMessage", (data) => {
      console.log(data);
      setMessages((prev) => {
        return [...prev, data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  console.log("messages", messages);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", roomName);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    socket.emit("message", { userId, message });
    setMessage("");
  };

  return (
    <>
      <div className="app">
        <ul className="nav nav-pills navbar">
          <li className="nav-item">
            <a className="nav-link active heading" aria-current="page" href="#">
              Friends Talk
            </a>
          </li>
        </ul>
        <div className="userid">
          UserID- <span className="socketid">{socketID}</span>
        </div>
        <form className="room_name" onSubmit={handleJoinRoom}>
          <div className="">
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                Room name
              </span>
              <input
                type="text"
                className="form-control room_name_input"
                placeholder="Type here"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Enter
          </button>
        </form>
        <form onSubmit={handleSubmitMessage} className="message">
          <div className="input-group flex-nowrap">
            <span className="input-group-text" id="addon-wrapping">
              User Id
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Type here user id of your friend"
              aria-label="Username"
              aria-describedby="addon-wrapping"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="input-group flex-nowrap">
            <span className="input-group-text" id="addon-wrapping">
              Message
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Type here"
              aria-label="Username"
              aria-describedby="addon-wrapping"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Enter
          </button>
        </form>

        <div className="">
          {messages.map((message, index) => (
            <div className="lead">{message}</div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
