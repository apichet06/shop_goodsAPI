const Messages = require("../config/messages");
const CartItemModel = require("../models/cartItemModel");

class CartItemController {


    static async DeleletCart(req, res) {
        try {
            const { id } = req.params
            const Data = await CartItemModel.Delete(id)
            if (Data == 1) {
                res.status(200).json({ status: 'ok', data: Data })
            } else {
                res.status(400).json({ status: Messages.error, message: Messages.idNotFound })
            }
        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message });
        }
    }

}

module.exports = CartItemController;