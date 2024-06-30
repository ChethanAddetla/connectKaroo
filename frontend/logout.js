function logout(){
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('refreshtoken');
    alert("Log out Successful !")
    window.location.href = "loginpage.html"
}