import { RateLimiter } from "limiter";

const limiter = new RateLimiter({ tokensPerInterval: 3, interval: 2000 });

async function sendMessage() {
  const remainingMessages = await limiter.removeTokens(1);
  console.log("Invocking func", remainingMessages, new Date().getSeconds());
}

async function main() {
  await Promise.all(Array.from({ length: 30 }, () => sendMessage()));
}
main();