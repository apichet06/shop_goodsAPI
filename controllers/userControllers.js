const Users = require("../models/userModel");
const bcrypt = require('bcrypt');
require("../config/messages");
const jwt = require('jsonwebtoken');
const Messages = require("../config/messages");
require('dotenv');

class UsersController {

    static async CreateUsers(req, res) {
        try {
            const { u_title, u_firstname, u_lastname, u_email, u_address, u_ship_address, u_tel, u_status, u_password } = req.body;

            const exitEmail = await Users.findByEmail(u_email);

            if (exitEmail) {
                return res.status(409).json({ error: Messages.repeat_email })
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
            res.status(200).json({ status: 'ok', message: Messages.insertSuccess, user });


        } catch (error) {

            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async UpdateUsers(req, res) {
        try {
            const { u_id } = req.params;
            const { u_title, u_firstname, u_lastname, u_address, u_ship_address, u_tel, u_status } = req.body;
            const userData = {
                u_title,
                u_firstname,
                u_lastname,
                u_address,
                u_ship_address,
                u_tel,
                u_status
            }

            const user = await Users.update(userData, u_id);
            if (user) {
                res.status(200).json({ status: 'ok', message: Messages.updateSuccess, data: user });
            } else {
                res.status(400).json({ status: 'error', message: Messages.userNotFound })
            }

        } catch (error) {

            res.status(500).json({ status: Messages.error500, message: error.message });
        }

    }

    static async DeleteUsers(req, res) {
        try {
            const { u_id } = req.params;
            const user = await Users.getUserById(u_id);
            if (!user) {
                return res.status(409).json({ message: Messages.idNotFound })
            }
            if (user) {
                await Users.delete(u_id)
                const { u_password, ...data } = user
                res.status(200).json({ status: 'ok', message: Messages.deleteSuccess, user: data })
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message })
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
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async login(req, res) {
        const { u_email, u_password } = req.body;


        try {

            const user = await Users.findByEmail(u_email);

            if (!user) {
                return res.status(400).json({ error: Messages.userNotFound });
            }
            // Compare passwords
            const passwordMatch = await Users.comparePassword(u_password, user.u_password);
            // console.log(passwordMatch);
            if (!passwordMatch) {
                return res.status(401).json({ error: Messages.invalidPassword });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.u_id, kty: 'oct' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            delete user.u_password
            // Return the token
            res.json({ success: true, token, user });
        } catch (error) {
            res.status(500).json({ error: Messages.error500, message: error.message });
        }
    }

}


module.exports = UsersController;

