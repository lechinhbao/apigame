
// kiem tra mail va pass trong database
// neu co tra ve user
// new khong co tra ve null

const {User} = require('../Model');

const login = async(email,password)=>{
    try{
        const user = await User.findOne({email});
       if(user){
         if( user.password == password){
            return user;
        }
       }
        return false;

    }catch(error){
        console.log('User service login error',error);
    }
    return false;
}


// const register = async(email,name,password)=>{
//     try{
//         const user = await User.findOne({email});
//         console.log("User service register",user);
//         if(user){
//             return false;
//         }
//         const newUser = new User({email,name,password});
//         await newUser.save();
//         return true;
//     }catch(error){
//         console.log('User service register error',error);
//     }
//     return false;
// }







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

      if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        return { success: false, message: "mat khau phai co du 8 ki tu co chu va so " };
        
      }
  
      // Nếu không có email hoặc tên người dùng trùng lặp, thực hiện đăng ký
      const newUser = new User({ email, name, password });
      await newUser.save();
  
      console.log('Đăng ký thành công:', email);
      return { success: true, message: 'Đăng ký thành công' };
    } catch (error) {
      console.error('User service register error', error);
      return { success: false, message: 'Đã có lỗi xảy ra trong quá trình đăng ký' };
    }
  };






const changePassword = async(id,password, newpass)=>{
    try{
        const user = await User.findById(id);
        if(user){
            if(user.password == password){
                user.password = newpass;
                await user.save();
                return 1;
            }
            return 2;
        }
        return 0;
    }catch(error){
        console.log('User service changePassword error',error);
    }
    return 0;
}

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


const resetPassword = async (email, password, otp) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (user.otp == otp) {
        user.password = password ? password : user.password;
        await user.save();
        return true;
      }
      return false;
    }

  } catch (error) {
    console.log("user sendotp error", error);
  }
  return [];
};


module.exports = {login,register,changePassword,addotp,sendotp,resetPassword};

