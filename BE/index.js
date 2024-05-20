const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/user.route.js');
const questionRoute = require('./routes/question.route.js');
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 



app.use('/user', userRoute);
app.use('/question', questionRoute);

app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
});
