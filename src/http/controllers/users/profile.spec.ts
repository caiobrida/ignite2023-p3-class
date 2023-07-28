import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthUser(app)

    const profileRes = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileRes.statusCode).toEqual(200)
    expect(profileRes.body.user).toEqual(
      expect.objectContaining({
        email: 'test@test.com',
      }),
    )
  })
})
