const dotenv = require("dotenv");
const path = require("path");
const http = require("http");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const connectDb = require("./utils/db");
const { createApp } = require("./app");
const { registerSeatSocketServer } = require("./services/socket-server");
const PORT = process.env.PORT || 5000;
const { app, allowedOrigins } = createApp();
const server = http.createServer(app);

const startServer = async () => {
  await connectDb();
  const io = registerSeatSocketServer({
    server,
    allowedOrigins: [...allowedOrigins],
  });
  app.locals.io = io;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  server,
  startServer,
};
