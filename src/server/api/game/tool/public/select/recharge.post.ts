import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { key, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const match : any = { game: game._id }
    if(!!key){
      match['$or'] = [
        { recharge_id: { $regex : key, $options : 'i' }},
        { recharge_name: { $regex : key, $options : 'i' }},
      ]
    }

    const list = await DB.GameToolRecharge
    .find(match)
    .select('recharge_id recharge_name')
    .limit(20)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})