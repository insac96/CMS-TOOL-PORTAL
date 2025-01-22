import type { H3Event } from 'h3'
import type { Types } from 'mongoose'

export default async (event: H3Event, type: string, game: Types.ObjectId, content: string, admin?: Types.ObjectId) => {
  await DB.GameToolLogAdmin.create({
    game: game,
    user: admin ? admin : event.context.auth._id,
    content: content
  })
}