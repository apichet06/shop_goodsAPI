const Messages = require("../config/messages");
const CartItemModel = require("../models/cartItemModel");

class CartItemController {

    static async CreateCartItem(req, res) {
        try {
            const { cart_qty, products_id, users_id } = req.body;
            const cart_id = await CartItemModel.generateUniqueId(users_id);
            const Data = {
                cart_id,
                cart_qty,
                products_id,
                users_id
            }
            const CartItem = await CartItemModel.Create(Data)

            if (CartItem)
                res.status(200).json({ status: 'ok', Messages: Messages.insertSuccess, data: CartItem })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message });
        }
    }

    static async UpdateCartItem(req, res) {
        try {

            const CartItem = await CartItemModel.Update(req.body.cart_qty, req.params.id)

            if (CartItem)
                res.status(200).json({ status: 'ok', Messages: Messages.updateSuccess, data: CartItem })
        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message });
        }
    }

    static async GetCartItem(req, res) {
        try {
            const CartItem = await CartItemModel.Get();

            res.status(200).json({ status: 'ok', data: CartItem })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, Messages: error.message })
        }
    }


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