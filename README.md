# SourceMod Docs Bot

A Discord bot that provides documentation hints for the SourceMod API.

<div align="center">
  <img src="https://i.imgur.com/Y5HOjpk.png" width="400" height="450" />
  <img src="https://i.imgur.com/4B9WHp5.png" width="400" height="450" />
</div>

## Commands
- `/docs <query>` - Displays symbol information.
- `/reload-symbols` - Owner only command to reload symbols.

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

## Development
1. Clone the repository with `git clone https://github.com/Sikarii/sourcemod-docs-bot`.
2. Navigate to the cloned repository with `cd sourcemod-docs-bot`.
3. Copy `.env.example` to `.env` and fill environment variables.
4. Run `npm run deploy:dev` to deploy slash commands to the dev guild.
5. Run `npm run dev` to run the bot in development mode (restarts on changes).

## Acknowledgments

* [rumblefrog](https://github.com/rumblefrog) - Author of the [sourcemod-dev/manifest](https://github.com/sourcemod-dev/manifest) repository, used for the symbols in the bot.