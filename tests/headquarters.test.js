import request from 'supertest';
import app from '../app.js'

const api = request(app);

test('Get all headquarters', async() => {
    await api.get('/api/headquarters/')
    .expect(200)
    .expect('Content-Type', /application\/json/) 
})

/* test('Get headquarters by id', async() => {
    await api.get('/api/headquarters/:id')
    .expect(200)
    .expect()
}) */