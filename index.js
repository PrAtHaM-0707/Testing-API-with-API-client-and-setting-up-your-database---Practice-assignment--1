const express = require('express');
const fs = require('fs');
const path = require('path');
const { resolve } = require('path');

const app = express();
const port = 3010;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files
app.use(express.static('static'));

// Homepage route
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// POST /students/above-threshold API
app.post('/students/above-threshold', (req, res) => {
  const threshold = req.body.threshold;

  // Validate input
  if (typeof threshold !== 'number' || isNaN(threshold)) {
    return res.status(400).json({ error: 'Invalid threshold. It must be a number.' });
  }

  // Path to data.json
  const filePath = path.join(__dirname, 'data.json');

  // Read student data
  let students;
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    students = JSON.parse(data);
  } catch (err) {
    console.error('Error reading data.json:', err.message);
    return res.status(500).json({ error: 'Failed to read student data.' });
  }

  // Filter students by threshold
  const filtered = students.filter(student => student.total > threshold);
  const result = filtered.map(s => ({
    name: s.name,
    total: s.total
  }));

  // Send response
  res.json({
    count: result.length,
    students: result
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
