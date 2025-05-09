const { TinkoffInvestApi } = require('tinkoff-invest-api');
require('dotenv').config();

const api = new TinkoffInvestApi({
  token: process.env.TINKOFF_TOKEN,
  target: 'sandbox-invest-public-api.tinkoff.ru:443'
});

async function openSandboxAccount() {
  try {
    const response = await api.sandbox.openSandboxAccount({});
    console.log(`Opened sandbox account: ${response.accountId}`);
    return response.accountId;
  } catch (error) {
    throw new Error(`Failed to open sandbox account: ${error.message}`);
  }
}

async function sandboxPayIn(accountId, amount) {
  try {
    await api.sandbox.sandboxPayIn({ accountId, amount: { units: amount, nano: 0 } });
    console.log(`Deposited ${amount} RUB to account ${accountId}`);
  } catch (error) {
    throw new Error(`Failed to deposit to sandbox: ${error.message}`);
  }
}

async function getCandles(figi, from, to, interval) {
  try {
    const response = await api.marketData.getCandles({
      figi,
      from,
      to,
      interval
    });
    return response.candles.map(candle => ({
      time: candle.time,
      open: candle.open.units + candle.open.nano / 1e9,
      high: candle.high.units + candle.high.nano / 1e9,
      low: candle.low.units + candle.low.nano / 1e9,
      close: candle.close.units + candle.close.nano / 1e9,
      volume: candle.volume
    }));
  } catch (error) {
    throw new Error(`Failed to fetch candles: ${error.message}`);
  }
}

async function getPortfolio(accountId) {
  try {
    const response = await api.sandbox.getSandboxPortfolio({ accountId });
    return {
      totalAmount: response.totalAmountCurrencies.units + response.totalAmountCurrencies.nano / 1e9,
      positions: response.positions
    };
  } catch (error) {
    throw new Error(`Failed to fetch portfolio: ${error.message}`);
  }
}

async function postOrder(figi, quantity, direction, accountId, price = null) {
  try {
    const order = await api.sandbox.postSandboxOrder({
      figi,
      quantity,
      direction: direction === 'buy' ? 'ORDER_DIRECTION_BUY' : 'ORDER_DIRECTION_SELL',
      accountId,
      orderType: price ? 'ORDER_TYPE_LIMIT' : 'ORDER_TYPE_MARKET',
      price: price ? { units: Math.floor(price), nano: Math.round((price % 1) * 1e9) } : undefined
    });
    return order;
  } catch (error) {
    throw new Error(`Failed to post order: ${error.message}`);
  }
}

module.exports = { openSandboxAccount, sandboxPayIn, getCandles, getPortfolio, postOrder };