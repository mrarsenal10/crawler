const amqp = require("amqplib/callback_api");
const axios = require("axios");

const INTERVAL = 1000; // Interval in milliseconds (10 seconds)

/**
 * Crawls the specified URL and sends the fetched content to a queue.
 * @param {string} url - The URL to crawl.
 */
function crawlUrl(url) {
  axios
    .get(url)
    .then((response) => {
      const content = response.data;
      sendContentToQueue(content);
    })
    .catch((error) => {
      console.error(`Failed to fetch URL: ${url}`);
      console.error(error);
    });
}

function sendContentToQueue(content) {
  amqp.connect("amqp://localhost:5672", (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      channel.assertQueue("crawled_content", {
        durable: true,
      });

      channel.sendToQueue("crawled_content", Buffer.from(content), {
        persistent: true,
      });

      console.log(`Sent crawled content to crawled_content queue`);
      setTimeout(() => {
        connection.close();
      }, 500);
    });
  });
}

/**
 * Consumes URLs from the "url_list" queue and crawls them.
 * This function connects to the AMQP server, creates a channel, and consumes URLs from the queue.
 * For each URL received, it calls the `crawlUrl` function and acknowledges the message.
 * After consuming a URL, it schedules the next consumption after a specified interval.
 */
function consumeUrlList() {
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

      channel.get(queue, {}, (err, msg) => {
        if (err) {
          throw err;
        }

        if (msg !== false) {
          const url = msg.content.toString();
          console.log(`Received URL from url_list queue: ${url}`);
          crawlUrl(url);
          // Acknowledge message
          channel.ack(msg);
        }

        // Schedule next consumption after interval
        setTimeout(() => {
          consumeUrlList();
        }, INTERVAL);
      });
    });
  });
}

// Start consuming URLs from the queue
consumeUrlList();
