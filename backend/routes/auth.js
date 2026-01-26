const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', {
        expiresIn: '7d',
    });
};

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        // Create new user
        const newUser = new User({
            id: `user-${Date.now()}`,
            name,
            email,
            password,
            role: role || 'HR',
        });

        await newUser.save();

        const token = generateToken(newUser._id);
        const { password: _, ...userToReturn } = newUser.toObject();

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: userToReturn,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = generateToken(user._id);
        const { password: _, ...userToReturn } = user.toObject();

        res.json({
            message: 'Login successful',
            token,
            user: userToReturn,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify token
router.get('/verify', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: _, ...userToReturn } = user.toObject();
        res.json(userToReturn);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
    // Token invalidation can be handled by client removing the token
    // Or implement token blacklist in production
    res.json({ message: 'Logout successful' });
});

// Update user
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, department, profileImage } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, email, phone, department, profileImage },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: _, ...userToReturn } = user.toObject();
        res.json(userToReturn);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
