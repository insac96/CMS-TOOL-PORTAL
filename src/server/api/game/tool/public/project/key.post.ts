export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GameTool
    .findOneAndUpdate(
      { key: key, display: true }, 
      { $inc: { 'statistic.view': 1 } }, 
      { new: true }
    )
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .select('-api')
    if(!game) throw 'Trò chơi không tồn tại'

    const newserver = await DB.GameToolServerOpen
    .findOne({ game: game._id })
    .sort({ opentime: -1 })

    const result = JSON.parse(JSON.stringify(game))
    result.newserver = newserver

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})