const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost:5672", (err, connection) => {
  if (err) {
    throw err;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    /**
     * Array of queues used in the crawler.
     * @type {string[]}
     */
    const queues = ["url_list", "crawled_content"];

    queues.forEach((queue) => {
      channel.assertQueue(queue, {
        durable: true,
      });
      console.log(`Queue ${queue} created.`);
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
