import chalk from "chalk";
import { BoardDisplay, ConsoleLogger } from "../utils.js";

export abstract class BaseModel<T> {
  abstract save(): T;

  abstract search(email: string | null): Promise<object> | null;

  static async displayAll(
    fn: Promise<object[]>,
    {
      errorMessage,
      headerMessage,
    }: { errorMessage: string; headerMessage: string }
  ) {
    const { level2Nest, border, marginDecoratorCount, frameChar } =
      BoardDisplay;
    try {
      const resEntries = fn;
      const allEntries = await resEntries;
      console.log(chalk.yellow(`${headerMessage}\n`));
      console.log(chalk.green(frameChar.repeat(marginDecoratorCount / 2)));

      allEntries.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          console.log(border, level2Nest, key, " ->", " ", entry[key]);
        });

        console.log(chalk.green(frameChar.repeat(marginDecoratorCount / 2)));
      });

      console.log("\n");
    } catch (err) {
      new ConsoleLogger("error", `${errorMessage}, ${err}`);
    }
  }
  abstract get all(): Promise<object[]> | never[];

  show() {
    console.log(`${chalk.bgCyanBright("MODEL:")} {${this.valueOf()}}`);
  }
}
