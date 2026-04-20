const { auth, db, admin } = require('../config/firebase');

class UserService {
    constructor() {
        this.collection = db.collection("users");
    }

    async createUserAccount(data) {
        const { name, email, password, exam } = data;

        // Check if user already exists
        const snapshot = await this.collection.where('email', '==', email).limit(1).get();
        if (!snapshot.empty) {
            const error = new Error('User with this email already exists.');
            error.statusCode = 400;
            throw error;
        }

        const userData = {
            name,
            email,
            password, // Storing in plain text as requested by straightforward firestore req, ideally hash this later
            exam,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Save to Firestore
        const docRef = await this.collection.add(userData);
        const result = {
            id: docRef.id,
            uid: docRef.id,
            displayName: name,
            ...userData
        };

        return result;
    }

    async verifyUserExists(email, password) {
        try {
            // Check Firestore for user via auth
            const snapshot = await this.collection.where('email', '==', email).limit(1).get();

            if (snapshot.empty) {
                const customError = new Error('Invalid email or password.');
                customError.statusCode = 401;
                throw customError;
            }

            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();

            // Very basic password check (since this is pure Firestore Auth substitute)
            if (password && userData.password !== password) {
                const customError = new Error('Invalid email or password.');
                customError.statusCode = 401;
                throw customError;
            }

            return {
                uid: userDoc.id,
                displayName: userData.name
            };
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
            const results = [];
            snapshot.forEach(doc => {
                results.push({ id: doc.id, ...doc.data() });
            });
            return results;
        } catch (error) {
            console.error("Error inside getAllUsers method!", error);
            throw error;
        }
    }

    async updateUser(id, data) {
        try {
            const updateData = {
                ...data,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            await this.collection.doc(id).update(updateData);
            return { id, ...updateData };
        } catch (error) {
            console.error("Error inside updateUser method!", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            // Delete from Firestore
            await this.collection.doc(id).delete();
            return { id };
        } catch (error) {
            console.error("Error inside deleteUser method!", error);
            throw error;
        }
    }
}

module.exports = new UserService();
