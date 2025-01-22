import type { Types } from 'mongoose'
export { 
  IDBGameTool, 
  IDBGameToolServerOpen,
  IDBGameToolUser, 
  IDBGameToolPayment, 
  IDBGameToolRecharge, 
  IDBGameToolItem ,
  IDBGameToolComment,
  IDBGameToolLogAdmin
} from './tool'

export interface IDBGamePlatform {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  icon: string
  key: string
  display: boolean
}

export interface IDBGameCategory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  icon: string
  key: string
  display: boolean
}