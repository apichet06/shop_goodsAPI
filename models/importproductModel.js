const db = require("../config/db");

class ImportProduct {

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