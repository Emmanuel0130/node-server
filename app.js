const readline = require('readline');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

const tasks = [];

let taskIdCounter = 1;

function addTask(description) {
  return new Promise((resolve, reject) => {
    const task = {
      id: taskIdCounter,
      description: description,
      completed: false
    };
    tasks.push(task);
    taskIdCounter++;
    resolve(task);
  });
}

function removeTask(id) {
  return new Promise((resolve, reject) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
    resolve();
  });
}

function completeTask(id) {
  return new Promise((resolve, reject) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
      task.completed = true;
    }
    resolve();
  });
}

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { description } = req.body;
  const newTask = await addTask(description);
  res.json(newTask);
});

app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await removeTask(id);
  res.json({ message: 'Task removed successfully' });
});

app.put('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await completeTask(id);
  res.json({ message: 'Task completed successfully' });
});

function promptAction() {
  rl.question('\nElige una acción (add/remove/complete/show/exit): ', action => {
    switch (action) {
      case 'add':
        rl.question('Descripción de la tarea: ', async description => {
          const newTask = await addTask(description);
          console.log('Tarea añadida:', newTask);
          promptAction();
        });
        break;
      case 'remove':
        rl.question('ID de la tarea que quieres eliminar?: ', async id => {
          await removeTask(parseInt(id));
          console.log('Tarea eliminada');
          promptAction();
        });
        break;
      case 'complete':
        rl.question('ID de la tarea que has completado?: ', async id => {
          await completeTask(parseInt(id));
          console.log('Tarea completada');
          promptAction();
        });
        break;
      case 'show':
        showTasks();
        promptAction();
        break;
      case 'exit':
        rl.close();
        break;
      default:
        console.log('Acción no válida. Inténtalo de nuevo.');
        promptAction();
        break;
    }
  });
}

function showTasks() {
  console.log('\nLista de tareas:');
  tasks.forEach(task => {
    console.log(`${task.id}: ${task.description} - ${task.completed ? 'Completada' : 'Pendiente'}`);
  });
}

console.log('Bienvenido a la lista de tareas!');
promptAction();

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

