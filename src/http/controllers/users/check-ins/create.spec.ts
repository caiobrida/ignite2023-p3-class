import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'
import { prisma } from '@/lib/prisma'

describe('Create check in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check in', async () => {
    const { token } = await createAndAuthUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'test 1',
        latitude: -21.7212365,
        longitude: -46.7367238,
      },
    })

    const profileRes = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -21.7212365,
        longitude: -46.7367238,
      })

    expect(profileRes.statusCode).toEqual(201)
  })
})
