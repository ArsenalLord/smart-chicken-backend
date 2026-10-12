
import express from "express";
import cors from "cors";

import sensoresRoutes from "./routes/sensores.routes.js";
import cenariosRoutes from "./routes/cenarios.routes.js";
import alertasRoutes from "./routes/alertas.routes.js";
import previsoesRoutes from "./routes/previsoes.routes.js";

import {
  registrarHistorico
} from "./services/simulador.service.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    projeto: "Smart Chicken",
    mensagem: "API funcionando",
    documentacao: "/api"
  });
});

app.get("/api", (req, res) => {
  res.json({
    endpoints: [
      "GET /api/health",
      "GET /api/sensores",
      "GET /api/sensores/historico",
      "GET /api/cenarios",
      "POST /api/cenarios/ativar",
      "POST /api/cenarios/automatico",
      "GET /api/alertas",
      "GET /api/previsoes"
    ]
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    projeto: "Smart Chicken"
  });
});

app.use("/api/sensores", sensoresRoutes);
app.use("/api/cenarios", cenariosRoutes);
app.use("/api/alertas", alertasRoutes);
app.use("/api/previsoes", previsoesRoutes);

app.use((req, res) => {
  res.status(404).json({
    erro: "Endpoint não encontrado."
  });
});

// Registra uma leitura a cada 30 segundos.
registrarHistorico();

const intervalo = setInterval(registrarHistorico, 30_000);
intervalo.unref();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Smart Chicken API rodando na porta ${PORT}`);
});
