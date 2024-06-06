#!/usr/bin/env node

import inquirer from "inquirer";
import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";

const program = new Command();

program
  .name("my-app")
  .version("1.0.0")
  .description("A console application with user interaction")
  .option("-u, --user <username>", "E.g octoMan")
  .option("-p, --password <password>", "Password (optional, not displayed)")
  .option("-q, --quit", "Exit the console");

async function promptAndProcess(options: any) {
  // Check if user provided username or password options
  let runCount = 0;

  while (!options.quit) {
    console.log(figlet.textSync("COURSETA", "3D-ASCII"));
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "response",
        message:
          "OPTIONS: \n1. 'q' => quit\n2. 'a' => authenticate user\n\n  input your choice:",
        when: true,
      },
    ]);

    let { response } = answers;
    response = response?.trim();

    switch (response) {
      case "q":
        console.log(chalk.yellowBright("INFO: "), "exiting the application...");
        return;
    }

    if (runCount === 0) {
      if (!options.user || !options.password) {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "username",
            message: "Enter username (if not provided as a flag):",
            when: !options.user,
          },
          {
            type: "password",
            name: "password",
            message: "Enter password (if not provided as a flag):",
            when: !options.password,
          },
        ]);

        options.username = options.user || answers.username;
        options.password = options.password || answers.password;
      }
      console.log(`Hello, ${options.username}`);
      console.log(`your password is: ${chalk.red(options.password)}`);
    }

    runCount++;
  }

  // console.log(`Hello, ${options.username}!`);
  // ... Use options.username and options.password for further logic
}
program
  .action(async (options) => {
    promptAndProcess(options);
  })
  .parse(process.argv);
