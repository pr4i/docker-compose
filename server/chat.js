const fs = require('fs');
const path = require('path');

// Путь к файлу для хранения сообщений
const messagesFilePath = path.join(__dirname, '../data/messages.json');

// Функция для загрузки сообщений из файла
const loadMessages = () => {
    if (fs.existsSync(messagesFilePath)) {
        const data = fs.readFileSync(messagesFilePath, 'utf8');
        try {
            return JSON.parse(data);
        } catch (err) {
            console.error('Error parsing messages JSON:', err);
            return [];
        }
    }
    return [];
};

// Функция для сохранения сообщений в файл
const saveMessages = (messages) => {
    try {
        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    } catch (err) {
        console.error('Error saving messages to file:', err);
    }
};

module.exports = function (io) {
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
            console.log('Received message:', msg);

            // Проверяем корректность данных
            if (!msg || !msg.role || !msg.message) {
                console.log('Invalid message data received:', msg);
                return;
            }

            const { role, message } = msg;
            const chatMessage = { role, message, timestamp: new Date().toISOString() };

            // Сохраняем сообщение
            messages.push(chatMessage);
            saveMessages(messages); // Сохраняем сообщения в файл

            // Отправляем сообщение всем пользователям
            io.emit('chatMessage', chatMessage);
        });
    });
};
