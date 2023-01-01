const userModel = require("../models/userSchema")
const validator = require("../validators/validations")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { isValidObjectId } = require("mongoose")
const centerModel = require("../models/vacineSchema")

const { isVaildPass, isValidadhar, isEmpty, isValidName, isvalidSlot, isValidPhone, isValidBody, isValidpincode, isValidAge, isvalidQuantity } = validator





const createUser = async function (req, res) {
    try {

        let data = req.body

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" });

        let { fname, lname, phone, password, aadharNo, age, pincode } = data

        if (!fname) return res.status(400).send({ status: false, message: "fname is requires" })
        if (!isValidName(fname.trim())) return res.status(400).send({ status: false, message: `${fname} is not a valide first name.` })


        if (!lname) return res.status(400).send({ status: false, message: "lname is requires" })
        if (!isValidName(lname.trim())) return res.status(400).send({ status: false, message: `${lname} is not a valide last name.` })

        if (!phone) return res.status(400).send({ status: false, message: "phone is required" })
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valide phone.` })
        const isPhoneAlreadyUsed = await userModel.findOne({ phone })
        if (isPhoneAlreadyUsed) { return res.status(409).send({ status: false, message: `${phone} is already in use, Please try a new phone number.` }) }


        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        if (!isVaildPass(password.trim())) return res.status(400).send({ status: false, message: "Please provide a valid Password with min 8 to 15 char with Capatial & special (@#$%^!) char " })
        const encryptedPassword = await bcrypt.hash(password, 10) //encrypting password by using bcrypt. // 10 => salt sound


        if (!age) return res.status(400).send({ status: false, message: "age is requires" })
        if (!isValidAge(age)) return res.status(400).send({ status: false, message: "not a valide age" })

        if (!aadharNo) return res.status(400).send({ status: false, message: "aadharNo is requires" })
        if (!isValidadhar(aadharNo)) return res.status(400).send({ status: false, message: "not a valide last aadharNo" })
        const findAadhar = await userModel.findOne({ aadharNo })
        if (findAadhar) { return res.status(409).send({ status: false, message: `aadharNo is already in use` }) }



        if (!pincode) return res.status(400).send({ status: false, message: "pincode is required" })
        if (!isValidpincode(pincode)) return res.status(400).send({ status: false, message: "Pinecode is not valide" })


        const userData = { fname, lname, phone, aadharNo, age, pincode, password: encryptedPassword, }
        const saveUserData = await userModel.create(userData);

        res.status(201).send({ status: true, message: "Success", data: saveUserData });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



const login = async function (req, res) {
    try {
        let data = req.body
        if (!isValidBody(data)) return res.status(400).send({ stataus: false, msg: "please provide data" })

        const { phone, password } = data

        if (!phone) return res.status(400).send({ status: false, message: "phone is required" })
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valide phone.` })
        const findUser = await userModel.findOne({ phone })
        if (!findUser) { return res.status(409).send({ status: false, message: "no regirstration found for this number plese registor first" }) }

        if (!password) return res.status(400).send({ stataus: false, msg: "please provide password" })


        const matchPassword = await bcrypt.compare(password, findUser.password)
        if (!matchPassword) {
            return res.status(400).send({ status: false, message: "plese provied currect password" })
        }
        const token = jwt.sign({ phone: phone }, "BackendDeveloperAssignmentKey", { expiresIn: "24h" })

        res.setHeader("x-api-key", token)

        return res.status(200).send({ status: true, message: "user log in successfully", data: { phone: phone, token: token } })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const registerSlot = async function (req, res) {

    try {
        const userId = req.params.userId

        data = req.body

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please provide valid User Id" })
        let userdata = await userModel.findById(userId)
        if (!userdata) return res.status(404).send({ status: false, message: "user not found" })
        if (userdata.registeredSlot.registered) return res.status(404).send({ status: false, message: `user allrady registored for slot ${userdata.registeredSlot}` })


        if (!isValidBody(data)) return res.status(400).send({ stataus: false, msg: "please provide data" })

        const { centerId, slot, date } = data

        if (!centerId) return res.status(400).send({ status: false, message: "centerId is required" })
        if (!isValidObjectId(centerId)) return res.status(400).send({ status: false, message: "Please provide valid centerId" })
        let centerData = await centerModel.findById(centerId)
        if (!centerData) return res.status(404).send({ status: false, message: "center not found" })

        if (!slot) return res.status(400).send({ status: false, message: "Slot is required" })
        if (!isvalidSlot(slot)) return res.status(400).send({ status: false, message: "Please provide valid slot" })

        const slotArr = centerData.avalableSlots
        for (let i = 0; i < slotArr.length; i++) {
            if (slotArr[i].slot == slot) {
                if (slotArr[i].avalableDose == 0) return res.status(400).send({ status: false, message: "Slot not avalable, plese take apoinment for other slot" })
                slotArr[i].avalableDose -= 1
            }
        }

        const registeredSlot = {
            registered: true,
            date: date,
            time: slot
        }

        const registor = await userModel.findByIdAndUpdate(userId, { $set: { registeredSlot: registeredSlot } }, { new: true }).select({ password: 0 })
        await centerModel.findByIdAndUpdate(centerId, { $set: { avalableSlots: slotArr } }, { new: true })


        return res.status(200).send({ status: true, message: `user Appinment booked successfully on ${date} at ${slot}`, data: registor })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


module.exports = { createUser, login, registerSlot }