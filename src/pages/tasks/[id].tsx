// pages/tasks/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchTaskDetail = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Tento úkol nebyl nalezen.");
          } else {
            setError("Došlo k chybě při načítání dat.");
          }
          return;
        }

        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError("Chyba síťového připojení.");
      }
    };

    fetchTaskDetail();
  }, [id]); // Závislost na 'id' - při změně URL se data stáhnou znovu

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <Link href="/tasks" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>
        ← Zpět na hlavní seznam
      </Link>

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Detail úkolu</h2>
        
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : !task ? (
          <p>Načítám data...</p>
        ) : (
          <div>
            <p><strong>ID úkolu:</strong> {task.id}</p>
            <p><strong>Název:</strong> {task.name}</p>
            <p><strong>Stav:</strong> {task.completed ? "✅ Dokončeno" : "❌ Zpracovává se"}</p>
          </div>
        )}
      </div>
    </div>
  );
}