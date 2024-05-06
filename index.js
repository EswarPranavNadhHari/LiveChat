const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const {linkOpen} = require("./middlewares/user.js");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const router = require("./routes/user.js");
const userid = process.env.USER_ID;
const api = process.env.BOT_API;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

const users = {};


let keys = [
{
  name: "BunnyClip",
  type: "m3u8",
  img: "images/BigBuckBunny.jpg",
  url: "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8",
},{
  name: "BunnyClip-2",
  type: "m3u8",
  img: "images/BigBuckBunny.jpg",
  url: "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8",
},{
  name: "BunnyClip-3",
  type: "m3u8",
  img: "images/BigBuckBunny.jpg",
  url: "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8",
},{
  name: "BunnyClip-4",
  type: "m3u8",
  img: "images/BigBuckBunny.jpg",
  url: "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8",
},{
  name: "BunnyClip-5",
  type: "m3u8",
  img: "images/BigBuckBunny.jpg",
  url: "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8",
},{
  name: "BunnyClip-6",
  type: "m3u8",
  img: "images/BigBuckBunny.jpg",
  url: "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8",
},{
  name: "BunnyClip-7",
  type: "m3u8",
  img: "images/BigBuckBunny.jpg",
  url: "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8",
},{
  name: "BunnyClip-8",
  type: "m3u8",
  img: "images/BigBuckBunny.jpg",
  url: "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8",
}
];

app.use("/user", router);

app.get("/", (req, res) => {
  res.render("home", { keys });
});

app.get("/:name", linkOpen, async (req, res) => {
  let name = req.params.name;
  for (let i of keys) {
    if (i.name == name) {
      return res.render("index", { item: i });
    }
  }
  return res.status(404).sendFile(__dirname + "/public/error.html");
});


io.on("connection", (socket) => {
// console.log('A user connected');
  socket.on("setUsername", (name, width, height, channel) => {
    users[socket.id] = name;
    let jl = "joined";
    telegram(name, jl, `${channel} ( ${width} X ${height} )`);
    io.emit("userJoined", name);
  });

  socket.on("message", (message) => {
    const name = users[socket.id];
    // console.log(users);
    io.emit("message", { name, message });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id];
    let jl = "Left";
    telegram(name, jl);
    delete users[socket.id];
    io.emit("userLeft", name);
    // console.log('A user disconnected');
  });
});

async function telegram(name, jl, channel = "") {
  if (!name) {
    name = "someone";
  }
  await fetch(`https://api.telegram.org/bot${api}/sendMessage?chat_id=${userid}&text=${name} ${jl} ${channel.slice(1)}`);
  return 0;
}

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


