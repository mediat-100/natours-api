const mongoose = require('mongoose');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 3000;

console.log(process.env.NODE_ENV);

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connected successfully!...'))
  .catch((err) => console.log('DB connection failed!...', err));

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
