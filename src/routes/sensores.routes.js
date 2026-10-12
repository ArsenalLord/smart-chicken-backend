
import { Router } from "express";
import {
  obterLeitura,
  listarHistorico,
  registrarHistorico
} from "../services/simulador.service.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(obterLeitura());
});

router.get("/historico", (req, res) => {
  const limite = Math.min(
    200,
    Math.max(1, Number(req.query.limite) || 50)
  );

  res.json(listarHistorico(limite));
});

router.post("/historico", (req, res) => {
  res.status(201).json(registrarHistorico());
});

export default router;
