import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Address } from "./entities/Address";

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
const dbUser = process.env.DB_USER || "mfp-user";
const dbPassword = process.env.DB_PASSWORD || "mfp-pswrd";
const dbName = process.env.DB_NAME || "mfp-db";
const dbLogging = process.env.DB_LOGGING
  ? process.env.DB_LOGGING === "true"
  : true;

const datasource = new DataSource({
  type: "postgres",
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  entities: [User, Address],
  logging: dbLogging,
  synchronize: true,
});

export default datasource;
