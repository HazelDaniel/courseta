var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import { BoardDisplay, ConsoleLogger } from "../../utils.js";
export class BaseModel {
    static displayAll(fn_1, _a) {
        return __awaiter(this, arguments, void 0, function* (fn, { errorMessage, headerMessage, }) {
            const { level2Nest, border, marginDecoratorCount, frameChar } = BoardDisplay;
            try {
                const resEntries = fn;
                const allEntries = yield resEntries;
                console.log(chalk.yellow(`${headerMessage}\n`));
                console.log(chalk.green(frameChar.repeat(marginDecoratorCount / 2)));
                allEntries.forEach((entry) => {
                    Object.keys(entry).forEach((key) => {
                        console.log(border, level2Nest, key, " ->", " ", entry[key]);
                    });
                    console.log(chalk.green(frameChar.repeat(marginDecoratorCount / 2)));
                });
                console.log("\n");
            }
            catch (err) {
                new ConsoleLogger("error", `${errorMessage}, ${err}`);
            }
        });
    }
    show() {
        console.log(`${chalk.bgCyanBright("MODEL:")} {${this.valueOf()}}`);
    }
}
