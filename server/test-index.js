require('dotenv').config();
console.log('1');
const express = require('express');
console.log('2');
const cors = require('cors');
console.log('3');
const authRoutes = require('./routes/authRoutes');
console.log('4');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

const PORT = 5005;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
console.log('5');
