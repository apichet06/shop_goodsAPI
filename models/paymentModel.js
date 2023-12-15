const db = require("../config/db");

class PaymentModel {

    static async generateOrder() {
        try {
            const [result] = await db.query('SELECT MAX(order_id) AS maxId FROM orders');
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(6)) + 1;
                const nextId = `T-ORD-${idNumber.toString().padStart(10, '0')}`;
                return nextId;
            } else {
                return 'T-ORD-1000000001';
            }
        } catch (error) {
            throw error;
        }
    }



    static async generatePayment() {
        try {
            const [result] = await db.query('SELECT MAX(payment_id) AS maxId FROM payment');
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(4)) + 1;
                const nextId = `PYM-${idNumber.toString().padStart(10, '0')}`;
                return nextId;
            } else {
                return 'PYM-1000000001';
            }
        } catch (error) {
            throw error;
        }
    }




    static async Create(Data) {
        try {
            const [Cart_items] = await db.query(`
            SELECT *, b.id as products_id FROM cart_items a 
            INNER JOIN products b ON a.products_id = b.id 
            WHERE a.users_id = ?`,
                [Data.users_id]
            );

            const [resultOrder] = await db.query("INSERT INTO orders SET ?, total_price = ?", [Data, Data.payment_price]);

            const insertid = resultOrder.insertId;

            console.log(Cart_items);

            await Promise.all(
                Cart_items.map(order => db.query(
                    `INSERT INTO order_items SET oitem_qty = ?, oitem_unitprice = ?, products_id = ?, order_id = ?`,
                    [order.cart_qty, order.pro_sellprice, order.products_id, insertid]
                ))
            );

            // const [result] = await db.query("INSERT INTO payment SET ?", [Data]);

            // const response = await db.query("SELECT * FROM payment WHERE id = ?", [result.insertId]);

            // return response;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = PaymentModel;