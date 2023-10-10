/* eslint-disable no-undef */
import express from 'express';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());

const users = [];

function upsert(array, item) {
  const i = array.findIndex((item) => item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });
  res.status(201);
  res.json({ name, email, picture });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`served at http://localhost:${port}`));
