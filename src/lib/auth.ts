import { NextFunction, Request, Response } from 'express';
import { verifyToken } from './jwt';
import { prisma } from './prisma';

type JwtPayload = { sub: string };

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token =
      header?.startsWith('Bearer ') ? header.slice(7) : (req.query.token as string | undefined);

    if (!token) return res.status(401).json({ error: 'unauthorized' });

    const payload = verifyToken<JwtPayload>(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) return res.status(401).json({ error: 'unauthorized' });

    res.locals.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
  }
}