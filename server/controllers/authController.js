const { auth, db, admin } = require('../config/firebase');
const userService = require('../Services/userService');
const { asyncHandler } = require('../Utils/asyncHandler');
const { ApiError } = require('../Utils/ApiError');
const logger = require('../Utils/logger');

// Signup Controller
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, exam } = req.body;

  if (!name || !email || !password || !exam) {
    throw new ApiError(400, 'Missing required fields: name, email, password, and exam are required.');
  }

  logger.info(`Attempting to register user: ${email}`);

  try {
    const result = await userService.createUserAccount(req.body);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      uid: result.uid,
      displayName: result.displayName
    });
  } catch (error) {
    logger.error(`Registration failed for ${email}: ${error.message}`);
    const statusCode = error.statusCode || 500;
    throw new ApiError(statusCode, error.message || 'Failed to create account.');
  }
});

// Login Controller
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  logger.info(`Login attempt for: ${email}`);

  try {
    const result = await userService.verifyUserExists(email, password);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      uid: result.uid,
      displayName: result.displayName
    });
  } catch (error) {
    logger.error(`Login failed for ${email}: ${error.message}`);
    const statusCode = error.statusCode || 500;
    throw new ApiError(statusCode, error.message || 'Internal server error during login.');
  }
});

// Get All Users Controller
const getAllUsers = asyncHandler(async (req, res) => {
  logger.info(`Fetching all users`);
  const result = await userService.getAllUsers();

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});

// Update User Controller
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  logger.info(`Updating user ${id}: ${JSON.stringify(data)}`);
  const result = await userService.updateUser(id, data);

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: result
  });
});

// Delete User Controller
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Deleting user ${id}`);
  await userService.deleteUser(id);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

module.exports = { signup, login, getAllUsers, updateUser, deleteUser };
