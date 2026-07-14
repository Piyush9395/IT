const bcrypt = reqire('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../Models/adminModel');
const ServiceModel = require('../Models/serviceModel');
const ProjectModel = require('../Models/projectModel');
const ContactModel = require('../Models/contactModel');
const { stat } = require('node:fs');

// POST /api/admin/login
const login = async (req,res)=>{
    try{
        const {username, password} = req.body;
        if(!username || !password)
            return res.status(400).json ({success:false,message:'Username and password required'});

        const admin = await AdminModel.findByUsername(username);
        if(!admin) 
            return res.status(401).json({success:false ,message:'Invalid Credentials'});

        const match = await bcrypt.compare(password,admin.password);
        if(!match) 
            return res.status(401).json({success:false,message:'Invalid Credentials'});

        const token = jwt.sign(
            { id:admin.id , username:admin.username},
            process.env.JWT_SECRET,
            {expiresIn : '8h'}  
        );

        res.json({
            success:true,
            message:'Login successful',
            token,
            admin : {id :admin.id , username :admin.username},
        });
    } catch(err){
        console.error('Login error:',err);
        res.status(500).json({success:false , message:'Server error'});
    }
};

// GET /api/admin/profile
const getProfile = async (req,res)=>{
    try{
        const admin = await AdminModel.findById(req.admin.id);
        if(!admin)
            return res.status(404).json({success:false,message:'Admin not found'});
        res.json({success:true ,admin});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};


// PUT /api/admin/change-password
const changePassword = async (req,res)=>{
    try{
        const { oldPassword,newPassword} = req.body;
        if(!oldPassword || !newPassword)
            return res.status(400).json({success:false , message:'Both passwords required'});

        const admin = await AdminModel.findByUsername(req.admin.username);
        const match = await bcrypt.compare(oldPassword , admin.password);
        if(!match)
            return res.status(401).json({success: false , message:'Old password incorrect'});
        
        const hashed = await bcrypt.hash(newPassword , 10);
        await AdminModel.updatePassword(req.admin.id , hashed);

        res.json({success : true , message :'Password updated successfully'});
    }catch(err){
        res.json(500).json({success:false,message:'Server error'});
    }
};


// GET /api/admin/dashboard
const getDashboard = async(req, res)=>{
    try{
        const [ services,projects,enquiries] = await Promise.all([
            ServiceModel.getAll(),
            ProjectModel.getAll(),
            ContactModel.getCount(),        
        ]);

        res.json({
            success:true,
            stats:{
                totalService : services.length,
                totalProject : projects.length,
                totalEnquiries : enquiries,
            },
        });
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};
module.exports = {login,getProfile,changePassword,getDashboard};