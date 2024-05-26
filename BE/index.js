const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/user.routes.js');
const questionRoute = require('./routes/question.routes.js');
const rankRoute = require('./routes/rank.routes.js');
const commentRoute = require('./routes/comment.routes.js');
const answerRoute = require('./routes/answer.routes.js');
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 


app.use('/user', userRoute);
app.use('/question', questionRoute);
app.use('/rank', rankRoute);
app.use('/comment', commentRoute);
app.use('/answer', answerRoute);

app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
});
