import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import variableRoutes from './server/routes/VariableRoutes';
import templateRoutes from './server/routes/TemplateRoutes';

const cors = require('cors');
const path = require('path');

config.config();

// eslint-disable-next-line no-unused-vars
// const publicFolderPath = `${__dirname}/public`;
// const db = require('./db');


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(`${process.cwd()}/public`));
// app.use('/static', express.static('public'));
const port = process.env.PORT || 8000;
global.appRoot = path.resolve(__dirname);
global.port = port;

app.use('/public', express.static(path.join(__dirname, 'public')))

const withFakeUser = function (req, res, next) {
  req.user = req.user ? req.user : {
    id: -1,
    name: 'admin'
  };
  next();
};


app.use(withFakeUser);
app.use('/api/v1/variables', variableRoutes);
app.use('/api/v1/templates', templateRoutes);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to this API.',
}));

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
