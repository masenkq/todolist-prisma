import { useState, useEffect } from 'react';
import Link from 'next/link';


interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");

  const fetchTasks = () => {
    fetch('/api/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTaskName.trim()) return;

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTaskName }),
    });

    if (response.ok) {
      setNewTaskName("");
      fetchTasks();
    }
  };

  // NOVÁ FUNKCE: Odeslání PUT požadavku na změnu stavu
  const toggleTask = async (id: number, currentStatus: boolean) => {
    // Pošleme požadavek na konkrétní úkol (např. /api/tasks/2)
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus }), // Pošleme opačný stav, než jaký je teď
    });

    if (response.ok) {
      fetchTasks(); // Pokud se to na backendu uložilo, stáhneme a vykreslíme nová data
    }
  };

  const deleteTask = async (id: number) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });

    // Pokud backend vrátil 200 OK, stáhneme si nový seznam úkolů
    if (response.ok) {
      fetchTasks();
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Můj Todolist</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Zadejte nový úkol..."
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button onClick={addTask} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Přidat úkol
        </button>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li 
            key={task.id} 
            style={{ 
              padding: '15px', 
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Link href={`/tasks/${task.id}`} style={{ flexGrow: 1, textDecoration: 'none' }}>
            <span style={{ 
              textDecoration: task.completed ? 'line-through' : 'none', 
              color: task.completed ? 'gray' : 'black',
              flexGrow: 1 
            }}>
              {task.name}
            </span>
            </Link>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id, task.completed)}
                style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
              />
              {/* NOVÉ: Tlačítko pro mazání */}
              <button 
                onClick={() => deleteTask(task.id)}
                style={{ 
                  background: 'none', 
                  border: 'none',  
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}