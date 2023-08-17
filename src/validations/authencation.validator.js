const Joi = require('joi')


class validator {
    registValitdation(data) {
        const schema = Joi.object({
            username: Joi.string().min(6).required(),
            // ngaysinh: Joi.date().iso().required(),
            fullname: Joi.string().min(6).required(),
            email: Joi.string().min(15).email().required(),
            address: Joi.string().min(6),
            mobile: Joi.string().length(10).pattern(/^[0-9]+$/),
            password: Joi.string().min(3).required(),
            re_password: Joi.ref('password'),
            gender: Joi.string().min(3).required(),
            otp: Joi.string().length(6).pattern(/^[0-9]+$/),
        })
        return schema.validate(data)
    }
    loginValitdation(data) {
        const schema = Joi.object({
            email: Joi.string().min(5).required(),
            password: Joi.string().min(3).required(),
        })
        return schema.validate(data)
    }
    sendOTPValidation(data) {
        const schema = Joi.object({
            email: Joi.string().min(15).email().required(),
        })
        return schema.validate(data)
    }
    editUserValitdation(data) {
        const schema = Joi.object({
            tennguoidung: Joi.string().min(6).required(),
            ngaysinh: Joi.date().iso().required(),
            gioitinh: Joi.string().min(2).required(),
            // diachi: Joi.string().min(6).required(),
            sdt: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        })
        return schema.validate(data)
    }
    forgotPasswordValitdation(data) {

        const schema = Joi.object({
            email: Joi.string().min(15).email().required(),
            password: Joi.string().min(3).required(),
            re_password: Joi.ref('password'),
            otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
        })

        return schema.validate(data)
    }
    editPasswordValitdation(data) {

        const schema = Joi.object({
            password: Joi.string().min(3).required(),
            new_password: Joi.string().min(3).required(),
            repeat_password: Joi.ref('new_password')
        })

        return schema.validate(data)
    }

}

module.exports = new validator