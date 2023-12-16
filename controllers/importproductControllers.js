const Messages = require("../config/messages");
const ImportProduct = require("../models/importproductModel");

class ImportProductController {

    static async GetAll(req, res) {
        try {
            const { Data } = req.body;

            const product_import = await ImportProduct.GetAll(Data);
            res.status(200).json({ status: "ok", data: product_import });
        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message });
        }
    }

}

module.exports = ImportProductController;