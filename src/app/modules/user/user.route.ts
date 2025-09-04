import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Route to create a regular user
router.post(
    '/create-user',
    UserController.createUser
);

router.patch('/user/:id',
    auth(['admin']),
    UserController.updateUser
)

router.get('/all-admin',
    auth(['admin']),
    UserController.getAllAdmin
)
router.get('/all-admin',
    auth(['admin']),
    UserController.getAllAdmin
)
router.get('/all-user',
    auth(['admin']),
    UserController.getAllUser
)
router.get('/:id',
    UserController.getSingleUser
)
router.get('/admin/:id',
    UserController.getSingleAdmin
)


router.patch('/:id',
    auth(['admin']),
    UserController.changeUserRole
)
router.patch('/status/:id',
    auth(['admin']),
    UserController.changeUserStatus
)

router.delete(
    '/:id',
    auth(['admin']),
    UserController.deleteUser);

router.delete('/admin/:id',
    auth(['admin']),
    UserController.deleteAdmin);


export const UserRoutes = router;
