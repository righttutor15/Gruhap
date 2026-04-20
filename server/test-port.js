const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('ok'));
app.listen(5000, () => {
    console.log("Listen callback fired on 5000");
}).on('error', (e) => {
    console.log("Error event:", e.message);
});
