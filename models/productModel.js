const db = require("../config/db");




class ProductModel {

    static async generateUniqueId() {
        try {
            const [result] = await db.query('SELECT MAX(pro_id) AS maxId FROM products');
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(1)) + 1;
                const nextId = `P${idNumber.toString().padStart(9, '0')}`;
                return nextId;
            } else {
                return 'PRO100000001';
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
            // console.log(insertResults); // Log the insertResults to check the data

            // Check for any errors during insertion
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



    static async ShowproductsAll(page, per_page, searchQ) {

        try {
            const offset = (page - 1) * per_page;
            let sql = `
            SELECT p.*, pt.type_name
            FROM products p
            INNER JOIN product_type pt ON p.product_type_id = pt.type_id
            LEFT JOIN users a ON p.users_id = a.u_id
            LEFT JOIN unit b ON p.unit_id = b.id   
            `;

            if (searchQ) {
                sql += `WHERE p.pro_name LIKE ? `;
            }

            sql += `ORDER BY p.pro_id DESC LIMIT ?, ?`;

            const queryParams = searchQ ? [`%${searchQ}%`, offset, per_page] : [offset, per_page];

            const [products] = await db.query(sql, queryParams);

            const productsWithImages = await Promise.all(products.map(async product => {
                const sql_images = ` SELECT image_file, image_date FROM product_image  WHERE pro_id = ? `;
                const [images] = await db.query(sql_images, [product.pro_id]);

                return {
                    pro_id: product.pro_id,
                    pro_name: product.pro_name,
                    pro_description: product.pro_description,
                    pro_cost_price: product.pro_cost_price,
                    pro_sellprice: product.pro_sellprice,
                    pro_qty: product.pro_qty,
                    pro_minstock: product.pro_minstock,
                    type_id: product.type_id,
                    pro_status: product.pro_status,
                    pro_status: product.pro_status,
                    images: images // Array of image_file  
                };
            }));

            return productsWithImages;
        } catch (error) {
            console.error('Error in ShowproductsAll:', error);
            throw error;
        }
    }


}

module.exports = ProductModel;