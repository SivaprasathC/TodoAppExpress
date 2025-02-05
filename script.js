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
                    <button style="height:40px;width:100px;border-radius: 15px;background-color: rgb(28, 170, 76);color: azure;font-size: large;" id="/update/${list._id} " class="edit" onclick="remove(this.id)">Edit</button>
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
        }, 1350);
    }))
    .catch(error => console.error("Error:", error)); 
     
}


function create(){

    let todo=document.getElementById('input').value;
    //todo example rcvd- 2025-02-11T00:35 to 11-02-2025 0:35
    let deadline=document.getElementById('inputdate').value;
    const datetimearray=deadline.split('T'); //splitting date and time
    let time=datetimearray[1]; //time
    let date=datetimearray[0]; //date
    let datearray=date.split('-'); //splitting date into day,month,year
    let day=datearray[2];
    let month=datearray[1];
    let year=datearray[0];
    let formatteddate=`${day}-${month}-${year} ${time}`;


    if(todo.trim()!='')
    {
        let data={
            "todo":todo.trim(),
            "deadline":formatteddate
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