import User from '../models/User.model.js';

export const createUser = (data) => User.create(data);

export const findUserByEmail = (email) => User.findOne({ email });

export const findUserByEmailWithPassword = (email) => User.findOne({ email }).select('+password');

export const findUserById = (id) => User.findById(id);

export const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
