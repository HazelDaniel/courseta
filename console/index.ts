#!/usr/bin/env node
import { AuthStateType } from "./../server/types.d";

import { config } from "dotenv";
config({ path: [".env", ".env.dev"] });

import inquirer from "inquirer";
import { Command } from "commander";
import { AdminModel } from "./models/admin.model.js";

import chalk from "chalk";
import figlet from "figlet";
import {
  handleAuthenticateUser,
  handleCreateCourse,
  handleCreateUser,
  handleViewCourse,
} from "./option-handlers.js";
import { AuthPosition } from "./option-handlers.js";
import { ConsoleLogger } from "./utils.js";

const program = new Command();

function renderAuthEntity(AUTH_STATE: AuthStateType) {
  let isAuth =
    !!AUTH_STATE.subject || AUTH_STATE.status[AuthPosition.ADMIN_AUTH];
  if (!isAuth) {
    console.log("\n", "\t\t\t\t", chalk.dim("(NOT-AUTHENTICATED)"), "\n");
    return;
  }
  console.log("\n");
  if (AUTH_STATE.subject && AUTH_STATE.status[AuthPosition.CREATOR_AUTH]) {
    if (AUTH_STATE.status[AuthPosition.ADMIN_AUTH])
      console.log("\t\t\t\t", chalk.magentaBright("(ADMIN [+] CREATOR)"), "\n");
    else console.log("\t\t\t\t", chalk.yellowBright("(CREATOR)"), "\n");
  } else if (
    AUTH_STATE.subject &&
    AUTH_STATE.status[AuthPosition.STUDENT_AUTH]
  ) {
    if (AUTH_STATE.status[AuthPosition.ADMIN_AUTH])
      console.log("\t\t\t\t", chalk.ansi256(151)("(ADMIN [+] STUDENT)"), "\n");
    else console.log("\t\t\t\t", chalk.blueBright("(STUDENT)"), "\n");
  } else {
    console.log("\t\t\t\t", chalk.cyanBright("(ADMIN)"), "\n");
  }
}

program
  .name("courseta (console)")
  .version("1.0.0")
  .description("A console application for the courseta project")
  .option("-e, --email <email>", "E.g octoman@mail.com")
  .option("-p, --password <password>", "Password (optional, not displayed)")
  .option("-i, --identifier <identifier>", "Admin ID (optional, not displayed)")
  .option("-q, --quit", "Exit the console");

async function promptAndProcess(options: any) {
  let runCount = 0;
  const ADMIN_AUTH_STATUS = false;
  const CREATOR_AUTH_STATUS = false;
  const STUDENT_AUTH_STATUS = false;
  const AUTH_STATE: AuthStateType = {
    subject: null,
    adminSubject: null,
    status: [ADMIN_AUTH_STATUS, CREATOR_AUTH_STATUS, STUDENT_AUTH_STATUS],
  };

  while (!options.quit) {
    console.log(figlet.textSync("COURSETA", "Banner3-D"));

    if (options.email && options.password && options.identifier) {
      const res = await AdminModel.search(options.email);
      if (res) {
        if (res.password === options.password) {
          AUTH_STATE.status[AuthPosition.ADMIN_AUTH] = true;
          AUTH_STATE.adminSubject = options.identifier;
          if (!runCount)
            console.log(
              chalk.green("SUCCESS: "),
              "admin authenticated successfully!"
            );
        }
      }
    }

    renderAuthEntity(AUTH_STATE);

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
          16. 'a' => authenticate user\n\
          17. 'vc' => view course\n\
          \ninput your choice:",
        when: true,
      },
    ]);

    let { response } = answers;
    response = response?.trim();

    switch (response) {
      case "q":
      case "1":
        console.log(chalk.yellowBright("INFO: "), "exiting the application...");
        process.exit();
      case "a":
      case "16":
        if (!!AUTH_STATE.subject) {
          new ConsoleLogger("info", "already authenticated"); // if an explicit user auth has already been performed
          break;
        }
        await handleAuthenticateUser(AUTH_STATE, "none");
        break;
      case "cc":
      case "2":
        await handleCreateCourse(AUTH_STATE, "require-creator");
        break;
      case "vc":
      case "17":
        await handleViewCourse(AUTH_STATE, "none");
        break;
      case "cu":
      case "3":
        await handleCreateUser(AUTH_STATE, "require-admin");
        break;
      default:
        new ConsoleLogger("info", "no valid option picked");
    }

    runCount++;
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
