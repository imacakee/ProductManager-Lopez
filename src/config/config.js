const dotenv = require("dotenv");
const { Command } = require("commander");

const program = new Command();

program
  .option("-d", "Variable para debug", false)
  .option("-p <port>", "Puerto del servidor", 9090)
  .option("--mode <mode>", "Modo de trabajo", "develop");
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;
let path = "";

switch (environment) {
  case "production":
    path = ".env.production";
    break;
  case "test":
    path = ".env.test";
    break;
  default:
    path = ".env.development";
}

console.log("el environment es", environment);

dotenv.config({
  path,
});

module.exports = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  environment: environment,
  privateKey: process.env.PRIVATE_KEY,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackUrl: process.env.CALLBACKURL,
  gmailAccount: process.env.GMAIL_ACCOUNT,
  gmailPassword: process.env.GMAIL_PASSWORD,
};
