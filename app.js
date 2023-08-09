const express = require('express');
const listViewRouter = require('./list-view-router');
const listEditRouter = require('./list-edit-router');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const app = express();
const PORT = 3000;


const users = [
  { id: 1, username: 'emmanuel', password: 'papi1' },
  { id: 2, username: 'juan', password: 'david2' }
];

app.use(express.json());
app.use(validateHTTPMethods); 

app.use('/list-view', listViewRouter);
app.use('/list-edit', listEditRouter);


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});


function validateHTTPMethods(req, res, next) {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (!validMethods.includes(req.method)) {
    return res.status(400).json({ error: 'Método HTTP no válido' });
  }
  next();
}

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.userId = decoded.userId;
    next();
  });
}

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ruta protegida accedida con éxito' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

