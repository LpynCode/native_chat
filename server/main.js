const WebSocket = require('ws');
const MessagesRepository = require('./repositories/messages.repository');
const { getPool } = require('./db/index');
const BaseHandler = require('./handlers/base-handler');

const wss = new WebSocket.Server({ port: 8080 }, () => console.log("SERVER STARTED ON PORT 8080"));

const messagesRepository = new MessagesRepository(getPool());
const handler = new BaseHandler(messagesRepository);

wss.on('connection', (ws) => {
    handler.addConnection(ws);
    ws.on('message', (data, isBinary) => {
        handler.handle({ data, ws, isBinary });
    });
})
