const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const {validateData} = require("../middlewares/user.js");
const { User } = require("../db/index");
const TOKEN = process.env.TOKEN;

router.get("/signup", validateData, async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const response = await User.findOne({ username: username });
  if(response) {
    return res.status(400).json({ message: "Username already exists with this username" });
  }
  User.create({ username: username, password: password });
  return res.status(200).json({ message: "User created successfully" });
});

router.get("/login", async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const response = await User.find({ username, password });
  if(response.length > 0){
    return res.status(200).json({ token: jwt.sign({ username: username }, TOKEN) });
  }
  return res.status(403).json({ message: "Invalid Credentials"});
});



module.exports = router;

