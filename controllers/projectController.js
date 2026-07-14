const ProjectModel = require('../Models/projectModel');
const fs = require('fs');
const path = require('path');

// GET /api/projects
const getAllProject = async(req , res)=>{
    try{
        const projects = await ProjectModel.getAll();
        res.json({success : true,data:projects});
    }catch(err){
        res.status(500).json({success:false,message:'Sever error'});
    }
};

// GET /api/projects/:id
const getProjectById = async(req,res)=>{
    try{
        const project = await ProjectModel.getById(req.params.id);
        if(!project) 
            return res.status(404).json({success:false,message:'Project not found'});
        res.json({success:true,data:project});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// POST /api/admin/projects  (protected)
const createProject = async(req,res)=>{
    try{
        const {title,description} = req.body;
        if(!title || !description)
            return res.status(400).json({success :false ,message:'Title and desription required'});

        const image = req.file ? req.file.filename : null;
        const id = await ProjectModel.create({title,description,image});

        res.status(201).json({success:true,message:'Project created',id});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
        }
};

// PUT /api/admin/projects/:id  (protected)
const updateProject = async(req,res)=>{
    try{
        const existing = await ProjectModel.getById(req.params.id);
        if(!existing)
            return res.json(404).json({success:false,message:'Project not found'});

        const { title,description} = req.body;
        let image = existing.image;

        if(req.file){
            if(existing.image){
                const oldPath = path.join(process.env.UPLOAD_DIR || 'uploads', existing.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            image = req.file.filename;
        }
        await ProjectModel.update(req.params.id ,{title,description,image});
        res.json({success:true,message:'Project updated'});
    }catch(err){
        res.status(500).json({success :false,message:'Server error'});
    }
};

// DELETE /api/admin/projects/:id  (protected)
const deleteProject = async(req,res)=>{
    try{
        const existing = await ProjectModel.getById(req.params.id);
        if(!existing)
            return res.status(404).json({success:false,message:'Project not found'});

        if(existing.image){
            const imgPath = path.join(process.env.UPLOAD_DIR || 'uploads',existing.image);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        await ProjectModel.delete(req.params.id);
        res.json({success:true,message:'Project deleted'});
    }catch(err){
        res.status(500).json({success : false,message:'Server error'});
    }
};

module.exports = {getAllProject,getProjectById,createProject,updateProject,deleteProject};
