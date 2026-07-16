const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
    origin :[
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:4173',
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// ── Static files (uploaded images) ─────────────────────────
app.use('/uploads',express.static(path.join(__dirname , process.env.UPLOAD_DIR || 'uploads')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/admin',require('./routes/adminRoutes'))
app.use('api/services' , require('./routes/serviceRoutes'));
app.use('/api/projects',require('./routes/projectRoutes'));
app.use('/api/amc', require('./routes/amcRoutes'));
app.use('/api/contact' , require('./routes/contactRoutes'));

// ── Health check ────────────────────────────────────────────
app.get('/api/health',(req,res)=>{
    res.json({success:true ,message :'API is running'});
});

// ── React frontend (production build) ───────────────────────
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)){
    app.use(express.static(frontendDist));
    app.get('*',(req,res,next)=>{
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(frontendDist,'index.html'));
    });
}

// ── 404 handler ─────────────────────────────────────────────
app.use((req,res)=>{
    res.status(404).json({success:false , message :`Route ${req.originalUrl} not found`});
});

// ── Global error handler ────────────────────────────────────
app.use((err,req,res,next)=>{
    console.error('Unhandled error',err);
    res.status(500).json({success:false,message:err.message || 'Internal server error'});
});

module.exports = app;