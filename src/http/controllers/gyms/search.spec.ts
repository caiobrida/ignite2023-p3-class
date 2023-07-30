import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'

describe('Search gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test1',
        description: 'test',
        phone: '19999999999',
        latitude: -22.4338089,
        longitude: -46.809481,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test2',
        description: 'test',
        phone: '19999999999',
        latitude: -22.4338089,
        longitude: -46.809481,
      })

    const res = await request(app.server)
      .get('/gyms/search')
      .query({
        q: '1',
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
