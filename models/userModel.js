const db = require("../config/db");


class Users {

    static async generateUniqueId() {
        try {
            const [result] = await db.query('SELECT MAX(u_id) AS maxId FROM users');
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(1)) + 1;
                const nextId = `U${idNumber.toString().padStart(7, '0')}`;
                return nextId;
            } else {
                // If no existing users, start from U100001
                return 'U10000001';
            }
        } catch (error) {
            throw error;
        }
    }

    static async create(userData) {
        try {
            // console.log(userData);
            const [result] = await db.query("INSERT INTO users SET ?", userData);

            const [user] = await db.query('SELECT * FROM users WHERE id = ?', result.insertId);

            return user;
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }

    static async update(userData) {
        const [result] = await db.query("UPDATE users SET ?", userData);

        if (result) {

            return result.affectedRows;
        } else {
            throw new Error('User update failed.'); // Handle the case when the update was not successful
        }
    }



    static async userAll() {
        try {
            const [result] = await db.query('SELECT * FROM users order by u_id desc');
            if (result) {
                return result;
            } else {
                throw new Error('ไม่พบข้อมูลผู้ใช้!')
            }
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {

        const [rows] = await db.query('SELECT * FROM users WHERE u_email = ?', [email]);
        // console.log(rows);
        return rows[0] || null;
    }


}

module.exports = Users;
