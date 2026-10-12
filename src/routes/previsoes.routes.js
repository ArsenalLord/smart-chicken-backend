
import { Router } from "express";
import {
  obterPrevisoes
} from "../services/simulador.service.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    horizonteHoras: 6,
    metodo: "simulacao",
    previsoes: obterPrevisoes()
  });
});

export default router;
