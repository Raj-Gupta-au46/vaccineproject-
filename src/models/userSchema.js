const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true,
            trim: true,
        },

        lname: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },
        aadharNo: {
            type: Number,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            trim: true,
        },
        pincode: {
            type: Number,
            required: true,

        }, status: {
            firstDose: {
                type: Boolean,
                default: false
            },
            secondDose: {
                type: Boolean,
                default: false
            }
        },
        center: {
            type: ObjectId,
            ref: "Center",
            trim: true,

        },
        registeredSlot: {
            
            registered: {
                type: Boolean,
                default: false
            },
            date: {
                type: Date
            },
            time: {
                type: Number
            }
        },


    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);


