const db = require ('../config/db');

const ContactModel ={
    getAll : async()=>{
        const [rows] = await db.execute(
            'select * from contacts order by date desc '
        );
        return rows;
    },
    getById :  async (id) =>{
        const [rows] = await db.execute('select * from contacts where id = ?',[id]);
        return rows[0] || null;
    
    } ,

    creae : async ({name,mobile ,email,message})=>{
        const[result] = await db.execute(
            'insert into contacts (name,mobile,email,message) values (?,?,?,?)',[name,mobile,email,message]
        );
        return result.insertId;
    },

    delete: async( id)=>{
        const [result] = await db.execute('delete from contacts where id = ?',[id]);
        return result;
    },

    getCount : async()=>{
        const [[row]] = await db.execute('select count(*) as total from contacts');
        return row.total;
    }

};

module.exports = ContactModel ;