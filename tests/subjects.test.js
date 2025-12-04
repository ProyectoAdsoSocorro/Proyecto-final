import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";

const api = request(app);

// ID de prueba que ya exista en tu BD
const EXISTING_ID = "6917ec45ac5ef097ac96abc8";
const EXISTING_GROUP = "6917ec45ac5ef097ac96abc5";

describe("Subject API Tests", () => {

    // ✔ GET /api/subjects
    test("Get all subjects", async () => {
        await api.get("/api/subjects/")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    // ✔ GET /api/subjects/:id
    test("Get subject by ID", async () => {
        const response = await api.get(`/api/subjects/${EXISTING_ID}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    // ✔ GET /api/subjects/type/:type
    test("Get subjects by type (materia)", async () => {
        const response = await api.get("/api/subjects/type/materia");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    // ✔ GET /api/subjects/area/:areaCode
    test("Get subjects by area", async () => {
        const response = await api.get("/api/subjects/area/AR-01");

        expect(response.status === 200 || response.status === 404).toBeTruthy();
    });

    // ✔ POST /api/subjects
    test("Create new subject", async () => {

        const subject = {
            group: EXISTING_GROUP,
            name: "Matemáticas Avanzadas",
            code: "MAT-999",
            type: "materia",
            areaCode: "AR-99",
            independent: false,
            includeInStatistics: true
        };

        const response = await api.post("/api/subjects/").send(subject);

        console.log("CREATE RESPONSE:", response.status, response.body);

        expect([200, 201, 400]).toContain(response.status);

        if (response.status === 400) {
            expect(response.body).toHaveProperty("errors");
        } else {
            expect(response.body).toHaveProperty("msg");
            expect(response.body).toHaveProperty("data");
        }
    });

    // ✔ PUT /api/subjects/:id
    test("Update subject", async () => {

        const updated = {
            group: EXISTING_GROUP,
            name: "Matemáticas Modificadas",
            code: "MAT-1000",
            type: "materia",
            areaCode: "AR-01"
        };

        const response = await api.put(`/api/subjects/${EXISTING_ID}`).send(updated);

        expect([200, 400]).toContain(response.status);
    });

    // ✔ PUT /api/subjects/:id/activate
    test("Activate subject", async () => {
        const response = await api.put(`/api/subjects/${EXISTING_ID}/activate`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("msg");
        expect(response.body).toHaveProperty("data");
    });

    // ✔ PUT /api/subjects/:id/desactivate
    test("Deactivate subject", async () => {
        const response = await api.put(`/api/subjects/${EXISTING_ID}/desactivate`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("msg");
        expect(response.body).toHaveProperty("data");
    });

    // ✔ DELETE /api/subjects/:id
    test("Delete subject", async () => {
        const response = await api.delete(`/api/subjects/${EXISTING_ID}`);

        expect([200, 404]).toContain(response.status);

        if (response.status === 200) {
            expect(response.body).toHaveProperty("msg");
        }
    });

});

// Cerrar conexión con MongoDB después de las pruebas
afterAll(async () => {
    await mongoose.connection.close();
});
