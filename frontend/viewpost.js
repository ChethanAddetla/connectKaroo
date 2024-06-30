let token = localStorage.getItem("accesstoken");
let container = document.getElementById("post-container");

async function validateToken(){
    

    let response = await fetch("http://localhost:5000/val/postValidate",{
        method:"GET",
        headers:{
            'Content-type':'application/json',
            'Authorization':`Basic ${token}` 
        }
    })

    let result = await response.json();
   


    if(response.ok){
        if(result.data.length <= 0){
            document.getElementById("msg").innerHTML = `If there are no posts to display, create a new post by <a href="addpost.html">clicking here</a>.`
        }
        else{
            let postData = result.data;
            
            postData.map((post,index)=>{
                let div = document.createElement("div");
                
                div.setAttribute("id",`${post.username}_${index+1}`);
                div.setAttribute("class", "postBlocks");
                
                div.innerHTML = `
                <h1>TITLE : ${post.title}</h1>
                <hr>
                <p>Content: ${post.content}</p>
                <hr>
                <span>
                    <p><b>Author : </b> ${post.author}</p>
                    <p><b>Created On: </b> ${post.created_on}</p>
                </span>
                <button onclick ="editPost('${post._id}')">Edit</button>
                <button onclick ="deletePost('${post._id}')">Delete</button>
                `;

                container.appendChild(div)
                return;
            })
            
        }
    }else{
        alert(result.msg);
        window.location.href = "loginpage.html"
    }
}

function createPostPage(){
    window.location.href = "addpost.html"
}

function editPost(id){
    localStorage.setItem('post_id',`${id}`)
    window.location.href = "editpost.html"

}

async function handleAuthorPost(event){
    let author = event.target.value;
    if(author == ""){
        document.getElementById("msg").innerText="Enter Valid Author name"
        window.location.href = "viewpost.html"
    }
    else{
        document.getElementById("msg").innerText="";
        }

        let result = await fetch(`http://localhost:5000/post/authorPost/${author}`,{
            method:"GET",
            headers:{
                'Content-type':'application/json'
               
            }
        })

    let response = await result.json();

    if(response.status){
        container.innerHTML="";
        let postData = response.data;
        container = document.getElementById("post-container");

        postData.map((post,index)=>{
            let div = document.createElement("div");
            
            div.setAttribute("id",`${post.username}_${index+1}`);
            div.setAttribute("class", "postBlocks");
            
            div.innerHTML = `
            <h1>TITLE : ${post.title}</h1>
            <hr>
            <p>Content: ${post.content}</p>
            <hr>
            <span>
                <p><b>Author : </b> ${post.author}</p>
                <p><b>Created On: </b> ${post.created_on}</p>
            </span>
            <button onclick ="editPost('${post._id}')">Edit</button>
            <button onclick ="deletePost('${post._id}')">Delete</button>
            `;

            container.appendChild(div)
            console.log("Author Found")
            return;
        })
    }
    else{
        container.innerHTML="";
        document.getElementById("msg").innerText=response.msg;
    }




}