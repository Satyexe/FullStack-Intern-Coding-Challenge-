const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateUser = [
  body('name')
    .isLength({ min: 3, max: 60 })
    .withMessage('Name must be between 3 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least 1 uppercase letter, 1 number, and 1 special character'),
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Role must be ADMIN, USER, or STORE_OWNER'),
  handleValidationErrors
];

const validateStore = [
  body('name')
    .isLength({ min: 3, max: 60 })
    .withMessage('Name must be between 3 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('owner_id')
    .isInt()
    .withMessage('Owner ID must be a valid integer'),
  handleValidationErrors
];

const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  handleValidationErrors
];

const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least 1 uppercase letter, 1 number, and 1 special character'),
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateStore,
  validateRating,
  validatePasswordUpdate,
  handleValidationErrors
};
