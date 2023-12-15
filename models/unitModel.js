const db = require("../config/db");

class UnitModels {

    static async Create(unit_name) {
        try {
            const [existingUnit] = await db.query("SELECT * FROM unit WHERE unit_name = ?", unit_name);

            if (existingUnit.length > 0)
                return null;

            const [result] = await db.query("INSERT INTO unit SET ?", [{ unit_name }]);

            const [response] = await db.query("SELECT * FROM unit WHERE id = ?", [result.insertId]);

            return response;

        } catch (error) {
            throw error;
        }

    }

    static async Update(unit_name, id) {
        try {

            const [existingUnit] = await db.query("SELECT * FROM unit WHERE unit_name = ? AND id != ?", [unit_name, id]);

            if (existingUnit.length > 0)
                return null;

            const [result] = await db.query("UPDATE unit SET unit_name = ? WHERE id = ?", [unit_name, id]);

            if (result.affectedRows > 0) {

                const [response] = await db.query("SELECT * FROM unit WHERE id = ?", [id]);

                return response;

            }

            return null;
        } catch (error) {
            throw error;
        }
    }

    static async Get() {
        try {

            const [result] = await db.query("SELECT * FROM unit")
            return result

        } catch (error) {
            throw error;
        }
    }
}


module.exports = UnitModels;