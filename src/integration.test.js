import test from 'ava'
import Sequelize from 'sequelize'
import sequelizeStream from './index.js'

test.beforeEach((t) => {
  const sequelize = t.context.squelize = new Sequelize({
    dialect: 'sqlite'
    , logging: false
  })

  t.context.Cat = sequelize.define('Cat', {
    name: Sequelize.STRING
    , spots: Sequelize.INTEGER
  })

  t.context.stream = sequelizeStream(sequelize)
  return sequelize.sync({force: true})
})

test.cb('update has previous values', (t) => {
  const {stream, Cat} = t.context


  stream.on('data', ({instance, event}) => {
    if (event === 'update') {
      t.truthy(instance.changed('spots'))
      t.end()
    }
  })

  Cat.create({name: 'spot'}).then((spot) => spot.update({spots: 1}))
})

// sequelize needs to update it's bulkUpdate algorithim to accomodate this
test.cb.failing(`bulkUpdate has previous values won't work b/c the instances are fresh.`, (t) => {
  const {stream, Cat} = t.context


  stream.on('data', ({instance, event}) => {
    if (event === 'update') {
      t.truthy(instance.changed('spots'))
      t.end()
    }
  })

  Cat.create({name: 'spot'}).then(() => {
    return Cat.update({spots: 1}, {where: {name: 'spot'}})
  })
})

test.cb(`bulk destroy with \`individualHooks\``, (t) => {
  const {stream, Cat} = t.context
  const models = [{name: 'spot'}, {name: 'tails'}]
  let destroyCount = 0

  stream.on('data', ({instance, event}) => {
    if (event === 'destroy') {
      destroyCount++
      t.pass(`${instance.name} deleted`)

      if (destroyCount === models.length) t.end()
    }
  })

  Cat.bulkCreate(models).then(() => {
    return Cat.destroy({where: {name: {$ne: null}}, individualHooks: true})
  })
})

test.cb.failing(`bulk destroy has doesn't work because sequelize doesn't give us a way to grab the instances`, (t) => {
  const {stream, Cat} = t.context
  const models = [{name: 'spot'}, {name: 'tails'}]
  let destroyCount = 0

  stream.on('data', ({instance, event}) => {
    if (event === 'bulk destroy') {
      t.fail(`bulk destroy event only deleted`)
      t.end()
    }
    else if (event === 'destroy') {
      destroyCount++
      t.pass(`${instance.name} deleted`)

      if (destroyCount === models.length) t.end()
    }
  })

  Cat.bulkCreate(models).then(() => {
    return Cat.destroy({where: {name: {$ne: null}}})
  })
})
