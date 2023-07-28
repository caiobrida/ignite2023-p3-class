import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await res.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return res.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(409).send({ message: err.message })
    }

    throw err
  }
}
