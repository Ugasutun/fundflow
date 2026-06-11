import { Router, Request, Response } from 'express';
import { getPool, getPoolCount } from '../services/stellar';

const router = Router();

// GET /pools — fetch all pools
router.get('/', async (req: Request, res: Response) => {
  try {
    const count = await getPoolCount();
    const pools = [];

    for (let i = 1; i <= count; i++) {
      const pool = await getPool(i);
      if (pool) pools.push(pool);
    }

    res.json(pools);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch pools' });
  }
});

// GET /pools/:id — fetch single pool
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pool = await getPool(Number(req.params.id));
    if (!pool) return res.status(404).json({ error: 'Pool not found' });
    res.json(pool);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch pool' });
  }
});

// GET /pools/:id/applications — fetch applications for a pool
router.get('/:id/applications', async (req: Request, res: Response) => {
  try {
    res.json([]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// POST /pools — create pool (returns tx for frontend to sign)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, amount, deadline, creator } = req.body;

    if (!name || !description || !amount || !deadline || !creator) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In production this would build and return an unsigned tx
    // Frontend signs it with Freighter and submits to Stellar
    res.json({
      message: 'Pool creation transaction ready',
      data: { name, description, amount, deadline, creator },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create pool' });
  }
});

export default router;