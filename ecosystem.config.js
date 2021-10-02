module.exports = {
    apps: [
        {
            name: "api.knotters.org",
            script: "./server.js",
            instances: "max",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
