import { ServerError } from "../../../utils.js";
export const ErrorBoundary = (err, req, res, next) => {
    if (err instanceof ServerError)
        return res.status(err.code).json({ message: err.message });
    res.status(500).json({ message: `internal server error: ${err.message}` });
};
