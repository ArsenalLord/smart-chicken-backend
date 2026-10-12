
export const cenarios = {
  normal: {
    nome: "Normal",
    descricao: "Condições ambientais dentro dos parâmetros.",
    temperatura: 23.8,
    umidade: 65,
    luminosidade: 78,
    distancia: 400,
    movimento: false
  },

  calor: {
    nome: "Calor",
    descricao: "Temperatura elevada e necessidade de ventilação.",
    temperatura: 29.7,
    umidade: 47,
    luminosidade: 90,
    distancia: 400,
    movimento: false
  },

  intruso: {
    nome: "Intruso",
    descricao: "Movimento detectado próximo ao galinheiro.",
    temperatura: 24.5,
    umidade: 61,
    luminosidade: 18,
    distancia: 32,
    movimento: true
  }
};
