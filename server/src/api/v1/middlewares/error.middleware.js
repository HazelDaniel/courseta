import { ServerError } from "../../../utils.js";
import v1Config from "../config.js";
export const ErrorBoundary = (err, req, res, next) => {
    if (v1Config.serverOptions.debugMode)
        console.error(err);
    if (err instanceof ServerError)
        return res.status(err.code).json({ message: err.message });
    res.status(500).json({ message: err.message || `internal server error` });
};
