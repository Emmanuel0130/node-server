
const express = require('express');
const listEditRouter = express.Router();

const tasks = [
  {
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

function validateTask(req, res, next) {
  const { id, isCompleted, description } = req.body;
  if (!id || typeof isCompleted !== 'boolean' || !description) {
    return res.status(400).json({ error: 'Solicitud no válida' });
  }
  next();
}

listEditRouter.post('/create', validateTask, (req, res) => {
  const { id, isCompleted, description } = req.body;
  const newTask = { id, isCompleted, description };
  tasks.push(newTask);
  res.json(newTask);
});

listEditRouter.put('/:id', validateTask, (req, res) => {
  const idToUpdate = req.params.id;
  const updatedTask = req.body;
  const taskIndex = tasks.findIndex(task => task.id === idToUpdate);
  if (taskIndex !== -1) {
    tasks[taskIndex] = updatedTask;
    res.json({ message: 'Task updated successfully' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});


module.exports = listEditRouter;
