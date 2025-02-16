const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user.controller')


router.post('/',  userController.createUser)
router.get('/',  userController.getUsers)
router.put('/', userController.editUser)
router.delete('/:id', userController.deleteUser)
router.get('/:id', userController.getUserById);


router.get('/:id/cv', userController.getUserCv);
router.get('/:id/organization', userController.getUserOrganization);
router.post('/:id/cv', userController.createUserCv);
router.put('/:id/cv', userController.updateUserCv);
router.delete('/:id/cv', userController.deleteUserCv);

module.exports = router;

