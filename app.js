const express = require('express');
const listViewRouter = require('./list-view-router');
const listEditRouter = require('./list-edit-router');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 


const app = express();
const PORT = 3000;


const users = [
  { id: 1, username: 'emmanuel', password: 'papi1' },
  { id: 2, username: 'juan', password: 'david2' }
];


const tasks = [{
    task: 'dormir',
    description: '10 - 5:30'
  },
  {
    task: 'estudiar',
    description: 'viernes, sabado, domingo'
  },
  {
    task: 'salir',
    description: 'domingo'
  }
];

app.use(bodyParser.json());

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

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

app.use(express.json());
app.use(validateHTTPMethods); 

function validateHTTPMethods(req, res, next) {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (!validMethods.includes(req.method)) {
    return res.status(400).json({ error: 'Método HTTP no válido' });
  }
  next();
}

app.post('/tasks', authenticateToken, (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'La descripción es requerida' });
  }

  const newTask = {
    id: Date.now().toString(),
    description,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Actualizar una tarea
app.put('/tasks/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  task.description = req.body.description || task.description;
  task.completed = req.body.completed || task.completed;

  res.json(task);
});

// Eliminar una tarea
app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Listar todas las tareas
app.get('/tasks', authenticateToken, (req, res) => {
  res.json(tasks);
});

// Listar tareas completas e incompletas
app.get('/tasks/completed', authenticateToken, (req, res) => {
  const completedTasks = tasks.filter(task => task.completed);
  res.json(completedTasks);
});

app.get('/tasks/incomplete', authenticateToken, (req, res) => {
  const incompleteTasks = tasks.filter(task => !task.completed);
  res.json(incompleteTasks);
});

// Obtener una tarea por su ID
app.get('/tasks/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  res.json(task);
});


app.use('/list-view', listViewRouter);
app.use('/list-edit', listEditRouter);

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ruta protegida accedida con éxito' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

