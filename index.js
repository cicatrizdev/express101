const express = require('express');

const server = express();

server.use(express.json())

const users = []

/**
 * GLOBAL MIDDLEWARE
 * Request log
 */
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}, URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

/**
 * LOCAL MIDDLEWARE
 * Required user name
 */
function checkUserExists(req, res, next) {
  !req.body.name ? res.status(400).json({ error: 'User name is required' }) : next() 
}

/**
 * LOCAL MIDDLEWARE
 * User exists
 */
function checkUserInArray(req, res, next) {
  const user = users[req.params.index]
  !user ? 
  res.status(400).json({ error: 'User does not exists' }) 
  : (
    req.user = user,
    next()
  )
}

/**
 * GET all (read)
 */
server.get('/users', (req, res) => {
  return res.json(users);
});

/**
 * GET one (read)
 */
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

/**
 * POST (create)
 */
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);
  
  return res.json(name);
});

/**
 * PUT (edit)
 */
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

/**
 * DELETE
 */
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);