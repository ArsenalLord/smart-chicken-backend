# smart-chicken-backend
Backend da API do projeto Smart Chicken IoT
## Endpoints da API — Smart Chicken

**URL base de produção**

`https://smart-chicken-backend-production.up.railway.app`

### Saúde da API
- `GET /api/health` — verifica se a API está online.

### Sensores
- `GET /api/sensores` — retorna a leitura atual dos sensores.
- `GET /api/sensores/historico` — consulta o histórico salvo no PostgreSQL.
- `POST /api/sensores/historico` — registra uma nova leitura no histórico.

### Cenários
- `GET /api/cenarios` — lista os cenários disponíveis.
- `POST /api/cenarios/ativar` — ativa um cenário específico.
- `POST /api/cenarios/automatico` — retorna ao modo automático.

Para ativar um cenário, envie um JSON como:

`{"cenario":"normal"}`

Os valores disponíveis são `normal`, `calor` e `intruso`.

### Alertas e previsões
- `GET /api/alertas` — retorna os alertas da leitura atual.
- `GET /api/previsoes` — retorna seis pontos de previsão simulada de temperatura e umidade.

### Banco de dados
O PostgreSQL armazena o histórico das leituras dos sensores, incluindo data e hora, cenário, medições, estado do ventilador e alertas.