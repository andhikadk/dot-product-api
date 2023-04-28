import request from 'supertest';
import { app } from '../index.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

app.listen(5001, () => console.log('Server running on port 5001'));

describe('POST /api/register', () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'password',
    confPassword: 'password',
  };

  beforeAll(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    await User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should return 400 if name is missing', async () => {
    const res = await request(app).post('/api/register').send({
      email: user.email,
      password: user.password,
      confPassword: user.confPassword,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'All fields are required');
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/register').send({
      name: user.name,
      password: user.password,
      confPassword: user.confPassword,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'All fields are required');
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app).post('/api/register').send({
      name: user.name,
      email: user.email,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'All fields are required');
  });

  it('should return 400 if password and confPassword does not match', async () => {
    const res = await request(app).post('/api/register').send({
      name: user.name,
      email: user.email,
      password: user.password,
      confPassword: 'wrongpassword',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Password does not match');
  });

  it('should return 400 if email already exists', async () => {
    const res = await request(app).post('/api/register').send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Email already exists');
  });

  it('should return 201 if user is created', async () => {
    const res = await request(app).post('/api/register').send({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: 'password',
      confPassword: 'password',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
  });
});

describe('POST /api/login', () => {
  let user;
  let accessToken;
  let refreshToken;

  beforeAll(async () => {
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    user = new User({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: hashedPassword,
      role: 'user',
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should return 401 if user not found', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'notfound@example.com', password: 'password' });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'User not found');
  });

  it('should return 401 if password does not match', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'johndoe@example.com', password: 'wrongpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Password does not match');
  });

  it('should return access token and set refresh token as cookie', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'johndoe@example.com', password: 'password' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
    expect(res.headers['set-cookie']).toBeDefined();
    const cookies = res.headers['set-cookie'][0].split(';');
    cookies.forEach((cookie) => {
      if (cookie.startsWith('refreshToken')) {
        refreshToken = cookie.split('=')[1];
      }
    });
    expect(refreshToken).toBeDefined();
  });
});
