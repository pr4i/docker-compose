const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

// Путь к файлу для хранения сообщений
const messagesFilePath = path.join(__dirname, '../data/messages.json');

// Функция для загрузки сообщений из файла
const loadMessages = () => {
    if (fs.existsSync(messagesFilePath)) {
        const data = fs.readFileSync(messagesFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

// Функция для сохранения сообщений в файл
const saveMessages = (messages) => {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
};

module.exports = function (server) {
    const io = socketIo(server);

    // Загружаем сообщения из файла
    const messages = loadMessages();

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Отправка всех сохранённых сообщений новому пользователю
        socket.emit('chatHistory', messages);

        // Присоединение к комнате
        socket.on('joinRoom', (role) => {
            socket.join(role);
            console.log(`${role} joined the chat`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        // Обработка нового сообщения
        socket.on('chatMessage', (msg) => {
            const { role, message } = msg;

            // Сохраняем сообщение
            const chatMessage = { role, message, timestamp: new Date().toISOString() };
            messages.push(chatMessage);
            saveMessages(messages); // Сохраняем сообщения в файл

            // Отправляем сообщение всем пользователям
            io.emit('chatMessage', chatMessage);
        });
    });
};