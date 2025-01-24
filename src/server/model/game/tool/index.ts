import type { Mongoose } from 'mongoose'
import type { IDBGameTool, IDBGameToolServerOpen, IDBGameToolUser, IDBGameToolRecharge, IDBGameToolItem, IDBGameToolComment, IDBGameToolLogAdmin } from '~~/types'

export const DBGameTool = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameTool>({ 
    platform: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePlatform' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'GameCategory' },

    name: { type: String },
    code: { type: String },
    key: { type: String },
    description: { type: String },
    image: {
      banner: { type: String, default: '' },
      logo: { type: String, default: '' },
      icon: { type: String, default: '' },
      review: [{ type: String }],
    },
    
    content: { type: String },

    mobile: { type: Boolean, default: false },
    
    api: {
      mail: { type: String, default: '' },
      recharge: { type: String, default: '' },
      secret: { type: String, default: '' },
    },

    play: {
      web: { type: String, default: '' },
      windows: { type: String, default: '' },
      android: { type: String, default: '' },
      ios: { type: String, default: '' },
    },

    price: {
      recharge: { type: Number, index: true, default: 100000 },
      mail: { type: Number, index: true, default: 100000 },
    },

    statistic: {
      play: { type: Number, index: true, default: 0 },
      view: { type: Number, index: true, default: 0 },
      user: { type: Number, index: true, default: 0 },
      revenue: { type: Number, index: true, default: 0 },
    },

    manager: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    open: { type: Boolean, default: true },
    pin: { type: Boolean, default: false },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text', code: 'text' })

  const model = mongoose.model('GameTool', schema, 'GameTool')
  return model 
}

export const DBGameToolServerOpen = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameToolServerOpen>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameTool' },
    server_id: { type: String },
    server_name: { type: String },
    opentime: { type: Date },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameToolServerOpen', schema, 'GameToolServerOpen')
  return model 
}

export const DBGameToolUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameToolUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameTool' },
    account: { type: String },
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'GameToolServerOpen' },
    recharge: { type: Boolean, index: true, default: false },
    mail: { type: Boolean, index: true, default: false },
    coin: { type: Number, index: true, default: 0 },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameToolUser', schema, 'GameToolUser')
  return model 
}

export const DBGameToolRecharge = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameToolRecharge>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameTool' },
    recharge_id: { type: String },
    recharge_name: { type: String },
    save_pay: { type: Number, default: 0 },
  })

  schema.index({ recharge_id: 'text', recharge_name: 'text' })
  const model = mongoose.model('GameToolRecharge', schema, 'GameToolRecharge')
  return model 
}

export const DBGameToolItem = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameToolItem>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameTool' },
    item_id: { type: String },
    item_name: { type: String }
  })
  
  schema.index({ item_id: 'text', item_name: 'text' })
  const model = mongoose.model('GameToolItem', schema, 'GameToolItem')
  return model 
}

export const DBGameToolComment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameToolComment>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GameToolUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameTool' },
    content: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameToolComment', schema, 'GameToolComment')
  return model 
}

export const DBGameToolLogAdmin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameToolLogAdmin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameTool' },
    content: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameToolLogAdmin', schema, 'GameToolLogAdmin')
  return model 
}
