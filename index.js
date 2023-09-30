require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config()

// Define a basic route
app.post('/translation/image', (req, res) => {
    res.send('Hello, World!');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});