const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync } = require('../redis/index')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  let todo
  try{
      todo = await Todo.create({
        text: req.body.text,
        done: false
      })
  }
  catch(error){
      return res.status(400).send({'error':error.message})
  }
  const todosCount = await getAsync('added_todos')
  await setAsync('added_todos', Number(todosCount)+1)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  const todosCount = await getAsync('added_todos')
  await setAsync('added_todos', Number(todosCount)-1) 
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todos = await req.todo
  res.send(todos);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  req.todo.text = await req.body.text
  req.todo.done = await req.body.done
  try{
      await req.todo.save()  
  }
  catch(error){
      return res.status(400).send(error.message)
  }
  res.status(200).send('Note changed successfully');
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
