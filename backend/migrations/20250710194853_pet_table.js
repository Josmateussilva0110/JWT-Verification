const up = function(knex) {
  return knex.schema.createTable('pets', function(table) {
    table.increments('id')
    table.string('name', 150).notNullable()
    table.integer('age').notNullable()
    table.integer('weight').notNullable()
    table.string('color',100).notNullable()
    table.specificType('photos', 'text[]').defaultTo('{}')
    table.integer('status').defaultTo(1) // 1 = ativo 2 = cancelado 3 = arquivado 4 = concluído
    table.timestamps(true, true) // created_at e updated_at automáticos
  })
};


const down = function(knex) {
  return knex.schema.dropTable('pets')
};

module.exports = {
  up,
  down
}