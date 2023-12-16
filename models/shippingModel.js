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
            const exisquery = await db.query('SELECT * FROM shipping WHERE  order_id = ? ', Data.order_Id);
            let result;
            let insrtId;
            if (exisquery.length > 0) {
                [result] = await db.query('UPDATE shipping SET ? WHERE order_id = ? ', [Data, Data.order_Id])
            } else {
                [result] = await db.query('INSERT INTO shipping SET ? ', [Data])
                insrtId = result.insrtId
            }


            const [shipping] = await db.query('SELECT * FROM shipping WHERE id = ? ', insrtId)

            return shipping;

        } catch (error) {
            throw error;
        }

    }

}

module.exports = ShippingModel;