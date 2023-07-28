import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'

describe('Nearby gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test1',
        description: 'test',
        phone: '19999999999',
        latitude: -22.0147455,
        longitude: -46.7216294,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test2',
        description: 'test',
        phone: '19999999999',
        latitude: -21.7212365,
        longitude: -46.7367238,
      })

    const res = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.0147455,
        longitude: -46.7216294,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(res.statusCode).toEqual(200)
    expect(res.body.gyms).toHaveLength(1)
    expect(res.body.gyms).toEqual([
      expect.objectContaining({
        title: 'test1',
      }),
    ])
  })
})
