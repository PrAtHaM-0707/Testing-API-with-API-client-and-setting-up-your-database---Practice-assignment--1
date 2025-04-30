const express = require("express");
const fs = require("fs");
const path = require("path");
const { resolve } = require("path");

const app = express();
const port = 3010;

app.use(express.json());

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.post("/students/above-threshold", (req, res) => {
  const threshold = req.body.threshold;

  if (typeof threshold !== "number" || isNaN(threshold)) {
    return res
      .status(400)
      .json({ error: "Invalid threshold. It must be a number." });
  }

  const filePath = path.join(__dirname, "data.json");

  let students;
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    students = JSON.parse(data);
  } catch (err) {
    console.error("Error reading data.json:", err.message);
    return res.status(500).json({ error: "Failed to read student data." });
  }

  const filtered = students.filter((student) => student.total > threshold);
  const result = filtered.map((s) => ({
    name: s.name,
    total: s.total,
  }));

  res.json({
    count: result.length,
    students: result,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
