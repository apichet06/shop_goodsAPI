const Messages = require("../config/messages");
const PaymentModel = require("../models/paymentModel");


class PaymentController {

    static async CreatePayment(req, res) {

        try {
            const { payment_price, users_id } = req.body

            const order_id = await PaymentModel.generateOrder()
            const payment_id = await PaymentModel.generatePayment()

            const Data = { order_id, payment_id, payment_price, users_id }

            const payment = await PaymentModel.Create(Data)
            if (payment)

                res.status(200).json({ status: "ok", message: Messages.insertSuccess, data: payment })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }

    }


}


module.exports = PaymentController;
