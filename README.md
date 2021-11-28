# SourceMod Docs Bot

A Discord bot that provides documentation hints for the SourceMod API.

![Docs Command Image](https://i.imgur.com/MpLDMaT.png)

## Getting Started

### Deploying with PM2
1. Clone this repository and navigate to the directory.
2. Copy `.env.example` to `.env` and fill environment variables.
3. Run `npm install` to install all the dependencies.
4. Run `npm run build` to build the application.
5. Run `pm2 start dist/index.js --name sourcemod-docs-bot` to start the bot.

### Deploying with Docker Compose
1. Clone this repository and navigate to the directory.
2. Copy `.env.example` to `.env` and fill environment variables.
3. Copy `docker-compose.yml.example` to `docker-compose.yml`.
4. Run `docker-compose up -d` to start the bot in the background.

## Acknowledgments

* [rumblefrog](https://github.com/rumblefrog) - Author of the sp-gid repository, used for the symbols in the bot.