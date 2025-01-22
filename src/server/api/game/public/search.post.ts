export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { search } = body
    if(!search) throw 'Vui lòng nhập từ khóa tìm kiếm'

    const match : any = { display: true }

    if(!!search){
      const key = formatVNString(search, '-')
      match['$or'] = [
        { 'key': { $regex : key, $options : 'i' }},
        { 'code': { $regex : key, $options : 'i' }},
      ]
    }

    const list = await DB.GameTool
    .find(match)
    .select('name code key pin statistic description image.icon')
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .sort({ 'statistic.play' : 1 })
    .limit(5)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})