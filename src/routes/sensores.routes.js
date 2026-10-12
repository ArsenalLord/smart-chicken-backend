
import { Router } from "express";

import {
  obterLeitura,
  listarHistorico,
  registrarHistorico
} from "../services/simulador.service.js";

const router = Router();

// Retorna a leitura atual simulada.
router.get("/", (req, res) => {
  res.json(obterLeitura());
});

// Consulta o histórico salvo no PostgreSQL.
router.get("/historico", async (req, res, next) => {
  const limite = Math.min(
    200,
    Math.max(1, Number(req.query.limite) || 50)
  );

  try {
    const historico = await listarHistorico(limite);
    res.json(historico);
  } catch (erro) {
    next(erro);
  }
});

// Registra uma nova leitura no PostgreSQL.
router.post("/historico", async (req, res, next) => {
  try {
    const leitura = await registrarHistorico();
    res.status(201).json(leitura);
  } catch (erro) {
    next(erro);
  }
});

export default router;
