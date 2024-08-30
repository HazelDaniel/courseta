var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from "../../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import { randomUUID } from "crypto";
export class AdminModel extends BaseModel {
    constructor(email, password) {
        super();
        this.email = email;
        this.password = password;
        this.adminID = null;
    }
    static get all() {
        const fetchAllAdmins = () => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_all_admins",
                    text: "SELECT SELECT admins.admin_id, admins.email, admins.password FROM admins",
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resAdmins = rows.map((el) => {
                    const { admin_id, email, password } = el;
                    return {
                        adminID: admin_id,
                        email,
                        password,
                    };
                });
                return resAdmins;
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch admins!. reason: ${err}`);
                throw err;
            }
            finally {
                client.release();
            }
        });
        return fetchAllAdmins();
    }
    static isSuperUser(adminID) {
        const fetchAdminStatus = () => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "is_admin_superuser",
                    text: "SELECT * FROM is_admin_superuser($1)",
                    values: [adminID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const { is_superuser: isSuperUser } = rows[0];
                return { isSuperUser };
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch admin status!. reason: ${err}`);
                throw err;
            }
            finally {
                client.release();
            }
        });
        return fetchAdminStatus();
    }
    static search(adminEmail) {
        const fetchAdmin = () => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_current_admin",
                    text: "SELECT * FROM get_current_admin($1)",
                    values: [adminEmail],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resAdmins = rows.map((el) => {
                    const { admin_id, email, password } = el;
                    return {
                        adminID: admin_id,
                        email,
                        password,
                    };
                })[0];
                return resAdmins;
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch admin!. reason: ${err}`);
                throw err;
            }
            finally {
                client.release();
            }
        });
        return fetchAdmin();
    }
    search(adminEmail) {
        try {
            return AdminModel.search(adminEmail);
        }
        catch (err) {
            return null;
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "set_new_admin",
                    text: "SELECT admin_id FROM set_new_admin($1, $2, $3)",
                    values: [this.email, this.password, randomUUID()],
                };
                const res = yield client.query(query);
                const { rows } = res;
                this.adminID = rows[0][0];
                this.show();
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not create admin!. reason: ${err}`);
                throw err;
            }
            finally {
                client.release();
            }
        });
    }
    get all() {
        try {
            return AdminModel.all;
        }
        catch (err) {
            return [];
        }
    }
}
