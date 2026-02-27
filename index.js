const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Event = require("./models/Event");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ==========================
// CREATE
// ==========================
app.post("/events", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================
// READ ALL
// ==========================
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// READ ONE (by ID)
// ==========================
app.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// ==========================
// UPDATE
// ==========================
app.put("/events/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================
// DELETE
// ==========================
app.delete("/events/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});