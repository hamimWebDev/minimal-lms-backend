import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (user: IUser, creatorRole: string) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Only admin can create admin users
  if (user.role === 'admin' && creatorRole !== 'admin') {
    throw new Error('Only admins can create admin users');
  }

  const result = await User.create(user);
  return result;
};

//update user
const updateUser = async (id: string, user: IUser): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate(id, user, { new: true });
  return result;
}

  
// get all user or admin 
const getAllUser = async (): Promise<IUser[]> => {
  const result = await User.find({ role: 'user' });
  return result;
}
// get all   admin 
const getAllAdmin = async (): Promise<IUser[]> => {
  const result = await User.find({ role: 'admin' });
  return result;
}

const getSingleAdmin = async (id: string): Promise<IUser | null> => {
  const result = await User.findOne({ role: 'admin', _id: id });
  if (!result) {
    throw new Error('Admin not found');
  }
  return result;
}

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate(id, { role: 'user', isDeleted: true }, { new: true });
  return result;
}

// Permanently delete an admin from the database
const deleteAdmin = async (id: string): Promise<IUser | null> => {
  const admin = await User.findOne({ _id: id, role: 'admin' });
  if (!admin) {
    throw new Error('Admin not found');
  }
  const result = await User.findByIdAndDelete(id);
  return result;
}


// get single user
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
}

// change user role
const changeUserRole = async (id: string, role: string): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate(id, { role }, { new: true });
  return result;
}
// change user status
const changeUserStatus = async (id: string, status: string): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate(id, { status }, { new: true });
  return result;
}
export const UserServices = {
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
}
