import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function validate(req: FastifyRequest, res: FastifyReply) {
  const validateCheckInsParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInsParamsSchema.parse(req.params)

  const checkInUseCase = makeValidateCheckInUseCase()

  await checkInUseCase.execute({
    checkInId,
  })

  return res.status(204).send()
}
