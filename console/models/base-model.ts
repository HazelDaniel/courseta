import chalk from "chalk";

export abstract class BaseModel<T> {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  abstract save(): T;

  abstract search(email: string | null): Promise<object> | null;

  abstract get all(): Promise<object[]> | never[];

  show() {
    console.log(`${chalk.bgCyanBright("MODEL:")} {${this.valueOf()}}`);
  }
}
