const express = require('express');
const listViewRouter = express.Router();

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

// Middleware para validar parámetros de solicitud
function validateParams(req, res, next) {
  const validParams = ['completed', 'incomplete'];
  const param = req.params.param;
  if (!validParams.includes(param)) {
    return res.status(400).json({ error: 'Parámetro no válido' });
  }
  next();
}

listViewRouter.get('/:param', validateParams, (req, res) => {
  const param = req.params.param;
  if (param === 'completed') {
    const completedTasks = tasks.filter(task => task.isCompleted);
    res.json(completedTasks);
  } else if (param === 'incomplete') {
    const incompleteTasks = tasks.filter(task => !task.isCompleted);
    res.json(incompleteTasks);
  }
});

module.exports = listViewRouter;

