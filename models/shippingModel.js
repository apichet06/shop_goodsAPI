const db = require("../config/db");

class ShippingModel {

    static async generateShippingKey() {
        try {
            const [result] = await db.query('SELECT MAX(shipping_key) AS maxId FROM shipping');
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(5)) + 1;
                const nextId = `SHIP-${idNumber.toString().padStart(10, '0')}`;
                return nextId;
            } else {
                return 'SHIP-1000000001';
            }
        } catch (error) {
            throw error;
        }
    }

    static async Create(Data) {
        try {

            // const [exisquery] = await db.query('SELECT * FROM shipping WHERE  order_id = ? ', Data.order_id);
            let exisquery = await this.exisData(Data.order_id)

            const exisqueryX = exisquery != null ? [exisquery].length : 0
            // console.log('====================================');
            // console.log(exisquery, exisqueryX);
            // console.log('====================================');

            let result;
            let insrtId;

            if (exisqueryX > 0) {

                [result] = await db.query('UPDATE shipping SET shipping_image =? ,status_id =? WHERE order_id = ? ', [Data.shipping_image, Data.status_id, Data.order_id])

            } else {

                [result] = await db.query('INSERT INTO shipping SET ? ', [Data])
                insrtId = result.insrtId

            }

            const [shipping] = await db.query('SELECT * FROM shipping WHERE order_id = ? ', Data.order_id)

            return shipping;

        } catch (error) {
            throw error;
        }

    }


    static async exisData(order_id) {
        try {
            const [exisquery] = await db.query('SELECT shipping_key FROM shipping WHERE  order_id = ? ', order_id);

            return exisquery[0] || null;

        } catch (error) {
            throw error;
        }
    }


}

module.exports = ShippingModel;