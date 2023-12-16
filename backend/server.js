const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Add this line for handling file paths
const dotenv = require('dotenv')
dotenv.config();
const database_url = process.env.DATABASE_URL;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(database_url, { useNewUrlParser: true, useUnifiedTopology: true });

// Create Todo Schema and Model
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ text, completed: false });
  await todo.save();
  res.json(todo);
});

// Update Todo by ID
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true } // Return the modified document
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Todo by ID
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
