/**
 * Hooks to stringify or parse a json column when saving or retrieving it
 * from the database.
 */
module.exports = (Model, attribute) => {
  const STRINGIFY = (instance) => {
    instance[attribute] = JSON.stringify(instance[attribute])
  }

  const PARSE = (instance) => {
    instance[attribute] = JSON.parse(instance[attribute])
  }

  Model.addHook('beforeSave', STRINGIFY)
  Model.addHook('afterSave', PARSE)
  Model.addHook('afterFind', PARSE)
  Model.addHook('afterFetch', (instances) => instances.forEach(PARSE))
}
