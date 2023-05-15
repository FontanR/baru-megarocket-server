const express = require('express');
const superAdminsController = require('../controllers/super-admins');
const superAdminsValidator = require('../validations/super-admins');

const superAdminsRouter = express.Router();

superAdminsRouter
  .post('/', superAdminsValidator.validateCreation, superAdminsController.createSuperAdmin)
  .delete('/:id', superAdminsController.deleteSuperAdmin);

module.exports = superAdminsRouter;
