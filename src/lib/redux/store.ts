import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  deleted: boolean;
}

interface TodoState {
  todos: Todo[];
  filter: "current" | "all" | "completed" | "trash";
  isAuthenticated: boolean;
}

const initialState: TodoState = {
  todos: [],
  filter: "current",
  isAuthenticated: false,
};

// Slice
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        deleted: false,
      });
      localStorage.setItem(
        "todoState",
        JSON.stringify({ todos: state.todos, filter: state.filter })
      );
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
      localStorage.setItem(
        "todoState",
        JSON.stringify({ todos: state.todos, filter: state.filter })
      );
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) todo.deleted = true;
      localStorage.setItem(
        "todoState",
        JSON.stringify({ todos: state.todos, filter: state.filter })
      );
    },
    clearTodos: (state) => {
      state.todos = [];
      localStorage.setItem(
        "todoState",
        JSON.stringify({ todos: state.todos, filter: state.filter })
      );
    },
    setFilter: (state, action: PayloadAction<TodoState["filter"]>) => {
      state.filter = action.payload;
      localStorage.setItem(
        "todoState",
        JSON.stringify({ todos: state.todos, filter: state.filter })
      );
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    loadState: (state, action: PayloadAction<Partial<TodoState>>) => {
      if (action.payload.todos) state.todos = action.payload.todos;
      if (action.payload.filter) state.filter = action.payload.filter;
      if (action.payload.isAuthenticated !== undefined)
        state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  clearTodos,
  setFilter,
  setAuthenticated,
  loadState,
} = todoSlice.actions;

export const store = configureStore({
  reducer: todoSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
