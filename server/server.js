require('dotenv').config();
const express = require('express');
const mongo = require('./mongo');
const controller = require('./controller');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
app.use(bodyParser.json());
app.use(cors());

app.post(
    '/log',
    use(async (req, res) => {
        const data = req.body;
        if (!data.tag) return res.status(400).send("'tag' field is required");

        await controller.createLog(data.tag);
        res.status(201).send();
    })
);

app.get(
    '/log/list',
    use(async (req, res) => {
        const logs = await controller.listLogs();
        res.status(200).send({ logs: logs });
    })
);

app.post(
    '/key',
    use(async (req, res) => {
        const data = req.body;
        if (!data.key) return res.status(400).send("'key' field is required");

        const isVerified = await controller.testKey(data.key);
        await controller.createLog(data.tag);

        res.status(201).send({ isVerified: isVerified });
    })
);

app.get(
    '/key',
    use(async (req, res) => {
        const keys = await controller.listKeys();
        res.status(201).send({ keys: keys });
    })
);

app.get(
    '/key/pending',
    use(async (req, res) => {
        const pending = await controller.listAuthRequests();
        res.status(201).send({ pending: pending });
    })
);

app.post(
    '/key/authenticate',
    use(async (req, res) => {
        const data = req.body;
        if (!data.key) return res.status(400).send("'key' field is required");

        await controller.authenticateKey(data.key, data.owner_name);
        res.status(200).send();
    })
);

app.delete(
    '/key/remove',
    use(async (req, res) => {
        const data = req.body;
        if (!data.key) return res.status(404).send("'key' field is required");

        await controller.removeKey(data.key);
        res.status(200).send();
    })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
    await mongo.connect();
    console.log(`Server listening at port ${PORT}`);
});
