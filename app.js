const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { response } = require('express');
const express = require('express');
const http = require('http');
const { body, validationResult } = require('express-validator');

const app = express();
const server = http.createServer(app);
const port = 8000;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



var jalan = false;

const phoneNumberFormatter = function (number) {
    // 1. Menghilangkan karakter selain angka
    let formatted = number.replace(/\D/g, '');

    // 2. Menghilangkan angka 0 di depan (prefix)
    //    Kemudian diganti dengan 62
    if (formatted.startsWith('0')) {
        formatted = '62' + formatted.substr(1);
    }

    if (!formatted.endsWith('@c.us')) {
        formatted += '@c.us';
    }

    return formatted;
}

const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
        ],
    },
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    jalan = true;
});

const findGroupByName = async function (name) {
    const group = await client.getChats().then(chats => {
        return chats.find(chat =>
            chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
        );
    });
    return group;
}


client.initialize();

app.get('/', [], async (req, res) => {
    res.status(200).json({
        title: "WhatsApp API By Strongpapazola"
    })
})
app.get('/ready', [], async (req, res) => {
    res.status(200).json({
        ready: jalan
    })
})
app.post('/send-group-message', async (req, res) => {
    if (!jalan) {
        return res.status(500).json({
            status: jalan,
            msg: "Whatsapp Not Ready"
        })
    }
    if (!req.body.name && !req.body.message) {
        return res.status(400).json({
            status: jalan,
            msg: "name or message not exist"
        })
    }

    var name = req.body.name
    var message = req.body.message

    const group = await findGroupByName(name);
    if (!group) {
      return res.status(422).json({
        status: false,
        message: 'No group found with name: ' + name
      });
    }
    chatId = group.id._serialized;
    client.sendMessage(chatId, message).then(response => {
        return res.status(200).json({
            status: true,
            msg: response
        });
    }).catch(err => {
        return res.status(500).json({
            status: false,
            msg: err
        });
    });
})

app.post('/send-message', async (req, res) => {
    if (!jalan) {
        return res.status(500).json({
            status: jalan,
            msg: "Whatsapp Not Ready"
        })
    }
    if (!req.body.number && !req.body.message) {
        return res.status(400).json({
            status: jalan,
            msg: "number or message not exist"
        })
    }

    var number = req.body.number
    var message = req.body.message

    client.sendMessage(phoneNumberFormatter(number), message).then(response => {
        return res.status(200).json({
            status: true,
            msg: response
        });
    }).catch(err => {
        return res.status(500).json({
            status: false,
            msg: err
        });
    });
})



server.listen(port, function () {
    console.log('App running on *: ' + port);
});
