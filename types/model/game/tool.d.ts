import type { Types } from 'mongoose'
import type { IDBUser } from '../user'
import type { IDBGamePlatform, IDBGameCategory } from '../game'

export interface IDBGameTool {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  platform: Types.ObjectId | IDBGamePlatform
  category: Types.ObjectId | IDBGameCategory

  name: string
  code: string
  key: string
  description: string
  image: {
    banner: string
    logo: string
    icon: string
    review: Array<string>
  }

  content: string

  mobile: boolean
  
  api: {
    mail: string
    recharge: string
    secret: string
  }

  play: {
    web: string
    windows: string
    android: string
    ios: string
  }

  price: {
    recharge: number
    mail: number
  }

  statistic: {
    play: number
    view: number
    user: number
    revenue: number
  }

  manager: Array<Types.ObjectId>

  open: boolean
  pin: boolean
  display: boolean
}

export interface IDBGameToolServerOpen {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGameTool
  server_id: string
  server_name: string
  opentime: date
}

export interface IDBGameToolUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBUser
  game: Types.ObjectId | IDBGameTool
  account: string
  server_id: string

  recharge: boolean
  mail: boolean

  coin: number
}

export interface IDBGameToolRecharge {
  _id: Types.ObjectId

  game: Types.ObjectId | IDBGameTool
  recharge_id: string
  recharge_name: string
  save_pay: number
}

export interface IDBGameToolItem {
  _id: Types.ObjectId

  game: Types.ObjectId | IDBGameTool
  item_id: string
  item_name: string
}

export interface IDBGameToolComment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBGameToolUser
  game: Types.ObjectId | IDBGameTool
  content: string
}

// Log Admin
export interface IDBGameToolLogAdmin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGameTool
  user: Types.ObjectId | IDBGameToolUser
  content: string
}