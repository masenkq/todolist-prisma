import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

const dataPath = path.join(process.cwd(), 'data', 'tasks.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Zpracování metody GET (Výpis úkolů)
  if (req.method === 'GET') {
    try {
      const fileContents = await fs.readFile(dataPath, 'utf8');
      const tasks = JSON.parse(fileContents);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Chyba při čtení souboru" });
    }
  } 
  // 2. Zpracování metody POST (Přidání úkolu)
  else if (req.method === 'POST') {
    try {
      // Získáme data z těla HTTP požadavku (request body)
      const { name } = req.body;

      // Validace: Chybový stav 400 (Bad Request) pro neplatné požadavky
      if (!name) {
        return res.status(400).json({ error: "Název úkolu je povinný" });
      }

      // Přečteme aktuální databázi
      const fileContents = await fs.readFile(dataPath, 'utf8');
      const tasks = JSON.parse(fileContents);

      // Vygenerujeme unikátní ID (o 1 větší než největší stávající)
      const newId = tasks.length > 0 ? Math.max(...tasks.map((t: { id: number }) => t.id)) + 1 : 1;      const newTask = {
        id: newId,
        name: name,
        completed: false // Nový úkol je automaticky nedokončený
      };

      // Zápis nového úkolu do JSON souboru
      tasks.push(newTask);
      await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));

      // Úspěšná odpověď se statusem 201 kdyz se ukol zapise uspesne
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Chyba při zápisu do souboru" });
    }
  } 
  // 3. Ošetření nepovolených metod
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Metoda ${req.method} není povolena`);
  }
}