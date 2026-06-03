const admin = require('firebase-admin');
const serviceAccount = require('../gruhap-a7354-firebase-adminsdk-fbsvc-9023e72727.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db, admin };
