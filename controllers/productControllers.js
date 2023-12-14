const FileUplood = require('../models/fileUploadModel');
const ProductModel = require('../models/productModel');
// const moment = require('moment');
const fs = require('fs');
const Messages = require('../config/messages');

class ProductController {

    static async CreateProdect(req, res) {
        try {
            const { pro_name, pro_description, pro_cost_price, pro_sellprice, pro_qty, pro_minstock, pro_status, users_id, unit_id, type_id } = req.body;
            const existsProname = await ProductModel.FindByPor_name(pro_name)

            const pro_id = await ProductModel.generateUniqueId();
            // const pro_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

            const files = req.files;
            const folder = 'products';

            if (existsProname) {
                files.map(file => {
                    file && fs.unlinkSync(file.path);
                })
                return res.status(400).json({ status: 'error', message: Messages.exists + existsProname.pro_name })

            }

            // บันทีกรูปภาพ หลายๆรูปภาพ
            const filePromises = files ? files.map((file, index) => FileUplood.uploadFile(file, `${pro_id}-${index + 1}`, folder)) : '';

            // ดึงรายชื่อแบบเต็มรูปแบบ เพื่อนำไป insert product image
            const fileUploadResults = await Promise.all(filePromises);
            const image_filename = fileUploadResults.map(result => result);

            // บันทึกข้อมูลรูปภาพ array 
            await ProductModel.ProductImages(image_filename, pro_id);


            const proData = {
                pro_id, pro_name, pro_description, pro_cost_price, pro_sellprice,
                pro_qty, pro_minstock, pro_status, users_id, unit_id, product_type_id: type_id
            };

            const product = await ProductModel.Create(proData);

            res.status(200).json({ status: 'ok', data: product });

        } catch (error) {
            res.status(500).send({ error: Messages.error500, message: error.message });
        }

    }

    static async UpdateProduct(req, res) {

        try {

            const { pro_id } = req.params;
            const { pro_name, pro_description, pro_cost_price, pro_sellprice, pro_qty, pro_minstock, pro_status, users_id, unit_id, type_id } = req.body;

            const updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const proData = { pro_name, pro_description, pro_cost_price, pro_sellprice, pro_qty, pro_minstock, pro_status, users_id, unit_id, product_type_id: type_id, updatedAt }

            const files = req.files;
            const folder = 'products';
            const exitProname = await ProductModel.FindByPor_name(pro_name)
            if (exitProname) {

                files.map(file => {
                    file && fs.unlinkSync(file.path);
                })

                return res.status(400).json({ status: 'error', message: Messages.exists + exitProname.pro_name })

            }


            const product = await ProductModel.Update(proData, pro_id)

            const max_image = parseInt(await ProductModel.maxImage(pro_id));

            // บันทีกรูปภาพ หลายๆรูปภาพ
            const filePromises = files ? files.map((file, index) => FileUplood.uploadFile(file, `${pro_id}-${max_image + index + 1}`, folder)) : '';
            // ดึงรายชื่อแบบเต็มรูปแบบ เพื่อนำไป insert product image

            const fileUploadResults = await Promise.all(filePromises);
            const image_filename = fileUploadResults.map(result => result);
            // บันทึกข้อมูลรูปภาพ array
            await ProductModel.ProductImages(image_filename, pro_id);

            if (product) {
                res.status(200).json({ status: 'ok', data: product });
            } else {

                res.status(404).json({ status: 'error', message: Messages.ID_not_found })
            }

        } catch (error) {
            res.status(500).send({ error: Messages.error500, message: error.message });
        }

    }

    static async DeleteProduct(req, res) {

        try {

            const { pro_id } = req.params;

            const product = await ProductModel.getProductById(pro_id);
            const imageArray = await ProductModel.getImageById(pro_id);
            if (product) {
                let dataunlink;
                for (const imageObj of imageArray) {
                    fs.unlink(imageObj.image_file, (err) => (err ? dataunlink = (Messages.DataUnlinkError, err) : dataunlink = (Messages.DataUnlinkSuccess)));
                }

                await ProductModel.delete(pro_id);
                res.status(200).json({ status: 'ok', message: Messages.deletesuccess, data: product, image: dataunlink })
            } else {
                res.status(404).json({ status: 'error', message: Messages.idNotFound })
            }
        } catch (error) {
            res.status(500).send({ error: Messages.error500, message: error.message });
        }

    }

    static async ProductAll(req, res) {

        try {
            const page = parseInt(req.params.page) || 1;
            const per_page = parseInt(req.params.per_page) || 10;
            const search = req.body.search || '';
            const productmodels = await ProductModel.ShowproductsAll(page, per_page, search);

            if (productmodels) {
                res.status(200).json({
                    page,
                    per_page,
                    data: productmodels,
                });
            }
        } catch (error) {
            res.status(500).send({ error: Messages.error500, message: error.message });
        }
    }

}


module.exports = ProductController;