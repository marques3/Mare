# MARÉ Platform — NestJS + TypeScript + MySQL

Base funcional para evoluir o MARÉ para uma plataforma de surf na Costa Vicentina. **Sem PHP.** Este projeto é independente do protótipo privado publicado no Sites e não altera as suas permissões.

## Incluído

- Node.js 24, NestJS 12 e TypeScript com verificação estrita.
- MySQL 8.4 LTS, TypeORM e migrações explícitas. `synchronize` está desligado.
- Interface original PT/EN, agora servida pelo backend. A escolha de idioma mantém-se.
- Registo, login, logout e consulta da conta. Passwords com scrypt e sessões opacas revogáveis: cookie HttpOnly; só o hash do token é armazenado.
- Perfil, idioma, preferências de avisos, favoritos e sessões guardadas em MySQL para utilizadores autenticados.
- Consulta das 11 praias, previsões centralizadas, cache persistente de 30 minutos e proteção contra pedidos duplicados simultâneos numa instância.
- Fallback explícito para cache desatualizada, no máximo 3 horas. Sem inventar valores quando a fonte falha.
- Motor de sugestões em TypeScript no **servidor**: duas horas futuras com luz, limites cumpridos em ambas, compatibilidade mínima de 60 e seleção sem sobreposições.
- Validação de pedidos, limitação de pedidos, proteção por origem, headers de segurança, health checks e documentação Swagger.
- Docker Compose e testes automatizados, incluindo teste de integração MySQL com duas contas distintas.

## Arranque mais simples — Docker Desktop

Pré-requisitos: Node.js 24 para gerar a configuração e Docker Desktop com Docker Compose. No Windows, pode ser executado num terminal WSL com integração Docker ativa.

```bash
node scripts/init-env.mjs
docker compose up --build
```

O primeiro comando cria `.env` com passwords aleatórias. Recusa substituir um ficheiro existente. O Compose inicia MySQL, aplica as migrações num processo separado e inicia a aplicação.

- Site: http://localhost:3000
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Disponibilidade da base de dados: http://localhost:3000/api/health/ready

Abre **Conta** para registar um utilizador. Quando tens sessão iniciada, perfil, favoritos e plano de surf ficam associados à tua conta. Os visitantes sem conta continuam a ter preferências locais. O registo inicial importa o perfil atual; os favoritos e sessões anónimos não são importados automaticamente. No login, os dados da conta substituem a vista local.

O Compose é uma configuração de **desenvolvimento local**, com as portas limitadas a `127.0.0.1`. Usa um volume persistente para os dados. Alterar a password no `.env` depois de criar o volume não altera automaticamente a password já existente no MySQL.

## Desenvolvimento com Node no terminal

```bash
nvm use
npm ci
node scripts/init-env.mjs
# Se o .env já existir, omite o comando anterior.
docker compose up -d db
npm run db:migrate
npm run start:dev
```

Também podes usar um MySQL 8.4 existente: configura `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER` e `MYSQL_PASSWORD` no `.env`. Se mudares a porta do site, atualiza também `APP_ORIGIN` para a origem exata, sem barra final.

```bash
npm run typecheck
npm test
npm run build
npm start
```

Não é necessário Nest CLI global. O lockfile permite repetir a instalação com `npm ci`.

## Organização

```text
src/
  auth/             Contas, scrypt e sessões revogáveis
  profiles/         Perfil, favoritos e plano de sessões por utilizador
  spots/            Catálogo com identificadores estáveis
  forecast/         Fonte Open-Meteo e cache MySQL
  recommendations/  Motor de regras e API de sugestões
  database/         Entidades, configuração e migrações
  common/           Configuração, validação e proteção HTTP
  health/           Liveness e readiness
public/             Interface PT/EN, sem chamadas diretas à fonte meteorológica
test/               Testes unitários, HTTP e integração
```

## API principal

| Método | Rota | Autenticação | Função |
|---|---|---|---|
| POST | `/api/auth/register` | Não | Criar conta e sessão |
| POST | `/api/auth/login` | Não | Iniciar sessão |
| POST | `/api/auth/logout` | Cookie, se existir | Revogar a sessão |
| GET | `/api/auth/me` | Sim | Consultar utilizador |
| GET | `/api/spots` | Não | Listar praias |
| GET | `/api/spots/:id` | Não | Consultar praia |
| GET | `/api/forecast` | Não | Previsão e estado de atualização |
| POST | `/api/recommendations` | Não | Comparar condições com perfil |
| GET, PUT | `/api/me/profile` | Sim | Ler/guardar preferências |
| GET | `/api/me/favorites` | Sim | Listar favoritos |
| PUT, DELETE | `/api/me/favorites/:spotId` | Sim | Guardar/remover favorito |
| GET, POST | `/api/me/sessions` | Sim | Listar/guardar sessões |
| DELETE | `/api/me/sessions/:id` | Sim | Remover sessão própria |

Exemplo do corpo de `/api/recommendations`:

```json
{
  "level": "intermediate",
  "availability": "morning",
  "scope": "all",
  "min": 0.7,
  "max": 2,
  "wind": 22,
  "favoriteIds": ["arrifana", "amado"]
}
```

A resposta inclui `candidates`, `suggested`, `forecastFetchedAt`, `stale`, `timezone`, `method: "rules-v1"` e `localQualityValidated: false`. A interface deixa de calcular as pontuações no navegador. As previsões mantêm as unidades originais: metros, segundos e km/h.

O horário das sessões é hora civil **Europe/Lisbon**, no formato `YYYY-MM-DDTHH:00`. A metadata identifica explicitamente o fuso. As horas da madrugada próximas da mudança de horário não são usadas: as sugestões começam às 07h e acabam até às 20h, sempre dentro do período diurno.

Para guardar uma sessão, envia apenas `spotId` e `startTime`, tal como recebidos nas sugestões. O servidor volta a verificar a compatibilidade com o perfil e deriva os valores guardados; não aceita uma pontuação arbitrária enviada pelo cliente.

## Testes MySQL e CI

Os testes normais usam fixtures identificadas e não precisam de MySQL ou de chamadas externas. Os testes MySQL não são executados automaticamente no comando normal e exigem uma base de dados dedicada, com migrações aplicadas.

```bash
# Configura MYSQL_* para uma base de dados exclusiva de testes.
npm run db:migrate
MYSQL_INTEGRATION=1 npm run test:integration
```

No PowerShell, define a variável com `$env:MYSQL_INTEGRATION = '1'`. O teste usa dados meteorológicos de teste, cria duas contas e confirma isolamento, persistência, cookies e revogação do login. O workflow `.github/workflows/ci.yml` fornece MySQL 8.4 e executa estes testes. Não foi criada nenhuma ligação ao teu GitHub nem executado um workflow remoto.

## Dados meteorológicos

Sem `OPEN_METEO_API_KEY`, a base usa os endpoints públicos **apenas para prototipagem não comercial**. Antes de vender subscrições, contrata acesso comercial apropriado ou escolhe outra fonte devidamente licenciada. Com uma chave configurada, o provider usa os endpoints de cliente; valida com o fornecedor o plano, os modelos, a cobertura marítima e as condições de utilização.

A chave é usada somente no servidor. Não é escrita no frontend, nas respostas ou nos logs. A altura apresentada é altura significativa **ao largo**; a aplicação não prevê a altura de rebentação, marés, correntes, abrigo real, fundos ou lotação. A avaliação é uma regra inicial e não um modelo de IA treinado.

A cache é partilhada por todos os visitantes **numa única instância**. Em várias réplicas, a cache MySQL é partilhada, mas o controlo de pedidos simultâneos e o limitador continuam a ser locais ao processo. Antes de escalar, acrescenta coordenação/limitação partilhada, por exemplo Redis.

## Caminho para produção

1. Cria um repositório teu a partir deste código e liga o workflow de CI.
2. Provisiona alojamento Node/Docker e MySQL, separados dos ambientes locais. Cria utilizadores distintos para migrações e execução, com privilégios adequados.
3. Configura o ambiente real: `NODE_ENV=production`, `APP_ORIGIN=https://teu-dominio`, credenciais fortes, chave comercial e ligação MySQL com TLS. Se necessário, aponta `MYSQL_SSL_CA_FILE` para a CA do fornecedor.
4. Constrói a imagem. Aplica as migrações como tarefa de release e arranca `node dist/main.js` atrás de um reverse proxy HTTPS. O cookie é Secure em produção. O Compose incluído força development para uso local e deve ser adaptado antes de qualquer exposição pública.
5. Define `ENABLE_DOCS=false` em produção, configura backups com restauro testado e monitoriza `/api/health/ready`.
6. Ajusta o trust proxy para a topologia conhecida e limitação partilhada antes de colocar várias réplicas. Não confies indiscriminadamente em `X-Forwarded-For`.

Este projeto não é compatível com o runtime Cloudflare Workers do Sites por depender de Node e de uma ligação TCP MySQL. O protótipo publicado mantém-se independente. Nenhuma infraestrutura paga foi criada ou publicada durante esta montagem.

## Ainda por implementar antes de vender

- Verificação de email, recuperação de password, gestão/remoção de conta e tratamento dos direitos dos utilizadores.
- Pagamentos e subscrições Stripe, webhooks verificados e idempotentes, autorização premium no backend e cancelamentos.
- Recolha agendada de previsões, fila de alertas, deduplicação, horários e envio real de email/push. Guardar preferências de avisos **não** ativa entrega em background nesta versão.
- Histórico de previsões emitidas, observações locais e avaliação/calibração por praia. A tabela atual guarda apenas a cache mais recente, não um dataset de treino.
- Termos, privacidade, faturação e enquadramento fiscal do serviço.
- Revisão de segurança e operação antes de expor contas a clientes reais. O registo pode revelar que um email já existe; os limites atuais são por IP/processo.

O próximo incremento recomendado é concluir o ciclo de conta (verificação e recuperação), depois adicionar observações locais e alertas por email. As subscrições podem ser ligadas quando a utilidade das sugestões estiver validada.
