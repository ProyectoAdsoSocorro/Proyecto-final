"use strict";
import request from 'supertest';

// Mock controllers and middlewares BEFORE importing app
jest.mock('../controllers/AcademicLoad.js', () => ({
    getLoadsByYear: (req, res) => res.status(200).json({ success: true, data: [] }),
    getLoadById: (req, res) => res.status(200).json({ success: true, data: { _id: req.params.id } }),
    getLoadsByProfessor: (req, res) => res.status(200).json([]),
    getLoadsByGroup: (req, res) => res.status(200).json({ success: true, data: [] }),
    createAcademicLoad: (req, res) => res.status(201).json({ success: true, data: Object.assign({ _id: 'mockedId123' }, req.body) }),
    updateAcademicLoad: (req, res) => res.status(200).json({ success: true, data: Object.assign({ _id: req.params.id }, req.body) }),
    activateAcademicLoad: (req, res) => res.status(200).json({ success: true, data: { _id: req.params.id } }),
    deactivateAcademicLoad: (req, res) => res.status(200).json({ success: true, data: { _id: req.params.id } }),
    deleteAcademicLoad: (req, res) => res.status(200).json({ success: true, data: { _id: req.params.id } })
}));

// Mock JWT middleware to bypass authentication in tests
jest.mock('../middlewares/Jwt.js', () => ({
    validateJWT: (req, res, next) => { req.user = { uid: 'testUser', role: 'secretaria' }; next(); },
    generateJWT: jest.fn().mockResolvedValue('mockedToken')
}));

// Mock authRole to always allow
jest.mock('../middlewares/authRole.js', () => ({
    __esModule: true,
    default: () => (req, res, next) => next()
}));

import app from '../app.js';

const api = request(app);

describe('AcademicLoad smoke tests (mocked)', () => {
    test('POST -> create, GET by id, PUT update, DELETE', async () => {
        const payload = {
            school: '64a000000000000000000001',
            professor: '64a000000000000000000002',
            subject: '64a000000000000000000003',
            group: '64a000000000000000000004',
            year: 2025,
            hoursIntensity: '4h',
            percentage: 40
        };

        // Create
        const createRes = await api.post('/api/AcademicLoad/')
            .send(payload)
            .set('Accept', 'application/json');

        expect([201,200]).toContain(createRes.status);
        const created = createRes.body.data || createRes.body;
        const id = created._id || 'mockedId123';

        // Get by id
        const getRes = await api.get(`/api/AcademicLoad/${id}`).set('Accept', 'application/json');
        expect([200,404]).toContain(getRes.status);

        // Update
        const updateRes = await api.put(`/api/AcademicLoad/${id}`).send({ percentage: 60 }).set('Accept', 'application/json');
        expect([200,404]).toContain(updateRes.status);

        // Delete
        const delRes = await api.delete(`/api/AcademicLoad/${id}`).set('Accept', 'application/json');
        expect([200,404]).toContain(delRes.status);
    });
});
