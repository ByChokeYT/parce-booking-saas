module.exports = {
    apps: [{
        name: "flow-barber-server",
        script: "./server/index.js",
        instances: "max",
        exec_mode: "cluster",
        env: {
            NODE_ENV: "development",
            PORT: 3001
        },
        env_production: {
            NODE_ENV: "production",
            PORT: 3001,
            // You should set these in your production environment or .env file
            // JWT_SECRET: "...", 
        }
    }]
}
