.PHONY: setup_rabbitmq start_rabbitmq stop_rabbitmq setup send crawl parse

start:
	@echo "Starting RabbitMQ service..."
	docker-compose up -d

stop:
	@echo "Stopping RabbitMQ service..."
	docker-compose down

setup:
	@echo "Setting up RabbitMQ queues..."
	node ./src/setup_queues.js

send:
	@echo "Sending URLs to the queue..."
	node ./src/send_urls.js

crawl:
	@echo "Crawling URLs and sending content to the queue..."
	node ./src/crawl_urls.js

parse:
	@echo "Parsing content and sending parsed data to the queue..."
	node ./src/parse_content.js
