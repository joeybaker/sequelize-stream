import addHooks from './add-hooks.js'
import {Readable} from 'stream'

export default (sequelize) => {
  const stream = new Readable({
    objectMode: true
    , read () {}
  })
  addHooks({sequelize, stream})
  return stream
}
