import dotenv from 'dotenv';
dotenv.config();

import knex from 'knex';

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente ${key} não definida`);
  }
  return value;
}

export const db = knex({
  client: 'mysql2',
  connection: {
    host: getEnv('DB_HOST'),
    port: Number(getEnv('DB_PORT')),
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
    database: getEnv('DB_NAME'),
  }
});
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
export async function setupDatabase() {
  try {
    const hasTableMeetings = await db.schema.hasTable('meetings');
    const hasTableUser = await db.schema.hasTable('users');
    const hasTableSala = await db.schema.hasTable('salas');

    // 1. Criar Tabela de Usuários
    if (!hasTableUser) {
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('nome_completo').notNullable();
        table.integer("numero").notNullable();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.string("departamento").notNullable();
      });

      console.log('✅ Tabela "users" criada!');
    }

    // 2. Criar Tabela de Salas
    if (!hasTableSala) {
      await db.schema.createTable('salas', (table) => {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('status').defaultTo('disponível');
        table.integer('capacidade').notNullable();
      });

      console.log('✅ Tabela "salas" criada!');
    }

    // 3. Criar Tabela de Meetings
    if (!hasTableMeetings) {
      await db.schema.createTable('meetings', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.dateTime('startTime').notNullable();
        table.dateTime('endTime').notNullable();
        table.string('status').defaultTo('Agendada');
        table.string('categoria').notNullable();

        table.integer('respondavel_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.integer('sala_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('salas')
          .onDelete('RESTRICT');

        table.timestamps(true, true);
      });

      console.log('✅ Tabela "meetings" criada!');
    }

  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error);
  }
}