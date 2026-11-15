export default ({ env }: any) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 0, max: 5 },
    acquireConnectionTimeout: 60000,
  },
});
