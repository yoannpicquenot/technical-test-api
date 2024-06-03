const Express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = Express();

const adminEmail = 'admin@monpetitplacement.fr';
const adminPassword = 'mpp#password2024!';
const mppSecret = 'verysecretsecret';

const database = {
  users: [{
    id: 1,
    firstName: "Thomas",
    lastName: "Perret",
    position: "CEO",
  }, {
    id: 2,
    firstName: "Thibault",
    lastName: "Jaillon",
    position: "CTO",
  }, {
    id: 3,
    firstName: "Valentine",
    lastName: "Demaison",
    position: "COO",
  }],
};

app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.status(200).send();
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if ((email ?? '') !== adminEmail || (password ?? '') !== adminPassword) {
    return res.status(400).send({
      'error': 'incorrect_credentials',
      'message': 'Email or password is not correct. Check them twice',
    });
  }

  const accessToken = jwt.sign({
    email: adminEmail,
  }, mppSecret, {
    expiresIn: '5 minutes',
  });

  const refreshToken = jwt.sign({
    assignedToken: accessToken,
  }, mppSecret, {
    expiresIn: '15 minutes',
  });

  return res.status(200).send({
    accessToken,
    refreshToken,
  });
});

app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  try {
    jwt.verify(refreshToken, mppSecret);
  } catch (exception) {
    if (exception instanceof jwt.TokenExpiredError) {
      return res.status(401).send({
        'error': 'expired_token',
        'message': 'Token is expired',
      });
    }
  }

  const data = jwt.decode(refreshToken);

  if (!data.assignedToken) {
    return res.status(400).send({
      'error': 'incorrect_token',
      'message': 'Token is incorrect',
    });
  }

  const newToken = jwt.sign({
    email: adminEmail,
    password: adminPassword,
  }, mppSecret, {
    expiresIn: '5 minutes',
  });

  const newRefreshToken = jwt.sign({
    assignedToken: refreshToken,
  }, mppSecret, {
    expiresIn: '15 minutes',
  });

  return res.status(200).send({
    accessToken: newToken,
    refreshToken: newRefreshToken,
  });
});

app.use((req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      'error': 'no_token',
      'message': 'User must provide a token',
    });
  }

  try {
    const data = jwt.verify(token, mppSecret, { complete: true });

    if (data.payload?.email !== adminEmail) {
      throw new jwt.JsonWebTokenError;
    }
  } catch (exception) {
    if (exception instanceof jwt.TokenExpiredError) {
      return res.status(401).send({
        'error': 'expired_token',
        'message': 'Token is expired',
      });
    }

    if (exception instanceof jwt.JsonWebTokenError) {
      return res.status(400).send({
        'error': 'incorrect_token',
        'message': 'Token is incorrect',
      });
    }
  }

  return next();
});

app.get('/users', (req, res) => {
  return res.status(200).send(database.users);
});

app.post('/users', (req, res) => {
  const { firstName, lastName, position, } = req.body;

  if (!firstName || !lastName || !position) {
    return res.status(400).send({
      'error': 'invalid_data',
      'message': 'Data are not correct',
    });
  }

  const id = generateRandomId();
  database.users.push({
    id,
    firstName,
    lastName,
    position,
  });

  return res.status(200).send(database.users);
});

app.patch('/users/:id', (req, res) => {
  const { firstName, lastName, position, } = req.body;
  const id = req.params.id;
  const index = database.users.findIndex(
    (user) => id === user.id.toString(),
  );

  if (index === -1) {
    return res.status(404).send({
      'error': 'user_not_found',
      'message': 'User not found',
    });
  }

  if (firstName) {
    database.users[index].firstName = firstName;
  }

  if (lastName) {
    database.users[index].lastName = lastName;
  }

  if (position) {
    database.users[index].position = position;
  }

  return res.status(200).send(database.users[index]);
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  const index = database.users.findIndex(
    (user) => user.id.toString() === id,
  );

  if (index === -1) {
    return res.status(404).send({
      'error': 'user_not_found',
      'message': 'User not found',
    });
  }

  database.users.splice(index, 1);

  return res.status(200).send();
});

app.listen(
  8080,
  () => {
    console.debug('App started listening on port 8080');
  },
);


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateRandomId() {
  const idList = database.users.map((e) => e.id);
  let nextId = getRandomInt(100000000);

  while (idList.indexOf(nextId) !== -1) {
    nextId = getRandomInt(100000000);
  }
  return nextId;
}