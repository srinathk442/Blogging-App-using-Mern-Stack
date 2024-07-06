const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  username: {
    type: String,
    required: true,
    min: 4,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
