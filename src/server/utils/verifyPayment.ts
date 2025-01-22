import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import type { IDBConfig, IDBGate, IDBUser } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  money: number,
  reason: string
}

export default async (
  event: H3Event, 
  { _id, status, money, reason } : IBodyData, 
  verifier? : Types.ObjectId,
  sendNotify : boolean = true
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 3
  ) throw 'Mã trạng thái không hợp lệ'
  if(
    !!isNaN(parseInt(String(money))) 
    || parseInt(String(money)) < 0 
  ) throw 'Số tiền không hợp lệ'
  if(status == 2 && !reason) throw 'Không tìm thấy lý do từ chối'

  // Set Real Value
  const realMoney = parseInt(String(money))
  const realStatus = realMoney == 0 ? 2 : status
  const realReason = reason || 'Giao dịch không hợp lệ'
  
  // Get Payment
  const payment = await DB.Payment
  .findOne({ _id: _id })
  .select('code gate user status')
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Other
  const bot = await DB.User.findOne({'username': 'bot'}).select('username') as IDBUser
  if(!bot) throw 'Không tìm thấy thông tin Bot'
  const user = await DB.User.findOne({ _id: payment.user }).select('username') as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'
  const gate = await DB.Gate.findOne({ _id: payment.gate }).select('name person number type') as IDBGate
  if(!gate) throw 'Không tìm thấy thông tin kênh nạp'


  // Update Payment
  const time = new Date()
  const verify_person = realStatus == 3 ? user._id : (!!verifier ? verifier : bot._id)
  await DB.Payment.updateOne({ _id: _id }, {
    money: realMoney,
    status: realStatus,
    verify: {
      person: verify_person,
      time: time,
      reason: realReason
    }
  })

  // Check Status
  let realNotify
  if(realStatus == 1){
    // Get Coin
    let realCoin = realMoney
    if(gate.type == 1){
      realCoin = Math.floor((realMoney * 80) / 100) // Thẻ cào chiết khấu 80%
    }

    // Update User
    await DB.User.updateOne({ _id: payment.user },{ $inc: { 'currency.coin': realCoin, 'currency.exp': realCoin }})

    // Log User
    realNotify = `Bạn được duyệt thành công giao dịch <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')} VNĐ</b> và nhận về <b>${realCoin.toLocaleString('vi-VN')} Xu</b>`
    logAdmin(event, `Chấp nhận giao dịch nạp tiền <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')}</b>`, verify_person)
    logUser({
      user: user._id, 
      action: `Nhận <b>${realCoin.toLocaleString('vi-VN')} Xu</b> từ giao dịch nạp tiền thành công <b>${payment.code}</b>`,
      type: 'pay.success',
      target: realMoney.toString()
    })
    IO.emit('notify-global-push', `<b class="text-primary-500">${user.username}</b> vừa tăng thêm <b class="text-primary-500">${realCoin.toLocaleString('vi-VN')}</b> Tu Vi`)

    // Check Frist Pay
    const count = await DB.LogUser.count({ user: user._id, type: 'pay.first' })
    if(count == 0) logUser({ user: user._id, action: `Nạp lần đầu`, type: 'pay.first' })

    // Telebot
    const config = await DB.Config.findOne({}).select('telebot manage_password') as IDBConfig
    if(!!config){
      const timeFormat = formatDate(event, time)
      const gateReceive : string = gate.type == 1 ? 'Thẻ Cào' : `${gate.name} - ${gate.person} - ${gate.number}`

      await botTeleSendMessage(event, {
        url: config.telebot.payment.receive,
        secret: config.manage_password,
        message: `
          Chú ý nhận tiền
          » Mã giao dịch: ${payment.code}
          » Số tiền: ${realMoney.toLocaleString('vi-VN')}
          » Thời gian: ${timeFormat.day}/${timeFormat.month}/${timeFormat.year} - ${timeFormat.hour}:${timeFormat.minute}
          » Tài khoản nhận: ${gateReceive}
        `
      })
    }
  }
  else if(realStatus == 2){
    realNotify = `Bạn bị từ chối giao dịch <b>${payment.code}</b> với lý do <b>${realReason}</b>`
    logUser({
      user: user._id, 
      action: `Bạn bị từ chối giao dịch <b>${payment.code}</b>`,
      type: 'pay.refuse'
    })
    logAdmin(event, `Từ chối giao dịch nạp tiền <b>${payment.code}</b> với lý do <b>${realReason}</b>`, verify_person)
  }
  else {
    realNotify = `Bạn đã hoàn tác giao dịch nạp tiền <b>${payment.code}</b> với lý do <b>${realReason}</b>`
    logUser({
      user: user._id, 
      action: `Hoàn tác giao dịch nạp tiền <b>${payment.code}</b>`,
      type: 'pay.undo'
    })
  }

  // Send Notify
  if(!!sendNotify) await sendNotifyUser({
    user: payment.user,
    color: realStatus == 1 ? 'green' : 'red',
    content: realNotify
  })
}