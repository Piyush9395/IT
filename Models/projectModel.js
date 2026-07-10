const db = require('../config/db');

const ProjectModel ={
    getAll : async () =>{
        const [rows] = await db.execute(
            'select * from projects order by id desc');
            return rows;
        
    },
    
    getById : async (id) =>{ 
        const [rows] = await db.execute(
            'select * from projects where id = ? ',[id]
        );
        return rows[0] || null ;
    },
     create : async ({title , description,image})=>{
        const [result] = await db.execute('insert into projects (title , description, image) values (?,?,?)',[title , description,image || null]);
        return result.insertId;
     },

     update : async (id ,{title , description ,image})=>{
        const fields =[];
        const values = [];

        if(title !== undefined){
            fields.push ('title =?');
            values.push(title);
        }
        if(description !== undefined){
            fields.push('description  = ?');
                values.push(description);
        }
        if(image!==undefined){
            fields.push('image=?');
            values.push(image);
        }

        if(!fields.length) return null;
        values.push(id);

        const [result] = await db.execute(
            'update projects set ${fields.join(',')} where id =?',values
        );
        return result;
    },

    delete : async(id)=>{
        const [result] = await db.execute('delete from projects where id = ?',[id]);
        return result;
    },
};

module.exports = ProjectModel;