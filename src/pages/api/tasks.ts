import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany(); // Prisma vytáhne vše z MySQL
    return res.status(200).json(tasks);
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const newTask = await prisma.task.create({
      data: { name, completed: false }
    });
    return res.status(201).json(newTask);
  }
}