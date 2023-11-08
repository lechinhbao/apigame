const {Rank}= require('../Model');


const getAllRank = async () => {
  try {
    return await Rank.find().populate("id_user").sort({"diem":-1});
  } catch (error) {
    console.log(error);
  }
  return [];
}

// xoa san pham theo id

const deleteProductByID = async (id) => {
  try {
    data = data.filter(item => item._id.toString() != id.toString());
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}

const addProduct = async (id_user, man, diem, coin) => {
  try {
    let newRank = await Rank.findOne({id_user});
    console.log(">>>>>>>>>>>>", newRank);
    if(newRank){
      newRank.man = man ? man : newRank.man;
      newRank.diem = diem? diem : newRank.diem;
      newRank.coin = coin? coin : newRank.coin;
      
    }else{
      newRank = new Rank({id_user,man,diem, coin});
    
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
    const rankUser = await Rank.findOne({id_user:id}).populate("id_user");
   if(rankUser){
     return rankUser;
   }
   return null;

  } catch (error) {
    console.log('get product by id error: ', e);
  }
  return null;
}

const updateProductById = async (id, name, man, diem, coin) => {

  try {
    const product = data.find(item => item._id.toString() == id.toString());
    if (product) {
      data = data.map(item =>{
        if (item._id.toString() == id.ToString()){
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

module.exports = { getAllRank, addProduct, getProductById,updateProductById };
 