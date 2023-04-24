export default class Kanban{
    // Get task, fetch task, update task, delete task, get all task 

    static getTasks(columnId){
        //const data=read(); // now you have information for all the columns

        const data=read().find(column=>{
            return column.columnId==columnId;
        });
        if(!data){
            return [];
        }
        return data.tasks;

        /*
            Another way
            const data=read()[columnId];
        if(!data){
            return [];
        }
        return data.tasks;

            
        */
    }

    static insertTask(columnId,content){
        const data=read();
        const currentcolumn=data.find(column=>{
            return column.columnId==columnId;
        }); // giving access to the column now you can add data
        const task = {
            taskId:Math.floor(Math.random() * 1000000),
            content:content // Given by user
        };

        currentcolumn.tasks.push(task); // Task has been added
        localStorage.setItem("data",JSON.stringify(data)); //Updated data and saved in local storage
        return task;
    }

    static deleteTask(taskId){
        const data=read();
        for(const column of data){
            const task=column.tasks.find(item =>{
                return item.taskId== taskId;
            });

            if(task){
                column.tasks.splice(column.tasks.indexOf(task),1);
            }
        }
        save(data);
    }

    static updateTask(taskId, newcontent){
        const data=read();

        function findColumnTask(){ // Find the current information 
            for(const column of data){
                const task=column.tasks.find(item=>{
                    return item.taskId==taskId;
                });
                if(task){
                    return[task,column]; // return the information of the found task
                }
            }
        }
        const [task,currentcolumn]=findColumnTask();  // task and currentcolumn variables get the content and columnId
        
        const targetcolumn=data.find(column=>{
            return column.columnId==newcontent.columnId;
        }); // Where you need to update it

        task.content=newcontent.content; // copied the contents
        currentcolumn.tasks.splice(currentcolumn.tasks.indexOf(task),1); // delete from the old 
        targetcolumn.tasks.push(task); // push the task with updated content to the required columnId

        save(data);
    }

    static getallTask(){
        const data=read();
        columncount();
        return [data[0].tasks,data[1].tasks,data[2].tasks];
    }
}

function read(){
    const data=localStorage.getItem("data");
    if(!data){
        return [
            {columnId:0, tasks:[]},
            {columnId:1, tasks:[]},
            {columnId:2, tasks:[]}
        ];
    }
    return JSON.parse(data);
}

function save(data){
    localStorage.setItem("data",JSON.stringify(data));
    columncount()
}

function columncount(){
    const data=read();
    const todo=document.querySelector("span.todo");
    todo.textContent=data[0].tasks.length;

    const pending=document.querySelector("span.pending");
    pending.textContent=data[1].tasks.length;

    const completed=document.querySelector("span.completed");
    completed.textContent=data[2].tasks.length;
}
