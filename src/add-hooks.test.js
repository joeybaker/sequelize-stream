import test from 'ava'
import addHooks from './add-hooks.js'
import Seqeulize from 'sequelize'
import {Readable} from 'stream'

test.beforeEach((t) => {
  const sequelize = t.context.sequelize = new Seqeulize({
    dialect: 'sqlite'
    , logging: false
  })

  t.context.model = sequelize.define('cat', {
    name: Seqeulize.STRING
  })

  const stream = t.context.stream = new Readable({
    read () {
    }
    , objectMode: true
  })

  addHooks({sequelize, stream})

  return sequelize.sync({force: true})
})

test('afterCreate', (t) => {
  t.plan(2)

  const {model, stream} = t.context
  const name = 'foo'

  stream.on('data', ({instance, event}) => {
    t.is(event, 'create')
    t.is(instance.name, name)
  })

  return model.create({name})
})

test('afterUpdate', (t) => {
  t.plan(2)

  const {model, stream} = t.context
  const originalName = 'foo'
  const updateName = 'bar'

  stream.on('data', ({instance, event}) => {
    if (event === 'create') return

    t.is(event, 'update')
    t.is(instance.name, updateName)
  })

  return model.create({name: originalName})
  .then((instance) => instance.update({name: updateName}))
})


test('afterDestroy', (t) => {
  t.plan(2)

  const {model, stream} = t.context
  const name = 'foo'

  stream.on('data', ({instance, event}) => {
    if (event === 'create') return

    t.is(event, 'destroy')
    t.is(instance.name, name)
  })

  return model.create({name})
  .then((instance) => instance.destroy())
})

test('afterBulkCreate', (t) => {
  const {model, stream} = t.context
  const name1 = 'foo'
  const name2 = 'bar'
  const names = [name1, name2]
  const ASSERTS = 2

  t.plan(names.length * ASSERTS)

  stream.on('data', ({instance, event}) => {
    t.is(event, 'create')
    t.truthy(names.includes(instance.name))
  })

  return model.bulkCreate([{name: name1}, {name: name2}])
})

test('afterBulkUpdate', (t) => {
  const {model, stream} = t.context
  const name1 = 'foo'
  const name2 = 'bar'
  const originalNames = [name1, name2]
  const newName = 'baz'
  const ASSERTS = 2

  t.plan(originalNames.length * ASSERTS)

  stream.on('data', ({instance, event}) => {
    if (event === 'create') return
    t.is(event, 'update')
    t.is(instance.name, newName)
  })

  return model.bulkCreate([{name: name1}, {name: name2}])
  .then(() => model.update({name: newName}, {where: {name: {$ne: newName}}}))
})
