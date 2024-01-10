var express = require('express');
var router = express.Router();
const userController = require('../compunents/user/Controller');
const productController = require('../compunents/product/Controller');
const { checkRegister } = require('../compunents/midle/Validation');
const { checkTokenWeb } = require('../compunents/midle/Authen');
let $ = require('jquery');
const request = require('request');
const moment = require('moment');

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Đường dẫn cho trang web
router.get('/submit', (req, res, next) => {
  res.render('user/support');
});

// Đường dẫn xử lý form POST
router.post('/submit', (req, res) => {
  const { email, message, contact } = req.body;

  // Kiểm tra xem có dữ liệu hợp lệ từ yêu cầu không
  if (!email || !message || !contact) {
    return res.status(400).send('Dữ liệu không hợp lệ.');
  }

  // Thông tin tài khoản email của bạn
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'baolcps21320@fpt.edu.vn',
      pass: 'e j g r g z r r h f e d f u a i',
    },
  });

  // Nội dung email
  const mailOptions = {
    from: email, // Sử dụng địa chỉ email của người gửi
    to: 'baolcps21320@fpt.edu.vn',
    subject: `Yêu cầu Hỗ trợ từ ❗❗❗ ${email}`, // Đặt tên người gửi vào tiêu đề
    text: `Nội dung: ${message}\nLiên hệ: ${contact}`,
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Đã có lỗi xảy ra, vui lòng thử lại sau.');
    } else {
      console.log('Email sent: ' + info.response);
      return res.send('Yêu cầu của bạn đã được gửi thành công.');
    }
  });
});









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

router.get('/webAdmin', async (req, res, next) => {
  try {
    const AllUser = await productController.getAllUser();
    console.log(AllUser);
    res.render('AdminWeb/TaskManeger', { AllUser });
  } catch (error) {
    console.error(error);
    // Xử lý lỗi nếu có
    res.status(500).send('Internal Server Error');
  }
});



// http://localhost:3000/login
// hien thi tran login
// nei login thanh cong thi chuyen sang tran chu 
// con khong dc thi chuyen lai trang login

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Kiểm tra mật khẩu
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return res.redirect('/login');
    }
    const result = await userController.login(email, password);

    if (result) {
      // // Tạo JWT token
      // const token = jwt.sign({ id:1, name: 'abc' }, '', { expiresIn: '1h' });
      // // Thiết lập session và token
      // req.session.userId = result._id;
      // req.session.token = token;

      if (result.roll === 1) {
        return res.redirect('/webAdmin');
      } else {
        const userId = result._id;
        return res.redirect('/informationuser/' + userId);
      }
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
    console.log(result);
    if (result) {

      // Đăng nhập thành công
      let user = {
        id: result._id,
        status: 1,
        Notification: "Login thành công",
        name: result.name,
        coin: result.coin,
        diem: result.diem,
        man: result.man,
        X: result.X,  // Thêm tọa độ X
        Y: result.Y,  // Thêm tọa độ Y
        Z: result.Z,   // Thêm tọa độ Z
      };
      return res.status(200).json(user);
    } else {
      // Đăng nhập không thành công
      let user = {
        status: 0,
        Notification: "Login không thành công",
      };
      return res.status(200).json(user);
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



router.get('/logout', async (req, res, next) => {

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
      const subject = "🎉 Chúc Mừng! Bạn Đã Đăng Kí Thành Công! 🚀";
      const content = ` 
      
      <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Knights-Adventure</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #1f1f1f;
      color: #fff;
      margin: 0;
      padding: 0;
    }

    h1 {
      font-family: 'fantasy'; /* Chọn font chữ hướng về game */
      text-align: center;
      font-size: 2em;
    }

    p, ul {
      font-size: 1.2em;
      line-height: 1.5;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li::before {
      content: '🔹'; /* Thêm biểu tượng trước mỗi mục danh sách */
      margin-right: 5px;
    }

    p:last-child {
      margin-bottom: 30px;
    }

    footer {
      font-size: 0.8em;
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <h1>Xin chào 🎮🎮🎮 ${name}!</h1>
  
  <p>Cảm ơn bạn đã tham gia vào cuộc phiêu lưu tuyệt vời của chúng tôi trong thế giới game sinh tồn!</p>
  
  <p>Chuẩn bị cho một hành trình kỳ thú, nơi bạn sẽ đối mặt với những thách thức, đầy rẫy quái vật, và chiến đấu cho đến cuối cùng mang hòa bình về cho mọi người.</p>
  
  <ul>
    <li><strong>Tên người chơi:</strong> ${name}</li>
    <li><strong>Email:</strong> ${email}</li>
  </ul>
  
  <p>Chúc bạn có những giây phút thú vị và thành công trong hành trình của mình!</p>
  
  <footer>Trân trọng,<br />Đội ngũ Knights-Adventure</footer>

</body>
</html>
`

        ;
      const result = await userController.sendMail(to, subject, content);
      return res.render('user/login', { message: result.message });
    } else {
      // Log thông báo lỗi
      console.error('Error during registration:', result.message);
      return res.render('user/register', { message: result.message });

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
    const { id, name, man, diem, coin, roll } = req.body;
    const addnew = await productController.addProduct(id, name, man, diem, coin, roll);
    if (addnew) {
      return res.redirect('/login');
    }
    res.render('user/changname', { successMessage: 'Đổi tên thất bại.' });
  } catch (error) {
    return res.status(500).json({ addnew: false });
  }
});




router.post('/changname/:id', async (req, res, next) => {
  try {
    const { id, name } = req.body;
    const addnewResult = await productController.addProduct(id, name);
    if (!addnewResult.success) {
      // Nếu không thành công (tên đã tồn tại), hiển thị thông báo lỗi
      return res.render('user/changname', { errorMessage: addnewResult.message });
    }
    // Nếu thành công, chuyển hướng đến trang đăng nhập
    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ addnew: false });
  }
});

router.get('/changname', async (req, res, next) => {
  const { id } = req.params;
  res.render('user/changname');

});





router.post('/savepoint', async (req, res, next) => {
  try {
    const { name, diem, coin, X, Y, Z } = req.body;
    const addnew = await productController.Savepoint(name, diem, coin, X, Y, Z);
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
    <h2> Chuc mung den voi advandtuknghit</h2>
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
    const { email, password } = req.body;

    // Kiểm tra email và password
    const user = await userController.sendotp(email, password);

    if (user) {
      // Nếu thông tin đăng nhập đúng
      const to = user.email;
      const id = user._id;
      const otp = Ngaunhien();
      const subject = "🎉 Gởi Mã Xác Nhận Thành công! 🚀";
      const content = `
      <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Knights-Adventure Registration</title>
  <style>
    body {
      font-family: 'Helvetica', Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      margin: 50px auto;
      width: 70%;
      padding: 20px 0;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    header {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }

    header a {
      font-size: 1.4em;
      color: #00466a;
      text-decoration: none;
      font-weight: 600;
    }

    h1 {
      font-size: 1.1em;
      color: #00466a;
    }

    h2 {
      background: #00466a;
      margin: 0 auto;
      width: max-content;
      padding: 0 10px;
      color: #fff;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .news {
      font-size: 0.9em;
      color: #00466a;
    }

    .news-highlight {
      font-size: 1.1em;
      font-weight: bold;
      color: #00466a;
    }

    .footer {
      float: right;
      padding: 8px 0;
      color: #aaa;
      font-size: 0.8em;
      line-height: 1;
      font-weight: 300;
    }

    /* Sử dụng font chữ hướng game cho emoji */
    @font-face {
      font-family: 'game-font';
      src: url('path_to_your_game_font.ttf') format('truetype');
    }

    header a::before,
    .news-highlight::before,
    .news::before,
    .footer p::before {
      content: '🎮';
      font-family: 'game-font';
      margin-right: 5px;
    }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;"></a>
    </header>
    <h1>Hi,</h1>
    <p>Thank you for choosing 🎮 Knights-Adventure. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes.</p>
    <h2>${otp}</h2>
    <p class="news">Also, we're excited to share some news from the gaming world:</p>
    <p class="news-highlight">
      Adventures with warriors in each place bring a new sense of difficulty with powerful moves that motivate monsters.
    </p>
    <p class="news">Immerse yourself in the world of gaming with our latest release. Exciting adventures await you!</p>
    <p class="news">Stay tuned for more updates and exclusive offers.</p>
    <p class="news">Regards,<br />🎮 Knights-Adventure</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div class="footer">
      <p>🎮 Knights-Adventure</p>
      <p>Quận 12 Quang Trung</p>
      <p>Việt Nam</p>
    </div>
  </div>

</body>
</html>
      `;
      const addotp = await userController.addotp(id, otp);
      const result = await userController.sendMail(to, subject, content);

      return res.render('user/ResetPasswordOTP');
    } else {
      // Nếu thông tin đăng nhập không đúng
      return res.status(400).json({ message: "Sai email hoặc mật khẩu. Mật khẩu phải có ít nhất 8 kí tự và chứa ít nhất một chữ cái và một số." });
    }
  } catch (error) {
    console.log("Fail to send mail", error);
    return res.status(500).json({ status: false });
  }
});

function Ngaunhien() {
  // Sinh số ngẫu nhiên từ 1000 đến 9999
  let fourDigitNumber = Math.floor(Math.random() * 9000) + 1000;
  return fourDigitNumber;
}



// router.post("/resetPassword", async (req, res, next) => {

//   try {
//     const { email, password, otp } = req.body;
//     const resetPassword = await userController.resetPassword(email, password, otp);
//     if (resetPassword) {
//       return res.render('user/login');
//     }
//     console.log(">>>>>>>>", resetPassword);
//     return res.status(200).json({ status: false, message: "otp khong dung" });

//   } catch (error) {
//     console.log("failed to reset password", error);
//     return res.status(500).json({ status: false, message: "Sever không phản hồi" });
//   }

// });



// router.post("/resetPassword", async (req, res, next) => {

//   try {
//     const { email, password, otp } = req.body;
//     const resetPassword = await userController.resetPassword(email, password, otp);
//     if (resetPassword) {
//       return res.render('user/login');
//     }
//     console.log(">>>>>>>>", resetPassword);
//     return res.status(200).json({ status: false, message: "otp khong dung" });

//   } catch (error) {
//     console.log("failed to reset password", error);
//     return res.status(500).json({ status: false, message: "Sever không phản hồi" });
//   }

// });

router.post("/resetPassword", async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    const isResetSuccessful = await userController.resetPassword(email, password, otp);

    if (isResetSuccessful) {
      // Nếu reset mật khẩu thành công, chuyển hướng đến trang đăng nhập
      return res.redirect('/login');
    } console.log(isResetSuccessful);

    return res.status(400).json({ status: false, message: "Mã OTP không đúng" });
  } catch (error) {
    console.log("Failed to reset password", error);
    return res.status(500).json({ status: false, message: "Sever không phản hồi" });
  }
});





router.get("/loginAdmin", async (req, res, next) => {
  res.render('AdminWeb/loginAdmin');
});


router.post("/loginAdmin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Gọi hàm đăng nhập từ service
    const loginResult = await userController.loginAdmin(email, password);

    if (loginResult.success) {
      // Đăng nhập thành công và kiểm tra vai trò
      if (loginResult.user.roll === 1) {
        // Nếu vai trò là 1, chuyển hướng đến trang taskmanager
        return res.redirect('/webAdmin');
      } else {
        // Nếu vai trò không phù hợp, trả về thông báo lỗi
        console.error('Error during registration:', loginResult.message);
        return res.render('AdminWeb/loginAdmin', { message: loginResult.message });
      }
    } else {
      // Đăng nhập thất bại
      return res.status(401).json(loginResult);
    }
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ success: false, code: 'SERVER_ERROR', message: "Server không phản hồi" });
  }
});



router.get('/new', async (req, res, next) => {
  try {
    //const addUser = await productController.newProduct( email,password,name, man, diem, coin,roll);
    return res.render('product/new');
  } catch (error) {
    next(error);
  }
});

router.post('/addnewUser', async (req, res, next) => {
  try {
    const { email, password, name, man, diem, coin, roll } = req.body;

    const addnewResult = await productController.newProduct(email, password, name, man, diem, coin, roll);

    if (addnewResult.success) {
      // Thành công, hiển thị thông báo thành công
      return res.render('product/new', { successMessage: addnewResult.message });
    } else {
      // Thất bại, hiển thị thông báo lỗi hoặc chuyển hướng đến trang thất bại
      return res.render('product/new', { errorMessage: addnewResult.message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ addnew: false });
  }
});




router.get('/:id/delete', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productController.deleteProductByID(id);
    return res.json({ result });
  } catch (error) {
    return res.json({ result: false });
  }
});


router.get('/create_payment_url', function (req, res, next) {
  res.render('payment', { title: 'Tạo mới đơn hàng', amount: 10000 })
});


router.post('/create_payment_url', function (req, res, next) {

  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = require('config');

  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnpUrl = config.get('vnp_Url');
  let returnUrl = config.get('vnp_ReturnUrl');
  let orderId = moment(date).format('DDHHmmss');
  console.log(req.body);
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === '') {
    locale = 'vn';
  }
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  res.redirect(vnpUrl)
});

router.get('/vnpay_return', function (req, res, next) {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let config = require('config');
  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    res.render('success', { code: true });
  } else {
    res.render('success', { code: '97' })
  }
});


function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
module.exports = router;
