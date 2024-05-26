const amqp = require("amqplib/callback_api");

/**
 * Sends a URL to a RabbitMQ queue for processing.
 * @param {string} url - The URL to be sent.
 */
function sendUrl(url) {
  amqp.connect("amqp://localhost:5672", (err, connection) => {
    if (err) {
      throw err;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      const queue = "url_list";

      channel.assertQueue(queue, {
        durable: true,
      });

      channel.sendToQueue(queue, Buffer.from(url), {
        persistent: true,
      });

      console.log(` [x] Sent ${url}`);

      setTimeout(() => {
        connection.close();
      }, 500);
    });
  });
}

if (require.main === module) {
  const urls = ["https://vnexpress.net"];
  urls.forEach(sendUrl);
}
