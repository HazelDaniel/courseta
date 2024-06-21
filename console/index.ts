#!/usr/bin/env node

import { config } from "dotenv";
config({ path: [".env", ".env.dev"] });

import inquirer from "inquirer";
import { Command } from "commander";
import { AdminModel } from "./models/admin.model.js";

import chalk from "chalk";
import figlet from "figlet";
import type { AuthStateType } from "./types";

export enum AuthPosition {
  ADMIN_AUTH,
  USER_AUTH,
}

const program = new Command();

program
  .name("courseta (console)")
  .version("1.0.0")
  .description("A console application for the courseta project")
  .option("-e, --email <email>", "E.g octoman@mail.com")
  .option("-p, --password <password>", "Password (optional, not displayed)")
  .option("-q, --quit", "Exit the console");

async function promptAndProcess(options: any) {
  let runCount = 0;
  const ADMIN_AUTH_STATUS = false;
  const USER_AUTH_STATUS = false;
  const AUTH_STATE: AuthStateType = {
    subject: null,
    status: [ADMIN_AUTH_STATUS, USER_AUTH_STATUS],
  };

  while (!options.quit) {
    console.log(figlet.textSync("COURSETA", "3D-ASCII"));

    if (options.email && options.password) {
      const res = await AdminModel.search(options.email);
      if (res) {
        if (res.password === options.password) {
          AUTH_STATE.status[AuthPosition.ADMIN_AUTH] = true;
        }
      }
    }
    // validation of the non-interactively provided credentials should go here, and then the auth status (of the admin) should be set based on that
    // options.username = options.user || answers.username; // this is for when the details are passed in  non-interactively
    // options.password = options.password || answers.password; // make sure to do proper validation and quit if not valid credentials

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "response",
        message:
          "OPTIONS: \n\
          1. 'q' => quit\n\
          2. 'cc' => create course\n\
          3. 'cu' => create user\n\
          4. 'cr' => create review\n\
          5. 'lc' => list courses\n\
          6. 'ls' => list students\n\
          7. 'lcr' => list creators\n\
          8. 'es' => enroll student\n\
          9. 'us' => unenroll student\n\
          10. 'uui' => update user info\n\
          12. 'aa' => attempt assessment\n\
          13. 'lmc' => list my courses\n\
          14. 'vrc' => view recommended courses\n\
          15. 'vruc' => view recent unfinished courses\n\
          n. 'a' => authenticate user\n\
          \ninput your choice:",
        when: true,
      },
    ]);

    let { response } = answers;
    response = response?.trim();

    const isAuth =
      AUTH_STATE.subject || AUTH_STATE.status[AuthPosition.ADMIN_AUTH];

    switch (response) {
      case "q":
        console.log(chalk.yellowBright("INFO: "), "exiting the application...");
        process.exit();
      case "a":
        if (isAuth) {
          console.log("already authenticated");
          break;
        }

        if (!options.user || !options.password || !isAuth) {
          const answers = await inquirer.prompt([
            {
              type: "input",
              name: "username",
              message: "Enter username :",
              when: !isAuth,
            },
            {
              type: "password",
              name: "password",
              message: "Enter password :",
              when: !isAuth,
            },
          ]);

          options.username = answers.username;
          options.password = answers.password;
        }

        console.log(`Hello, ${options.username}`);
        console.log(`your password is: ${chalk.red(options.password)}`);

        runCount++;
        break;
    }
  }
}

const main = () => {
  program
    .action(async (options) => {
      promptAndProcess(options);
    })
    .parse(process.argv)
    .opts();
};

main(); //driver code for the console
