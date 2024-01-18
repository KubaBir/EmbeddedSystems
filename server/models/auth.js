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
});
const Admin = mongoose.model('Admin', AdminSchema, 'admin');

exports.authenticate = async function (username, password) {
    const adminData = await Admin.findOne({ username: username });
    if (!adminData) return false;

    if (password === decryptValue(adminData.password, key)) return true;
    return false;
};

exports.update = async function (username, password, newPassword) {
    const adminData = await Admin.findOne({ username: username });
    if (!adminData) return false;

    if (password !== decryptValue(adminData.password, key)) return false;

    await Admin.findOneAndUpdate(
        { username: username },
        {
            password: encryptValue(newPassword, key),
        }
    );
    return true;
};
