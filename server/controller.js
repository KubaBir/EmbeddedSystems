const log = require('./models/log');
const key = require('./models/key');
const auth = require('./models/auth');
const mail = require('./mail');

exports.auth = async function (username, password) {
    return await auth.authenticate(username, password);
};

exports.auth.update = async function (username, password, newPassword) {
    return await auth.update(username, password, newPassword);
};

exports.createLog = async function (tag_id, type) {
    if (type === 'alarm') mail.mail();
    return await log.create(tag_id, type);
};

exports.listLogs = async function () {
    return await log.list();
};

exports.testKey = async function (key_id) {
    // Check if the key is verified
    const keyData = await key.get(key_id);

    if (keyData && keyData.verified) return true;
    if (keyData) return false;

    await key.create(key_id);
    return false;
};

exports.listKeys = async function () {
    return await key.list();
};

exports.listAuthRequests = async function () {
    return await key.list.pending();
};

exports.authenticateKey = async function (key_id, owner_name) {
    await key.authenticate(key_id, owner_name);
};

exports.removeKey = async function (key_id) {
    await key.remove(key_id);
};
