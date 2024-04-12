import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('New client connected');

    ws.on('message', function incoming(message) {
        const bufferData = Buffer.from(message);
        const jsonString = bufferData.toString('utf8');
        const jsonData = JSON.parse(jsonString);
        console.log('Received message:', JSON.stringify(jsonData));
        // Broadcast received message to all clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                // console.log('@SENDING>>>MSG', jsonString)
                client.send(jsonString);
            }
        });
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});
