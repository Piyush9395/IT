const db = require('../config/db');

const AdminModel = {
    findByUsername: async (username) =>{
        const [rows] = await db.execute(
            'select * from admins where username = ?',
            [username]
        );
        return rows[0] || null;
    } ,

    findBYId: async (id) =>{
        const [rows]=await db.execute(
            'select id,username from admins where id= ?',[id]
        );
        return rows[0] || null;
    },

    updatePassword : async (id, hashedPassword) =>{
        const [result] =await db.execute(
            'update admins setpassword = ? where id = ?',[hashedPassword ,id]
        );
        return result;
    }
}

module.exports = AdminModel;