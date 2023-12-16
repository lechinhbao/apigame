const { User } = require('../Model');


const getAllRank = async () => {
  try {
    return await User.find().populate("id").sort({ "diem": -1 });
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
    const newProduct = new productUser({
      email, password, name, man, diem, coin, roll
    });
    await newProduct.save();
    return true;
  } catch (error) {
    console.log('Add product error:', error);
    return false;
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







const Savepoint = async (name, diem, coin) => {
  try {
    let newRank = await User.findOne({ name });
    console.log(">>>>>>>>>>>>", newRank);
    if (newRank) {
      newRank.name = name ? name : newRank.name;
      newRank.diem = diem ? diem : newRank.diem;
      newRank.coin = coin ? coin : newRank.coin;

    }
    await newRank.save();
    return true;
  } catch (error) {
    console.log('Add product error:', error);
    return false;
  }
}

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

const updateProductById = async (id, name, man, diem, coin) => {

  try {
    const product = data.find(item => item._id.toString() == id.toString());
    if (product) {
      data = data.map(item => {
        if (item._id.toString() == id.ToString()) {
          item.name = name ? name : item.name;
          item.man = man ? man : item.man;
          item.diem = diem ? diem : item.diem;
          item.coin = coin ? coin : item.coin;
        }
        return item;
      });
      return true;
    }
  } catch (error) {
    console.log(' update product by id error', e);
  }
  return false;

}




module.exports = { getAllRank, addProduct, getProductById, updateProductById, Savepoint, getAllUsers, deleteProductByID, addnewProduct, Changname };
