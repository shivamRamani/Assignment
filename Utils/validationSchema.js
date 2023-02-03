import Joi from "joi";

const userSchema = Joi.object({

    userName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    emailId: Joi.string()
        .email()
        .lowercase()
        .required(),
    password: Joi.string()
        .min(3)
        .max(30)
        .required(),
    confirmPassword: Joi.ref("password"),
    verified: Joi.boolean()
        .default(false)

});

const postSchema = Joi.object({

    creatorName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    postData: Joi.string()
        .required(),
    creatorId: Joi.string()
        .required()

});

export { userSchema,postSchema };

