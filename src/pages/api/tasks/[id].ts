import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const taskId = Number(id);

  if (req.method === 'PUT') {
    const { completed } = req.body;
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { completed }
    });
    return res.status(200).json(task);
  }

  if (req.method === 'DELETE') {
    await prisma.task.delete({ where: { id: taskId } });
    return res.status(200).json({ message: "Deleted" });
  }
}