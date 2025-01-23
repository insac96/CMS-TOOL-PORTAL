import type { IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { game: code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const servers = await DB.GameToolServerOpen.find({ game: game._id }).sort({ opentime: -1 })
    
    return resp(event, { result: servers })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})