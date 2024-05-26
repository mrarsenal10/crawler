# Crawler Node.js Project

This project is a web crawler implemented in Node.js. It allows you to scrape data from websites.

## Getting Started

To get started with this project, follow the steps below:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/tonytran/crawler.git
   ```

2. Navigate to the project directory:

   ```bash
   cd crawler
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

## Running the Project

To run the project, you can use the provided Makefile. Here are the available commands:

- `make start`: Start the containers.
- `make stop`: Stop the containers.
- `make send`: Publish the URLs to the crawler service consume.
- `make crawler`: Start the crawler service.
- `make parse`: Start the parse service and save the parsed HTML to MongoDB.

To use these commands, open a terminal and navigate to the project directory. Then, run the desired command using the `make` command. For example, to start the project, run:
