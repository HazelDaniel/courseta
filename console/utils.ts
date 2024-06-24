import chalk from "chalk";

export class ConsoleLogger {
  tileWidth = process.stdout.columns;
  indentation: number =
    this.tileWidth >= 150 ? 8 : this.tileWidth >= 80 ? 5 : 1;
  indentString: string = "\t".repeat(this.indentation);

  constructor(
    public readonly status: "fail" | "success" | "info" | "error",
    public readonly message: string
  ) {
    console.log("_".repeat(this.tileWidth));
    if (this.status === "fail")
      console.log(
        this.indentString,
        chalk.redBright(`(FAIL): ${this.message}`)
      );
    else if ((this.indentString, this.status === "success"))
      console.log(
        this.indentString,
        chalk.greenBright(`(SUCCESS): ${this.message}`)
      );
    else if ((this.indentString, this.status === "info"))
      console.log(this.indentString, chalk.white(`(INFO): ${this.message}`));
    else if (this.status === "error")
      console.log(
        this.indentString,
        chalk.bgRedBright(`(ERR): ${this.message}`)
      );
    console.log("_".repeat(this.tileWidth));
  }
}

export class BoardDisplay {
  static level1Nest = "\t\t";
  static level2Nest = "\t\t\t\t";
  static level3Nest = "\t\t\t\t\t\t\t\t";
  static level4Nest = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
  static level5Nest =
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
  static frameChar = "<>";

  static border = "|";
  static marginDecoratorCount = 35;
}
