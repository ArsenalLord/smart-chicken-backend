
import { Router } from "express";
import {
  obterAlertas
} from "../services/simulador.service.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    alertas: obterAlertas()
  });
});

export default router;
