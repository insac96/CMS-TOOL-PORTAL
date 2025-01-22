import type { Types } from 'mongoose'

export interface IDBConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  short_name: string
  description: string
  og_image: string
  logo_image: string
  makeby: string
  article: {
    about: string
    privacy: string
    terms: string
  }
  manage_password: string
  license: boolean
  contact: {
    name: string
    phone: string
    email: string
    address: string
    prefix: string
  }
  telebot: {
    payment: {
      create: string
      receive: string
    }
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
  }
  facebook: {
    client_id: string
    client_secret: string
    client_version: string
    client_verify: string
    client_ads: string
  }
  google: {
    client_id: string
    client_secret: string
    client_verify: string
    client_ads: string
  }
  tiktok: {
    client_id: string
    client_secret: string
    client_verify: string
  }
  zalo: {
    client_id: string
    client_secret: string
    client_verify: string
  }
}

export interface IDBConfigStore {
  name: string
  short_name: string
  description: string
  og_image: string
  logo_image: string
  makeby: string
  contact: {
    name: string
    phone: string
    email: string
    address: string
    prefix: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
  }
  facebook: {
    client_id: string
    client_version: string
    client_verify: string
    client_ads: string
  }
  google: {
    client_id: string
    client_verify: string
    client_ads: string
  }
  tiktok: {
    client_id: string
    client_verify: string
  }
  zalo: {
    client_id: string
    client_verify: string
  }
}