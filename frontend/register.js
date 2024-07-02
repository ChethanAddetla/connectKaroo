let myobj ={

};

function handleInputs(event){
    myobj[event.target.id] = event.target.value;
    console.log(myobj)
}

function handlePass(event){

    if(myobj["password"] === event.target.value ){
        document.getElementById("msg").innerHTML="Password Matched";
        document.getElementById("register").disabled = false;
        
    }else{
        document.getElementById("msg").innerHTML="Password Not Matched";
       
    }

}

async function register1(event){
    event.preventDefault();

    const result = await fetch("http://localhost:5000/user/register",{
        method :"POST",
        headers:{"Content-type":"application/json"},
        body :JSON.stringify(myobj)

    });

    alert("Sign up Successful !")

    window.location.href="loginpage.html"


    console.log("Sign up Successful !")
}