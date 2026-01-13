const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { nama, email, password, role, nama_perusahaan } = req.body;

    if (!nama || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Default role is customer if not specified
    const userRole = role || 'customer';

    // If role is operator, nama_perusahaan is required
    if (userRole === 'operator' && !nama_perusahaan) {
        return res.status(400).json({ message: 'Company name is required for operators' });
    }

    try {
        // Check if user already exists
        User.getUserByEmail(email, async (err, existingUser) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (existingUser) return res.status(400).json({ message: 'Email already registered' });

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                nama,
                email,
                password: hashedPassword,
                role: userRole,
                nama_perusahaan: userRole === 'operator' ? nama_perusahaan : null
            };

            User.createUser(newUser, (err, result) => {
                if (err) return res.status(500).json({ message: 'Error registering user' });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    User.getUserByEmail(email, async (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Set session
        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.nama_perusahaan = user.nama_perusahaan;

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                nama_perusahaan: user.nama_perusahaan
            }
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Could not log out' });
        res.json({ message: 'Logout successful' });
    });
};

exports.getCurrentUser = (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    User.getUserById(req.session.userId, (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    });
};
