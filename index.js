require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./ConnectDb");
// const connectDB2 = require("./ConnectDb");
const Question = require('./models/Questions')

const app = express();
const PORT =  8000;

app.use(cors());
app.use(express.json());

connectDB()


app.post("/post",async(req,res)=>{
    console.log(req.body);
    res.status(200).json({ message: "POST request received successfully" });
});



app.get('/api/questions', async (req, res) => {
    try {
      const questions = await Question.find();
      res.status(200).json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/createquestions', async (req, res) => {
    try {
      // Extract data from the request body
      const { question, category, answerOptions } = req.body;
  
      // Set isCorrect to true or false for each answer option
      const formattedAnswerOptions = answerOptions.map((option) => ({
        answer: option.answer,
        isCorrect: Boolean(option.isCorrect), // Convert to boolean
      }));
  
      // Create a new question instance using the Question model
      const newQuestion = new Question({
        question,
        category,
        answerOptions: formattedAnswerOptions,
      });
  
      // Save the new question to the database
      await newQuestion.save();
  
      res.status(201).json(newQuestion); // Respond with the created question
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




// GET request to fetch the data of a specific question by its ID
app.get('/api/getquestion/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




  

  app.put('/api/updatequestions/:id', async (req, res) => {
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.status(200).json(updatedQuestion);
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

 

  app.delete('/api/delquestions/:id', async (req, res) => {
    try {
      const questionId = req.params.id;
      // console.log('Received questionId:', questionId); // Add this line for debugging
      const deletedQuestion = await Question.findByIdAndDelete(questionId);
      if (!deletedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.get("/", (req, res) => {
    res.json("Hello mate!");
  })

app.listen(PORT, ()=> {
    console.log(`Server is running on Port: ${PORT}`);
  });

