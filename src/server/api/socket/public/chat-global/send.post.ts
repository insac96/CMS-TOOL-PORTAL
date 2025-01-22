import type { IAuth, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { text } = await readBody(event)
    if(!text) throw 'Vui lòng nhập nội dung'
    if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

    // Get User
    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('username avatar type level online')
    .populate({ path: 'level' }) as IDBUser

    // Check Limit Chat
    const level = user.level as IDBUserLevel
    const max = level.limit.chat
    const now = DayJS(Date.now())
    const start = now.startOf('date')
    const end = now.endOf('date')
    const matchTime = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
    const historyChat = await DB.SocketChatGlobal.aggregate([
      { $match: { user: user._id, createdAt: matchTime }},
      { $project: {
        createdAt: 1,
        timeformat: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }}
      }},
      { $group: { _id: '$timeformat', count: { $count: {} } }},
    ])
    if(!!historyChat[0] && historyChat[0].count >= max) throw `Bạn đã đạt giới hạn chat thế giới trong ngày`

    // Check Tag
    const match = text.match(/^@(\S+)/)

    // Default Chat
    if(!match){
      const chat = await DB.SocketChatGlobal.create({ user: user._id, content: text })
      const result = JSON.parse(JSON.stringify(chat))
      result.user = user
      IO.emit('chat-global-push', result)
      return resp(event, { result: true })
    }

    // Smart Chat
    if(!!match){
      // Notify Global
      if(match[1] == 'notify'){
        if(user.type != 100) throw 'Chức năng chỉ dành cho Quản Trị Viên'
        let notifyArr = text.split("@notify ")
        if(!notifyArr[1]) throw 'Vui lòng nhập nội dung thông báo'

        IO.emit('notify-global-push', notifyArr[1])
        return resp(event, { result: true })
      }

      // Tag
      const userTag = await DB.User.findOne({ username: match[1] }).select('username') as IDBUser
      if(!userTag) throw 'Tài khoản trả lời không tồn tại'

      let tagArr = text.split(`@${userTag.username} `)
      if(!tagArr[1]) throw 'Vui lòng nhập nội dung trả lời'

      const content = `<b class="text-primary">@${userTag.username}</b> ${tagArr[1]}`
      const chat = await DB.SocketChatGlobal.create({ user: user._id, content: content })
      const result = JSON.parse(JSON.stringify(chat))
      result.user = user
      IO.emit('chat-global-push', result)
      return resp(event, { result: true })
    }
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})