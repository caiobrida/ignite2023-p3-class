import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'caio',
    email: 'test@test.com',
    password: '123456',
  })

  const authRes = await request(app.server).post('/sessions').send({
    email: 'test@test.com',
    password: '123456',
  })

  const { token } = authRes.body

  return { token }
}
