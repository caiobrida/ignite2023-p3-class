import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'title 1',
      latitude: -22.4338089,
      longitude: -46.809481,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: 'title 2',
      latitude: -22.4338089,
      longitude: -46.809481,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      query: '1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'title 1' })])
  })

  it('should be able to get paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `title ${i}`,
        latitude: -22.4338089,
        longitude: -46.809481,
        description: null,
        phone: null,
      })
    }

    const { gyms } = await sut.execute({
      query: 'title',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'title 21' }),
      expect.objectContaining({ title: 'title 22' }),
    ])
  })
})
