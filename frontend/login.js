let myobj={

}

function handleInputs(event){
myobj[event.target.id] = event.target.value;

// if(Object.keys(myobj).length != 2){
    
//     document.getElementById("login").disabled=true;
// }
// else{
//     document.getElementById("login").disabled=false;
// }


}
async function login(event){

    event.preventDefault();
   

    const result  = await fetch("http://localhost:5000/user/login",{
        method:"POST",
        headers :{'Content-type' : 'application/json'},
        body:JSON.stringify(myobj)

    })

    let response  = await result.json();
    
    if(result.ok){
        localStorage.setItem('refreshtoken',response.refreshtoken);
        localStorage.setItem('accesstoken' ,response.accesstoken);
        alert("Login Successful !");
        window.location.href="content.html";
    }
    else{
        alert(`Login failed! ,${response.msg}`)
       
    }


    // console.log("hello ")

    
}