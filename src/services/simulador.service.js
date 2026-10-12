
import { cenarios } from "../data/cenarios.js";
import { pool } from "../db.js";

let cenarioManual = null;

function obterCenarioAtual() {
  if (cenarioManual) {
    return cenarioManual;
  }

  const nomes = ["normal", "calor", "intruso"];
  const indice = (new Date().getDate() - 1) % nomes.length;

  return nomes[indice];
}

export function listarCenarios() {
  return Object.entries(cenarios).map(([id, dados]) => ({
    id,
    nome: dados.nome,
    descricao: dados.descricao
  }));
}

export function ativarCenario(nome) {
  if (!Object.hasOwn(cenarios, nome)) {
    return false;
  }

  cenarioManual = nome;
  return true;
}

export function ativarModoAutomatico() {
  cenarioManual = null;
}

export function obterLeitura() {
  const nomeCenario = obterCenarioAtual();
  const cenario = cenarios[nomeCenario];
  const ventilador = cenario.temperatura > 25;
  const alertas = [];

  if (cenario.temperatura > 25) {
    alertas.push({
      tipo: "temperatura",
      nivel: "critico",
      mensagem: "Temperatura acima de 25 °C."
    });
  }

  if (cenario.umidade < 50) {
    alertas.push({
      tipo: "umidade",
      nivel: cenario.umidade < 40 ? "critico" : "atencao",
      mensagem: "Umidade abaixo de 50%."
    });
  }

  if (cenario.luminosidade < 20) {
    alertas.push({
      tipo: "luminosidade",
      nivel: "atencao",
      mensagem: "Luminosidade baixa."
    });
  }

  if (cenario.movimento && cenario.distancia < 50) {
    alertas.push({
      tipo: "movimento",
      nivel: "critico",
      mensagem: "Movimento detectado próximo ao galinheiro."
    });
  }

  return {
    timestamp: new Date().toISOString(),
    cenario: nomeCenario,
    temperatura: cenario.temperatura,
    umidade: cenario.umidade,
    luminosidade: cenario.luminosidade,
    distancia: cenario.distancia,
    movimento: cenario.movimento,
    ventilador,
    alertas
  };
}

export async function registrarHistorico() {
  const leitura = obterLeitura();

  const resultado = await pool.query(
    `INSERT INTO leituras_sensores (
      timestamp,
      cenario,
      temperatura,
      umidade,
      luminosidade,
      distancia,
      movimento,
      ventilador,
      alertas
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id`,
    [
      leitura.timestamp,
      leitura.cenario,
      leitura.temperatura,
      leitura.umidade,
      leitura.luminosidade,
      leitura.distancia,
      leitura.movimento,
      leitura.ventilador,
      JSON.stringify(leitura.alertas)
    ]
  );

  return {
    ...leitura,
    id: resultado.rows[0].id
  };
}

export async function listarHistorico(limite = 50) {
  const resultado = await pool.query(
    `SELECT
      id,
      timestamp,
      cenario,
      temperatura,
      umidade,
      luminosidade,
      distancia,
      movimento,
      ventilador,
      alertas
    FROM leituras_sensores
    ORDER BY timestamp DESC, id DESC
    LIMIT $1`,
    [limite]
  );

  return resultado.rows.map((linha) => ({
    ...linha,
    timestamp: new Date(linha.timestamp).toISOString()
  }));
}

export function obterAlertas() {
  return obterLeitura().alertas;
}

export function obterPrevisoes() {
  const leitura = obterLeitura();

  const variacoes = {
    normal: [0, 0.3, 0.7, 0.4, -0.2, -0.6],
    calor: [0, 0.5, 1.1, 1.5, 0.8, 0.1],
    intruso: [0, 0.1, 0.2, 0, -0.3, -0.5]
  };

  return variacoes[leitura.cenario].map((variacao, indice) => ({
    horas: indice,
    temperatura: Number(
      (leitura.temperatura + variacao).toFixed(1)
    ),
    umidade: Math.max(
      0,
      Math.min(100, leitura.umidade - indice * 1.5)
    ),
    simulada: true
  }));
}
