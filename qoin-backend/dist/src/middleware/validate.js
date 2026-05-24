"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema, source = "body") {
    return (req, res, next) => {
        const data = req[source];
        const result = schema.safeParse(data);
        if (!result.success) {
            const error = result.error;
            const errors = error.issues.map((i) => ({
                path: i.path.join("."),
                message: i.message,
            }));
            return res.status(400).json({
                status: "error",
                message: "Validation error",
                errors,
            });
        }
        req[source] = result.data;
        next();
    };
}
