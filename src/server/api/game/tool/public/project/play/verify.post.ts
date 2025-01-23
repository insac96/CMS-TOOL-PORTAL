import jwt from 'jsonwebtoken'
import type { IAuth, IDBGameTool, IDBGameToolUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, token } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!token) throw 'Không tìm thấy mã ủy quyền'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('key api') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const decoded = jwt.verify(token, game.api.secret) as any
    const url = decoded.url
    const key = game.key

    return resp(event, { result: { url, key, code } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})