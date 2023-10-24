const WebSocket = require('ws');

const socket = new WebSocket('ws://176.236.217.218:3839');

socket.onopen = (event) => {
    console.log('Socket Bağlantısı oluşturuldu.');
    let authData = {
        "message": "kantarAtikMerkezi",
        "data": "30 KG"
    };
    socket.send(JSON.stringify(authData));
};

socket.onmessage = event => {

    let data = JSON.parse(event.data);
    console.log(event.data)

};

socket.onclose = () => {
    console.log('Socket Bağlantısı Kapatıldı');
};