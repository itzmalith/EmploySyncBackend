const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user.controller')
const { protect, authorize } = require('../../middleware/auth.middleware');


router.post('/', protect, authorize('create:user'), userController.createUser);

router.get('/', protect, authorize('read:user'), userController.getUsers);

router.put('/', protect, authorize('update:user'), userController.editUser);
router.delete('/:id', protect, authorize('delete:user'), userController.deleteUser);
router.get('/:id', protect, authorize('read:user'), userController.getUserById);

router.get('/:id/cv', userController.getUserCv);
router.get('/:id/organization', userController.getUserOrganization);
router.post('/:id/cv', userController.createUserCv);
router.put('/:id/cv', userController.updateUserCv);
router.delete('/:id/cv', userController.deleteUserCv);

module.exports = router;

