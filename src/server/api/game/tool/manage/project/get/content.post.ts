import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('content manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    return resp(event, { result: game.content })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})