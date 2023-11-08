var express = require('express');
var router = express.Router();
const userController = require('../compunents/user/Controller');
const productController = require('../compunents/product/Controller');
const { checkRegister } = require('../compunents/midle/Validation');


// http://localhost:3000/
router.get('/', function (req, res, next) {
  res.render('index'); // render dung cho hien thi mot tran nao do
});

// http://localhost:3000/informationuser/:id
router.get('/informationuser/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const rankId = await productController.getProductById(id);
    if (rankId) {
      console.log('product: ', rankId);
      return res.render('user/information', { rankId });
    }
  } catch (error) {
    console.log("Error: ", error);
    next(error);
  }

});



// http://localhost:3000/fogetpassword
router.get('/fogetpassword/:id', async (req, res, next) => {
  const { id } = req.params;
  res.render('user/rewordpassword', { id }); // render dung cho hien thi mot tran nao do
});


router.post('/fogetpassword/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, newpass, repass } = req.body;

    if (newpass === repass) {
      const result = await userController.changePassword(id, password, newpass);
      if (result === 1) {
        return res.redirect('/login');
      } else if (result === 2) {
        return res.redirect('/fogetpassword/' + id);
      } else {
        return res.redirect('/fogetpassword/' + id);
      }
    } else {
      return res.redirect('/fogetpassword/' + id);
    }

  } catch (error) {
    console.log("Failed to change password", error);
    next(error);
  }
});


router.get('/rank', async (req, res, next) => {
  try {
    const result = await productController.getAllRank();
    if (result) {
      return res.render('product/list', { result });
    }
    return res.status(400).json({ result: false });
  } catch (error) {
    next(error);
    return res.status(500).json({ result: false });
  }
});

// http://localhost:3000/login
// hien thi tran login
// nei login thanh cong thi chuyen sang tran chu 
// con khong dc thi chuyen lai trang login
router.get('/login', function (req, res, next) {
  res.render('user/login');
});


// http://localhost:3000/login
// hien thi tran login
// nei login thanh cong thi chuyen sang tran chu 
// con khong dc thi chuyen lai trang login
router.post('/login', async (req, res, next) => {
  try {

    const { email, password } = req.body;
    const result = await userController.login(email, password);
    if (result) {
      const userId = result._id;
      return res.redirect('/informationuser/' + userId);
    }
    return res.redirect('/login');
  } catch (error) {
    next(error);
    return res.status(500).json({ result: false });

  }
});


router.post('/register', async (req, res, next) => {

  try {
    
    const { email, name, password } = req.body;
    const result = await userController.register(email, name, password);
    if (result) {
      // res.redirect('/');
      return res.status(200).json({ result: true });
    }
    return res.status(400).json({ result: false });
  } catch (error) {
    next(error);
    return res.status(500).json({ result: false });
  }

});

router.post('/addnew', async (req, res, next) => {
  try {
    const { id_user, man, diem, coin } = req.body;
    const addnew = await productController.addProduct(id_user, man, diem, coin);
    if (addnew) {
      return res.status(200).json({ addnew: true });
    }
    return res.status(400).json({ addnew: false })
  } catch (error) {
    return res.status(500).json({ addnew: false });
  }
});





module.exports = router;
