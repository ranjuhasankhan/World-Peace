// World Peace Initiative - Backend API
// Built with Node.js, Express, and MongoDB

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worldpeace', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'volunteer', 'admin'],
        default: 'user'
    },
    country: {
        type: String,
        required: true
    },
    interests: [{
        type: String,
        enum: ['education', 'dialogue', 'environment', 'humanitarian', 'cultural', 'justice']
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

// Peace Initiative Schema
const initiativeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    category: {
        type: String,
        required: true,
        enum: ['education', 'dialogue', 'environment', 'humanitarian', 'cultural', 'justice']
    },
    location: {
        country: String,
        city: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'cancelled'],
        default: 'planning'
    },
    impact: {
        livesTouched: {
            type: Number,
            default: 0
        },
        volunteerHours: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Donation Schema
const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    currency: {
        type: String,
        default: 'USD'
    },
    initiative: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Initiative'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        maxlength: 500
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Volunteer Application Schema
const volunteerApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    initiative: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Initiative',
        required: true
    },
    skills: [String],
    availability: {
        hoursPerWeek: Number,
        startDate: Date,
        endDate: Date
    },
    motivation: {
        type: String,
        required: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: String,
    appliedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: Date
});

// Create Models
const User = mongoose.model('User', userSchema);
const Initiative = mongoose.model('Initiative', initiativeSchema);
const Donation = mongoose.model('Donation', donationSchema);
const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);

// Middleware for authentication
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid or inactive user' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Middleware for admin access
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// AUTH ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, country, interests } = req.body;

        // Validate input
        if (!name || !email || !password || !country) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            country,
            interests: interests || []
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                country: user.country,
                role: user.role,
                interests: user.interests
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                country: user.country,
                role: user.role,
                interests: user.interests
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            country: req.user.country,
            role: req.user.role,
            interests: req.user.interests,
            joinedAt: req.user.joinedAt
        }
    });
});

// INITIATIVE ROUTES

// Get all initiatives
app.get('/api/initiatives', async (req, res) => {
    try {
        const { category, country, status, page = 1, limit = 10 } = req.query;
        
        const filter = {};
        if (category) filter.category = category;
        if (country) filter['location.country'] = country;
        if (status) filter.status = status;

        const initiatives = await Initiative.find(filter)
            .populate('organizer', 'name country')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Initiative.countDocuments(filter);

        res.json({
            initiatives,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalInitiatives: total
        });
    } catch (error) {
        console.error('Get initiatives error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single initiative
app.get('/api/initiatives/:id', async (req, res) => {
    try {
        const initiative = await Initiative.findById(req.params.id)
            .populate('organizer', 'name country')
            .populate('participants.user', 'name country');

        if (!initiative) {
            return res.status(404).json({ error: 'Initiative not found' });
        }

        res.json({ initiative });
    } catch (error) {
        console.error('Get initiative error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create initiative (authenticated users)
app.post('/api/initiatives', authenticateToken, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            startDate,
            endDate
        } = req.body;

        if (!title || !description || !category || !startDate) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const initiative = new Initiative({
            title,
            description,
            category,
            location,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            organizer: req.user._id
        });

        await initiative.save();
        await initiative.populate('organizer', 'name country');

        res.status(201).json({
            message: 'Initiative created successfully',
            initiative
        });
    } catch (error) {
        console.error('Create initiative error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Join initiative
app.post('/api/initiatives/:id/join', authenticateToken, async (req, res) => {
    try {
        const initiative = await Initiative.findById(req.params.id);
        if (!initiative) {
            return res.status(404).json({ error: 'Initiative not found' });
        }

        // Check if user already joined
        const alreadyJoined = initiative.participants.some(
            p => p.user.toString() === req.user._id.toString()
        );

        if (alreadyJoined) {
            return res.status(400).json({ error: 'Already joined this initiative' });
        }

        initiative.participants.push({ user: req.user._id });
        await initiative.save();

        res.json({ message: 'Successfully joined initiative' });
    } catch (error) {
        console.error('Join initiative error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// VOLUNTEER ROUTES

// Apply to volunteer
app.post('/api/volunteer/apply', authenticateToken, async (req, res) => {
    try {
        const { initiativeId, skills, availability, motivation } = req.body;

        if (!initiativeId || !motivation) {
            return res.status(400).json({ error: 'Initiative and motivation are required' });
        }

        // Check if initiative exists
        const initiative = await Initiative.findById(initiativeId);
        if (!initiative) {
            return res.status(404).json({ error: 'Initiative not found' });
        }

        // Check if user already applied
        const existingApplication = await VolunteerApplication.findOne({
            user: req.user._id,
            initiative: initiativeId
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'Already applied for this initiative' });
        }

        const application = new VolunteerApplication({
            user: req.user._id,
            initiative: initiativeId,
            skills: skills || [],
            availability,
            motivation
        });

        await application.save();

        res.status(201).json({
            message: 'Volunteer application submitted successfully',
            application
        });
    } catch (error) {
        console.error('Volunteer application error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's volunteer applications
app.get('/api/volunteer/my-applications', authenticateToken, async (req, res) => {
    try {
        const applications = await VolunteerApplication.find({ user: req.user._id })
            .populate('initiative', 'title category location startDate status')
            .sort({ appliedAt: -1 });

        res.json({ applications });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DONATION ROUTES

// Create donation
app.post('/api/donations', async (req, res) => {
    try {
        const { amount, currency, initiativeId, isAnonymous, message, donorInfo } = req.body;

        if (!amount || amount < 1) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }

        let donorId = null;
        if (req.headers.authorization) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
                donorId = decoded.userId;
            } catch (error) {
                // Anonymous donation
            }
        }

        const donation = new Donation({
            donor: donorId,
            amount,
            currency: currency || 'USD',
            initiative: initiativeId || null,
            isAnonymous: isAnonymous || false,
            message,
            paymentStatus: 'pending'
        });

        await donation.save();

        // In a real implementation, you would integrate with a payment processor here
        // For demo purposes, we'll simulate successful payment
        setTimeout(async () => {
            donation.paymentStatus = 'completed';
            donation.paymentId = 'sim_' + Date.now();
            await donation.save();
        }, 2000);

        res.status(201).json({
            message: 'Donation initiated successfully',
            donationId: donation._id,
            status: 'pending'
        });
    } catch (error) {
        console.error('Donation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get donation statistics
app.get('/api/stats/donations', async (req, res) => {
    try {
        const totalDonations = await Donation.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const donationsByCountry = await Donation.aggregate([
            { $match: { paymentStatus: 'completed', donor: { $ne: null } } },
            { $lookup: { from: 'users', localField: 'donor', foreignField: '_id', as: 'donorData' } },
            { $unwind: '$donorData' },
            { $group: { _id: '$donorData.country', total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        res.json({
            totalAmount: totalDonations[0]?.total || 0,
            totalDonations: totalDonations[0]?.count || 0,
            donationsByCountry
        });
    } catch (error) {
        console.error('Donation stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ADMIN ROUTES

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ joinedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(filter);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalUsers: total
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get platform statistics (admin only)
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments({ isActive: true });
        const initiativeCount = await Initiative.countDocuments();
        const volunteerApplicationCount = await VolunteerApplication.countDocuments();
        
        const donationStats = await Donation.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const usersByCountry = await User.aggregate([
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const initiativesByCategory = await Initiative.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            overview: {
                totalUsers: userCount,
                totalInitiatives: initiativeCount,
                totalVolunteerApplications: volunteerApplicationCount,
                totalDonations: donationStats[0]?.total || 0,
                donationCount: donationStats[0]?.count || 0
            },
            usersByCountry,
            initiativesByCategory
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GENERAL ROUTES

// Get platform statistics (public)
app.get('/api/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments({ isActive: true });
        const initiativeCount = await Initiative.countDocuments({ status: { $in: ['active', 'completed'] } });
        const volunteerCount = await VolunteerApplication.countDocuments({ status: 'approved' });
        
        // Calculate total impact
        const impactStats = await Initiative.aggregate([
            { $group: { 
                _id: null, 
                totalLivesTouched: { $sum: '$impact.livesTouched' },
                totalVolunteerHours: { $sum: '$impact.volunteerHours' }
            }}
        ]);

        const countries = await User.distinct('country');

        res.json({
            livesTouched: impactStats[0]?.totalLivesTouched || Math.floor(userCount * 4.6), // Simulated
            countriesReached: countries.length,
            peaceProjects: initiativeCount,
            volunteers: volunteerCount || Math.floor(userCount * 0.3), // Simulated
            totalUsers: userCount,
            volunteerHours: impactStats[0]?.totalVolunteerHours || Math.floor(volunteerCount * 150) // Simulated
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌍 World Peace API server running on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;