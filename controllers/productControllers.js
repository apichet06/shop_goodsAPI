const FileUplood = require('../models/fileUploadModel');
const ProductModel = require('../models/productModel');

class ProductController {

    static async CreateProdect(req, res) {
        try {
            const { pro_name, pro_description, pro_cost_price, pro_sellprice, pro_qty, pro_minstock, pro_status, users_id, unit_id, type_id } = req.body;


            const pro_id = await ProductModel.generateUniqueId();
            // const currentDate = new Date();
            // const pro_date = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');

            const files = req.files;
            const folder = 'products';
            // บันทีกรูปภาพ หลายๆรูปภาพ
            const filePromises = files ? files.map((file, index) => FileUplood.uploadFile(file, `${pro_id}-${index + 1}`, folder)) : '';

            // ดึงรายชื่อแบบเต็มรูปแบบ เพื่อนำไป insert product image
            const fileUploadResults = await Promise.all(filePromises);
            const image_filename = fileUploadResults.map(result => result);

            // บันทึกข้อมูลรูปภาพ array 
            await ProductModel.ProductImages(image_filename, pro_id);

            const proData = { pro_id, pro_name, pro_description, pro_cost_price, pro_sellprice, pro_qty, pro_minstock, pro_status, users_id, unit_id, type_id };

            const product = await ProductModel.create(proData)


            res.status(200).json({ status: 'ok', data: product });

        } catch (error) {
            res.status(500).send({ error: error500 });
        }

    }

    static async UpdateProdect(req, res) {

    }

    static async DeleteProdect(req, res) {

    }

    static async ProductAll(req, res) {

        try {
            const page = parseInt(req.params.page) || 1;
            const per_page = parseInt(req.params.per_page) || 10;
            const search = req.body.search || '';

            const productmodels = await productModel.ShowproductsAll(page, per_page, search);

            if (productmodels) {
                res.status(200).json({
                    pagination: {
                        page,
                        per_page
                    },
                    data: productmodels,
                });
            }
        } catch (error) {
            res.status(500).send({ error: error500 });
        }
    }

}




module.exports = ProductController;