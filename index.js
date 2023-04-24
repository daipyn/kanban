import Kanban from "./kanban.js";   

const todo=document.querySelector(".cards.todo");
const pending=document.querySelector(".cards.pending");
const completed=document.querySelector(".cards.completed");


const taskbox=[todo,pending,completed];

function addTaskCard(task,index){
    const element=document.createElement("form");  
    element.className="card";
    element.dataset.id=task.taskId;
    element.draggable=true;
    element.innerHTML=`<input type="text" name="task" autocomplete="off" disabled="disabled" value="${task.content}">
    <div>
        <span class="task-id">#${task.taskId}</span>
        <span>
            <button class="bi bi-pencil edit" data-id="${task.taskId}"></button>
            <button class="bi bi-check-lg update hide" data-id="${task.taskId}" data-column="${index}"></button>
            <button class="bi bi-trash3 delete" data-id="${task.taskId}"></button>
        </span>
    </div>
    `;
    taskbox[index].appendChild(element);


}

Kanban.getallTask().forEach((tasks,index)=>{
    tasks.forEach(task=>{
        addTaskCard(task,index); 
    });
});

const addForm=document.querySelectorAll(".add");
addForm.forEach(form =>{
    form.addEventListener("submit",event=>{
        event.preventDefault();
        if(form.task.value){
            const task=Kanban.insertTask(form.submit.dataset.id,form.task.value.trim());
            addTaskCard(task,form.submit.dataset.id);
            form.reset();
        }
    });
})

taskbox.forEach(column=>{
    column.addEventListener("click",event=>{
        event.preventDefault();

        

        if(event.target.classList.contains("edit")){
            event.target.parentElement.parentElement.previousElementSibling.removeAttribute("disabled");
            event.target.classList.add("hide");
            event.target.nextElementSibling.classList.remove("hide");

        }
        if(event.target.classList.contains("update")){
            event.target.parentElement.parentElement.previousElementSibling.setAttribute("disabled","disabled");
            event.target.classList.add("hide");
            event.target.previousElementSibling.classList.remove("hide");
            const taskId=event.target.dataset.id;
            const columnId=event.target.dataset.column;
            const content=event.target.parentElement.parentElement.previousElementSibling.value;
            Kanban.updateTask(taskId,
                {
                    columnId:columnId,
                    content: content
                });
        }

        if(event.target.classList.contains("delete")){
            event.preventDefault();
            formInput.parentElement.remove();
            Kanban.deleteTask(event.target.dataset.id);
        }
    });

    column.addEventListener("dragstart",event=>{
        if(event.target.classList.contains("card")){
            event.target.classList.add("dragging");
        }
    });

    column.addEventListener("dragover",event=>{
        const card=document.querySelector(".dragging");
        column.appendChild(card);
    });

    column.addEventListener("dragend",event=>{
        if(event.target.classList.contains("card")){
            event.target.classList.remove("dragging");
            const taskId=event.target.dataset.id;
            const columnId=event.target.parentElement.dataset.id;
            const content=event.target.task.value;
            Kanban.updateTask(taskId,{
                columnId: columnId,
                content: content
            });
        }
    })
});