import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'

describe('Create gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthUser(app)

    const profileRes = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test',
        description: 'test',
        phone: '19999999999',
        latitude: -22.4338089,
        longitude: -46.809481,
      })

    expect(profileRes.statusCode).toEqual(201)
  })
})
