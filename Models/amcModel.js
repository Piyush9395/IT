const db = require('../config/db');

const AmcModel = {
    getAll : async () =>{
        const [rows] = await db.execute(
            'select * from amc order by id asc'
        );
        return rows;
    },

    getById :async (id) =>{
        const [rows] =await db.execute(
            'select * from amc where id = ?',[id]
        );
        return rows[0] || null;
    },

    create : async ({title , description})=>{
        const [result] = await db.execute(
            'insert into amc (title , description) values (?,?)',[title , description]
        );
        return result.insertId;
    },
    
    update : async (id,{title , description})=>{
        const fields = [];
        const values = [];

        if (title !== undefined)
               {
                fields.push('title=?');
                values.push(title);
            }
        if (description !== undefined){
            fields.push('description =?');
            values.push(description);
        }

        if(!fields.length) return null;
        values.push(id);

        const [result] = await db.execute(
            `update amc set ${fields.join(',')} where id = ?`, values
        );
        return result;
    },

    delete: async(id) =>{
        const [result] = await db.execute(`delete from amc where id = ?`,[id]);
        return result;
    },
         
};

modules.exports = AmcModel ;
