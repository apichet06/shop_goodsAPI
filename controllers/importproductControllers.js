const Messages = require("../config/messages");

class ImportProductController {

    static async GetAll(req, res) {

        try {
            res.status(200).send("Test ProductImport")
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }

    }

}

module.exports = ImportProductController;