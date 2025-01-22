import type { Model } from 'mongoose'

export { IDBConfig, IDBConfigStore } from './config'
export { IDBNews, IDBNewsCategory } from './news'

export { IDBUser, IDBUserLevel, IDBUserStore } from './user'
export { IDBNotifyUser } from './notify'

export { IDBGate } from './gate'
export { IDBPayment } from './payment'
export { IDBSpend } from './spend'

export { IDBLogAdmin, IDBLogUser, IDBLogLogin } from './log'
export { IDBAdminIP, IDBBlockIP, IDBUserIP } from './ip'

export { 
  IDBGamePlatform, 
  IDBGameCategory, 

  IDBGameTool, 
  IDBGameToolServerOpen,
  IDBGameToolUser, 
  IDBGameToolPayment,
  IDBGameToolRecharge, 
  IDBGameToolItem,
  IDBGameToolComment,
  IDBGameToolLogAdmin,
} from './game'

export { 
  IDBSocketChatGlobal, 
  IDBSocketOnline,
  IDBSocketChatSingle, IDBSocketChatSingleMessage
} from './socket'

export interface IGlobalDB {
  // Main DB
  Config: Model<IDBConfig>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  User: Model<IDBUser>
  UserLevel: Model<IDBUserLevel>

  NotifyUser: Model<IDBNotifyUser>

  Gate: Model<IDBGate>
  Payment: Model<IDBPayment>
  Spend: Model<IDBSpend>

  LogAdmin: Model<IDBLogAdmin>
  LogUser: Model<IDBLogUser>
  LogLogin: Model<IDBLogLogin>

  AdminIP: Model<IDBAdminIP>
  UserIP: Model<IDBUserIP>
  BlockIP: Model<IDBBlockIP>

  // Game DB
  GamePlatform: Model<IDBGamePlatform>
  GameCategory: Model<IDBGameCategory>

  GameTool: Model<IDBGameTool>
  GameToolServerOpen: Model<IDBGameToolServerOpen>
  GameToolUser: Model<IDBGameToolUser>
  GameToolPayment: Model<IDBGameToolPayment>
  GameToolRecharge: Model<IDBGameToolRecharge>
  GameToolItem: Model<IDBGameToolItem>
  GameToolComment: Model<IDBGameToolComment>
  GameToolLogAdmin: Model<IDBGameToolLogAdmin>

  // Socket
  SocketChatGlobal: Model<IDBSocketChatGlobal>
  SocketOnline: Model<IDBSocketOnline>
  SocketChatSingle: Model<IDBSocketChatSingle>
  SocketChatSingleMessage: Model<IDBSocketChatSingleMessage>
}