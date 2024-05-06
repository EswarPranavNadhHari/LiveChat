const mongoose = require('mongoose');
const url = process.env.DB_URL;
//connecting to database
mongoose.connect(url);

//creating schemas
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String
});

//creating models
const User = mongoose.model('user', UserSchema);
const Admin = mongoose.model('admin', AdminSchema);

module.exports = {User, Admin};
