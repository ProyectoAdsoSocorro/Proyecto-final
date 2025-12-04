import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';

const api = request(app);

// 📌 ID reales para probar (ajústalos a los tuyos)
const testId = "6917ec45ac5ef097ac96abc3"; // 
const emailTest = "testcore@test.com";     // Para login

// -----------------------------
//   GET ALL
// -----------------------------
test('Get all core directions', async () => {
    await api.get('/api/core-direction/')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

// -----------------------------
//   GET POR ID
// -----------------------------
test('Get core direction by id', async () => {
    const response = await api.get(`/api/core-direction/${testId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
});

// -----------------------------
//   CREAR REGISTRO
// -----------------------------
/*
test('Create new core direction', async () => {

    const newDirection = {
        name: "Dirección Central",
        code: "DC001",
        address: "Calle 123",
        phone: "3120001122",
        email: emailTest,
        password: "123456",
        responsible: "Julian Perez"
    };

    const response = await api.post('/api/core-direction/')
        .send(newDirection);

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('msg');
    expect(response.body).toHaveProperty('data');
});
*/

// -----------------------------
//   ACTIVAR
// -----------------------------
test('Activate core direction', async () => {
    const response = await api.put(`/api/core-direction/${testId}/activate`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg');
    expect(response.body).toHaveProperty('data');
});

// -----------------------------
//   DESACTIVAR
// -----------------------------
test('Deactivate core direction', async () => {
    const response = await api.put(`/api/core-direction/${testId}/deactivate`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg');
    expect(response.body).toHaveProperty('data');
});

// -----------------------------
//   CAMBIAR CONTRASEÑA
// -----------------------------
test('Change password core direction', async () => {
    const response = await api.put(`/api/core-direction/${testId}/change-password`)
        .send({ password: "newpass123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg');
});

// -----------------------------
//   LOGIN (opcional si funciona)
// -----------------------------
/*
test('Core direction login', async () => {
    const response = await api.post('/api/core-direction/login')
        .send({
            email: emailTest,
            password: "123456"
        });

    console.log("LOGIN:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
});
*/

// -----------------------------
//   DELETE
// -----------------------------
/*
test('Delete core direction', async () => {
    const response = await api.delete(`/api/core-direction/${testId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg');
});
*/
