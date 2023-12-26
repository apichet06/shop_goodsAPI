const jwt = require('jsonwebtoken');
const Messages = require('../config/messages');
require('dotenv');
const fs = require('@cyclic.sh/s3fs')

class auth {
    static async authenticateToken(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: Messages.error, Message: Messages.notToken });
        }

        //กรณี Token ไม่ถูกต้องให้ลบรูปภาพด้วย
        const files = req.files;

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {

                files.map(file => {
                    file && fs.unlinkSync(file.path);
                })
                return res.status(403).json({ status: Messages.error, Message: Messages.invalidToken });
            }
            req.userId = decoded.userId;
            next();
        });
    }
}

module.exports = auth;