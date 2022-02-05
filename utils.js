const exec = require("child_process").exec;
const promisify = require("util").promisify;
const { readFileSync, writeFileSync } = require("fs");

const readJson = (fn) => JSON.parse(readFileSync(fn, { encoding: "utf-8" }));
const writeJson = (fn, obj) => writeFileSync(fn, JSON.stringify(obj, null, 4))

const execAsync = promisify(exec);

const createArchive = async (output_dir, filename) => {
    return await execAsync(`tar -czf "${filename}" ${output_dir}`);
};

const getBuildCommands = (website, command_type) => {
    const { commands, repo } = website;
    const all_commands = [
        `git clone --depth=1 https://github.com/${repo}`,
        `cd ${repo.split("/")[1]}`,
        ...commands
    ];
    if (command_type == "cli") {
        return all_commands.reduce((a, b) => a + " && " + b);
    } else if (command_type == "multi_line") {
        return all_commands.reduce((a, b) => a + "\n" + b);
    } else {
        return all_commands
    }
}

module.exports = {
    execAsync,
    readJson,
    writeJson,
    getBuildCommands,
    createArchive
}
