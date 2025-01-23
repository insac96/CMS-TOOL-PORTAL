import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'

import { DBUser, DBUserLevel } from './user'

import { DBNotifyUser } from './notify'

import { DBGate } from './gate'
import { DBPayment } from './payment'
import { DBSpend } from './spend'

import { DBLogAdmin, DBLogLogin, DBLogUser } from './log'
import { DBAdminIP, DBBlockIP, DBUserIP } from './ip'

import { 
  DBGamePlatform, 
  DBGameCategory, 

  DBGameTool, 
  DBGameToolServerOpen,
  DBGameToolUser, 
  DBGameToolRecharge, 
  DBGameToolItem,
  DBGameToolComment,
  DBGameToolLogAdmin,
} from './game'

import { 
  DBSocketChatGlobal, 
  DBSocketOnline,
  DBSocketChatSingle, DBSocketChatSingleMessage
} from './socket'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    // Main DB
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    User: DBUser(mongoose),
    UserLevel: DBUserLevel(mongoose),

    NotifyUser: DBNotifyUser(mongoose),

    Gate: DBGate(mongoose),
    Payment: DBPayment(mongoose),
    Spend: DBSpend(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogUser: DBLogUser(mongoose),
    LogLogin: DBLogLogin(mongoose),

    AdminIP: DBAdminIP(mongoose),
    UserIP: DBUserIP(mongoose),
    BlockIP: DBBlockIP(mongoose),

    // Game DB
    GamePlatform: DBGamePlatform(mongoose),
    GameCategory: DBGameCategory(mongoose),

    GameTool: DBGameTool(mongoose),
    GameToolServerOpen: DBGameToolServerOpen(mongoose),
    GameToolUser: DBGameToolUser(mongoose),
    GameToolRecharge: DBGameToolRecharge(mongoose),
    GameToolItem: DBGameToolItem(mongoose),
    GameToolComment: DBGameToolComment(mongoose),
    GameToolLogAdmin: DBGameToolLogAdmin(mongoose),

    // Socket
    SocketChatGlobal: DBSocketChatGlobal(mongoose),
    SocketOnline: DBSocketOnline(mongoose),
    SocketChatSingle: DBSocketChatSingle(mongoose),
    SocketChatSingleMessage: DBSocketChatSingleMessage(mongoose)
  }
}