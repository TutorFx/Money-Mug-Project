const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controllers/auth')(app);
require('./controllers/project')(app);

app.listen(3001, () => {
    console.log("Server is running at port 3001");
});