const db = require("../config/db");

class OrderModel {

    static async Get(order_id) {

        try {
            const [result] = await db.query(`SELECT *,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('pro_id',c.pro_id,'pro_name',c.pro_name,'qty',b.oitem_qty,'unit_price',b.oitem_unitprice,'o_date',b.oitem_date,'unit',d.unit_name))
             FROM order_items b
             INNER JOIN products c ON b.products_id = c.id
             INNER JOIN unit d ON b.unit_id = d.id
             WHERE a.id = b.order_id ) as order_items
             FROM orders a WHERE a.order_number like ?`, [`%${order_id}%`])
            return result

        } catch (error) {
            throw error;
        }

    }
}

module.exports = OrderModel