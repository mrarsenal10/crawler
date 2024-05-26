const amqp = require("amqplib/callback_api");
const cheerio = require("cheerio");
const HashedURLSet = require("./utils");
const ParsedHtmlRepository = require("./repository/parsedHtml.repository");

/**
 * Parses the HTML content and extracts the title and articles.
 *
 * @param {string} content - The HTML content to parse.
 * @returns {Object} An object containing the title and articles.
 */
function parseHtml(content) {
  const $ = cheerio.load(content);
  const title = $("h1.title-detail").text().trim();
  const articles = [];

  $("article > p.Normal").each((index, element) => {
    const article = $(element).text().trim();
    articles.push(article);
  });

  return { title, articles };
}

/**
 * Parses the content and extracts all the href links starting with "http",
 * adds them to a set to avoid duplicates, and sends them to a queue.
 *
 * @param {string} content - The content to parse.
 */
function parseUrl(content) {
  const $ = cheerio.load(content);

  $("a").each((index, element) => {
    const href = $(element).attr("href");

    if (href && href.startsWith("http") && !HashedURLSet.has(href)) {
      console.log(`Found href link: ${href}`);
      HashedURLSet.add(href);
      sendUrlToQueue(href);
    }
  });
}

/**
 * Sends a URL to the url_list queue.
 * @param {string} url - The URL to be sent to the queue.
 */
function sendUrlToQueue(url) {
  amqp.connect("amqp://localhost:5672", (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      channel.assertQueue("url_list", {
        durable: true,
      });

      channel.sendToQueue("url_list", Buffer.from(url), {
        persistent: true,
      });

      console.log(`Sent URL to url_list queue: ${url}`);

      setTimeout(() => {
        connection.close();
      }, 500);
    });
  });
}

/**
 * Consumes crawled content from a RabbitMQ queue and processes it.
 */
function consumeCrawledContent() {
  amqp.connect("amqp://localhost:5672", (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      const queue = "crawled_content";
      channel.assertQueue(queue, {
        durable: true,
      });

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          console.log(`Received content from crawled_content queue`);

          parseUrl(content);

          const data = parseHtml(content);

          if (data.title.trim().length > 0) {
            await new ParsedHtmlRepository().save(data);
          }

          channel.ack(msg); // Acknowledge message
        }
      });
    });
  });
}

// Start consuming messages from crawled_content queue
consumeCrawledContent();
