import type { IAuth, IDBGameTool, IDBGameToolRecharge, IDBGameToolServerOpen, IDBGameToolUser } from "~~/types"
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, info, recharge } = body
    
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!info) throw 'Vui lòng chọn tài khoản game'
    if(!info.account || !info.server_id) throw 'Tài khoản game không hợp lệ'
    if(!recharge) throw 'Vui lòng chọn vật phẩm để gửi'
    if(!recharge.id) throw 'Vật phẩm gửi không hợp lệ'

    const { account, server_id } = info
    
    // Check Game
    const game = await DB.GameTool.findOne({ code: code, display: true }).select('api') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.api.recharge || !game.api.secret) throw 'Tính năng mua gói nạp đang bảo trì'

    // Check Server
    const server = await DB.GameToolServerOpen.findOne({ game: game._id, server_id: server_id }).select('server_id') as IDBGameToolServerOpen
    if(!server) throw 'Máy chủ không tồn tại'

    // Check Recharge
    const rechargeSelect = await DB.GameToolRecharge.findOne({ game: game._id, recharge_id: recharge.id }).select('recharge_id') as IDBGameToolRecharge
    if(!rechargeSelect) throw 'Gói nạp không hỗ trợ'

    // Check User Game
    const userGameTool = await DB.GameToolUser.findOne({ game: game._id, user: auth._id, account: account, server: server._id }) as IDBGameToolUser
    if(!userGameTool) throw 'Bạn chưa mua bất cứ tool nào cho tài khoản game này'
    if(!userGameTool.recharge) throw 'Vui lòng mua tool nạp cho tài khoản game này tại máy chủ này trước'

    // Send API
    let params : any = new URLSearchParams({
      type: 'charge',
      idpay: rechargeSelect.recharge_id,
      usr: userGameTool.account,
      server: server.server_id,
      keygm: game.api.secret
    })
    params = params.toString()
    const send = await axios.get(`${game.api.recharge}?${params}`)
    const res = send.data
    if(res.error) throw res.error

    return resp(event, { message: 'Nạp thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})