const CryptoJS = require('crypto-js');
const mongoose = require('mongoose');

const key = process.env.KEY;

function encryptValue(value, key) {
    return CryptoJS.AES.encrypt(value, key).toString();
}

function decryptValue(encryptedValue, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

const AdminSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
});
const Admin = mongoose.model('Admin', AdminSchema, 'admin');

exports.authenticate = async function (username, password) {
    const adminData = await Admin.findOne({ username: username });
    if (!adminData) return false;

    if (password === decryptValue(adminData.password, key)) return true;
    return false;
};
exports.get = async function (username) {
    const adminData = await Admin.findOne({ username: username });
    return adminData;
};

exports.update = async function (username, password, newPassword, email) {
    console.log(email);
    const adminData = await Admin.findOne({ username: username });
    if (!adminData) return false;

    if (password !== decryptValue(adminData.password, key)) return false;

    await Admin.findOneAndUpdate(
        { username: username },
        {
            password: encryptValue(newPassword, key),
            email: email,
        }
    );
    return true;
};
