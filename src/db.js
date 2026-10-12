
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "A variável DATABASE_URL não foi configurada."
  );
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("proxy.rlwy.net")
    ? { rejectUnauthorized: false }
    : undefined,
});

export async function inicializarBanco() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leituras_sensores (
      id BIGSERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ NOT NULL,
      cenario TEXT NOT NULL,
      temperatura DOUBLE PRECISION NOT NULL,
      umidade DOUBLE PRECISION NOT NULL,
      luminosidade DOUBLE PRECISION NOT NULL,
      distancia DOUBLE PRECISION NOT NULL,
      movimento BOOLEAN NOT NULL,
      ventilador BOOLEAN NOT NULL,
      alertas JSONB NOT NULL DEFAULT '[]'::jsonb
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_leituras_timestamp
    ON leituras_sensores (timestamp DESC);
  `);

  console.log("PostgreSQL conectado e tabela verificada.");
}
