import test from 'ava'
import sequelizeStream from './index.js'
import Seqeulize from 'sequelize'
import {Readable} from 'stream'

test.beforeEach((t) => {
  t.context.sequelize = new Seqeulize({
    dialect: 'sqlite'
    , logging: false
  })
})

test('returns a readable stream', (t) => {
  const {sequelize} = t.context
  const stream = sequelizeStream(sequelize)
  t.truthy(stream instanceof Readable)
})
