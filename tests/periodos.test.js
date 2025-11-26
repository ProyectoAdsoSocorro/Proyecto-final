import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

const api = request(app);

// Variables para compartir estado entre tests
let createdPeriodId;
const testSchoolId = new mongoose.Types.ObjectId(); // Random ID for testing

// 1. GET /api/periodos
test('GET /api/periodos should return 200 and json', async () => {
    await api
        .get('/api/periodos')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('GET /api/periodos should return an array', async () => {
    const response = await api.get('/api/periodos');
    expect(Array.isArray(response.body)).toBe(true);
});

// 2. POST /api/periodos
test('POST /api/periodos should create a new period', async () => {
    const newPeriod = {
        school: testSchoolId,
        year: 2024,
        cycle: 'normal',
        number: 1,
        name: 'Periodo 1',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        percentage: 25
    };

    const response = await api
        .post('/api/periodos')
        .send(newPeriod)
        .expect(201) // Created
        .expect('Content-Type', /application\/json/);

    createdPeriodId = response.body._id;
    expect(response.body.name).toBe(newPeriod.name);
});

test('POST /api/periodos should fail with invalid data', async () => {
    const invalidPeriod = {
        year: 'invalid', // Should be number
    };

    await api
        .post('/api/periodos')
        .send(invalidPeriod)
        .expect(400);
});

// 3. GET /api/periodos/:id
test('GET /api/periodos/:id should return the created period', async () => {
    if (!createdPeriodId) return;

    const response = await api
        .get(`/api/periodos/${createdPeriodId}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(response.body._id).toBe(createdPeriodId);
});

test('GET /api/periodos/:id should return 404 or 400 for invalid ID', async () => {
    const invalidId = '12345'; // Not a MongoID
    await api
        .get(`/api/periodos/${invalidId}`)
        .expect(400);
});

// 4. GET /api/periodos/year/:year
test('GET /api/periodos/year/:year should return periods for that year', async () => {
    await api
        .get('/api/periodos/year/2024')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('GET /api/periodos/year/:year should validate year is number', async () => {
    await api
        .get('/api/periodos/year/invalid')
        .expect(400);
});

// 5. PUT /api/periodos/:id
test('PUT /api/periodos/:id should update the period', async () => {
    if (!createdPeriodId) return;

    const updates = {
        name: 'Periodo 1 Updated'
    };

    const response = await api
        .put(`/api/periodos/${createdPeriodId}`)
        .send(updates)
        .expect(200);

    expect(response.body.name).toBe(updates.name);
});

test('PUT /api/periodos/:id should validate updates', async () => {
    if (!createdPeriodId) return;

    const invalidUpdates = {
        percentage: 150 // Max 100
    };

    await api
        .put(`/api/periodos/${createdPeriodId}`)
        .send(invalidUpdates)
        .expect(400);
});

// 6. PUT /api/periodos/:id/activate
test('PUT /api/periodos/:id/activate should activate the period', async () => {
    if (!createdPeriodId) return;

    await api
        .put(`/api/periodos/${createdPeriodId}/activate`)
        .expect(200);
});

test('PUT /api/periodos/:id/activate should validate ID', async () => {
    await api
        .put('/api/periodos/invalid/activate')
        .expect(400);
});

// 7. PUT /api/periodos/:id/deactivate
test('PUT /api/periodos/:id/deactivate should deactivate the period', async () => {
    if (!createdPeriodId) return;

    await api
        .put(`/api/periodos/${createdPeriodId}/deactivate`)
        .expect(200);
});

test('PUT /api/periodos/:id/deactivate should validate ID', async () => {
    await api
        .put('/api/periodos/invalid/deactivate')
        .expect(400);
});

// 8. DELETE /api/periodos/:id
test('DELETE /api/periodos/:id should delete the period', async () => {
    if (!createdPeriodId) return;

    await api
        .delete(`/api/periodos/${createdPeriodId}`)
        .expect(200);
});

test('DELETE /api/periodos/:id should validate ID', async () => {
    await api
        .delete('/api/periodos/invalid')
        .expect(400);
});

// Limpieza manual al final si es necesario, aunque jest maneja el cierre si no hay conexiones abiertas colgando.
// En el estilo simple, a veces no se pone afterAll explícito si no hay conexión global que cerrar manualmente en el test,
// pero como importamos mongoose y creamos IDs, es mejor cerrar la conexión para evitar warnings.
// Sin embargo, schools.test.js NO tiene afterAll. 
// Voy a mantener el afterAll para evitar el warning de "Jest did not exit one second after the test run has completed",
// pero lo pondré al final sin describe.

afterAll(async () => {
    await mongoose.connection.close();
});
