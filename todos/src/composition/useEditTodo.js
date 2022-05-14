import { ref, computed } from "vue";

export default function useEditTodo(todosRef) {
  const editingTodoRef = ref(null); // 当前正在修改的是哪一个todo
  let originTitle = null; // 缓存之前的title值
  const editTodo = (todo) => {
    originTitle = todo.title;
    editingTodoRef.value = todo;
  };
  const doneEdit = (todo) => {
    editingTodoRef.value = null;
    const title = todo.title.trim();
    if (title) {
      todo.title = title;
    } else {
    //   // 删除
    //   const index = todosRef.value.indexOf(todo); // 可以查找对象，indexOf 找出在数组的第n个位置,没有找到返回-1
    //   if (index >= 0) {
    //     todosRef.value.splice(index, 1);
    //   }
        todosRef.value =  todosRef.value.filter((item)=>{
            return item != todo;
        })   
    }
  };
  
  const cancelEdit = (todo) => {
    editingTodoRef.value = null;
    todo.title = originTitle;
  };
  const allDoneRef = computed({
    get() {
      return todosRef.value.filter((it) => !it.completed).length === 0; // 全部完成，返回true，否则返回false
    },
    set(checked) { // 改变复选框（全选按钮）状态，改变总体状态
      todosRef.value.forEach((todo) => {
        todo.completed = checked;
      });
    },
  });
  return {
    editingTodoRef,
    editTodo,
    doneEdit,
    cancelEdit,
    allDoneRef,
  };
}
