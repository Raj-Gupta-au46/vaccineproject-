const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        centeName: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        pincode: {
            type: Number,
            required: true,

        },
        avalableSlots: [
            {
                _id: false,
                slot: {
                    type: Number,
                    required: true
                },
                avalableDose: {
                    type: Number,
                    default: 10
                }
            },
        ]


    },
    { timestamps: true }
);

module.exports = mongoose.model("Center", userSchema);