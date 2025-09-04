"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const createUser = async (user, creatorRole) => {
    // Check if user already exists
    const existingUser = await user_model_1.User.findOne({ email: user.email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    // Only admin can create admin users
    if (user.role === 'admin' && creatorRole !== 'admin') {
        throw new Error('Only admins can create admin users');
    }
    const result = await user_model_1.User.create(user);
    return result;
};
//update user
const updateUser = async (id, user) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, user, { new: true });
    return result;
};
// get all user or admin 
const getAllUser = async () => {
    const result = await user_model_1.User.find({ role: 'user' });
    return result;
};
// get all   admin 
const getAllAdmin = async () => {
    const result = await user_model_1.User.find({ role: 'admin' });
    return result;
};
const getSingleAdmin = async (id) => {
    const result = await user_model_1.User.findOne({ role: 'admin', _id: id });
    if (!result) {
        throw new Error('Admin not found');
    }
    return result;
};
const deleteUser = async (id) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, { role: 'user', isDeleted: true }, { new: true });
    return result;
};
// Permanently delete an admin from the database
const deleteAdmin = async (id) => {
    const admin = await user_model_1.User.findOne({ _id: id, role: 'admin' });
    if (!admin) {
        throw new Error('Admin not found');
    }
    const result = await user_model_1.User.findByIdAndDelete(id);
    return result;
};
// get single user
const getSingleUser = async (id) => {
    const result = await user_model_1.User.findById(id);
    return result;
};
// change user role
const changeUserRole = async (id, role) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, { role }, { new: true });
    return result;
};
// change user status
const changeUserStatus = async (id, status) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, { status }, { new: true });
    return result;
};
exports.UserServices = {
    createUser,
    getAllUser,
    getAllAdmin,
    deleteUser,
    getSingleUser,
    getSingleAdmin,
    deleteAdmin,
    changeUserRole,
    changeUserStatus,
    updateUser,
};
