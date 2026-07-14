const AmcModel = require('../Models/amcModel');

// GET /api/amc
const getAllAmc = async (req , res) => {
    try{
        const plans = await AmcModel.getAll();
        res.json({success : true , data:plans});
    }catch(err){
        res.status(500).json({success:false,message : 'Server error'});
    }
};

// GET /api/amc/:id
const getAmcById = async (req,res)=>{
    try{
        const plan = await AmcModel.getById(req.params.id);
        if(!plan)
            return res.status(404).json({success:false,mesaage:"AMC plan not found"});
        res.json({success:true ,data:plan});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// POST /api/admin/amc  (protected)
const createAmc = async (req , res)=>{
    try{
        const {title , description} = req.body;
    if(!title || !description)
        return res.status(400).json({success:false , message :'Title and description required'});

    const id = await AmcModel.create({title,description});
    res.status(201).json({success:true , message: 'AMC plan created' , id});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// PUT /api/admin/amc/:id  (protected)
const updateAmc = async(req,res)=>{
    try{
        const existing = await AmcModel.getById(req.params.id);
        if (!existing)
            return res.status(404).json({success:false ,message:'AMC plant not found'});

        const {title,description} = req.body;
        await AmcModel.update(req.params.id ,{title,description});
        res.json({success:true , message:'AMC plan updated'});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// DELETE /api/admin/amc/:id  (protected)
const deleteAmc= async(req, res)=>{
    try{
        const existing = await AmcModel.getById(req.params.id);
        if(!existing)
            return res.status(404).json({success:false,message:'AMC plan not found'});

        await AmcModel.delete(req.params.id);
        res.json({success:true , message:'AMC plan deleted'});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

module.exports ={getAllAmc,getAmcById,createAmc,updateAmc,deleteAmc};