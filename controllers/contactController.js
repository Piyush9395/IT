const ContactModel = require('../Models/contactModel');
// POST /api/contact  (public — from contact form)
const submitContact = async(req , res)=>{
    try{
        const {name,mobile,email,message} = req.body;
        if (!name || !mobile || !email || !message)
            return res.status(400).json({success:false,message:'All fields are required'});

        // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({success:false,message:'Invalid email address'});

    const id = await ContactModel.create({ name,mobile ,email,message});
    res.status(201).json({success:true,message:'Enquiry submitted successfully',id});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// GET /api/admin/contacts  (protected)
const getAllContacts = async(req,res)=>{
    try{
        const contacts = await ContactModel.getAll();
        res.json({success:true , data:contacts});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// GET /api/admin/contacts/:id  (protected)
const getContactById = async(req,res)=>{
    try{
        const contact = await ContactModel.getById(req.params.id);
        if(!contact)
            return res.status(404).json({success:false,message:'Enquiry not found'});
        res.json({success:true , data:contact});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

// DELETE /api/admin/contacts/:id  (protected)
const deleteContact = async(req,res)=>{
    try{
        const existing = await ContactModel.getById(req.params.id);
        if(!existing)
            return res.status(404).json({success:false,message:'Enquiry not found'});

        await ContactModel.delete(req.params.id);
        res.status(201).json({success:true,message:'Enquiry deleted'});
    }catch(err){
        res.status(500).json({success:false,message:'Server error'});
    }
};

module.exports = {submitContact , getAllContacts , getContactById ,deleteContact};