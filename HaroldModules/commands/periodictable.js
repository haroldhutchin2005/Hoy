const periodicTable = require('periodic-table');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "periodictable",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Search the periodic table",
  category: "utility",
  usages: "[element]",
  cooldowns: 5,
  prefix: "disable",
  letStart: async function({ api, event, target }) {
    if (!target[0]) return api.sendMessage("Please provide an element symbol, name, or atomic number.", event.threadID);

    let elementQuery = target.join(" ");
    let element;

    // Check if query is a number (atomic number)
    if (!isNaN(elementQuery)) {
      element = periodicTable.elements[parseInt(elementQuery) - 1];
    } else {
      // Try finding by symbol or name
      element = periodicTable.symbols[elementQuery] || periodicTable.names[elementQuery];
    }

    if (!element) return api.sendMessage("Element not found.", event.threadID);

    // Send the message with the element information
    let message = `Element Information:\n- Name: ${element.name}\n- Symbol: ${element.symbol}\n- Atomic Number: ${element.atomicNumber}\n- Atomic Mass: ${element.atomicMass}\n- Electronic Configuration: ${element.electronicConfiguration}\n- Oxidation States: ${element.oxidationStates}\n- Standard State: ${element.standardState}\n- Bonding Type: ${element.bondingType}\n- Melting Point: ${element.meltingPoint} K\n- Boiling Point: ${element.boilingPoint} K\n- Density: ${element.density} g/cm3\n- Year Discovered: ${element.yearDiscovered}`;

    api.sendMessage(message, event.threadID);
  }
};