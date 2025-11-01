import { Request, Response } from "express";
import { signToken } from "../lib/jwt";
import { hashPassword, verifyPassword } from "../lib/password";
import { prisma } from "../lib/prisma";

const user_auth = class user_auth {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) return res.status(400).json({ error: 'missing_email_or_password' });

      const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
      if (!user || !user.passwordHash) return res.status(401).json({ error: 'invalid_credentials' });

      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

      const token = signToken({ sub: user.id });
      res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, spotifyId: user.spotifyId, googleId: user.googleId },
      });
    } catch {
      res.status(500).json({ error: 'login_failed' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
      if (!email || !password) return res.status(400).json({ error: 'missing_email_or_password' });

      const normalizedEmail = email.trim().toLowerCase();
      const pwdHash = await hashPassword(password);

      const user = await prisma.user.create({
        data: { email: normalizedEmail, name: name ?? null, passwordHash: pwdHash },
      });

      const token = signToken({ sub: user.id });
      res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (e: any) {
      if (e.code === 'P2002') return res.status(409).json({ error: 'email_in_use' });
      return res.status(500).json({ error: 'register_failed' });
    }
  }
}

export default user_auth;