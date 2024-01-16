const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const LogSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    timestamp: { type: Date, required: true },
    key_id: { type: String, required: true },
    type: { type: String },
});
const Log = mongoose.model('Log', LogSchema, 'log');

exports.create = async function (key_id, type) {
    console.log('Creating log');
    const data = Log({
        id: uuidv4(),
        timestamp: new Date(),
        key_id: key_id,
        type: type,
    });

    const newLog = Log(data);
    await newLog.save();
    return data;
};

exports.list = async function () {
    return await Log.find();
};
