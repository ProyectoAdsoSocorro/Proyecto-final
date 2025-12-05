import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import User from '../models/users.js';
import { generarJWT } from '../middlewares/JWT.js';

const api = request(app);

// Variables para compartir estado entre tests
let createdPeriodId;
const testSchoolId = new mongoose.Types.ObjectId(); // Random ID for testing
let token;

beforeAll(async () => {
    // Crear un usuario de prueba con rol secretaria
    const user = new User({
        names: 'Test',
        lastNames: 'User',
        email: 'test@example.com',
        password: 'password123',
        roles: ['secretaria'],
        isActive: true
    });
    await user.save();

    token = await generarJWT(user._id);
});

afterAll(async () => {
    // Limpiar usuario de prueba
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.connection.close();
});

// 1. GET /api/periods
test('GET /api/periods should return 200 and json', async () => {
    await api
        .get('/api/periods')
        .set('x-token', token)
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('GET /api/periods should return an array', async () => {
    const response = await api
        .get('/api/periods')
        .set('x-token', token);
    expect(Array.isArray(response.body)).toBe(true);
});

// 2. POST /api/periods
test('POST /api/periods should create a new period with auto percentage', async () => {
    const newPeriod = {
        school: testSchoolId,
        year: 2024,
        cycle: 'normal',
        number: 1,
        name: 'Periodo 1',
        startDate: '2024-01-01',
        endDate: '2024-03-31'
        // percentage removed, should be auto 25
    };

    const response = await api
        .post('/api/periods')
        .set('x-token', token)
        .send(newPeriod)
        .expect(201) // Created
        .expect('Content-Type', /application\/json/);

    createdPeriodId = response.body._id;
    expect(response.body.name).toBe(newPeriod.name);
    expect(response.body.percentage).toBe(25);
});

test('POST /api/periods should calculate trimestral percentages correctly', async () => {
    // Trimestre 1 -> 33.33
    const p1 = await api.post('/api/periods')
        .set('x-token', token)
        .send({
            school: testSchoolId,
            year: 2025,
            cycle: 'trimestral',
            number: 1,
            name: 'T1',
            startDate: '2025-01-01',
            endDate: '2025-03-31'
        }).expect(201);
    expect(p1.body.percentage).toBe(33.33);

    // Trimestre 3 -> 33.34
    const p3 = await api.post('/api/periods')
        .set('x-token', token)
        .send({
            school: testSchoolId,
            year: 2025,
            cycle: 'trimestral',
            number: 3,
            name: 'T3',
            startDate: '2025-07-01',
            endDate: '2025-09-30'
        }).expect(201);
    expect(p3.body.percentage).toBe(33.34);
});

test('POST /api/periods should fail with invalid data', async () => {
    const invalidPeriod = {
        year: 'invalid', // Should be number
    };

    await api
        .post('/api/periods')
        .set('x-token', token)
        .send(invalidPeriod)
        .expect(400);
});

// 3. GET /api/periods/:id
test('GET /api/periods/:id should return the created period', async () => {
    if (!createdPeriodId) return;

    const response = await api
        .get(`/api/periods/${createdPeriodId}`)
        .set('x-token', token)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(response.body._id).toBe(createdPeriodId);
});

test('GET /api/periods/:id should return 404 or 400 for invalid ID', async () => {
    const invalidId = '12345'; // Not a MongoID
    await api
        .get(`/api/periods/${invalidId}`)
        .set('x-token', token)
        .expect(400);
});

// 4. GET /api/periods/year/:year
test('GET /api/periods/year/:year should return periods for that year', async () => {
    await api
        .get('/api/periods/year/2024')
        .set('x-token', token)
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('GET /api/periods/year/:year should validate year is number', async () => {
    await api
        .get('/api/periods/year/invalid')
        .set('x-token', token)
        .expect(400);
});

// 5. PUT /api/periods/:id
test('PUT /api/periods/:id should update the period', async () => {
    if (!createdPeriodId) return;

    const updates = {
        name: 'Periodo 1 Updated'
    };

    const response = await api
        .put(`/api/periods/${createdPeriodId}`)
        .set('x-token', token)
        .send(updates)
        .expect(200);

    expect(response.body.name).toBe(updates.name);
});

test('PUT /api/periods/:id should ignore manual percentage update', async () => {
    if (!createdPeriodId) return;

    const invalidUpdates = {
        percentage: 150 // Should be ignored
    };

    const response = await api
        .put(`/api/periods/${createdPeriodId}`)
        .set('x-token', token)
        .send(invalidUpdates)
        .expect(200);

    // Should remain 25 (from normal cycle)
    expect(response.body.percentage).toBe(25);
});

// 6. PUT /api/periods/:id/activate
test('PUT /api/periods/:id/activate should activate the period', async () => {
    if (!createdPeriodId) return;

    await api
        .put(`/api/periods/${createdPeriodId}/activate`)
        .set('x-token', token)
        .expect(200);
});

test('PUT /api/periods/:id/activate should validate ID', async () => {
    await api
        .put('/api/periods/invalid/activate')
        .set('x-token', token)
        .expect(400);
});

// 7. PUT /api/periods/:id/deactivate
test('PUT /api/periods/:id/deactivate should deactivate the period', async () => {
    if (!createdPeriodId) return;

    await api
        .put(`/api/periods/${createdPeriodId}/deactivate`)
        .set('x-token', token)
        .expect(200);
});

test('PUT /api/periods/:id/deactivate should validate ID', async () => {
    await api
        .put('/api/periods/invalid/deactivate')
        .set('x-token', token)
        .expect(400);
});

// 8. DELETE /api/periods/:id
test('DELETE /api/periods/:id should delete the period', async () => {
    if (!createdPeriodId) return;

    await api
        .delete(`/api/periods/${createdPeriodId}`)
        .set('x-token', token)
        .expect(200);
});

test('DELETE /api/periods/:id should validate ID', async () => {
    await api
        .delete('/api/periods/invalid')
        .set('x-token', token)
        .expect(400);
});
