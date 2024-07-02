async function basic1(event){
    event.preventDefault();

    let accesstoken = localStorage.getItem('accesstoken')
    if(!accesstoken){
        console.log("You are not logined in")

    }
    else{
        const result  = await fetch("http://localhost:5000/val/verify",{
            method :"POST",
            headers :{
                'Content-type' :'application/json',
                'Authorization' :`Basic ${accesstoken}`
            },
            body:JSON.stringify({event})
        })

        if(result.ok){
            alert(`You are allowed to access ${event.target.id} content`)
            window.location.href = "basiccontent.html"
        }
        else{
            alert(`Session expired! Refresh the page!`)
            // window.location.href = "loginpage.html"
        }

        
    }
}

function viewpost(){
    window.location.href = "viewpost.html";
}

function premium(event){
    event.preventDefault();
}
function golden(event){
    event.preventDefault();
}

async function refreshb(event){
    event.preventDefault();
    
    let refreshtoken = localStorage.getItem('refreshtoken');
    const result  = await fetch("http://localhost:5000/user/refresh",{
        method:"POST",
        headers :{
            'Content-type' : 'application/json',
            'Authorization':`Basic ${refreshtoken}`
        },
        body:JSON.stringify(event)

    })

    let response = await result.json();
    console.log(response)
    localStorage.setItem('accesstoken' ,response.accesstoken);
    // window.location.href="loginpage.html";
}