const express = require('express');
const mongoose = require('mongoose')
const app = express();
const route = require('./route/route');
const port = 3002;
mongoose.set("strictQuery", true);

app.use(express.json());

app.use((req, res, next) => {
    res.header('x-api-key1', "setedHeader");
    next();
  });

mongoose
  .connect(
    "mongodb+srv://nehajaiswal:neha123@nehadb.pcorgpc.mongodb.net/cnergee1",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("mongoDB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use('/', route);

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});