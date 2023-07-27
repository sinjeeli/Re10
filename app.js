const express = require('express');
const bcrypt = require('bcrypt');
const { User, Course } = require('./models');
const app = express();
const router = express.Router();


// Middleware to parse JSON
app.use(express.json());

const auth = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  // Replace `auth(req)` with your function to parse the header
  const credentials = parseAuthHeader(req);  

  if (credentials) {
    const user = await User.findOne({ where: { emailAddress: credentials.name } });
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.emailAddress}`);
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};

// User routes
router.get('/api/users', auth, async (req, res) => {
  const currentUser = req.currentUser;
  res.status(200).json(currentUser);
});

router.post('/api/users', async (req, res) => {
  const newUser = req.body;
  newUser.password = bcrypt.hashSync(newUser.password, 10);

  await User.create(newUser);
  res.status(201).location('/').end();
});

// Courses routes
router.get('/api/courses', async (req, res) => {
  const courses = await Course.findAll({ include: [{ model: User }] });
  res.status(200).json(courses);
});

router.get('/api/courses/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id, { include: [{ model: User }] });
  res.status(200).json(course);
});

// Use the router
app.use(router);

// Add error handlers, etc.
function parseAuthHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') {
    return null;
  }
  const credentials = Buffer.from(parts[1], 'base64').toString().split(':');
  return { name: credentials[0], pass: credentials[1] };
}


// Start the server
app.listen(5000, () => console.log('Server is running on port 5000'));

