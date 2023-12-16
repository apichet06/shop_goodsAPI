const db = require("../config/db");

class ImportProduct {

    static async Create(data) {
        try {
            const [result] = await db.query('INSERT INTO product_import SET ?', [data]);

            await db.query(
                'UPDATE products SET pro_qty = pro_qty + ?, pro_sellprice = ? WHERE id = ?',
                [data.pro_imp_qty, data.pro_imp_sellprice, data.products_id]
            );

            const response = result.insertId;
            const [insertedRecord] = await db.query('SELECT * FROM product_import WHERE id =  ? ', response);

            return insertedRecord;
        } catch (error) {
            console.error('Error in ProductImportModule Create:', error);
            throw error;
        }
    }


    static async Delete(id) {
        try {
            const [rows] = await db.query('SELECT * FROM product_import WHERE id = ?', [id]);

            if (rows.length > 0)
                await db.query('UPDATE products SET pro_qty = pro_qty - ? WHERE id = ?', [
                    rows[0].pro_imp_qty,
                    rows[0].products_id,
                ]);

            const [result] = await db.query('DELETE FROM product_import WHERE id = ? ', [id]);

            return result.affectedRows;
        } catch (error) {
            console.error('Error in ProductImportModule Delete:', error);
            throw error;
        }
    }

    static async GetAll(data) {
        try {
            data = data || '';

            const [result] = await db.query(
                `SELECT *, 
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('image_file', c.image_file, 'image_date', c.image_date)) 
                 FROM product_image c WHERE b.pro_id = c.pro_id) AS images
                FROM product_import a 
                INNER JOIN products b ON a.products_id = b.id 
                WHERE b.pro_name LIKE  ?`,
                [`%${data}%`]
            );

            return result;
        } catch (error) {
            console.error('Error in ProductImportModule GetAll:', error);
            throw error;
        }
    }

}

module.exports = ImportProduct;