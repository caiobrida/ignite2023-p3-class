import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to register', async () => {
    const res = await request(app.server).post('/users').send({
      name: 'caio',
      email: 'test@test.com',
      password: '123456',
    })

    expect(res.statusCode).toEqual(201)
  })
})
