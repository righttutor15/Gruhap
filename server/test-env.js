require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

console.log("Initializing...");
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Success!");
} catch (e) {
    console.log("Error:", e.message);
}
