const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'text-editor/dist')));

// Serve index.html for all routes, letting Vite handle the front-end routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'text-editor/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
