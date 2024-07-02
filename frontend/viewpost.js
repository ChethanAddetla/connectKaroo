let token = localStorage.getItem("accesstoken");
let container = document.getElementById("post-container");
let likes = [];

async function validateToken() {

    let response = await fetch("http://localhost:5000/val/postValidate", {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${token}`
        }
    })

    let result = await response.json();



    if (response.ok) {
        // console.log(result.userdata)
        localStorage.setItem('userName', result.userdata.name)
        document.getElementById("user").innerText = `User : ${result.userdata.name}`
        document.getElementById("followerCount").innerText = `  ${result.userdata.followers.length}`
        console.log(result.userdata)
        if (result.data.length <= 0) {
            document.getElementById("msg").innerHTML = `If there are no posts to display, create a new post by <a href="addpost.html">clicking here</a>.`
        }
        else {
            let postData = result.data;

            postData.map((post, index) => {
                let div = document.createElement("div");

                div.setAttribute("id", `${post.username}_${index + 1}`);
                div.setAttribute("class", "postBlocks");

                div.innerHTML = `
                <h1>${post.username} : ${post.title}</h1>
                <hr>
                <p>Content: ${post.content}</p>
                <hr>
                <span>
                    <p><b>Author : </b> ${post.author}</p>
                    <p><b>Created On: </b> ${post.created_on}</p>
                </span>
                <button onclick ="editPost('${post._id}')">Edit</button>
                <button onclick ="deletePost('${post._id}','${post.title}')">Delete</button>
                <br>
                <br>
                <button onclick="likePost('${post._id}')">Likes : ${post.likes.length}</button>
             
                <br>
                <br>
                <button onclick="follow('${post.username}')">Follow</button>
                `;

                container.appendChild(div)
                return;
            })

        }
    } else {
        alert(result.msg);
        window.location.href = "loginpage.html"
    }
}

function createPostPage() {
    window.location.href = "addpost.html"
}

function editPost(id) {
    localStorage.setItem('post_id', `${id}`)
    window.location.href = "editpost.html"

}

async function handleAuthorPost(event) {
    let author = event.target.value;
    if (author == "") {
        document.getElementById("msg").innerText = "Enter Valid Author name"
        window.location.href = "viewpost.html"
    }
    else {
        document.getElementById("msg").innerText = "";
    }

    let result = await fetch(`http://localhost:5000/post/authorPost/${author}`, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'

        }
    })

    let response = await result.json();

    if (response.status) {
        container.innerHTML = "";
        document.getElementById("msg").innerText = response.msg;
        let postData = response.data;
        container = document.getElementById("post-container");

        postData.map((post, index) => {
            let div = document.createElement("div");

            div.setAttribute("id", `${post.username}_${index + 1}`);
            div.setAttribute("class", "postBlocks");

            div.innerHTML = `
            <h1>${post.username} : ${post.title}</h1>
            <hr>
            <p>Content: ${post.content}</p>
            <hr>
            <span>
                <p><b>Author : </b> ${post.author}</p>
                <p><b>Created On: </b> ${post.created_on}</p>
            </span>
            <button onclick ="editPost('${post._id}')">Edit</button>
            <button onclick ="deletePost('${post._id}','${post.title}')">Delete</button>
             <br>
                <br>
                <button onclick="likePost('${post._id}')">Likes : ${post.likes.length}</button>
                <button onclick="follow('${post.username}')">Follow</button>

            `;

            container.appendChild(div)
            console.log("Author Found ")
            return;
        })
    }
    else {
        container.innerHTML = "";
        document.getElementById("msg").innerText = response.msg;
    }

}

async function deletePost(id) {


    let postid = id;

    const result = await fetch(`http://localhost:5000/post/deletepost/${postid}`, {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json'
        }
    })

    let response = await result.json();
    alert("Are you sure want to delete TITLE : " + response.title + " Post");
    if (response.status) {
        alert("Post Deleted Sucessfully !")
        // document.getElementById("msg").innerText="Post Deleted Sucessfully !"
        location.reload();
    }
    else {
        container.innerHTML = "";
        document.getElementById("msg").innerText = response.msg
    }


}

let userObj = {}
async function likePost(id) {
    let userName = localStorage.getItem('userName');
    userObj.username = userName;

    const result = await fetch(`http://localhost:5000/post/likepost/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ ...userObj })

    })

    let response = await result.json();
    if (response.status) {
        document.getElementById("likescount").innerText=`Likes :${response.length} `
        alert(`likes count is ${response.length}`)
        return
    }
    else {
        alert(response.msg)
    }


}

async function follow(postusername){
    let logineduser = localStorage.getItem('userName')
    userObj.username = logineduser;
    const result = await fetch(`http://localhost:5000/user/followers/${postusername}`,{
        method:'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body:JSON.stringify({ ...userObj })
    })
    // console.log(result);
    let response  = await result.json();

    if(response.status){
        // console.log(response.length)
        // document.getElementById("folloerscount").innerText=response.length;
        alert(response.msg);
    }
    else{
        alert(response.msg);
    }

}

function flNames(event){
    event.preventDefault()
    window.location.href="followers.html"
}
