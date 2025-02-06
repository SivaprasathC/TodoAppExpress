// text='<div id="todos"><p>hello</p></div>'
// document.getElementById("todolist").innerHTML = text


fetch("https://appsail-50024778614.development.catalystappsail.in/todos")
.then(response=> response.json())
.then(res=>{
    const data=res;
    let todo='';
    data.forEach(list => {
       todo+=` <div id="todos">
                <p>${list.todo}</p>
                <h5 style="color: red;">Deadline: ${list.deadline}</h5>
                <div id="buttons">
                    <button style="height:40px;width:100px;border-radius: 15px;background-color: red;color: azure;font-size: large;" id="${list._id} "  onclick="remove(this.id)">Delete</button>
                    <button style="height:40px;width:100px;border-radius: 15px;background-color: rgb(28, 170, 76);color: azure;font-size: large;" id="/update/${list._id}" class="edit" onclick="edit(this.id)">Edit</button>
                </div>
            </div>`
    })
    document.getElementById('todolist').innerHTML=todo;
})


function remove(id) {
    fetch('https://appsail-50024778614.development.catalystappsail.in/delete/' + id, {
        method: 'DELETE',
    })
    .then((function()
    {   document.getElementById('operation').innerHTML=`<h3 style="color: red;">Todo Deleted Successfully &#9989;</h3>`
        setTimeout(() => {
            window.location.reload();
        }, 950);
    }))
    .catch(error => console.error("Error:", error)); 
     
}


function create(){

    let todo=document.getElementById('input').value;
    console.log(document.getElementById('inputdate').value);
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
    

    if(todo.trim()!='')
    {
        let data={
            "todo":todo.trim(),
            "deadline": formatteddate
        }
        fetch("https://appsail-50024778614.development.catalystappsail.in/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(data), //covert to json string
        })
        .then((function()
        {   document.getElementById('operation').innerHTML=`<h3 style="color: green;">Todo Added Successfully &#9989;</h3>`
            setTimeout(() => {
                window.location.reload();
            }, 1350);
        }))
        .catch(error => console.error("Error:", error)); 
    }
   
}


function edit(id)
{    
    fetch("https://appsail-50024778614.development.catalystappsail.in/todos")
    .then(response=> response.json())
    .then(res=>{
    const data=res;
    data.forEach(list => {
        var result = id.replace("/update/", "")
        if (list._id==result){
            document.getElementById('input').value=list.todo;
        }
    })})
    .catch(error => console.error("Error:", error)); 
    document.getElementById('create').innerHTML=`<input type="text" id="input" placeholder="Enter Your Task and Deadline">
        <input type="datetime-local" id="inputdate" placeholder="Enter the date">
        <button id="${id}" class="edit" onclick="editsubmit(this.id)">Edit</button>
        <div id="operation"></div>`
}

function editsubmit(id){

    let fetchurl=`https://appsail-50024778614.development.catalystappsail.in${id}`
    fetch(fetchurl,  
     { 
         method: "PATCH",  
        headers: {    "Content-type": "application/json"  },  
        body: JSON.stringify({ "todo": document.getElementById('input').value,
                            "deadline": document.getElementById('inputdate').value
         })}) 
        .then((function()
         {   document.getElementById('operation').innerHTML=`<h3 style="color: green;">Todo Edited Successfully &#9989;</h3>`
             setTimeout(() => {
                 window.location.reload();
             }, 950);
         }))
         .catch(error => console.error("Error:", error)); 
    
}
