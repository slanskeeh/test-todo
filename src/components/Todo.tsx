"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  addTodo,
  toggleTodo,
  deleteTodo,
  clearTodos,
  setFilter,
  loadState,
} from "@/lib/redux/store";

export default function TodoApp() {
  const dispatch = useDispatch();
  const { todos, filter } = useSelector((state: RootState) => state);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const savedState = localStorage.getItem("todoState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch(loadState(parsedState));
      } catch (error) {
        console.error("Failed to parse saved state:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem("todoState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch(loadState(parsedState));
      } catch (error) {
        console.error("Failed to parse saved state:", error);
      }
    }
  }, [dispatch]);

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "current":
        return !todo.completed && !todo.deleted;
      case "completed":
        return todo.completed && !todo.deleted;
      case "trash":
        return todo.deleted;
      default:
        return !todo.deleted;
    }
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <form onSubmit={handleAddTodo} className="flex gap-4 mb-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add
            </button>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Add new TODO..."
            />
            <button
              type="button"
              onClick={() => dispatch(clearTodos())}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Clear all
            </button>
          </form>

          <div className="border-b mb-6">
            <nav className="flex gap-4">
              {(["current", "all", "completed", "trash"] as const).map(
                (filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => dispatch(setFilter(filterOption))}
                    className={`pb-2 px-1 ${
                      filter === filterOption
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {String(filterOption[0]).toUpperCase() +
                      String(filterOption).slice(1)}
                  </button>
                )
              )}
            </nav>
          </div>

          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => dispatch(toggleTodo(todo.id))}
                  className="h-4 w-4"
                />
                <span
                  className={todo.completed ? "line-through text-gray-500" : ""}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => dispatch(deleteTodo(todo.id))}
                  className="ml-auto text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
