const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
  name: "module",
  hasPermission: "adminbot",
  credits: "Your Name",
  info: "Module loader for managing command modules in the commands folder.",
  usages: "module launch [module_name] | module unlaunch [module_name] | module launchAll",
  category: "system",
  cooldowns: 5,
  prefix: "enable",
  dependencies: {},
originalCommandsFolder: '',
  cancelCmdFolder: 'cancelcmd',
  letStart: async function({ api, event, target }) {
    const commandsDir = path.resolve(__dirname, this.originalCommandsFolder);
    const cancelCmdDir = path.resolve(__dirname, this.cancelCmdFolder);

    if (!fs.existsSync(commandsDir)) {
      api.sendMessage(
        `Commands directory not found at ${commandsDir}`,
        event.threadID,
        event.messageID
      );
      return;
    }

    // Create cancelcmd folder if not exists
    if (!fs.existsSync(cancelCmdDir)) {
      fs.mkdirSync(cancelCmdDir);
    }

    const commandsFiles = fs.readdirSync(commandsDir);
    const loadedCommands = [];
    const failedCommands = [];

    if (target.length === 0) {
      api.sendMessage(
        "Invalid syntax. Use: module launch [module_name] | module unlaunch [module_name] | module launchAll",
        event.threadID,
        event.messageID
      );
      return;
    }

    const action = target[0].toLowerCase();
    const moduleName = target[1];

    switch (action) {
      case "launch":
        if (moduleName) {
          const originalPath = path.join(commandsDir, `${moduleName}.js`);
          const cancelCmdPath = path.join(cancelCmdDir, `${moduleName}.js`);

          try {
            delete require.cache[require.resolve(originalPath)];
            const command = require(originalPath);

            if (typeof command.letStart === 'function') {
              loadedCommands.push(moduleName);
              console.log(`Module '${moduleName}' loaded.`);
            } else {
              throw new Error(`${moduleName}.js does not export a 'letStart' function.`);
            }
          } catch (error) {
            failedCommands.push(moduleName);
            console.error(`Failed to load module '${moduleName}': ${error.message}`);
          }

          // Check if module is in cancelcmd folder and move it back using child process
          if (fs.existsSync(cancelCmdPath)) {
            exec(`mv ${cancelCmdPath} ${originalPath}`, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error moving module back: ${error.message}`);
                return;
              }
              console.log(`Module '${moduleName}' moved back to the original path.`);
            });
          }
        } else {
          api.sendMessage(
            "Invalid syntax for launching a module. Use: module launch [module_name]",
            event.threadID,
            event.messageID
          );
          return;
        }
        break;

      case "unlaunch":
        if (moduleName) {
          const moduleIndex = loadedCommands.indexOf(moduleName);
          const originalPath = path.join(commandsDir, `${moduleName}.js`);
          const cancelCmdPath = path.join(cancelCmdDir, `${moduleName}.js`);

          if (moduleIndex !== -1) {
            loadedCommands.splice(moduleIndex, 1);
            console.log(`Module '${moduleName}' unloaded.`);
          } else {
            api.sendMessage(
              `Module '${moduleName}' is not currently loaded.`,
              event.threadID,
              event.messageID
            );
            return;
          }

          // Move the module to cancelcmd folder using child process
          if (!fs.existsSync(cancelCmdPath)) {
            exec(`mv ${originalPath} ${cancelCmdPath}`, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error moving module to cancelcmd folder: ${error.message}`);
                return;
              }
              console.log(`Module '${moduleName}' moved to the cancelcmd folder.`);
            });
          }
        } else {
          api.sendMessage(
            "Invalid syntax for unlaunching a module. Use: module unlaunch [module_name]",
            event.threadID,
            event.messageID
          );
          return;
        }
        break;

      case "launchall":
        for (let file of commandsFiles) {
          if (file.endsWith('.js')) {
            const moduleName = path.parse(file).name;
            const originalPath = path.join(commandsDir, file);
            const cancelCmdPath = path.join(cancelCmdDir, file);

            try {
              delete require.cache[require.resolve(originalPath)];
              const command = require(originalPath);

              if (typeof command.letStart === 'function') {
                loadedCommands.push(moduleName);
                console.log(`Module '${moduleName}' loaded.`);
              } else {
                throw new Error(`${moduleName}.js does not export a 'letStart' function.`);
              }
            } catch (error) {
              failedCommands.push(moduleName);
              console.error(`Failed to load module '${moduleName}': ${error.message}`);
            }

            // Check if module is in cancelcmd folder and move it back using child process
            if (fs.existsSync(cancelCmdPath)) {
              exec(`mv ${cancelCmdPath} ${originalPath}`, (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error moving module back: ${error.message}`);
                  return;
                }
                console.log(`Module '${moduleName}' moved back to the original path.`);
              });
            }
          }
        }
        break;

      default:
        api.sendMessage(
          "Invalid action. Use: module launch [module_name] | module unlaunch [module_name] | module launchAll",
          event.threadID,
          event.messageID
        );
        return;
    }

    const loadedMessage = loadedCommands.length
      ? `${loadedCommands.length} modules loaded: ${loadedCommands.join(', ')}`
      : "No modules loaded.";

    const failedMessage = failedCommands.length
      ? `Failed to load modules: ${failedCommands.join(', ')}`
      : "";

    api.sendMessage(
      `${loadedMessage}\n${failedMessage}`,
      event.threadID,
      event.messageID
    );
  }
};
