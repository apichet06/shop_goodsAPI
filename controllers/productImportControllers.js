const Messages = require("../config/messages");
const ProductImportModule = require("../models/productImportModel")

class ProductImportController {
    static async CreateProduct_import(req, res) {
        try {
            const { pro_imp_qty, pro_imp_price, pro_imp_sellprice, products_id } = req.body;

            const Data = {
                pro_imp_qty,
                pro_imp_price,
                pro_imp_sellprice,
                products_id,
            };

            const product_import = await ProductImportModule.Create(Data);
            res.status(200).json({ status: "ok", data: product_import });
        } catch (error) {
            res.status(500).json({ status: Messages.error500, error: error.message });
        }
    }

    static async DeleteProduct_import(req, res) {
        try {
            const { id } = req.params
            const Data = await ProductImportModule.Delete(id)

            if (Data == 1) {
                res.status(200).json({ status: 'ok', data: Data })
            } else {
                res.status(400).json({ status: Messages.error, message: Messages.idNotFound })
            }


        } catch (error) {
            res.status(500).json({ status: Messages.error500, error: error.message });
        }

    }


    static async GetAllProduct_import(req, res) {
        try {
            const { Data } = req.body;

            const product_import = await ProductImportModule.GetAll(Data);
            res.status(200).json({ status: "ok", data: product_import });
        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message });
        }
    }
}

module.exports = ProductImportController;
