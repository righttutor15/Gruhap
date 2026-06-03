const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../Utils/asyncHandler');
const { ApiError } = require('../Utils/ApiError');
const logger = require('../Utils/logger');

// Sign up admin
const signupAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Missing name, email, or password.');
  }

  logger.info(`Attempting to register admin: ${email}`);

  const adminCollection = db.collection('admins');
  const snapshot = await adminCollection.where('email', '==', email).limit(1).get();

  if (!snapshot.empty) {
    throw new ApiError(400, 'An administrator account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminData = {
    name,
    email,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  const docRef = await adminCollection.add(adminData);

  const token = jwt.sign(
    { uid: docRef.id, name, email, role: 'admin' },
    process.env.JWT_SECRET || 'gruhap_admin_jwt_secret_key',
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    success: true,
    message: 'Admin account created successfully!',
    uid: docRef.id,
    displayName: name,
    email,
    role: 'admin',
    token
  });
});

// Login admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  logger.info(`Admin login attempt for: ${email}`);

  const adminCollection = db.collection('admins');
  const snapshot = await adminCollection.where('email', '==', email).limit(1).get();

  if (snapshot.empty) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const adminDoc = snapshot.docs[0];
  const adminData = adminDoc.data();

  const isPasswordValid = await bcrypt.compare(password, adminData.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = jwt.sign(
    { uid: adminDoc.id, name: adminData.name, email: adminData.email, role: adminData.role || 'admin' },
    process.env.JWT_SECRET || 'gruhap_admin_jwt_secret_key',
    { expiresIn: '7d' }
  );

  return res.status(200).json({
    success: true,
    message: 'Login successful!',
    uid: adminDoc.id,
    displayName: adminData.name,
    email: adminData.email,
    role: adminData.role || 'admin',
    token
  });
});

module.exports = { signupAdmin, loginAdmin };
