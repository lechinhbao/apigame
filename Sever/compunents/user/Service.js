
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


const register = async(email,name,password)=>{
    try{
        const user = await User.findOne({email});
        if(user){
            return false;
        }
        const newUser = new User({email,name,password});
        await newUser.save();
        return true;
    }catch(error){
        console.log('User service register error',error);
    }
    return false;
}

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


module.exports = {login,register,changePassword};

