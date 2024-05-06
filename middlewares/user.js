const jwt = require("jsonwebtoken");
const { z } = require('zod');
const TOKEN = process.env.TOKEN;
const Schema = z.object({
    username: z.string(),
    password: z.string().min(8),
});

function userVerify(req, res, next) {
  try{
    const token = req.headers.authorization;
    const decodedValue = jwt.verify(token, TOKEN);
    if(decodedValue.username) {
      req.username = decodedValue.username;
      next();
    }
  }catch(e){
    return res.status(403).json({ message: "Sgin in to continue" });
  }
}

function linkOpen(req, res, next) {
  try{
    const token = req.query.token;
    const decodedValue = jwt.verify(token, TOKEN);
    if(decodedValue.username) {
      req.username = decodedValue.username;
      next();
    }
  }catch(e){
    return res.redirect("/signin.html");
  }
}

const validateData = (req, res, next) => {
    try {
        Schema.parse(req.headers);
        next();
    } catch (error) {
        return res.status(400).json({ message: "password must have 8 characters" });
    }
};

module.exports = {userVerify, linkOpen, validateData};
