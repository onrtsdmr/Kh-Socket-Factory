// Sıfır Atık Bahçesi
const {SerialPort, ReadlineParser} = require('serialport')
const WebSocket = require("ws");

let lastWeight = 0;

/*/ check Ports
SerialPort.list().then(res => {
    console.log(res);
});
/*/

// 176.236.217.218
const socket = new WebSocket('ws://176.236.217.218:3839');

socket.onopen = (event) => {
    console.log('Socket Bağlantısı oluşturuldu.');
    let authData = {
        "message": "kantarBahce",
        "data": "connect"
    };
    socket.send(JSON.stringify(authData));
};


let port = new SerialPort({
    path: 'COM6',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
});

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
    let newData = data.replace(/[^0-9.]/g, "");
    let kilogram = parseFloat(newData);
    if (lastWeight !== kilogram) {
        lastWeight = kilogram; // Sıfır Atık Bahçesi
        let weightData = {
            "message": "kantarBahce",
            "data": kilogram
        };
        console.log(weightData)
        socket.send(JSON.stringify(weightData));
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