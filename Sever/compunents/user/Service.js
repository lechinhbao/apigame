
// kiem tra mail va pass trong database
// neu co tra ve user
// new khong co tra ve null

const { User } = require('../Model');
const bcrypt = require('bcrypt');


const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Mật khẩu đúng, đăng nhập thành công
        return user;
      }
    }
    // Email hoặc mật khẩu không đúng
    return null;
  } catch (error) {
    console.error('User service login error', error);
    throw error; // Nếu có lỗi, ném lỗi để xử lý ở middleware xử lý lỗi
  }
};


const loginAdmin = async (email, password) => {
  try {
    // Kiểm tra email và mật khẩu
    const user = await User.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Kiểm tra vai trò
        if (user.roll === 1) {
          // Vai trò là 1, đăng nhập thành công
          return user;
        } else {
          // Vai trò không phù hợp
          return { success: false, code: 'INVALID_ROLE', message: 'Vai trò không phù hợp' };
        }
      }
    }

    // Email hoặc mật khẩu không đúng
    return { success: false, code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' };
  } catch (error) {
    console.error('User service login error', error);
    return { success: false, code: 'LOGIN_ERROR', message: 'Đã có lỗi xảy ra trong quá trình đăng nhập' };
  }
};


const register = async (email, name, password, roll,key) => {
  try {
    // Kiểm tra email
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      console.log('Email đã tồn tại:', email);
      return { success: false, code: 'EMAIL_EXISTS', message: 'Email đã tồn tại' };
    }

    // Kiểm tra tên người dùng
    const userWithName = await User.findOne({ name });
    if (userWithName) {
      console.log('Tên người dùng đã tồn tại:', name);
      return { success: false, code: 'USERNAME_EXISTS', message: "Tên người dùng đã tồn tại" };
    }

    // Kiểm tra mật khẩu
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return { success: false, code: 'INVALID_PASSWORD', message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số" };
    }

    // Thực hiện đăng ký
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Thêm các kiểm tra khác nếu cần thiết cho tên người dùng

    // Gán giá trị roll theo mong muốn (ví dụ, 0)
    const newUser = new User({ email, name, password: hash, roll: roll || 0, key: key });
    await newUser.save();
    console.log('Đăng ký thành công:', email);
    return { success: true, code: 'REGISTER_SUCCESS', message: 'Đăng ký thành công' };
  } catch (error) {
    console.error('User service register error', error);
    return { success: false, code: 'REGISTER_ERROR', message: 'Đã có lỗi xảy ra trong quá trình đăng ký' };
  }
};



const changePassword = async (id, oldPassword, newPassword) => {
  try {
    const user = await User.findById(id);
    if (user) {
      // Kiểm tra xác thực mật khẩu cũ
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return 2; // Mật khẩu cũ không đúng
      }
      // Mã hóa mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10); // 10 là số vòng lặp mã hóa
      // Lưu mật khẩu mới vào cơ sở dữ liệu
      user.password = hashedNewPassword;
      await user.save();
      return 1; // Thành công
    }
    return 0;
  } catch (error) {
    console.error('User service changePassword error', error);
    throw error;
  }
};



const addotp = async (id, otp) => {
  try {
    let user = await User.findById(id);
    if (user) {
      user.otp = otp ? otp : user.otp;
      await user.save();
      return true;
    }
  } catch (error) {
    console.log("user otp error", error);
  }
  return false;
};

const sendotp = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      return user;
    }
    return false;
  } catch (error) {
    console.log("user sendotp error", error);
  }
  return [];
};



const resetPassword = async (email, newPassword, otp) => {
  try {
    const user = await User.findOne({ email });

    if (user) {
      console.log('User OTP:', user.otp);
      console.log('Input OTP:', otp);
      // Kiểm tra mã OTP
      if (user.otp == otp) {
        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // 10 là số vòng lặp mã hóa
        // Lưu mật khẩu mới vào cơ sở dữ liệu
        user.password = hashedNewPassword;
        await user.save();
        return true; // Thành công
        
      }
      return false; // Mã OTP không đúng
    }

  } catch (error) {
    console.log("Reset password error", error);
    throw error;
  }
  return false;
};


// Trong file userService.js

// const isEmailRegistered = async (email) => {
//   try {
//       const user = await User.findOne({ email });
//       return !!user; // Trả về true nếu email đã được đăng ký, ngược lại là false
//   } catch (error) {
//       console.error('Error checking email registration:', error);
//       return false;
//   }
// }

module.exports = { login, register, changePassword, addotp, sendotp, resetPassword, loginAdmin };


