const db = require("../config/db");
class ProductModel {

    static async generateUniqueId() {
        try {
            const [result] = await db.query('SELECT MAX(pro_id) AS maxId FROM products');
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(3)) + 1;
                const nextId = `PRO${idNumber.toString().padStart(10, '0')}`;
                return nextId;
            } else {
                return 'PRO1000000001';
            }
        } catch (error) {
            throw error;
        }
    }


    static async maxImage(pro_id) {
        try {

            const [result] = await db.query('SELECT MAX(image_file) as image_file FROM product_image WHERE pro_id = ?', pro_id);
            // console.log(result[0].image_file);
            if (result[0].image_file) {
                const imageFilePath = await result[0].image_file;
                const imageNumber = await imageFilePath.match(/(\d+)\.jpg$/)[1];

                return imageNumber;
            } else {
                return 0;
            }

        } catch (error) {
            throw error;
        }
    }

    static async Create(ProData) {

        try {
            const [result] = await db.query(`INSERT INTO products  SET ?`, ProData);

            const insertproid = result.insertId;

            const [product] = await db.query('SELECT * FROM products WHERE id = ?', insertproid);
            return product;

        } catch (error) {
            throw error;
        }

    }

    static async ProductImages(path_file, pro_id) {

        try {
            const insertPromises = path_file.map(image_file => db.query(`INSERT INTO product_image (image_file, pro_id) VALUES (?, ?) `, [image_file, pro_id]));
            const insertResults = await Promise.all(insertPromises);

            insertResults.forEach(result => {
                if (result instanceof Error) {
                    throw result;
                }
            });

        } catch (error) {
            console.error('Error images:', error);
            throw error;
        }
    }

    static async Update(proData, pro_id) {
        try {
            const [result] = await db.query('UPDATE products SET ? WHERE pro_id = ?', [proData, pro_id]);
            const affectedRows = result.affectedRows;
            if (affectedRows > 0) {
                const [product] = await db.query('SELECT * FROM products WHERE pro_id = ?', pro_id);

                return product;
            } else {
                return null; // หรือจะส่งข้อความแสดงว่าไม่พบรายการที่จะอัปเดตก็ได้
            }
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }

    }

    static async getProductById(pro_id) {

        const [rows] = await db.query('SELECT * FROM products WHERE pro_id = ?', [pro_id]);
        // console.log(rows);
        return rows[0] || null;
    }

    static async getImageById(pro_id) {
        const rows = await db.query('SELECT * FROM product_image WHERE pro_id = ?', [pro_id]);
        return rows[0] || null;
    }

    static async delete(pro_id) {

        try {
            const [result] = await db.query("DELETE FROM products WHERE pro_id = ? ", [pro_id]);
            await db.query("DELETE FROM product_image WHERE pro_id = ? ", [pro_id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }



    static async GetProduct(pro_id) {
        try {

            const sql = `
              SELECT *,a.id as id, (Select JSON_ARRAYAGG(JSON_OBJECT('image_file',pi.image_file)) From product_image pi Where pi.pro_id = a.pro_id) as images FROM products a 
              Left join product_type b On a.product_type_id = b.id
              Left join unit c On a.unit_id = c.id
              WHERE a.pro_id = ?
             `;

            const [queryparams] = await db.query(sql, [pro_id])
            return queryparams[0]

        } catch (error) {
            throw error
        }
    }

    static async GetProductType(type_id) {
        try {

            const sql = `
              SELECT *,a.id as id ,(Select JSON_ARRAYAGG(JSON_OBJECT('image_file',pi.image_file)) From product_image pi Where pi.pro_id = a.pro_id) as images FROM products a 
              Left join product_type b On a.product_type_id = b.id
              Left join unit c On a.unit_id = c.id
              WHERE b.id = ?
              order by RAND() LIMIT 2
             `;

            const [queryparams] = await db.query(sql, [type_id])
            return queryparams

        } catch (error) {
            throw error
        }
    }


    static async ShowproductsAll(page, per_page, searchQ) {
        try {
            const offset = (page - 1) * per_page;

            let sql = `
                SELECT p.*, pt.*,
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('image_file', pi.image_file, 'image_date', pi.image_date))
                FROM product_image pi WHERE pi.pro_id = p.pro_id) AS images
                FROM products p
                LEFT JOIN product_type pt ON p.product_type_id = pt.id
                LEFT JOIN users a ON p.users_id = a.u_id
                LEFT JOIN unit b ON p.unit_id = b.id
            `;

            if (searchQ) {
                sql += `WHERE p.pro_name LIKE ? `;
            }

            sql += `ORDER BY p.pro_id DESC LIMIT ?, ?`;

            const queryParams = searchQ ? [`%${searchQ}%`, offset, per_page] : [offset, per_page];

            const [products] = await db.query(sql, queryParams);

            return products.map(product => ({
                pro_id: product.pro_id,
                pro_name: product.pro_name,
                pro_description: product.pro_description,
                pro_cost_price: product.pro_cost_price,
                pro_sellprice: product.pro_sellprice,
                pro_qty: product.pro_qty,
                pro_minstock: product.pro_minstock,
                type_id: product.type_id,
                type_name: product.type_name,
                pro_status: product.pro_status,
                images: product.images // Array of image_file  
            }));
        } catch (error) {
            // console.error('Error in ShowproductsAll:', error);
            throw error;
        }
    }



    static async FindByPor_name(name) {
        const [rows] = await db.query('SELECT pro_name FROM products WHERE pro_name = ?', [name]);
        // console.log(rows);
        return rows[0] || null;

    }


}

module.exports = ProductModel;