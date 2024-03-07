// filename: handlers/cooldowns.js

class CooldownsHandler {
  constructor() {
    this.cooldowns = new Map();
  }

  setCooldown(userID, commandName, durationMs) {
    const currentTime = Date.now();
    const cooldownData = this.cooldowns.get(userID) || {};
    cooldownData[commandName] = currentTime + durationMs;
    this.cooldowns.set(userID, cooldownData);
  }

  checkCooldown(userID, commandName) {
    const userCooldowns = this.cooldowns.get(userID);
    if (!userCooldowns) return false;
    const currentTime = Date.now();
    return userCooldowns[commandName] && currentTime < userCooldowns[commandName];
  }

  getCooldownRemaining(userID, commandName) {
    const currentTime = Date.now();
    const userCooldowns = this.cooldowns.get(userID);
    if (!userCooldowns || !userCooldowns[commandName]) return 0;
    const timeLeft = userCooldowns[commandName] - currentTime;
    return timeLeft > 0 ? timeLeft : 0;
  }
}

module.exports = CooldownsHandler;