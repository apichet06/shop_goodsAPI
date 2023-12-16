const Messages = require("../config/messages");
const OrderModel = require("../models/ordersModdel");

class OrderController {

    static async OrderGet(req, res) {
        try {
            const order = await OrderModel.Get(req.params.order_id);

            if (order)
                res.status(200).json({ status: 'ok', data: order })
            else
                res.status(400).json({ status: 'error', message: Messages.error })

        } catch (error) {
            res.status(500).json({ error: Messages.error500, message: error.message });
        }
    }


}


module.exports = OrderController;