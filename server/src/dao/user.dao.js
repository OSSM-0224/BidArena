const User = require('../models/User.model');

const createUser = (data) => User.create(data);

const findUserByEmail = (email) => User.findOne({ email });

const findUserByEmailWithPassword = (email) => User.findOne({ email }).select('+password');

const findUserById = (id) => User.findById(id);

const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

module.exports = {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  updateUser,
};
