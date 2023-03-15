const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const router = express.Router();

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({
      user: req.user.id,
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Server error",
    });
  }
});

router.post("/addnote", fetchuser, async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const { title, description, tag } = req.body;
    const note = new Notes({
      title,
      description,
      tag,
      user: req.user,
    });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Server error",
    });
  }
});

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // console.log("req.body:", req.body);
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send({
        error: "Note not found",
      });
    }
    if (note.user.toString() !== req.user) {
      return res.status(401).send({
        error: "Not allowed",
      });
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      {
        $set: newNote,
      },
      {
        new: true,
      }
    );
    res.json({
      note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Server error",
    });
  }
});

//Delete a note using: DELETE "/api/auth/deletenote". Requires Auth
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // console.log("req.body:", req.body);
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send({
        error: "Note not found",
      });
    }
    if (note.user.toString() !== req.user) {
      return res.status(401).send({
        error: "Not allowed",
      });
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success": "Note has been deleted", note: note});
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Server error",
    });
  }
});

module.exports = router;
