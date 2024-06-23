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
  handleCourseEnroll,
  handleCourseReview,
  handleCourseUnenroll,
  handleCreateCourse,
  handleCreateUser,
  handleListCourses,
  handleListStudentCourses,
  handleListStudents,
  handleViewCourse,
  handleUserInfoUpdate
} from "./option-handlers.js";
import { AuthPosition } from "./option-handlers.js";
import { ConsoleLogger } from "./utils.js";
import { ConsoleRootOptionType } from "./types";
import { pool } from "./db.js";

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

const RootOptions: ConsoleRootOptionType[] = [
  { id: 1, shortcut: "q", description: "quit" },
  { id: 2, shortcut: "cc", description: "create course" },
  { id: 3, shortcut: "cu", description: "create user" },
  { id: 4, shortcut: "rc", description: "review course" },
  { id: 5, shortcut: "lc", description: "list courses" },
  { id: 6, shortcut: "ls", description: "list students" },
  { id: 12, shortcut: "lmc", description: "list my courses" },
  { id: 15, shortcut: "a", description: "authenticate user" },
  { id: 16, shortcut: "vc", description: "view course" },
  { id: 8, shortcut: "ec", description: "enroll course" },
  { id: 9, shortcut: "uc", description: "unenroll course" },
  { id: 10, shortcut: "uui", description: "update user info" },
  { id: 11, shortcut: "aa", description: "attempt assessment" },
  { id: 13, shortcut: "vrc", description: "view recommended courses" },
  { id: 14, shortcut: "vruc", description: "view last unfinished course" },
  { id: 7, shortcut: "lcr", description: "list creators" },
  { id: 17, shortcut: "dc", description: "delete course" },
];

const parseOptionListToString = (options: ConsoleRootOptionType[]) => {
  const tileRatio = process.stdout.columns / 150;
  const columnNumber = Math.round(tileRatio * 2.5);

  const columnSize = Math.round(process.stdout.columns / 3.5);

  return (
    "\n" +
    options.reduce((acc, curr, i) => {
      acc +=
        `${i % columnNumber === 0 && !!i ? "\n" : !!i ? "\t" : ""}` +
        `${curr.id}. '${curr.shortcut}' ->  ${curr.description}`.padEnd(
          tileRatio * columnSize,
          " "
        );
      return acc;
    }, "") +
    "\n"
  );
};

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
        message: `OPTIONS:\n${parseOptionListToString(
          RootOptions
        )}\ninput your choice:`,
        when: true,
      },
    ]);

    let { response } = answers;
    response = response?.trim();

    switch (response) {
      case "q":
      case "1":
        console.log(chalk.yellowBright("INFO: "), "exiting the application...");
        await pool.end();
        process.exit();
      case "cc":
      case "2":
        await handleCreateCourse(AUTH_STATE, "require-creator");
        break;
      case "cu":
      case "3":
        await handleCreateUser(AUTH_STATE, "require-admin");
        break;
      case "rc":
      case "4":
        await handleCourseReview(AUTH_STATE, "require-student");
        break;
      case "lc":
      case "5":
        await handleListCourses(AUTH_STATE, "none");
        break;
      case "ls":
      case "6":
        await handleListStudents(AUTH_STATE, "none");
        break;
      case "ec":
      case "8":
        await handleCourseEnroll(AUTH_STATE, "require-student");
        break;
      case "uc":
      case "9":
        await handleCourseUnenroll(AUTH_STATE, "require-student");
        break;
      case "uui":
      case "10":
        await handleUserInfoUpdate(AUTH_STATE, "require-user");
        break;
      case "lmc":
      case "12":
        await handleListStudentCourses(AUTH_STATE, "require-student");
        break;
      case "a":
      case "15":
        await handleAuthenticateUser(AUTH_STATE, "none");
        break;
      case "vc":
      case "16":
        await handleViewCourse(AUTH_STATE, "none");
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
