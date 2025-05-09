const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

function sendMessage(message) {
  bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
}

module.exports = { sendMessage };