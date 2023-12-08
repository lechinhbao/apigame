
// kiem tra mail va pass trong database
// neu co tra ve user
// new khong co tra ve null

const { User } = require('../Model');
const bcrypt = require('bcrypt');

// const login = async(email,password)=>{
//     try{
//         const user = await User.findOne({email});
//        if(user){
//          if( user.password == password){
//             return user;
//         }
//        }
//         return false;

//     }catch(error){
//         console.log('User service login error',error);
//     }
//     return false;
// }

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


const register = async (email, name, password) => {
  try {
    // Kiểm tra email
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      console.log('Email đã tồn tại:', email);
      return { success: false, message: 'Email đã tồn tại' };
    }
    // Kiểm tra tên người dùng
    const userWithName = await User.findOne({ name });
    if (userWithName) {
      console.log('Tên người dùng đã tồn tại:', name);
      return { success: false, message: "Tên người dùng đã tồn tại" };
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return { success: false, message: "mat khau phai co du 8 ki tu co chu va so " };
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    // Nếu không có email hoặc tên người dùng trùng lặp, thực hiện đăng ký
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    console.log('Đăng ký thành công:', email);
    return { success: true, message: 'Đăng ký thành công' };
  } catch (error) {
    console.error('User service register error', error);
    return { success: false, message: 'Đã có lỗi xảy ra trong quá trình đăng ký' };
  }
};






// const changePassword = async (id, password, newpass) => {
//   try {
//     const user = await User.findById(id);
//     if (user) {
//       if (user.password == password) {
//         user.password = newpass;
//         await user.save();
//         return 1;
//       }
//       return 2;
//     }
//     return 0;
//   } catch (error) {
//     console.log('User service changePassword error', error);
//   }
//   return 0;
// }

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


// const resetPassword = async (email, password, otp) => {
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       if (user.otp == otp) {
//         user.password = password ? password : user.password;
//         await user.save();
//         return true;
//       }
//       return false;
//     }

//   } catch (error) {
//     console.log("user sendotp error", error);
//   }
//   return [];
// };

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



module.exports = { login, register, changePassword, addotp, sendotp, resetPassword };

