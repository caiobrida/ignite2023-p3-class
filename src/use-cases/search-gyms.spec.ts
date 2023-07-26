import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('fetch nearby gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'title 1',
      latitude: -22.0147455,
      longitude: -46.7216294,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: 'title 2',
      latitude: -21.7212365,
      longitude: -46.7367238,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.0075042,
      userLongitude: -46.7230027,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'title 1' })])
  })
})
