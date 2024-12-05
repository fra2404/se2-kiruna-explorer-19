import { getGraphConstruction } from '@controllers/graph.controllers';
import express from 'express';

const router = express.Router();

router.get('/', getGraphConstruction);

export const graphRoutes = router;