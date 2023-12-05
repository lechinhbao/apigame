var express = require('express');
var router = express.Router();
const userController = require('../compunents/user/Controller');
const productController = require('../compunents/product/Controller');
const { checkRegister } = require('../compunents/midle/Validation');
const { checkTokenWeb } = require('../compunents/midle/Authen');


// http://localhost:3000/
router.get('/', function (req, res, next) {
  res.render('index'); // render dung cho hien thi mot tran nao do
});

// http://localhost:3000/Register
router.get('/Register', function (req, res, next) {
  res.render('user/register'); // render dung cho hien thi mot tran nao do
});

// http://localhost:3000/informationuser/:id


// http://localhost:3000/fogetpassword
router.get('/fogetpassword/:id', async (req, res, next) => {
  const { id } = req.params;
  res.render('user/rewordpassword', { id }); // render dung cho hien thi mot tran nao do
});

router.get('/ResetOTP', function (req, res, next) {
  res.render('user/Resetotp'); // render tới trang quen mật khẩu và otp
});

router.get('/ResetPasswordOTP', function (req, res, next) {
  res.render('user/ResetPasswordOTP'); // render tới trang quen mật khẩu và otp
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
      //const token = jwt.sign({id:1,name:'abc'},'secret',{expiresIn: 1 *60 *60});
      // req.session.token = token;
      return res.redirect('/informationuser/' + userId);
    }
    return res.redirect('/login');

  } catch (error) {
    next(error);
    return res.status(500).json({ result: false });

  }
});

router.post('/loginUser', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userController.login(email, password);
    if (result) {
      let Usser = {
        status: 1,
        Notification: "Login thành công",
        name: result.name,
        coin: result.coin,
        diem: result.diem,
        man: result.man,
      };
      return res.status(200).json(Usser)
    }

  } catch (error) {
    next(error);
    return res.status(500).json({ result: false });

  }
});

router.post('/informationuser/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const rankId = await productController.getProductById(id);
    if (rankId) {
      console.log('product: ', rankId);
      return res.render('user/information', { rankId });
    }
    // return res.status(200).json({ status: 'true' });
  } catch (error) {
    console.log("Error: ", error);
    next(error);
  }
});
router.get('/informationuser/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const rankId = await productController.getProductById(id);
    if (rankId) {
      console.log('product: ', rankId);
      return res.render('user/information', { rankId });
    }
    // return res.status(200).json({ status: 'true' });
  } catch (error) {
    console.log("Error: ", error);
    next(error);
  }
});

// router.post('/register', async (req, res, next) => {

//   try {

//     const { email, name, password } = req.body;
//     const result = await userController.register(email, name, password);
//     if (result) {
//       return res.redirect('/login');
//       // return res.status(200).json({ result: true });
//     }
//     return res.redirect('/register');
//   } catch (error) {
//     next(error);
//     return res.status(500).json({ result: false });
//   }
// });



router.get('/logout', [checkTokenWeb], async (req, res, next) => {

  try {
    res.session.destroy();
    return res.redirect('/login');
  } catch (error) {
    console.log(error);
    next(error);
  }
});



router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const result = await userController.register(email, name, password);

    if (result.success) {
      const to = email;
      const subject = "Chúc mừng bạn đã đăng kí thành công";
      const content = `<h1>xin chao ban ${name}toi game sinh ton </h1>`;
      const result = await userController.sendMail(to, subject, content);
      return res.redirect('/login');
    } else {
      // Log thông báo lỗi
      console.error('Error during registration:', result.message);
      return res.render('user/register', {message: result.message});

      // Thêm thông báo lỗi vào URL hoặc chuyển đến trang đăng ký với thông báo
      // return res.redirect(`/register?error=${result.message}`);
    }
  } catch (error) {
    // Log lỗi khi có exception
    console.error('Error in /register route:', error);
    next(error);
    return res.status(500).json({ result: false });
  }
});


router.post('/addnew', async (req, res, next) => {
  try {
    const { id, name, man, diem, coin } = req.body;
    const addnew = await productController.addProduct(id, name, man, diem, coin);
    if (addnew) {
      return res.status(200).json({ addnew: true });
    }
    return res.status(400).json({ addnew: false })
  } catch (error) {
    return res.status(500).json({ addnew: false });
  }
});


router.post('/savepoint', async (req, res, next) => {
  try {
    const { name, diem, coin } = req.body;
    const addnew = await productController.Savepoint(name, diem, coin);
    if (addnew) {
      return res.status(200).json({
        status: 1,
        Notification: "lưu thành công",
      });
    }
    return res.status(400).json({ addnew: false })
  } catch (error) {
    return res.status(500).json({ addnew: false });
  }
});





router.post('/sendmail', async (req, res, next) => {
  try {
    const { to, subject } = req.body;
    let name = 'nguyen van a'
    const content = `
    <h1> Chuc mung ban dang ki thanh cong ${name} </h1>
    <h2>Chuc mung den voi advandtuknghit</h2>
    `;
    const result = await userController.sendMail(to, subject, content);
    return res.status(200).json({ result });

  } catch (error) {
    console.log('Sendmail error:', error);
    return res.status(500).json({ result: false });
  }
});



router.post('/senotpmail', async (req, res, next) => {
  try {
    const { email } = req.body;
    const sendmail = await userController.sendotp(email);
    if (sendmail) {
      const to = sendmail.email;
      console.log(to);
      const id = sendmail._id;
      const otp = Ngaunhien();
      const subject = "Xac nhan tai khoan";
      const content = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Your Brand Inc</p>
        <p>1600 Amphitheatre Parkway</p>
        <p>California</p>
      </div>
    </div>
  </div>`;
      const addotp = await userController.addotp(id, otp);
      const result = await userController.sendMail(to, subject, content);
      return res.render('user/ResetPasswordOTP');
      // cần sữa lại thành chỗ của nhập mã otp và mật khẩu mới 
    }
    else {
      return res.status(400).json({ message: "tài khoản không tồn tại" });
    }
  } catch (error) {

    console.log("fail to send mail", error);
    return res.status(500).json({ status: false });

  }
});

function Ngaunhien() {
  // Sinh số ngẫu nhiên từ 1000 đến 9999
  let fourDigitNumber = Math.floor(Math.random() * 9000) + 1000;
  return fourDigitNumber;
}



router.post("/resetPassword", async (req, res, next) => {

  try {
    const { email, password, otp } = req.body;
    const resetPassword = await userController.resetPassword(email, password, otp);
    if (resetPassword) {
      return res.render('user/login');
    }
    console.log(">>>>>>>>", resetPassword);
    return res.status(200).json({ status: false, message: "otp khong dung" });

  } catch (error) {
    console.log("failed to reset password", error);
    return res.status(500).json({ status: false, message: "Sever không phản hồi" });
  }

});




module.exports = router;
