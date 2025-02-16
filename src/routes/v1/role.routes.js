const express = require('express');
const router = express.Router();
const { createRole, updateRole, deleteRole } = require('../../controllers/role.controller');


router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
