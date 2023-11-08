const userService = require('./Service');


const login = async (email,password)=>{
    try{
        return await userService.login(email,password);
    }catch(error){
        throw error;
    }
}

const register = async (email,name,password)=>{  
    try{
        return await userService.register(email,name,password);
    }catch(error){
        throw error;
    }
}

const changePassword = async (id,password, newpass)=>{
    try{
        return await userService.changePassword(id,password, newpass);
    }catch(error){
        throw error;
    }
}

module.exports ={login,register,changePassword};