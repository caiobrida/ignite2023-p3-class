import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

describe('Refresh (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh token', async () => {
    await request(app.server).post('/users').send({
      name: 'caio',
      email: 'test@test.com',
      password: '123456',
    })

    const res = await request(app.server).post('/sessions').send({
      email: 'test@test.com',
      password: '123456',
    })

    const cookies = res.get('Set-Cookie')

    const newRes = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(newRes.statusCode).toEqual(200)
    expect(newRes.body).toEqual({
      token: expect.any(String),
    })
    expect(newRes.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
