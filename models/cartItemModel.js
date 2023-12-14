const db = require("../config/db");

class CartItemModel {
    static async generateUniqueId(user_id) {
        try {
            const [result] = await db.query('SELECT MAX(cart_id) AS maxId FROM cart_items WHERE users_id = ?', [{ user_id }]);
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(3)) + 1;
                const nextId = `CRT${idNumber.toString().padStart(5, '0')}`;
                return nextId;
            } else {
                return 'CRT10001';
            }
        } catch (error) {
            throw error;
        }
    }

    static async Create(Data) {

        try {

            const [result] = await db.query('INSERT INTO cart_items SET ? ', [Data]);

            const response = result.insertId;

            const insertedRecord = await db.query('SELECT * FROM cart_items WHERE  id = ?', response);

            return insertedRecord;

        } catch (error) {
            throw error;
        }

    }

    static async Update(Data, id) {
        try {
            const [result] = await db.query('UPDATE cart_items SET cart_qty = cart_qty + ? WHERE id = ? ', [Data, id]);

            const [Cart] = await db.query('SELECT * FROM cart_items WHERE id = ? ', id);

            if (result.affectedRows > 0)
                return Cart;

        } catch (error) {
            throw error;
        }
    }

    static async Delete(id) {

        try {
            const [result] = await db.query('DELETE FROM cart_items WHERE  id = ?', [id])

            return result.affectedRows;
        } catch (error) {
            throw error;
        }

    }

}


module.exports = CartItemModel