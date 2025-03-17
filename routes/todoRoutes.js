import express from "express";
import Todo from "../models/Todo.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {title} = req.body;
        if (!title) return res.status(400).json({ message: "Title is required" });

        const newTodo = new Todo({user: userId, title});
        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({user: req.userId});
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const {title, completed} = req.body;

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { title, completed },
            { new: true }
        );

        if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({_id: req.params.id, user: userId});
        if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})