const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('*', (_, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});
