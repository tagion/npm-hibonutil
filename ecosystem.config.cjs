module.exports = {
  apps: [
    {
      name: "hibon-server",
      script: "./build/start.js",
      args: "-p 3001",
      watch: false,
    },
  ],
};
