  import request from 'supertest';   
/* const supertest = require('supertest')
const app = require('../app.js')  */  
import app from '../app.js' 
/* Verificar que el rol de (Dirección de núcleo) existan. */

const api = request(app)
// console.log(Api)

test('school are return as json', async()=>{
 await api.get('/api/school/').expect(200).expect('Content-Type', /application\/json/)
})

