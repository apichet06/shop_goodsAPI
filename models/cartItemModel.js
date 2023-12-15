const db = require("../config/db");

class CartItemModel {
    static async generateUniqueId(users_id) {
        try {
            const [result] = await db.query('SELECT MAX(cart_id) AS maxId FROM cart_items WHERE users_id = ? ', users_id);
            const currentMaxId = result[0].maxId;
            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(3)) + 1;
                const nextId = `CRT${idNumber.toString().padStart(4, '0')}`;
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

            const [rows] = await db.query('SELECT * FROM cart_items WHERE products_id = ? and users_id = ? ', [Data.products_id, Data.users_id]);

            let result;
            // let response;
            if (rows.length > 0) {
                [result] = await db.query('UPDATE cart_items SET cart_qty = cart_qty + ? WHERE products_id = ? and users_id = ? ', [Data.cart_qty, Data.products_id, Data.users_id]);
                // response = result.affectedRows
            } else {
                [result] = await db.query('INSERT INTO cart_items SET ? ', [Data]);
                // response = result.insertId;
            }

            const [insertedRecord] = await db.query('SELECT * FROM cart_items WHERE products_id = ? AND users_id = ?', [Data.products_id, Data.users_id]);

            return insertedRecord;


        } catch (error) {
            throw error;
        }

    }

    static async Update(cart_qty, id) {

        try {

            const [result] = await db.query('UPDATE cart_items SET cart_qty = ? WHERE id = ? ', [cart_qty, id]);

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

    static async Get() {
        try {
            const [result] = await db.query(` SELECT * ,(SELECT JSON_ARRAYAGG(JSON_OBJECT('image_file',c.image_file )) From product_image c Where b.pro_id = c.pro_id ) as Images From cart_items a 
            INNER JOIN products b ON a.products_id = b.id
            ORDER BY a.id asc `);

            return result

        } catch (error) {
            throw error
        }
    }

}


module.exports = CartItemModel