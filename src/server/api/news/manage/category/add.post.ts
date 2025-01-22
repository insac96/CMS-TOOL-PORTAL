import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { name, color } = body
    if(!name || !color) throw 'Dữ liệu đầu vào không hợp lệ'

    const key = formatVNString(name, '-')
    const getByKey = await DB.NewsCategory.findOne({ key: key }).select('_id')
    if(!!getByKey) throw 'Tên danh mục đã tồn tại'

    body.key = key
    await DB.NewsCategory.create(body)
    logAdmin(event, `Thêm danh mục tin tức <b>${name}</b>`)
    
    return resp(event, { message: 'Thêm danh mục thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})