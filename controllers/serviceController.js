const ServiceModel = require('../Models/serviceModel');
const fs = require('fs');
const path = require('path');
const { serialize } = require('v8');

// GET /api/services
const getAllServices = async(req , res)=>{
    try{
        const services = await ServiceModel.getAll();
        res.json({success:true,data:services});
    }catch(err){
        res.status(500).json({success:false,message:'Servet error'});
    }
};

// GET /api/services/:id
const getServiceById = async(req,res)=>{
    try{
        const service = await ServiceModel.getById(req.params.id);
        if(!service)
            return res.status(404).json({success:false,message:'Service not found'});
        res.json({success:true,data:service});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// POST /api/admin/services   (protected)
const createService = async(req,res)=>{
    try{
        const { title,description} = req.body;
        if(!title || !description)
            return res.status(400).json({success:false , message:'Title and description required'});

        const image = req.file ? req.file.filename : null;
        const id = await ServiceModel.create({title,description,image});

        res.status(201).json({success:true,message:'Service created',id});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// PUT /api/admin/services/:id  (protected)
const updateService = async (req,res)=>{
    try{
        const existing = await ServiceModel.getById(req.params.id);
        if(!existing)
            return res.status(404).json({ success : false, message:'Service not found'});

        const {title,description} = req.body;
        let image = existing.image;

        if (req.file){
            if(existing.image){
                const oldPath = path.join(process.env.UPLOAD_DIR || 'uploads',existing.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            image = req.file.filename;
        }
        await ServiceModel.update(req.params.id , {title,description,image});
        res.json({success:true ,message:'Service updated'});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// DELETE /api/admin/services/:id  (protected)
const deleteService = async (req,res)=>{
    try{
        const existing = await ServiceModel.getById(req.params.id);
        if (!existing)
            return res.status(404).json({success:false,message:'Service not found'});

        if(existing.image){
            const imgPath =path.join(process.env.UPLOAD_DIR || 'uploads', existing.image);
            if(fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        await ServiceModel.delete(req.params.id);
        res.json({success:true,message:'Service deleted'});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

module.exports = { getAllServices,getServiceById,createService,updateService,deleteService};