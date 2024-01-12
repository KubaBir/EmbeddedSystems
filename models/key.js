const mongoose = require('mongoose');

const KeySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    verified: { type: Boolean, required: true },
    owner_name: { type: String },
});
const Key = mongoose.model('Key', KeySchema, 'key');

exports.create = async function (id) {
    console.log('Adding tag verification request');
    const data = Key({
        id: id,
        verified: false,
        owner_name: null,
    });

    const newKey = Key(data);
    await newKey.save();
    return data;
};

exports.get = async function (key_id) {
    const key = await Key.findOne({ id: key_id });
    return key;
};

exports.list = async function () {
    return await Key.find();
};

exports.list.pending = async function () {
    return await Key.find({ verified: false });
};

exports.authenticate = async function (key_id, owner_name) {
    await Key.findOneAndUpdate({ id: key_id }, { verified: true, owner_name: owner_name });
};
