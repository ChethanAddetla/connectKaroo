let token  = localStorage.getItem('accesstoken');
let myobj={

}

function handleInput(event){


myobj[event.target.id] = event.target.value;

}

async function createPost(event){
    event.preventDefault();
   

    let result  = await fetch("http://localhost:5000/addpost",{
        method :'POST',
        headers :{
            'Content-type' :'application/json',
            'Authorization':`Basic ${token}`
        },
        body :JSON.stringify(myobj)
    })

    let response  = await result.json();
    console.log(result)
    if(result.ok){
        console.log({msg:"Post added successfully",post :response})
    }
    else{
        console.log({response})
    }

    
    
}

async function validatetoken(event){
    let result  = await fetch("http://localhost:5000/val/validate",{
        method :'GET',
        headers :{
            'Content-type' : 'application/json',
            'Authorization':`Basic ${token}`
        }
       
    })

    let response = await result.json();

    
    if(!result.ok){
        alert("Session Expired! Refresh the page ")
        window.location.href="content.html"
    }
}