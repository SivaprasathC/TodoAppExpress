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
    .then((function(){window.alert("Deleted successfully")
                   location.reload(true)
    }))
    .catch(error => console.error("Error:", error)); 
     
}
