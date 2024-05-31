const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./bookRoutes');  // Upewnij się, że ścieżka do pliku z trasami jest poprawna
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Użyj tras dla książek
app.use('/api', bookRoutes);

// Serwuj pliki statyczne z katalogu frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Serwuj główny plik HTML dla wszystkich innych tras
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
