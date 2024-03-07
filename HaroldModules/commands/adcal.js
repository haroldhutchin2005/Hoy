const Exponents = require('advanced-calculator');
const Volume = require('advanced-calculator');

module.exports = {
  name: "adcal",
  Programmer: "Jonell Magallanes",
  info: "Performs advanced mathematical calculations",
  hasPermission: "members",
  category: "utility",
  usages: "advance <operation> <values>",
  cooldowns: 5,
  prefix: "enable",

  letStart: async function({ api, event, target }) {
    let result;
    const operation = target[0];
    target.shift(); 

    try {
      switch (operation) {
        // Exponents operations
        case 'multiplyExponents':
          result = Exponents.multiplyExponents(target);
          break;
        case 'divideExponents':
          result = Exponents.divideExponents(target);
          break;
        case 'negativeExponents':
          result = Exponents.negativeExponents(target [0], target[1]);
          break;
        case 'fractionalExponents':
          result = Exponents.fractionalExponents(target[0], target[1], tagret[2]);
          break;
        case 'powerOfPower':
          result = Exponents.powerOfPower(target[0], tagret[1], target[2]);
          break;
        case 'x10':
          result = Exponents.x10(target[0], target[1]);
          break;

        // Volume operations
        case 'sphereSurfaceArea':
          result = Volume.sphereSurfaceArea(target[0]);
          break;
        case 'sphereVolume':
          result = Volume.sphereVolume(target[0]);
          break;
        case 'cubeSurfaceArea':
          result = Volume.cubeSurfaceArea(target[0]);
          break;
        case 'cubeVolume':
          result = Volume.cubeVolume(target [0]);
          break;
        case 'rectangularprizmSurfaceArea':
          result = Volume.rectangularprizmSurfaceArea(target[0], target[1], target[2]);
          break;
        case 'rectangularprizmVolume':
          result = Volume.rectangularprizmVolume(target[0], target[1], target[2]);
          break;
        case 'cylinderSurfaceArea':
          result = Volume.cylinderSurfaceArea(target [0], target[1]);
          break;
        case 'cylinderVolume':
          result = Volume.cylinderVolume(target[0], target[1]);
          break;
        case 'coneSurfaceArea':
          result = Volume.coneSurfaceArea(target[0], target[1], target[2]);
          break;
        case 'coneVolume':
          result = Volume.coneVolume(target[0], target[1]);
          break;

        default:
          api.sendMessage("Unknown operation.", event.threadID);
          return;
      }
      api.sendMessage(`Result: ${result}`, event.threadID);
    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID);
    }
  }
};