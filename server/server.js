const express = require('express');
const app = express();

const firebaseAdmin = require('firebase-admin');
firebaseAdmin.initializeApp({
  projectId: 'app-attest',
});

// Verify Token
const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    res.status(401);
    return next(new Error('Unauthorized'));
  }

  try {
    await firebaseAdmin.appCheck().verifyToken(appCheckToken);
    return next();
  } catch (err) {
    res.status(401);
    return next(new Error(err.message));
  }
};

// Routes
app.get('/', (req, res) => {
  console.log('I am called');
  res.send('API is up and running...');
});

app.get('/authenticate', [appCheckVerification], (req, res) => {
  console.log('USER AUTHENTICATED');
  res.send('Authenticated Successfully');
});

// Not found
app.use((req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({ message: err.message });
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running in development mode on port ${PORT}.`)
);
