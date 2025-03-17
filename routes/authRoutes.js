import express, { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//registering an user

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Auth route working!');
});

router.post("/register", async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

//logging in a user

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        const alreadyRegistered = await User.findOne({email});
        if(!alreadyRegistered) return res.status(400).json({ message: "User doesn't exists" });

        const userCheck = await bcrypt.compare(password, alreadyRegistered.password);
        if(!userCheck) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: alreadyRegistered._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
