const up = function(knex) {
  return knex.schema.alterTable('pets', function(table) {
    table.float('weight').alter()
    table.integer('user_id').unsigned().notNullable()
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })
}

const down = function(knex) {
  return knex.schema.alterTable('pets', function(table) {
    table.dropForeign('user_id')
    table.dropColumn('user_id')
  })
}

module.exports = {
  up,
  down
}
