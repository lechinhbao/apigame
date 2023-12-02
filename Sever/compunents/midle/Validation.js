// bắt lỗi
// bắt lỗi đăng kí 
const checkRegister = (req, res, next) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        return res.status(400).json({ success: false, message: 'Mật khẩu không đúng định dạng' });
    }
    return next();
}
module.exports = { checkRegister };