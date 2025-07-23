const up = function(knex) {
  return knex.schema.createTable('adopters', function(table) {
    table.increments('id')
    table.integer('user_id').unsigned().notNullable()
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('pet_id').unsigned().notNullable()
    table.foreign('pet_id').references('id').inTable('pets').onDelete('CASCADE')
    table.integer('status').defaultTo(1) 
    table.timestamps(true, true) // created_at e updated_at automáticos
  })
};


const down = function(knex) {
  return knex.schema.dropTable('adopters')
};

module.exports = {
  up,
  down
}