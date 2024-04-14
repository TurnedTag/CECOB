const app = require("./src/app");
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando  na porta ${PORT}`);
});
