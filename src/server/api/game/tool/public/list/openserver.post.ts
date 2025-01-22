export default defineEventHandler(async (event) => {
  try {
    const { size, current } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const match : any = { }

    const list = await DB.GameToolServerOpen
    .find(match)
    .populate({ path: 'game', select: 'name key code image.icon' })
    .sort({ opentime: -1 })
    .limit(size)
    .skip((current - 1) * size)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})