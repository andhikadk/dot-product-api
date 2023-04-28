import request from 'supertest';
import { app } from '../index.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

app.listen(5002, () => console.log('Server running on port 5002'));

describe('POST /api/brands', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    const user = new User({
      name: 'Brand Test',
      email: 'brandtest@gmail.com',
      password: hashedPassword,
      role: 'user',
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should return 201 if brand is created', async () => {
    beforeAll(async () => {
      await request(app).post('/api/login').send({
        email: 'brandtest@gmail.com',
        password: 'password',
      });
    });
    const res = await request(app).post('/api/brands').send({
      name: 'Nike',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Brand created successfully');
  });
});
