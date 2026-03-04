import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

const dataPath = path.join(process.cwd(), 'data', 'tasks.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
)
 { 
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const fileContents = await fs.readFile(dataPath, 'utf8');
      const tasks = JSON.parse(fileContents);
      
      // Metoda find vrátí první element, který splňuje podmínku
      const task = tasks.find((t: { id: number }) => t.id === Number(id));

      if (!task) {
        return res.status(404).json({ error: "Úkol nenalezen" }); // Splnění požadavku pro lepší známku
      }

      res.status(200).json(task);
    } 
    catch (error) {
      res.status(500).json({ error: "Chyba při čtení úkolu" });
    }
  }
  else if (req.method === 'PUT') {
  if (req.method === 'PUT') {
    try {
      const { completed } = req.body;

      const fileContents = await fs.readFile(dataPath, 'utf8');
      const tasks = JSON.parse(fileContents);
      
      // Najdeme index úkolu v poli, který chceme upravit
      const taskIndex = tasks.findIndex((t: { id: number }) => t.id === Number(id));

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Úkol nenalezen" });
      }

      // Aktualizace stavu 'completed' u nalezeného úkolu
      tasks[taskIndex].completed = completed;

      // Zápis aktualizovaných dat zpět do souboru
      await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
      
      res.status(200).json(tasks[taskIndex]);
    } 
    catch (error) {
      res.status(500).json({ error: "Chyba při úpravě úkolu" });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Metoda ${req.method} není povolena`);
  }

  }
  else if (req.method === 'DELETE') {
    try {
      const fileContents = await fs.readFile(dataPath, 'utf8');
      let tasks = JSON.parse(fileContents);
      
      const taskExists = tasks.some((t: { id: number }) => t.id === Number(id));
      
      if (!taskExists) {
        return res.status(404).json({ error: "Úkol nenalezen" });
      }

      tasks = tasks.filter((t: { id: number }) => t.id !== Number(id));
      await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
      
      res.status(200).json({ message: "Úkol byl úspěšně smazán" });
    } catch (error) {
      res.status(500).json({ error: "Chyba při mazání úkolu" });
    }
  }
else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Metoda ${req.method} není povolena`);
  }

} 