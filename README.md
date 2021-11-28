# SourceMod Docs Bot

A Discord bot that provides documentation hints for the SourceMod API.

![Docs Command Image](https://i.imgur.com/NkEqMpS.png)

## Deploying the bot

### Preparation
1. Clone this repository and navigate to the directory.
2. Copy `.env.example` to `.env` and fill environment variables.

### Deploying using PM2
1. Run `npm install` to install all the dependencies.
2. Run `npm run build` to build the application.
3. Run `npm run deploy:prod` to deploy the slash commands.
4. Run `pm2 start dist/index.js --name sourcemod-docs-bot` to start the bot.

### Deploying using Docker (Compose)
1. Copy `docker-compose.yml.example` to `docker-compose.yml`.
2. Run `docker-compose up -d` to start the bot in the background.

## Acknowledgments

* [rumblefrog](https://github.com/rumblefrog) - Author of the [sourcemod-dev/manifest](https://github.com/sourcemod-dev/manifest) repository, used for the symbols in the bot.