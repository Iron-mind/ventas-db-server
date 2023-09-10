import {Router} from 'express';
import userRoutes from './user.js';
import productRoutes from './product.js';
import saleRoutes from './sale.js';
import incomeRoutes from './income.js';
import expenseRoutes from './expense.js';
import sessionRoutes from './session.js';
import notificationRoutes from './notification.js';
import clientRoutes from './client.js';
import { jwtMiddleware } from './jwt.js';
const router = Router();

router.use('/user',jwtMiddleware, userRoutes);
router.use('/product', jwtMiddleware, productRoutes);
router.use('/sale',jwtMiddleware, saleRoutes);
router.use('/income',jwtMiddleware, incomeRoutes);
router.use('/expense',jwtMiddleware, expenseRoutes);
router.use('/session', sessionRoutes);
router.use('/notification',jwtMiddleware, notificationRoutes);
router.use('/client',jwtMiddleware, clientRoutes);

export default router;