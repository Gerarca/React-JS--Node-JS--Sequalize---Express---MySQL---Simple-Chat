import { useEffect, useState } from "react";
import io from "socket.io-client";

// const socket = io("http://localhost:3001");
const socket = io("/");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userA, setUserA] = useState("");
  const [count, setCount] = useState(0);
  const [userB, setUserB] = useState("");

  if(userA.length > 0 && message.userA){
    message.forEach(usuario => {
      if( usuario.from !== userA ){
        setUserB(usuario.from);
      }
    });    
  }

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([message, ...messages]);
    };

    socket.on("message", receiveMessage);
    return () => {
      socket.off("message", receiveMessage);
    };     
  }, [messages]);

  const handleSubmit = (event) => { 
    event.preventDefault();
    setCount(count + 1 );
    const newMessage = {
      body: message,
      from: userA,
      count,
    };
    setMessages([newMessage, ...messages]);
    setMessage("");

    socket.emit("message", newMessage);
  };

  return (
    <div className="h-screen bg-white-800 text-white flex items-center justify-center w-full">

      <div className="w-96">
        <input
          name="username"
          type="text"
          placeholder="Ingresa tu Nick Name"
          onChange={(e) => setUserA(e.target.value)}
          className="border-2 border-zinc-300 p-2 w-full text-black my-2 rounded"
          value={userA}
          autoFocus
        />

        <form onSubmit={handleSubmit} className="bg-white-900 p-6 w-full border">       
          <ul className="h-80 overflow-y-auto flex flex-col-reverse">
            { messages.length > 0 &&
              messages.map((message, index) => (
              <li
                key={index}
                className={"flex flex-row w-full" + message.from === userA ? "justify-start" : "justify-end"}
              >
                <div className={`my-2 p-2 table text-sm rounded-md text-black ${
                  message.from === userA? "bg-slate-300 ml-auto" : "bg-slate-100"
                }`}
                >
                  {message.body}
                </div>
            </li>
            ))}
          </ul>

          <input
            name="message"
            type="text"
            placeholder="Escribe tu mensaje..."
            onChange={(e) => setMessage(e.target.value)}
            className="border-1 border-zinc-300 p-2 w-full text-black rounded bg-slate-50 mt-2"
            value={message}          
          />
        </form>
      </div>
    </div>
  );
}
