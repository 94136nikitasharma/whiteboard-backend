module.exports = {
    apps: [{
        name: 'whiteboard-backend',
        script: 'src/server.js',
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
            PORT: 8080
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 8080
        },
        error_file: 'logs/err.log',
        out_file: 'logs/out.log',
        log_file: 'logs/combined.log',
        time: true
    }]
};
