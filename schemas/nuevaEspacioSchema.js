const Joi = require('joi');

const newEntrySchema = Joi.object().keys({
    place: Joi.string()
        .required()
        .min(3)
        .max(50)
        .alphanum()
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            )
                return new Error('Se requiere un lugar');

            return new Error(
                'El lugar debe tener entre 3 y 50 caracteres. Solo puede contener letras y números.'
            );
        }),

    description: Joi.string()
        .max(500)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere una descripción');

                case 'string.empty':
                    return new Error('Se requiere una descripción');

                default:
                    return new Error(
                        'La descripción debe ser inferior a 500 caracteres'
                    );
            }
        }),
});

module.exports = newEntrySchema;
