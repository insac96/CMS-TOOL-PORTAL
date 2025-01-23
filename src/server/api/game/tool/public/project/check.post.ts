import type { IAuth, IDBGameToolUser, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { game : code, account } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!account) throw 'Vui lòng nhập tên tài khoản game'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GameToolUser.findOne({ game: game._id, user: auth._id, account: account }) as IDBGameToolUser
    let result = {
      recharge: false,
      mail: false
    }

    if(!!userGame){
      result.mail = userGame.mail
      result.recharge = userGame.recharge
    }
    
    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})