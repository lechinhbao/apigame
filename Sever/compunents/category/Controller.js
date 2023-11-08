


const categoryService = require('./Service');

const getAllCategories= async()=>{
try {
    return await categoryService.getAllCategories();
} catch (error) {
    console.log(error);
}
}

module.exports={getAllCategories};