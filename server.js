import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

const clients = {};
const messages = [];
const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", (ws) => {
  const id = uuid();
  clients[id] = ws;

  console.log(`New client ${id}: `);

  ws.on('message', (rawMassage, isBinary) => {
    const receivedMessage = isBinary ? rawMassage : rawMassage.toString();
    const { name, message } = JSON.parse(receivedMessage);
    messages.push({ name, message });
    for (const id in clients) {
      clients[id].send(JSON.stringify([{name, message}]));
    }
  });

  ws.on('close', () => {
    delete clients[id];
    console.log(`Client is closed ${id}`);
  });
})