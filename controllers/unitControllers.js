const Messages = require("../config/messages");
const UnitModels = require("../models/unitModel");

class UnitController {

    static async CreateUnit(req, res) {
        try {
            const { unit_name } = req.body
            const unit = await UnitModels.Create(unit_name)

            if (unit)
                res.status(200).json({ status: "ok", message: Messages.insertSuccess, data: unit })
            else
                res.status(400).json({ status: Messages.error, Messages: Messages.exists + unit_name })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

    static async UpdateUnit(req, res) {

        try {

            const unit = await UnitModels.Update(req.body.unit_name, req.params.id)

            if (unit)
                res.status(200).json({ status: "ok", message: Messages.updateSuccess, data: unit })
            else
                res.status(400).json({ status: Messages.error, Messages: Messages.exists + req.body.unit_name })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }

    }

    static async GetUnit(req, res) {
        try {
            const unit = await UnitModels.Get()
            if (unit)
                res.status(200).json({ status: "ok", data: unit })

        } catch (error) {
            res.status(500).json({ status: Messages.error500, message: error.message });
        }
    }

}

module.exports = UnitController;