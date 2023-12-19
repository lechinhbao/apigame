const userService = require('./Service');
const mailer = require('nodemailer');

const login = async (email, password) => {
    try {
        return await userService.login(email, password);
    } catch (error) {
        throw error;
    }
}

const loginAdmin = async (email, password, roll) => {
    try {
        return await userService.loginAdmin(email, password, roll);
    } catch (error) {
        throw error;
    }
}


const register = async (email, name, password) => {
    try {
        return await userService.register(email, name, password);
    } catch (error) {
        throw error;
    }
}

const changePassword = async (id, password, newpass) => {
    try {
        return await userService.changePassword(id, password, newpass);
    } catch (error) {
        throw error;
    }
}

const addotp = async (id,otp) => {
    try {
        return await userService.addotp(id,otp);
    } catch (error) {
        throw error;
    }
}

const sendotp = async (email) => {
    try {
        return await userService.sendotp(email);
    } catch (error) {
        throw error;
    }
}

const resetPassword = async (email, password, otp) => {
    try {
        return await userService.resetPassword(email, password, otp);
    } catch (error) {
        throw error;
    }
}

const transporter = mailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'baolcps21320@fpt.edu.vn',
        pass: 'e j g r g z r r h f e d f u a i'
    },

});

const sendMail = async (to, subject, content) => {
    try {
        const mailOptions = {
            from: 'Knights-Adventure <baolcps21320@fpt.edu.vn>',
            to,
            subject,
            html: content
        }
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log('User controler sendMail error:',error);
    }
    return false;
}

// const support = async (to, subject, content) => {
//     try {
//         // Kiểm tra xem email đã được đăng ký hay chưa
//         const isEmailRegistered = await userService.isEmailRegistered(to);
//         if (!isEmailRegistered) {
//             console.log('Email chưa được đăng ký trong hệ thống.');
//             return false;
//         }
//         // Gửi email nếu email đã được đăng ký
//         const mailOptions = {
//             from: 'Knights-Adventure <baolcps21320@fpt.edu.vn>',
//             to: 'baolcps21320@fpt.edu.vn',
//             subject,
//             html: content
//         }
//         await transporter.sendMail(mailOptions);
//         return true;
//     } catch (error) {
//         console.log('User controller sendMail error:', error);
//         return false;
//     }
// }




module.exports = { login, register, changePassword, sendMail,addotp,sendotp,resetPassword,loginAdmin};