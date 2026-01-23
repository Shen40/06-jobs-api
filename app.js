require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//conectDB 
const connectDB = require("./db/connect")

const authenticateUser = require("./middleware/authentication")
//routers
const authRouter = require("./routes/auth")
const runsRouter = require("./routes/runs")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages
app.use(express.json());

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/runs', authenticateUser, runsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
