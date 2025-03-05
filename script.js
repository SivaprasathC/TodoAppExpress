// text='<div id="todos"><p>hello</p></div>'
// document.getElementById("todolist").innerHTML = text

let token=localStorage.getItem("token")
// localStorage.removeItem("token")

if (token == null){
    window.location.href="login.html"
}
function logout() {
    localStorage.removeItem("token"); 
    window.location.href = "login.html";
}

let apiurl="https://appsail-50024778614.development.catalystappsail.in"

fetch(`${apiurl}/todos`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
})

.then(response=> response.json())
.then(res=>{
    const data=res;
    console.log(data)
    if (data==""){
        document.getElementById('todolist').innerHTML=`<h3 style="color: red;margin-top:40px">No Todos Added Yet &#128533;</h3><h3 style="color: green;">Start By Adding Your First ToDo! &#128519;</h3>`
    }

    else{

        data.sort((a, b) => {
            if (a.deadline === "No Deadline Given") return 1; 
            if (b.deadline === "No Deadline Given") return -1;
            
            const dateA = new Date(a.deadline.split(" ")[0].split("-").reverse().join("-") + "T" + a.deadline.split(" ")[1]);
            const dateB = new Date(b.deadline.split(" ")[0].split("-").reverse().join("-") + "T" + b.deadline.split(" ")[1]);
            
            return dateA - dateB;
        });
    
        
        let todo='';
        data.forEach(list => {
           todo+=` <div id="todos">
                    <p>${list.todo}</p>
                    <h5 style="color: red;">Deadline: ${list.deadline}</h5>
                    <div id="buttons">
                        <button style="height:40px;width:100px;border-radius: 30px;background-color: red;color: azure;font-size: large;padding-bottom:6px" id="${list._id} "  onclick="remove(this.id)">Delete</button>
                        <button style="height:40px;width:100px;border-radius: 30px;background-color: rgb(28, 170, 76);color: azure;font-size: large;padding-bottom:6px" id="/update/${list._id}" class="edit" onclick="edit(this.id)">Edit</button>
                    </div>
                </div>`
        })
        document.getElementById('todolist').innerHTML=todo;

    }


})


function remove(id) {
    fetch(`${apiurl}/delete/` + id, {
        method: 'DELETE',
    })
    .then((function()
    {   document.getElementById('operation').innerHTML=`<h3 style="color: red;">Todo Deleted Successfully &#9989;</h3>`
        setTimeout(() => {
            window.location.reload();
        }, 400);
    }))
    .catch(error => console.error("Error:", error)); 
     
}

function getdate(){
    //todo example rcvd- 2025-02-11T00:35 to 11-02-2025 0:35
    let deadline=document.getElementById('inputdate').value;
    if (deadline==""){  //if no deadline is choosen
        var formatteddate=`No Deadline Given`;
    }
    else{
        const datetimearray=deadline.split('T'); //splitting date and time
        let time=datetimearray[1]; //time
        let date=datetimearray[0]; //date
        let datearray=date.split('-'); //splitting date into day,month,year
        let day=datearray[2];
        let month=datearray[1];
        let year=datearray[0];
        var formatteddate =`${day}-${month}-${year} ${time}`;
    }
    return formatteddate;
}

function create(){

    let todo=document.getElementById('input').value;
    if(todo.trim()!='')
    {
        var data=JSON.stringify({
            "todo":todo.trim(),
            "deadline": getdate(),
            "jwttoken":token,

        })
        fetch(`${apiurl}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:(data), //covert to json string
        })
        .then((function()
        {   document.getElementById('operation').innerHTML=`<h3 style="color: green;">Todo Added Successfully &#9989;</h3>`
            setTimeout(() => {
                window.location.reload();
            }, 400);
        }))
        .catch(error => console.error("Error:", error)); 
    }
   
}


function edit(id)
{    
    fetch(`${apiurl}/todos`,
        {
            method:"GET",
            headers:{
            ContentType:"Application/json",
            Authorization: token
        }})
    .then(response=> response.json())
    .then(res=>{
    const data=res;
    data.forEach(list => {
        var result = id.replace("/update/", "")
        if (list._id==result)
        {
            document.getElementById('input').value=list.todo;
            document.getElementById('inputdate').value=list.deadline.split(" ")[0].split("-").reverse().join("-") + "T" + list.deadline.split(" ")[1];
        }
    })})
    .catch(error => console.error("Error:", error)); 
    document.getElementById('create').innerHTML=`<input type="text" id="input" placeholder="Enter Your Task and Deadline">
        <h3>Enter Deadline Below</h3>
        <input type="datetime-local" id="inputdate" placeholder="Enter the date">
        <button id="${id}" class="edit" onclick="editsubmit(this.id)">Edit</button>
        <div id="operation"></div>`
}

function editsubmit(id){

    let fetchurl=`${apiurl}${id}`
    fetch(fetchurl,  
     { 
         method: "PATCH",  
        headers: {    "Content-type": "application/json"  },  
        body: JSON.stringify({ "todo": document.getElementById('input').value,
                            "deadline": getdate()
         })}) 
        .then((function()
         {   document.getElementById('operation').innerHTML=`<h3 style="color: green;">Todo Edited Successfully &#9989;</h3>`
             setTimeout(() => {
                 window.location.reload();
             }, 400);
         }))
         .catch(error => console.error("Error:", error)); 
    
}
