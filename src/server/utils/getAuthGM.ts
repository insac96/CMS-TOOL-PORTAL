import type { H3Event } from 'h3'
import type { IAuth, IDBGameTool } from "~~/types"

export default async (event : H3Event, auth : IAuth, game : IDBGameTool) : Promise<any> => {
  try {
    if(auth.type == 0) throw true
    if(auth.type == 100) return true

    const manager = game.manager
    if(!manager.includes(auth._id)) throw true
    return true
  }
  catch (e:any) {
    event.node.res.end(JSON.stringify({code: 403, message: e.toString()}))
  }
}