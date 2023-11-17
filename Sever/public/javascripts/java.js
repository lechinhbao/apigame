function registerUser(event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var name = document.getElementById('name').value;
    var password = document.getElementById('password').value;

    // Kiểm tra xem dữ liệu có hợp lệ không (ở đây chỉ kiểm tra xem có dữ liệu hay không)
    if (!email || !name || !password) {
        document.getElementById('registrationStatus').innerText = 'Vui lòng điền đầy đủ thông tin.';
        return;
    }

    // Xử lý đăng ký tài khoản tại đây (có thể làm việc với server hoặc cơ sở dữ liệu)
    document.getElementById('registrationStatus').innerText = 'Đăng ký thành công!';
}