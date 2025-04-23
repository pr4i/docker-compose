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

app.use(bodyParser.json());
app.use(cors());

// REST API для продуктов
app.use('/api/products', productsRoute);

// Добавляем GraphQL API
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

// Обслуживание статических файлов из папки public
app.use(express.static(path.join(__dirname, '../public')));

// Обработка корневого маршрута
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Настройка чата
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });
});

const PORT_ADMIN = process.env.PORT || 8080;
server.listen(PORT_ADMIN, () => {
    console.log(`Admin API is running on http://localhost:${PORT_ADMIN}`);
});