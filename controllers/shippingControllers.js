const Messages = require("../config/messages");
const ShippingModel = require("../models/shippingModel");
const FileUpload = require("../models/fileUploadModel");


class ShippingController {

    static async CreateShipping(req, res) {
        try {
            const shipping_key = await ShippingModel.generateShippingKey()

            const { order_id, status_id } = req.body
            const sxisKey = await ShippingModel.exisData(order_id)


            const sxisKeys = sxisKey ? sxisKey.shipping_key : shipping_key


            const files = req.file;
            const folder = 'shipping';

            const shipping_image = files ? await FileUpload.uploadFile(files, sxisKeys, folder) : '';

            const Data = { order_id, status_id, shipping_key: sxisKeys, shipping_image }

            const shipping = await ShippingModel.Create(Data)
            if (shipping)
                res.status(200).json({ status: 'ok', message: Messages.insertSuccess, data: shipping })
            else
                res.status(200).json({ status: 'error', message: Messages.error })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }


}

module.exports = ShippingController;