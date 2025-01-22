export default defineEventHandler(async (event) => {
  try {
    const user = await DB.User.count()
    const gameTool = await DB.GameTool.count({ display: true })

    return resp(event, { result: {
      member: user,
      game: {
        tool: gameTool
      }
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})