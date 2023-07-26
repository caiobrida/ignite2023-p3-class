import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let usersRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create gym use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(usersRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'test',
      latitude: -22.4338089,
      longitude: -46.809481,
      description: null,
      phone: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
