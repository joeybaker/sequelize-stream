const PREFIX = 'sequelize-stream'
const EVENTS = {
  CREATE: 'create'
  , UPDATE: 'update'
  , DESTROY: 'destroy'
  // unsupported, just here so we can provide a test case and be alerted if
  // sequelize fixes this in the future.
  , BULK_DESTROY: 'bulk destroy'
}

export default ({sequelize, stream}) => {
  sequelize.addHook('afterCreate', `${PREFIX}-afterCreate`, (instance) => {
    stream.push({event: EVENTS.CREATE, instance})
  })

  sequelize.addHook('afterBulkCreate', `${PREFIX}-afterBulkCreate`, (instances) => {
    instances.forEach((instance) => {
      stream.push({event: EVENTS.CREATE, instance})
    })
  })

  sequelize.addHook('afterUpdate', `${PREFIX}-afterUpdate`, (instance) => {
    stream.push({event: EVENTS.UPDATE, instance})
  })

  sequelize.addHook('afterBulkUpdate', `${PREFIX}-afterBulkUpdate`, ({model, attributes}) => {
    // this is a hacky way to get the updated rows
    const {updatedAt} = attributes
    return model.findAll({where: {updatedAt}})
    .then((instances) => {
      instances.forEach((instance) => {
        stream.push({event: EVENTS.UPDATE, instance})
      })
    })
  })

  sequelize.addHook('afterDestroy', `${PREFIX}-afterDestroy`, (instance) => {
    stream.push({event: EVENTS.DESTROY, instance})
  })

  // sequelize doesn't pass the instances to us, so all we can do is emit a
  // destroy event
  sequelize.addHook('afterBulkDestroy', `${PREFIX}-afterBulkDestroy`, () => {
    stream.push({event: EVENTS.BULK_DESTROY})
  })
}
