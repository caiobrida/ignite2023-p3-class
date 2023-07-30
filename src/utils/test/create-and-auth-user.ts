import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthUser(app: FastifyInstance, isAdmin = false) {
  await prisma.user.create({
    data: {
      name: 'caio',
      email: 'test@test.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authRes = await request(app.server).post('/sessions').send({
    email: 'test@test.com',
    password: '123456',
  })

  const { token } = authRes.body

  return { token }
}
