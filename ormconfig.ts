export default {
  host: process.env.DB_HOST,
  type: 'postgres',
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: ['src/shared/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/shared/migrations',
  },
};
