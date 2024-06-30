let token = localStorage.getItem('accesstoken')
let postid = localStorage.getItem('post_id')
let editedpost ={};

async function handlePostData(){

    if(postid){
        const result  = await fetch(`http://localhost:5000/post/postdata/${postid}`,{
            method:"GET",
            headers :{
                'Content-type' : 'application/json',
            },
          
        })

        let response = await result.json();

        if(result.ok){
            
            document.getElementById("title").value = response.data.title;
            document.getElementById("content").value = response.data.content;
            document.getElementById("category").value = response.data.category;
            
            // console.log(response.data);
        }
        // else{
        //     // console.log(response.msg);
        // }

    }
    else{
        alert("Error in finding the post")
    }
    
}



async function handleInput(event){
    editedpost[event.target.id]= event.target.value;

}

async function editPost(event){
    event.preventDefault();
    if(!postid){
         alert("Post not selected ")
         window.location.href = "viewpost.html";
         return;

    }

    const result = await fetch(`http://localhost:5000/post/editpost/${postid}`,{
        method : "PUT",
        headers : {
            'Content-type' :'application/json',
            'Authorization' : `Basic ${token}`
        },
        body:JSON.stringify({editedpost})
    })

    let response = await result.json()
    if(result.ok){
        alert(response.msg);
        console.log(response.data)
        window.location.href = "viewpost.html";
    }
    else{
        console.log(response.msg)
    }
}