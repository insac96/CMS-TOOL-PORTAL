import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { category, title, description } = body
    if(!category || !title || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const categoryCheck = await DB.NewsCategory.findOne({ _id: category }).select('_id name')
    if(!categoryCheck) throw 'Danh mục không tồn tại'

    const key = formatVNString(title, '-')
    const newsCheck = await DB.News.findOne({ key: key }).select('_id')
    if(!!newsCheck) throw 'Tiêu đề tin tức đã tồn tại'

    body.key = key
    body.creator = auth._id
    body.updater = auth._id

    await DB.News.create(body)
    logAdmin(event, `Thêm tin tức <b>${title}</b>`)

    return resp(event, { message: 'Thêm tin tức thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})