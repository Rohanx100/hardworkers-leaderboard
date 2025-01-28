const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// App setup
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const MONGO_URI = 'mongodb+srv://<username>:<password>@cluster.mongodb.net/hardworkers?retryWrites=true&w=majority'; // Replace with your MongoDB Atlas URI
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB 🚀'))
  .catch((err) => console.log('MongoDB connection error:', err));

// MongoDB Schemas
const studentSchema = new mongoose.Schema({
  name: String,
  lectures: { type: Number, default: 0 },
  pages: { type: Number, default: 0 },
  chapters: { type: Number, default: 0 },
  score: { type: Number, default: 0 }
});
const Student = mongoose.model('Student', studentSchema);

const activitySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  lectures: Number,
  pages: Number,
  chapters: Number,
  date: { type: Date, default: Date.now }
});
const Activity = mongoose.model('Activity', activitySchema);

// Routes
// Add a student
app.post('/api/students', async (req, res) => {
  try {
    const { name } = req.body;
    const student = new Student({ name });
    await student.save();
    res.status(201).json({ message: 'Student added!', student });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student!', error });
  }
});

// Add an activity
app.post('/api/activities', async (req, res) => {
  try {
    const { studentId, lectures, pages, chapters } = req.body;
    const student = await Student.findById(studentId);

    if (!student) return res.status(404).json({ message: 'Student not found!' });

    student.lectures += lectures;
    student.pages += pages;
    student.chapters += chapters;
    student.score += lectures * 100 + pages * 40 + chapters * 150;
    await student.save();

    const activity = new Activity({ studentId, lectures, pages, chapters });
    await activity.save();

    res.status(201).json({ message: 'Activity added!', activity });
  } catch (error) {
    res.status(500).json({ message: 'Error adding activity!', error });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Student.find().sort({ score: -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard!', error });
  }
});

// Get activity history
app.get('/api/history', async (req, res) => {
  try {
    const history = await Activity.find().populate('studentId');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history!', error });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
