const express = require('express');
const listViewRouter = require('./list-view-router');
const listEditRouter = require('./list-edit-router');

const app = express();
const PORT = 3000;

function validateHTTPMethods(req, res, next) {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (!validMethods.includes(req.method)) {
    return res.status(400).json({ error: 'Método HTTP no válido' });
  }
  next();
}

app.use(validateHTTPMethods); 

app.use('/list-view', listViewRouter);
app.use('/list-edit', listEditRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

