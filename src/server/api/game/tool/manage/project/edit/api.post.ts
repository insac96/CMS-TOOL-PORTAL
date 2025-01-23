import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : gameID, mail, recharge, secret, open } = body
    if(!gameID) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('name manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    logGameAdmin(event, 'tool', game._id, `Sửa API trò chơi`)
    await DB.GameTool.updateOne({ _id: game._id }, {
      api: { mail, recharge, secret },
      open: open
    })
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})