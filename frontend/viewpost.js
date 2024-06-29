async function validateToken(){
    let token = localStorage.getItem("accesstoken");

    let response = await fetch("http://localhost:5000/val/postValidate",{
        method:"GET",
        headers:{
            'Content-type':'application/json',
            'Authorization':`Basic ${token}` 
        }
    })

    let result = await response.json();
    console.log(result);


    if(response.ok){
        if(result.data.length <= 0){
            document.getElementById("msg").innerHTML = `If there are no posts to display, create a new post by <a href="addpost.html">clicking here</a>.`
        }
        else{
            let postData = result.data;
            let container = document.getElementById("post-container");

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

                container.append(div)
                return;
            })
            
        }
    }else{
        alert(result.msg);
        window.location.href = "loginpage.html"
    }
}