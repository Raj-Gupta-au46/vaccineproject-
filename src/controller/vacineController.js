const { model } = require("mongoose");
const { type } = require("os");
const centerModel = require("../models/vacineSchema")
const validator = require("../validators/validations")


const { isVaildPass, isValidadhar, isEmpty, isValidName, isvalidSlot, isValidPhone, isValidBody, isValidpincode, isValidAge, isvalidQuantity } = validator

const createCenter = async function (req, res) {
    try {

        let data = req.body

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" });

        let { centeName, address, phone, pincode } = data

        if (!centeName) return res.status(400).send({ status: false, message: "CenteName is requires" })
        if (!typeof centeName == "string") return res.status(400).send({ status: false, message: `CenteName is not a valide ` })


        if (!address) return res.status(400).send({ status: false, message: "lname is requires" })
        if (typeof address != "string") return res.status(400).send({ status: false, message: `${lname} is not a valide last name.` })

        if (!phone) return res.status(400).send({ status: false, message: "phone is required" })
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valide phone.` })
        const isPhoneAlreadyUsed = await centerModel.findOne({ phone })
        if (isPhoneAlreadyUsed) { return res.status(409).send({ status: false, message: `${phone} is already in use, Please try a new phone number.` }) }


        if (!pincode) return res.status(400).send({ status: false, message: "pincode is required" })
        if (!isValidpincode(pincode)) return res.status(400).send({ status: false, message: "Pinecode is not valide" })

        const avalableSlots = [{ slot: 10 }, { slot: 10.30 }, { slot: 11 }, { slot: 11.30 }, { slot: 12 }, { slot: 12.30 },
        { slot: 1 }, { slot: 1.30 }, { slot: 2 }, { slot: 2.30 }, { slot: 3 }, { slot: 3.30 }, { slot: 4 }, { slot: 4.30 }]

        data.avalableSlots = avalableSlots

        const saveUserData = await centerModel.create(data);

        res.status(201).send({ status: true, message: "Success", data: saveUserData });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}




const getCenter = async function (req, res) {

    try {
        const { pincode, ...other } = req.query

        if(isValidBody(other))return res.status(400).send({ status: false, message: "plese provide valid qury params" })

        const obj = {}

        if (pincode) {
            if (!isValidpincode(pincode)) return res.status(400).send({ status: false, message: "Pinecode is not valide" })
            obj.pincode = pincode
        }

        const findCenter = await centerModel.find(obj)

        if(findCenter.length == 0) return res.status(400).send({ status: false, message: "Center not found for this pincode" })

        res.status(201).send({ status: true, message: "Success", data: findCenter });


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}



module.exports = { createCenter, getCenter }