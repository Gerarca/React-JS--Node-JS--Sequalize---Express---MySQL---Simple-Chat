import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PORT } from "./config.js";
import cors from "cors";
import {Sequelize, DataTypes} from "sequelize";

// Initializations
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  // cors: {
  //   origin: "http://localhost:3000",
  // },
});
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "../client/build")));

// Routes
app.get("/chat", async (req, res, next) => {  
  const list = await getAll();
  console.log("list: ", list);
  res.json(list);
});
 
io.on("connection", (socket) => { 
  socket.on("message", async (msg) => {  
    await add(msg);
    socket.broadcast.emit("message", { 
      body: msg.body,
      from: msg.from,
    });
  });
});

server.listen(PORT);
console.log(`server on port ${PORT}`);

const sequelize = new Sequelize(
  "chat", 
  "root", 
  "",
  {
    host: '127.0.0.1',
    dialect: 'mysql'
  }
);

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
  }).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const Chat = sequelize.define("chat", {
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
  }
});

const add = (msg) => { 
  sequelize.sync().then(() => {
    console.log('Message table created successfully!');
 
    Chat.create({
        username: msg.from,
        message: msg.body,
    }).then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to create a new record : ', error);
    });
 
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });
};

const getAll = async () => {
  await sequelize.sync();
  const result = await Chat.findAll();
  console.log("result: ", result);
  return result
}