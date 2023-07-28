import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkInOnSameDay = this.items.find((c) => {
      const checkInDate = dayjs(c.created_at)

      const isOnSameDay =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay)

      return c.user_id === userId && isOnSameDay
    })

    if (!checkInOnSameDay) return null

    return checkInOnSameDay
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((i) => i.user_id === userId).length
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.items.find((i) => i.id === id)

    if (!checkIn) return null

    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.items
      .filter((i) => i.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex((i) => i.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
  }
}
