import type { IAuth, IDBGameTool, IDBGameToolItem, IDBGameToolServerOpen, IDBGameToolUser } from "~~/types"
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, account, server_id, item, amount } = body
    
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!account) throw 'Vui lòng chọn tài khoản game'
    if(!server_id) throw 'Vui lòng chọn máy chủ'
    if(!item) throw 'Vui lòng chọn vật phẩm để gửi'
    if(!item.id) throw 'Vật phẩm gửi không hợp lệ'
    
    // Check Game
    const game = await DB.GameTool.findOne({ code: code, display: true }).select('api') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.api.mail || !game.api.secret) throw 'Tính năng gửi thư đang bảo trì'

    // Check Server
    const server = await DB.GameToolServerOpen.findOne({ game: game._id, server_id: server_id }).select('server_id') as IDBGameToolServerOpen
    if(!server) throw 'Máy chủ không tồn tại'

    // Check Item
    const itemSelect = await DB.GameToolItem.findOne({ game: game._id, item_id: item.id }).select('item_id') as IDBGameToolItem
    if(!itemSelect) throw 'Vật phẩm không hỗ trợ'

    // Check User Game
    const userGameTool = await DB.GameToolUser.findOne({ game: game._id, user: auth._id, account: account, server_id: server.server_id }) as IDBGameToolUser
    if(!userGameTool) throw 'Bạn chưa mua bất cứ tool nào cho tài khoản game này'
    if(!userGameTool.mail) throw 'Vui lòng mua tool gửi thư cho tài khoản game này tại máy chủ này trước'

    // Send API
    let params : any = new URLSearchParams({
      type: 'mail',
      iditem: itemSelect.item_id,
      num: amount,
      usr: userGameTool.account,
      server: server.server_id,
      keygm: game.api.secret
    })
    params = params.toString()
    const send = await axios.get(`${game.api.mail}?${params}`)
    const res = send.data
    if(res.error) throw res.error

    return resp(event, { message: 'Gửi thư thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})