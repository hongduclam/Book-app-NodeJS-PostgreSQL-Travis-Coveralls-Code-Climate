import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import variableRoutes from './server/routes/VariableRoutes';
import templateRoutes from './server/routes/TemplateRoutes';

config.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const withFakeUser = function (req, res, next) {
  req.user = req.user ? req.user : {
    id: -1,
    name: 'admin'
  };
  next();
};

const port = process.env.PORT || 8000;

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
