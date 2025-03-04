const envs = ["NODE_ENV", "APP_PORT", "APP_FQDN"];

envs.forEach((env) => {
  if (!Bun.env[env]) {
    console.error("[Error]: Environment variable not found: ", env);
    process.exit(-1);
  }
});

const ENV = {
  NODE_ENV: Bun.env.NODE_ENV || "development",
  APP_PORT: Number(Bun.env.APP_PORT) || 8080,
  APP_FQDN: Bun.env.APP_FQDN || "http://localhost:8080",
};

export default ENV;
