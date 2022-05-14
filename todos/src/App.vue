<template>
  <div id="app">
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" autofocus="" autocomplete="off" placeholder="What needs to be done?"
          v-model="newTodoRef" @keyup.enter="addTodo" />
      </header>
      <section class="main" v-show="todosRef.length > 0">
        <input id="toggle-all" class="toggle-all"  type="checkbox" v-model = "allDoneRef"/>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <li class="todo" :class="{ completed: todo.completed,editing:editingTodoRef === todo }" v-for="todo in filteredTodosRef"  :key="todo.id">
            <div class="view">
              <input class="toggle" type="checkbox" v-model="todo.completed" />
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <button class="destroy" @click="deleteTodo(todo)"></button>
            </div>
            <input class="edit" @blur="doneEdit(todo)"  @keyup.enter="doneEdit(todo)" @keyup.escape="cancelEdit(todo)" v-model="todo.title" type="text" />
          </li>
        </ul>
      </section>
      <footer class="footer" v-show="todosRef.length> 0">
        <span class="todo-count">
          <strong>{{ remainingRef }}</strong>
          <span>item{{ remainingRef === 1 ? "" : "s" }} left</span>
        </span>
        <ul class="filters">
          <li>
            <a href="#/all" :class="{ selected: visibilityRef === 'all' }">
              All
            </a>
          </li>
          <li>
            <a href="#/active" :class="{ selected: visibilityRef === 'active' }">
              Active
            </a>
          </li>
          <li>
            <a href="#/completed" :class="{ selected: visibilityRef === 'completed' }">
              Completed
            </a>
          </li>
        </ul>
        <button class="clear-completed" @click="deleteCompleted" v-show="completedRef > 0">
          Clear completed
        </button>
      </footer>
    </section>
  </div>
</template>


<script setup>
import useTodoList from "./composition/useTodoList"; // 获取目前的todosList
import useNewTodo from "./composition/useNewTodo"; // create New todos
import useFilter from "./composition/useFilter"; // Filter todosList
import useEditTodo from "./composition/useEditTodo";
import useDeleteTodo from "./composition/useDeleteTodo"; 

const { todosRef } = useTodoList();
const { newTodoRef, addTodo } = useNewTodo(todosRef);
const { visibilityRef, filteredTodosRef, remainingRef, completedRef } = useFilter(todosRef);
const { editingTodoRef,editTodo,doneEdit,cancelEdit,allDoneRef} = useEditTodo(todosRef);
const {deleteTodo,deleteCompleted} = useDeleteTodo(todosRef);
</script>