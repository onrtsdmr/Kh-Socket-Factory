// Atık Getirme Merkezi

const {SerialPort, ReadlineParser} = require('serialport')
const WebSocket = require('ws');
let lastWeight = 0;

let port = new SerialPort({
    path: 'COM5',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
});

const socket = new WebSocket('ws://45.141.149.116:3838');

socket.onopen = (event) => {
    console.log('Socket Bağlantısı oluşturuldu.');
    let authData = {
        "message": "kantarAtikMerkezi",
        "data": "30 KG"
    };
    socket.send(JSON.stringify(authData));
};

port.on('open', showPortOpen);

let parser = new ReadlineParser({delimiter: '\r\n'});

port.pipe(parser);
parser.on('data', readSerialData)

port.on('close', showPortClose);
port.on('error', showError);

function showPortOpen() {
    console.log(port.isOpen)
    console.log('port open. Data rate: ' + port.baudRate);
}

function readSerialData(data) {
    let trimData = data.split(" ");
    let weight;
    trimData.forEach(val => {
        if (!isNaN(val) && val > 0) {
            weight = val;
        }
    })
    if (lastWeight !== weight){
        lastWeight = weight;
        // socket.send olacak
        let weightData = {
            "message": "kantarAtikMerkezi",
            "data": weight + " KG"
        };
        socket.send(JSON.stringify(weightData));
        console.log(weight)
    }
}

function showPortClose() {
    console.log('port closed.');
}

function showError(error) {
    console.log('Serial port error: ' + error);
}

process.on('SIGINT', async () => {
    console.log('Ctrl+C algılandı, seri port kapatılıyor...');
    console.log(port.isOpen);
    await port.close();
    console.log(port.closing);

    if (!port.isOpen) {
        process.exit();
    }
});
