import chalk from "chalk";

export class ConsoleLogger {
  constructor(
    public readonly status: "fail" | "success" | "info" | "error",
    public readonly message: string
  ) {
    if (this.status === "fail")
      console.log(chalk.redBright(`(FAIL): ${this.message}`));
    else if (this.status === "success")
      console.log(chalk.greenBright(`(SUCCESS): ${this.message}`));
    else if (this.status === "info") console.log(chalk.white(`(INFO): ${this.message}`));
    else if (this.status === "error")
      console.log(chalk.bgRedBright(`(ERR): ${this.message}`));
  }

}
