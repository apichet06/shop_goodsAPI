const db = require("../config/db");
const Messages = require("../config/messages");


class ProductTypeModel {

    static async GenerateUniqueId() {
        try {
            const [result] = await db.query('SELECT COALESCE(MAX(type_id), 1000) AS maxId FROM product_type');
            const currentMaxId = result[0].maxId;
            const currentNumber = parseInt(currentMaxId.slice(3)) || 1000; //slice(3) คือ TYP ส่วน 1000 คือ ค่าเริ่มต้น

            const idNumber = currentNumber + 1;
            const nextId = `TYP${idNumber.toString().padStart(4, '0')}`;
            return nextId;
        } catch (error) {
            throw error;
        }
    }



    static async Create(typeData) {
        try {

            const [result] = await db.query('INSERT INTO product_type SET ?', [typeData])
            const response = result.insertId;
            const [insertedRecord] = await db.query('SELECT * FROM product_type WHERE id =  ? ', response)

            return insertedRecord;
        } catch (error) {
            throw error;
        }
    }
    static async Update(typeData, type_id) {
        try {
            const [result] = await db.query('UPDATE  product_type  SET ? Where type_id = ? ', [typeData, type_id])
            if (result.effactedRow > 0) {
                const [response] = await db.query('SELECT * FORM product_type WHERE type_id = ? ', type_id)
                return response
            } else {
                throw new Error(Messages.updateFailed)
            }
        } catch (error) {
            throw error
        }
    }
    static async Delete(type_id) {
        try {
            const [result] = await db.query('DELETE FROM product_type WHERE type_id = ? ', [type_id])
            if (result.effactedRow > 0) {
                return result.affectedRows
            } else {
                throw new Error(Messages.deleteFailed);
            }

        } catch (error) {
            throw error
        }
    }

    static async GetAllProductType() {

        try {
            const [result] = await db.query('SELECT * FROM product_type')
            return result

        } catch (error) {
            throw error;
        }
    }

    static async FindByProductType(type_name) {
        try {

            const [result] = await db.query('SELECT type_name FROM product_type WHERE type_name = ?', [type_name])

            return result[0] || null;

        } catch (error) {
            throw error;
        }
    }

    static async FinbyUpdateType(type_name, type_id) {
        console.log(type_name, type_id);
        try {
            const [result] = await db.query('SELECT type_name FROM product_type WHERE type_name != ? and type_id = ? ', [type_name, type_id])

            return result[0] || null;

        } catch (error) {
            throw error;
        }
    }
}


module.exports = ProductTypeModel