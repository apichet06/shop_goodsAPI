const FileUplood = require('../models/fileUploadModel');
const ProductModel = require('../models/productModel');
// const moment = require('moment');
const fs = require('@cyclic.sh/s3fs')
const Messages = require('../config/messages');
const AWS = require('aws-sdk');

const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
class ProductController {



    static async CreateProdect(req, res) {
        try {

            // ตรวจสอบว่ามี environment variables ที่จำเป็นได้ถูกตั้งค่าหรือไม่
            if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
                console.error("AWS credentials or region not set.");
                process.exit(1); // จบโปรแกรมถ้าไม่มี credentials
            }

            // ตั้งค่า AWS SDK
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
            });

            const s3 = new AWS.S3()

            const { pro_name, pro_description, pro_cost_price, pro_sellprice, pro_qty, pro_minstock, pro_status, users_id, unit_id, type_id } = req.body;
            const existsProname = await ProductModel.FindByPor_name(pro_name)

            const pro_id = await ProductModel.generateUniqueId();
            const file = req.file;
            const folder = 'products';
            // Generate a unique key for the S3 object using UUID
            const key = `${folder}/${uuidv4()}_${file.originalname}`;

            // Upload file to S3
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: key,
                Body: file.buffer, // The file content as a Buffer
                ContentType: file.mimetype,
                ACL: 'public-read', // Set appropriate ACL based on your requirements
            };

            const uploadResult = await s3.upload(params).promise();


            const proData = {
                pro_id,
                pro_name,
                pro_description,
                pro_cost_price,
                pro_sellprice,
                pro_qty,
                pro_minstock,
                pro_status,
                users_id,
                unit_id,
                product_type_id: type_id,
                // Add the S3 URL to your data
                pro_image_url: uploadResult.Location,
            };

            const product = await ProductModel.Create(proData);

            res.status(200).json({ status: 'ok', data: { product, uploadedFileURLs } });

        } catch (error) {
            res.status(500).send({ error: Messages.error500, message: error.message });
        }
    }




    // static async CreateProdect(req, res) {
    //     try {
    //         const { pro_name, pro_description, pro_cost_price, pro_sellprice, pro_qty, pro_minstock, pro_status, users_id, unit_id, type_id } = req.body;
    //         const existsProname = await ProductModel.FindByPor_name(pro_name)

    //         const pro_id = await ProductModel.generateUniqueId();
    //         // const pro_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    //         const files = req.files;

    //         const folder = 'products';

    //         if (existsProname) {
    //             files.map(file => {
    //                 file && fs.unlinkSync(file.path);
    //             })
    //             return res.status(400).json({ status: 'error', message: Messages.exists + existsProname.pro_name })

    //         }

    //         // บันทีกรูปภาพ หลายๆรูปภาพ
    //         const filePromises = files ? files.map((file, index) => FileUplood.uploadFile(file, `${pro_id}-${index + 1}`, folder)) : '';

    //         // ดึงรายชื่อแบบเต็มรูปแบบ เพื่อนำไป insert product image
    //         const fileUploadResults = await Promise.all(filePromises);
    //         const image_filename = fileUploadResults.map(result => result);

    //         // บันทึกข้อมูลรูปภาพ array 
    //         await ProductModel.ProductImages(image_filename, pro_id);


    //         const proData = {
    //             pro_id, pro_name, pro_description, pro_cost_price, pro_sellprice,
    //             pro_qty, pro_minstock, pro_status, users_id, unit_id, product_type_id: type_id
    //         };

    //         const product = await ProductModel.Create(proData);

    //         res.status(200).json({ status: 'ok', data: product });

    //     } catch (error) {
    //         res.status(500).send({ error: Messages.error500, message: error.message });
    //     }

    // }

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