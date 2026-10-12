
import { Router } from "express";
import {
  listarCenarios,
  ativarCenario,
  ativarModoAutomatico
} from "../services/simulador.service.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    cenarios: listarCenarios()
  });
});

router.post("/ativar", (req, res) => {
  const { cenario } = req.body;

  if (!cenario || !ativarCenario(cenario)) {
    return res.status(400).json({
      erro: "Cenário inválido.",
      disponiveis: ["normal", "calor", "intruso"]
    });
  }

  res.json({
    mensagem: "Cenário ativado.",
    cenario
  });
});

router.post("/automatico", (req, res) => {
  ativarModoAutomatico();

  res.json({
    mensagem: "Alternância automática ativada."
  });
});

export default router;
