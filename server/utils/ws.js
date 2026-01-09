const WebSocket = require('ws');

// Создаём WebSocket-сервер без привязки к HTTP
const wss = new WebSocket.Server({ noServer: true });

// Хранилище активных соединений по пользователю
const clients = new Map();

wss.on('connection', (ws, request) => {
  // Извлекаем токен из URL или заголовков
  const token = request.url.split('?token=')[1];
  
  if (!token) {
    ws.close(1008, 'Токен отсутствует');
    return;
  }

  // Здесь можно проверить токен, но для краткости пропустим
  // В реальном приложении используйте jwt.verify()

  // const payload = jwt.verify(token, JWT_SECRET);

  const userId = 'dummy-id'; // Заглушка — в реальности из токена

  // Сохраняем соединение
  if (!clients.has(userId)) {
    clients.set(userId, []);
  }
  clients.get(userId).push(ws);

  console.log(`Пользователь ${userId} подключился`);

  ws.on('close', () => {
    const userClients = clients.get(userId);
    if (userClients) {
      const updated = userClients.filter(client => client !== ws);
      if (updated.length === 0) {
        clients.delete(userId);
      } else {
        clients.set(userId, updated);
      }
    }
    console.log(`Пользователь ${userId} отключился`);
  });
});

// Функция для отправки обновлений клиенту
const sendUpdate = (userId, data) => {
  const userClients = clients.get(userId);
  if (userClients) {
    userClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }
};

module.exports = { wss, sendUpdate };