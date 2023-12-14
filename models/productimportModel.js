const db = require("../config/db");

class ProductImportModule {


    static async Create(Data) {

        try {

            const [result] = await db.query('INSERT INTO product_import SET ?', [Data])

            await db.query('UPDATE products SET pro_qty = pro_qty + ?, pro_sellprice = ? WHERE id = ?', [Data.pro_imp_qty, Data.pro_imp_sellprice, Data.products_id]);

            const response = result.insertId;
            const [insertedRecord] = await db.query('SELECT * FROM product_import WHERE id =  ? ', response)

            return insertedRecord;
        } catch (error) {
            throw error;
        }
    }


    static async Delete(id) {
        try {

            const [rows] = await db.query('SELECT * FROM product_import WHERE id = ?', [id]);

            await db.query('UPDATE products SET pro_qty = pro_qty - ? WHERE id = ?', [rows[0].pro_imp_qty, rows[0].products_id]);


            const [result] = await db.query('DELETE FROM product_import WHERE id = ? ', [id]);

            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    static async GetAll(Data) {
        try {
            Data = Data || '';

            const [result] = await db.query(
                `SELECT *, 
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('image_file', c.image_file, 'image_date', c.image_date)) 
                 FROM product_image c WHERE b.pro_id = c.pro_id) AS images
                FROM product_import a 
                INNER JOIN products b ON a.products_id = b.id 
                WHERE b.pro_name LIKE  ?`, [`%${Data}%`]);

            return result;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ProductImportModule