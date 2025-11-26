import moongose from 'mongoose';
import request from 'supertest';
import app from '../app.js'

const api = request(app);

// Obtener todas las sedes
test('Get all headquarters', async() => {
    await api.get('/api/headquarters/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
});

// Obtener sede por ID
test('Get headquarters by id', async() => {
    const id = "6917ec45ac5ef097ac96abc8";
    const response = await api.get(`/api/headquarters/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
});

// Obtener sedes por ID de colegio
test('Get headquarters by school id', async() => {
    const schoolId = "6917ec45ac5ef097ac96abc5";

    const response = await api.get(`/api/headquarters/school/${schoolId}/headquarters`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
});

// Crear nueva sede
/* test('Create new headquarters', async() => {
    const sede = {
        school: "6917ec45ac5ef097ac96abc5",
        name: "Sede Central",
        abbreviation: "SC",
        code: "SC001",
        address: "Calle Principal 123",
        phone: "1234567890"
    };

    const response = await api.post('/api/headquarters/')
    .send(sede);
    
    console.log('Status:', response.status);
    console.log('Body:', response.body); 
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('msg', 'Sede creada con exito');
    expect(response.body).toHaveProperty('data');
}); */

// Actualizar sede


// Activar sede
test('Activate headquarters', async() => {
    const id = "6917ec45ac5ef097ac96abc8";

    const response = await api.put(`/api/headquarters/${id}/activate`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg', 'Sede activada');
    expect(response.body).toHaveProperty('data');
}); 

// Inactivar sede
test('Desactivate headquarters', async() => {
    const id = "6917ec45ac5ef097ac96abc8";

    const response = await api.put(`/api/headquarters/${id}/desactivate`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('msg', 'Sede inactiva');
    expect(response.body).toHaveProperty('data');
}); 