
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

listEditRouter.post('/create', (req, res) => {
  const { id, isCompleted, description } = req.body;
  const newTask = { id, isCompleted, description };
  tasks.push(newTask);
  res.json(newTask);
});

listEditRouter.delete('/:id', (req, res) => {
  const idToDelete = req.params.id;
  const taskIndex = tasks.findIndex(task => task.id === idToDelete);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

listEditRouter.put('/:id', (req, res) => {
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
