const { User } = require('../Model');
const bcrypt = require('bcrypt');

const getAllRank = async () => {
  try {
    return await User.find().populate("id").sort({ "diem": -1 }).limit(5);
  } catch (error) {
    console.log(error);
  }
  return [];
}


const getAllUsers = async () => {
  try {
    const users = await User.find(); // Lấy tất cả người dùng, không cần đối số
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};


// xoa san pham theo id

const deleteProductByID = async (id) => {
  try {
    await User.findByIdAndDelete(id)
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}



const addProduct = async (id, name, man, diem, coin, roll) => {
  try {
    let newRank = await User.findById(id);
    console.log(">>>>>>>>>>>>", newRank);

    if (newRank) {
      // Kiểm tra xem tên mới có trùng với tên hiện tại không
      if (name && name !== newRank.name) {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
          console.log('Tên đã tồn tại');
          return false; // Trả về false nếu tên đã tồn tại
        }
      }

      // Cập nhật thông tin nếu không có vấn đề với tên
      newRank.name = name ? name : newRank.name;
      newRank.man = man ? man : newRank.man;
      newRank.diem = diem ? diem : newRank.diem;
      newRank.coin = coin ? coin : newRank.coin;
      newRank.roll = roll ? roll : newRank.roll;

      // Kiểm tra xem có thay đổi không trước khi save
      if (newRank.isModified()) {
        await newRank.save();
        return true; // Trả về true nếu thành công
      } else {
        console.log('Không có thay đổi để lưu.');
        return false;
      }
    } else {
      console.log('Bản ghi không tồn tại');
      return false;
    }
  } catch (error) {
    console.log('Add product error:', error);
    return false;
  }
};


const addnewProduct = async (email, password, name, man, diem, coin, roll) => {
  try {
    // Kiểm tra mật khẩu
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      console.log('Mật khẩu không đáp ứng yêu cầu.');
      return { success: false, message: 'Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ và một số.' };
    }

    // Kiểm tra trùng lặp email hoặc name trong cơ sở dữ liệu
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });

    if (existingUser) {
      // Nếu tồn tại người dùng với email hoặc name trùng
      console.log('Email hoặc Name đã tồn tại trong hệ thống.');
      return { success: false, message: 'Email hoặc Name đã tồn tại trong hệ thống.' };
    }

    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Nếu không có trùng lặp và mật khẩu đáp ứng yêu cầu, thêm mới người dùng
    const newUser = new User({
      email, password: hashedPassword, name, man, diem, coin, roll
    });

    await newUser.save();
    return { success: true, message: 'Thêm mới người chơi thành công.' };
  } catch (error) {
    console.log('Add product error:', error);
    return { success: false, message: 'Đã xảy ra lỗi khi thêm mới người chơi.' };
  }
}





const Changname = async (id, name) => {
  try {
    let newRank = await User.findById(id);
    if (newRank) {
      newRank.name = name ? name : newRank.name;
      await newRank.save();
      return true;
    } else {
      console.log('Bản ghi không tồn tại');
      return false;
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật tên:', error);
    return false;
  }
};



const Savepoint = async (name, diem, coin, X, Y, Z) => {
  try {
    let newRank = await User.findOne({ name });
    console.log("Trước khi lưu >>>>>>>>>>", newRank);
    if (newRank) {
      newRank.name = name ? name : newRank.name;
      newRank.diem = diem ? diem : newRank.diem;
      newRank.coin = coin ? coin : newRank.coin;
      newRank.X    = X    ? X    : newRank.X;
      newRank.Y    = Y    ? Y    : newRank.Y;
      newRank.Z    = Z    ? Z    : newRank.Z;
    }
    await newRank.save();
    console.log("Sau khi lưu >>>>>>>>>>", newRank);
    return true;
  } catch (error) {
    console.log('Lỗi khi lưu:', error);
    return false;
  }
};


const getProductById = async (id) => {
  try {
    const rankUser = await User.findById(id);
    if (rankUser) {
      return rankUser;
    }
    return false;

  } catch (error) {
    console.log('get product by id error: ', e);
  }
  return false;
}






module.exports = { getAllRank, addProduct, getProductById, Savepoint, getAllUsers, deleteProductByID, addnewProduct, Changname };
