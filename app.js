const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tasks = [];

function addTask(indicador, descripcion) {
  return new Promise((resolve, reject) => {
    tasks.push({ indicador, descripcion, completada: false });
    resolve();
  });
}

function removeTask(indicador) {
  return new Promise((resolve, reject) => {
    const index = tasks.findIndex(task => task.indicador === indicador);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
    resolve();
  });
}

function completeTask(indicador) {
  return new Promise((resolve, reject) => {
    const task = tasks.find(task => task.indicador === indicador);
    if (task) {
      task.completada = true;
    }
    resolve();
  });
}

function showTasks() {
  console.log('\nLista de tareas:');
  tasks.forEach(task => {
    console.log(`${task.indicador}: ${task.descripcion} - ${task.completada ? 'Completada' : 'Pendiente'}`);
  });
}

function promptAction() {
  rl.question('\nElige una acción (add/remove/complete/show/exit): ', async action => {
    switch (action) {
      case 'add':
        rl.question('Nombre de la tarea: ', async indicador => {
          rl.question('Descripción de la tarea: ', async descripcion => {
            await addTask(indicador, descripcion);
            promptAction();
          });
        });
        break;
      case 'remove':
        rl.question('Cual tarea quieres eliminar?: ', async indicador => {
          await removeTask(indicador);
          promptAction();
        });
        break;
      case 'complete':
        rl.question('Cual fue la tarea que realizaste?: ', async indicador => {
          await completeTask(indicador);
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

console.log('Bienvenido a la lista de tareas!');
promptAction();
