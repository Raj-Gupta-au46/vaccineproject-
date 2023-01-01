const mongoose = require("mongoose");

const isEmpty = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

const isValidBody = function (object) {
    return Object.keys(object).length > 0;
}

const isValidName = function (name) {
    if (typeof name === "undefined" || name === null) return false;
    if (typeof name === "string" && name.trim().length === 0) return false;
    const nameRegex = /^[a-zA-Z ]+$/;
    return nameRegex.test(name);
}


const isValidPhone = function (num) {
    if (typeof num === "undefined" || num === null) return false;
    if (typeof num === "string" && num.trim().length === 0) return false;
    const reg = /^[0-9]{10}$/;
    return reg.test(num);
}


const isValidpincode = function (pincode) {

    const reg = /^[0-9]{6}$/;
    return reg.test(String(pincode));
};



const isValidAge = function isInteger(value) {
    if (value < 10) return false
    return true
}


const isvalidQuantity = function isInteger(value) {
    if (value < 1) return false
    if (isNaN(Number(value))) return false
    if (value > 0) return true
}


const isvalidSlot = function (slot) {
    return [10, 10.30, 11, 11.30, 12, 12.30, 1, 1.30, 2, 2.30, 3, 3.30, 4, 4.30].includes(slot);
};


const isVaildPass = function (str) {
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(str);
}

const isValidadhar = function (no) {
    const re = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/
    return re.test(String(no));
}





module.exports = { isVaildPass, isValidadhar, isEmpty, isValidName, isvalidSlot, isValidPhone, isValidBody, isValidpincode, isValidAge, isvalidQuantity }