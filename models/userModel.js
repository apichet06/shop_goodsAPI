const db = require("../config/db");
const bcrypt = require("bcrypt");
const Messages = require("../config/messages");

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

    static async update(userData, u_id) {
        try {

            const [result] = await db.query("UPDATE users SET ? Where u_id = ? ", [userData, u_id]);

            const [user] = await db.query('SELECT * FROM users WHERE u_id = ?', u_id);

            if (result) {
                return user;
            } else {
                throw new Error(Messages.updateFailed);
            }

        } catch (err) {
            return error.message;
        }

    }


    static async delete(u_id) {

        try {
            const [result] = await db.query('DELETE FROM users WHERE  u_id = ?', [u_id])
            // console.log(result.affectedRows);
            if (result) {
                return result.affectedRows;
            } else {
                throw new Error(Messages.deleteFailed); // Handle the case when the delete
            }

        } catch (error) {
            throw error;
        }

    }

    static async getUserById(u_id) {

        const [rows] = await db.query('SELECT * FROM users WHERE u_id = ?', [u_id]);
        // console.log(rows);
        return rows[0] || null;
    }

    static async userAll() {
        try {
            const [result] = await db.query('SELECT * FROM users order by u_id desc');
            if (result) {
                return result;
            } else {
                throw new Error(Messages.deleteFailed)
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

    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword)
    }



}

module.exports = Users;
