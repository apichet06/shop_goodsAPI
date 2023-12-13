const moment = require("moment");
const Messages = require("../config/messages");
const ProductTypeModel = require("../models/productTypeModel");


class ProductTypeController {

    static async CreateProductType(req, res) {
        try {
            const { type_name } = req.body

            const type_id = await ProductTypeModel.GenerateUniqueId()
            const TypeData = {
                type_id,
                type_name
            }
            const existstypeName = await ProductTypeModel.FindByProductType(type_name)

            if (existstypeName) {
                res.status(400).json({ status: 'error', message: Messages.exists + existstypeName.type_name })
                return;
            }

            const productType = await ProductTypeModel.Create(TypeData)
            res.status(200).json({ status: 'ok', data: productType });
        } catch (error) {
            res.status(500).json({ status: Messages.error500, error: error.message })
        }

    }

    static async UpdateProductType(req, res) {
        try {
            const { type_id } = req.params
            const { type_name } = req.body

            const existType = await ProductTypeModel.FinbyUpdateType(type_name, type_id)

            if (existType) {
                res.status(400).json({ status: 'error', message: Messages.exists + type_name })
                return
            }

            const Data = await ProductTypeModel.Update(type_name, type_id)
            res.status(200).json({ status: 'ok', data: Data });

        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message });
        }
    }



    static async DeleteProductType(req, res) {
        try {
            const { type_id } = req.params
            const Data = await ProductTypeModel.Delete(type_id)
            if (Data == 1) {
                res.status(200).json({ status: 'ok', data: Data })
            } else {
                res.status(400).json({ status: Messages.error, message: Messages.idNotFound })
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message });
        }
    }


    static async ShowAllProductType(req, res) {
        try {
            const productType = await ProductTypeModel.GetAllProductType()
            res.status(200).json({ status: 'ok', data: productType });
        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message })
        }

    }
}


module.exports = ProductTypeController;