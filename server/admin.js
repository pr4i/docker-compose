const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const productsRoute = require('./products');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql');
const setupChat = require('./chat');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});

const PORT_ADMIN = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

// REST API для продуктов
app.use('/api/products', productsRoute);

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

// Статические файлы (index.html и др.)
app.use(express.static(path.join(__dirname, '../public')));

// Корневой маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Инициализация WebSocket-чата
setupChat(io);

server.listen(PORT_ADMIN, () => {
    console.log(`Admin API is running on http://localhost:${PORT_ADMIN}`);
});
