const Users = require("../models/userModel");
const bcrypt = require('bcrypt');
require("../config/messages");


class UsersController {

    static async createUsers(req, res) {
        try {
            const { u_title, u_firstname, u_lastname, u_email, u_address, u_ship_address, u_tel, u_status, u_password } = req.body;

            const exitEmail = await Users.findByEmail(u_email);

            if (exitEmail) {
                return res.status(409).json({ error: repeat_email })
            }

            const u_id = await Users.generateUniqueId();
            const hashedPassword = await bcrypt.hash(u_password, 10);

            const userData = {
                u_id,
                u_title,
                u_firstname,
                u_lastname,
                u_email,
                u_password: hashedPassword,
                u_address,
                u_ship_address,
                u_tel,
                u_status
            }

            const user = await Users.create(userData);
            res.status(200).json({ status: 'ok', user });


        } catch (error) {
            console.error(error.message);
            res.status(500).json({ status: error500, message: error.message });
        }
    }

    static async updateUsers(req, res) {
        try {
            const { u_title, u_firstname, u_lastname, u_email, u_address, u_ship_address, u_tel, u_status } = req.body;
            const userData = {
                u_id,
                u_title,
                u_firstname,
                u_lastname,
                u_address,
                u_ship_address,
                u_tel,
                u_status
            }

            const user = await Users.update(userData);
            res.status(200).json({ status: 'ok', user });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ status: error500, message: error.message });
        }

    }


    static async ShowUserAll(req, res) {
        try {
            const user = await Users.userAll();
            if (user) {
                const sanitizedUsers = user.map(user => {
                    const { u_password, ...data } = user;
                    return data;
                });
                // delete user[0].u_password;
                res.status(200).json({ status: 'ok', data: sanitizedUsers });
            }
        } catch (error) {
            res.status(500).json({ status: error500, message: error.message });
        }
    }


}


module.exports = UsersController;

