const express = require("express");
const Task = require("../models/Task");

console.log("TASK ROUTES LOADED");

const router = express.Router();

// GET all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// POST new task
router.post("/", async (req, res) => {
    try {
        const task = new Task(req.body);

        const savedTask = await task.save();

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// put routes update task

router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Delete tasks

router.delete("/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;