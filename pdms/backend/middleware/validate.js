const { validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
        }));

        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: extractedErrors,
        });
    };
};

module.exports = validate;
