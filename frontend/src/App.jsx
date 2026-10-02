
import { useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "./api";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");

  const [editingId, setEditingId] = useState(null);

  // TASK COUNTER
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  // LOAD TASKS
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  // CREATE AND UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
      category
    };

    if (editingId) {
      await updateTask(editingId, taskData);
      setEditingId(null);
    } else {
      await createTask({
        ...taskData,
        completed: false
      });
    }

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setCategory("");

    await loadTasks();
  };

  // COMPLETE / UNCOMPLETE
  const handleComplete = async (task) => {
    await updateTask(task._id, {
      completed: !task.completed
    });

    await loadTasks();
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteTask(id);
    await loadTasks();
  };

  // EDIT TASK
  const handleEdit = (task) => {
    setEditingId(task._id);

    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);

    setDueDate(
      task.dueDate
        ? task.dueDate.substring(0, 10)
        : ""
    );

    setCategory(task.category || "");
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setCategory("");
  };

  // SEARCH AND FILTER
  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      (task.title || "").toLowerCase().includes(searchText) ||
      (task.description || "").toLowerCase().includes(searchText) ||
      (task.category || "").toLowerCase().includes(searchText);

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Pending" && !task.completed) ||
      (filterStatus === "Completed" && task.completed);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-container">

      <h1>Task Manager</h1>

      {/* ADD / UPDATE FORM */}
      <form onSubmit={handleSubmit} className="task-form">

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update Task" : "Add Task"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}

      </form>

      <hr />

      {/* TASK COUNTER */}
      <div className="task-summary">

        <div className="summary-card">
          <h3>Total Tasks</h3>
          <h2>{totalTasks}</h2>
        </div>

        <div className="summary-card">
          <h3>Completed</h3>
          <h2>{completedTasks}</h2>
        </div>

        <div className="summary-card">
          <h3>Pending</h3>
          <h2>{pendingTasks}</h2>
        </div>

      </div>

      {/* SEARCH AND FILTER */}
      <div className="task-controls">

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

      </div>

      {/* TASK LIST */}
      <div className="task-list">

        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (

            <div className="task-card" key={task._id}>

              <h2 className={task.completed ? "completed-title" : ""}>
                {task.title}
              </h2>

              <p>{task.description}</p>

              <p>
                Priority:{" "}
                <span className={`priority-${(task.priority || "medium").toLowerCase()}`}>
                  {task.priority}
                </span>
              </p>

              <p>Category: {task.category || "Not set"}</p>

              <p>
                Due Date:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-IN")
                  : "Not set"}
              </p>

              <p>
                Completed: {task.completed ? "Yes" : "No"}
              </p>

              <div className="task-buttons">

                <button onClick={() => handleComplete(task)}>
                  {task.completed
                    ? "Mark Incomplete"
                    : "Mark Complete"}
                </button>

                <button onClick={() => handleEdit(task)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default App;