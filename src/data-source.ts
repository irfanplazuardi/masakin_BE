/**
 * This the set up need to do for migration.
 *
 *
 * Migration needed for setup data base on production.
 * the setup might like create table or update previous
 * row data to new form.
 * TODO: Learn about migration
 */

import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  logging: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['migration/*{.ts,.js}'],
  subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOption);
export default AppDataSource;
