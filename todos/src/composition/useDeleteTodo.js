

export default function useDeleteTodo(todosRef) {

    const deleteTodo = (todo)=>{
        todosRef.value =  todosRef.value.filter((item)=>{
            return item != todo;
        })
    }
    const deleteCompleted = ()=>{
        todosRef.value = todosRef.value.filter((item)=>!item.completed)
    }
    return {
        deleteTodo,
        deleteCompleted
    }
}