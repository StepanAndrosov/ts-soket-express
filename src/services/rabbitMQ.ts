import { connect } from 'amqplib';

const AMQP_URL = 'amqp://admin:password@localhost:5672';

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

  channel.consume(queue, (msg) => {
    console.log('consume', msg)
    if (msg !== null) {
      console.log('Received:', msg.content.toString());
      channel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

  await channel.prefetch(1);

  const sendChannel = await connection.createChannel()
  await sendChannel.assertQueue(queue)

  const sendToQueue = (msg: string) => sendChannel.sendToQueue(queue, Buffer.from(msg))

  return {
    sendToQueue
  }
}