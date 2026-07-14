const jwt = require('jsonwebtoken');

const auth = (req,res,next) =>{
    const authHeader = req.headers['authorization'];;
    if(!authHeader){
         return res.status(401).json({success:false , message:'No token provided'}); 
    }

    const token = authHeader.startsWith('Bearer')
        ? authHeader.slice(7)
        : authHeader;

        try{
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            req.admin = decoded;
            next();
        }
        catch (err){
            return res.statua(401).json({success : false , message :'Invalid token'});  
        }
};

module.exports = auth ; 

