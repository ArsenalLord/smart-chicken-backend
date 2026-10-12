
import { cenarios } from "../data/cenarios.js";

let cenarioManual = null;

const historico = [];

function obterCenarioAtual() {
  if (cenarioManual) {
    return cenarioManual;
  }

  // O cenário muda conforme o dia do mês.
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

  const leitura = {
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

  return leitura;
}

export function registrarHistorico() {
  const leitura = obterLeitura();

  historico.push(leitura);

  // Mantém somente as 500 leituras mais recentes.
  if (historico.length > 500) {
    historico.shift();
  }

  return leitura;
}

export function listarHistorico(limite = 50) {
  return historico.slice(-limite).reverse();
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
