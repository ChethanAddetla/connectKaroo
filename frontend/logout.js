function logout(){
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('refreshtoken');
    localStorage.removeItem('userName');
    localStorage.removeItem('post_id');
    alert("Log out Successful !")
    window.location.href = "loginpage.html"
}