import { Router, Request, Response } from 'express';
import { getLeaderboard } from '../services/stellar';

const router = Router();

// GET /leaderboard?period=all|month
router.get('/', async (req: Request, res: Response) => {
  try {
    const period = req.query.period === 'month' ? 'month' : 'all';
    const leaderboard = await getLeaderboard(period);
    res.json(leaderboard);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
