# fl4
This project is a Node.js application that serves a product catalog with real-time chat functionality. It utilizes Express for the server, GraphQL for data querying, and Socket.IO for real-time communication.

## Project Structure
- **data/products.json**: Contains an array of product objects with properties such as `id`, `title`, `price`, `description`, and `category`.
- **public/index.html**: The main HTML document that includes the title, links to stylesheets, and scripts for fetching product data and handling chat functionality.
- **public/styles.css**: CSS styles for the application, specifically for the product cards.
- **server/admin.js**: Sets up the Express server, configures middleware, and defines routes for the REST API and GraphQL API. Initializes chat functionality.
- **server/chat.js**: Sets up Socket.IO for real-time chat functionality, handling user connections and chat messages.
- **server/graphql.js**: Defines a GraphQL schema and root query for fetching product data from the JSON file.
- **server/products.js**: Defines RESTful routes for managing products, including GET, POST, PUT, and DELETE operations.
- **Dockerfile**: Instructions for building a Docker image for the application, specifying the base image, working directory, file copying, dependency installation, and command to run the application.
- **docker-compose.yml**: Defines services, networks, and volumes for the application, specifying how to build the Docker image and run the application in a containerized environment.
- **package.json**: Configuration file for npm, listing dependencies and defining scripts for running the application.

## Setup Instructions
1. Ensure you have Docker and Docker Compose installed on your machine.
2. Clone the repository or download the project files.
3. Navigate to the project directory in your terminal.
4. Build and run the application using the following command:
   ```
   docker-compose up --build
   ```
5. Access the application in your web browser at `http://localhost:8080`.

## Usage
- The product catalog will be displayed on the main page.
- You can add, edit, or delete products via the REST API.
- Use the chat feature to communicate in real-time with other users.