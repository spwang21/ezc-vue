function isLogin() {
  var login_info = JSON.parse(localStorage.getItem("loginInfo"));
  if (login_info == '' || login_info == undefined) {
    window.location.href = '#/login';
  } else {
    login = login_info.data.result;
    return login;
  }
}
