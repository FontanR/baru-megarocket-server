import request from 'supertest';
import app from '../app';
import Trainer from '../models/Trainer';
import seedTrainer from '../seeds/trainers';

const mockTrainer = {
  firstName: 'Dwight',
  lastName: 'Schrute',
  dni: '32532102',
  phone: '7697649050',
  email: 'dwightk@nifty.com',
  password: '3p8s8R3KdW',
  salary: '$85000.43',
  isActive: true,
};

beforeAll(async () => {
  await Trainer.collection.insertMany(seedTrainer);
}, 10000);

describe('GET /api/trainer', () => {
  test('should return status 200', async () => {
    const response = await request(app).get('/api/trainer').send();
    expect(response.status).toBe(200);
    expect(response.error).toBeFalsy();
  });

  test('should return status 404', async () => {
    const response = await request(app).get('/api/trainers').send();
    expect(response.status).toBe(404);
    expect(response.error).toBeTruthy();
  });

  test('Trainers lenght should be the same as the DB', async () => {
    const response = await request(app).get('/api/trainer').send();
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(seedTrainer.length);
  });
});

describe('POST /api/trainer', () => {
  test('create a trainer should return status 201', async () => {
    const response = await request(app).post('/api/trainer').send(mockTrainer);
    expect(response.status).toBe(201);
    expect(response.error).toBeFalsy();
  });

  test('should return status 404', async () => {
    const response = await request(app).post('/api/trainers').send(mockTrainer);
    expect(response.status).toBe(404);
    expect(response.error).toBeTruthy();
  });

  test('should have all the required fields', async () => {
    const response = await request(app).post('/api/trainer').send(mockTrainer);
    expect(response.body.data).toHaveProperty('firstName');
    expect(response.body.data).toHaveProperty('lastName');
    expect(response.body.data).toHaveProperty('dni');
    expect(response.body.data).toHaveProperty('email');
    expect(response.body.data).toHaveProperty('password');
  });

  test('fields length should be between its defined maximum and minimum chars length', async () => {
    const response = await request(app).post('/api/trainer').send(mockTrainer);

    expect(response.body.data.firstName.length).toBeGreaterThanOrEqual(3);
    expect(response.body.data.firstName.length).toBeLessThanOrEqual(20);

    expect(response.body.data.lastName.length).toBeGreaterThanOrEqual(3);
    expect(response.body.data.lastName.length).toBeLessThanOrEqual(20);

    expect(response.body.data.dni.length).toBeGreaterThanOrEqual(8);
    expect(response.body.data.dni.length).toBeLessThanOrEqual(10);

    expect(response.body.data.phone.length).toBeGreaterThanOrEqual(10);
    expect(response.body.data.phone.length).toBeLessThanOrEqual(12);

    expect(response.body.data.password.length).toBeGreaterThanOrEqual(8);
    expect(response.body.data.password.length).toBeLessThanOrEqual(20);
  });

  test('fields must have a valid format', async () => {
    const response = await request(app).post('/api/trainer').send(mockTrainer);

    expect(response.body.data.firstName).toMatch((/^[a-zA-Z\s]+$/));

    expect(response.body.data.lastName).toMatch((/^[a-zA-Z\s]+$/));

    expect(response.body.data.dni).toMatch((/^\d+$/));

    if (response.body.data.phone) {
      expect(response.body.data.phone).toMatch((/^\d+$/));
    }

    expect(response.body.data.email).toMatch(/^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/);

    expect(response.body.data.password).toMatch((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/));

    if (response.body.data.salary) {
      expect(response.body.data.salary).toMatch((/^\$[1-9]\d{0,6}(?:\.\d{1,2})?$/));
    }
  });
});

describe('PUT /api/trainer/:id', () => {
  test('update trainer should return status 200', async () => {
    const response = await request(app).put('/api/trainer/646f10810596acb1db833e25').send(mockTrainer);
    expect(response.status).toBe(200);
    expect(response.error).toBeFalsy();
  });

  test('should return status 404', async () => {
    const response = await request(app).put('/api/trainer/646f10810596acb1db833e28').send(mockTrainer);
    expect(response.status).toBe(404);
    expect(response.error).toBeTruthy();
  });

  test('should only change the sent attributes and follow the validation format', async () => {
    const response = await request(app).put('/api/trainer/646f10810596acb1db833e25').send({ dni: '42130241', salary: '$63000.43' });
    const {
      firstName, lastName, dni, phone, email, password, salary,
    } = response.body.data;

    if (firstName) {
      expect(firstName).toMatch((/^[a-zA-Z\s]+$/));
    }

    if (lastName) {
      expect(lastName).toMatch((/^[a-zA-Z\s]+$/));
    }

    if (dni) {
      expect(dni).toMatch((/^\d+$/));
    }

    if (phone) {
      expect(phone).toMatch((/^\d+$/));
    }

    if (email) {
      expect(email).toMatch(/^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/);
    }

    if (password) {
      expect(password).toMatch((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/));
    }

    if (salary) {
      expect(salary).toMatch((/^\$[1-9]\d{0,6}(?:\.\d{1,2})?$/));
    }
  });

  test('fields length should be between its defined maximum and minimum chars length', async () => {
    const response = await request(app).put('/api/trainer/646f10810596acb1db833e25').send({ firstName: 'Rolando' });

    if (response.body.data.firstName) {
      expect(response.body.data.firstName.length).toBeGreaterThanOrEqual(3);
      expect(response.body.data.firstName.length).toBeLessThanOrEqual(20);
    }

    if (response.body.data.lastName) {
      expect(response.body.data.lastName.length).toBeGreaterThanOrEqual(3);
      expect(response.body.data.lastName.length).toBeLessThanOrEqual(20);
    }

    if (response.body.data.dni) {
      expect(response.body.data.dni.length).toBeGreaterThanOrEqual(8);
      expect(response.body.data.dni.length).toBeLessThanOrEqual(10);
    }

    if (response.body.data.phone) {
      expect(response.body.data.phone.length).toBeGreaterThanOrEqual(10);
      expect(response.body.data.phone.length).toBeLessThanOrEqual(12);
    }

    if (response.body.data.password) {
      expect(response.body.data.password.length).toBeGreaterThanOrEqual(8);
      expect(response.body.data.password.length).toBeLessThanOrEqual(20);
    }
  });
});