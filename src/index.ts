import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupAmqp } from './services/rabbitMQ.js';

const port = process.env.PORT || 5000;

export const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' },
});

export async function startApp() {
  app.get('/', (req, res) => {
    res.send('Hello!');
  });

  io.on('connection', (socket) => {
    console.log(`${socket.id} user connected`);

    socket.on('disconnect', () => {
      console.log(`${socket.id}  disconnected`);
    });
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log(msg);
      io.emit('chat message', msg);
    });
  });

  server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });

  await setupAmqp()
}

startApp();
