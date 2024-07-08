import { connect } from 'amqplib';

const AMQP_URL = 'amqp://admin:123456@ha-bus:5672'; 

export async function setupAmqp() {
const connection = await connect(AMQP_URL);
const channel = await connection.createChannel();
  // Создание очереди для получения сообщений от RabbitMQ
  const queue = 'new_chat_messages';
  const queueOptions = {
    durable: true,
    arguments: { 'x-queue-type': 'quorum' }
  };
  await channel.assertQueue(queue, queueOptions);

  // channel.consume(queue, (msg) => {
  //   if (msg !== null) {
  //     console.log('Received:', msg.content.toString());
  //     channel.ack(msg);
  //   } else {
  //     console.log('Consumer cancelled by server');
  //   }
  // });

  await channel.prefetch(1);
}