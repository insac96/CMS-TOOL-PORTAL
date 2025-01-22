import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id : gameID, manager } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!manager) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('name manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    await DB.GameTool.updateOne({ _id: game._id },{ manager: manager })

    logGameAdmin(event, 'tool', game._id, `Sửa quản trị viên trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})