import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  return next();
};

// Auth validation
export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];

export const validateRegister = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Valid phone number is required"),
  body("countryCode")
    .optional()
    .isLength({ min: 1, max: 6 })
    .withMessage("Country code must be between 1 and 6 characters"),
  body("location")
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage("Location must be between 2 and 200 characters"),
  body("avatarUrl")
    .optional()
    .isURL()
    .withMessage("Avatar URL must be valid"),
  handleValidationErrors,
];

// Product validation
export const validateCreateProduct = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("originalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),
  body("stockQuantity")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
  body("categoryId").isString().withMessage("Valid category ID is required"),
  body("brand")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Brand must be at least 2 characters"),
  handleValidationErrors,
];

export const validateUpdateProduct = [
  param("id").notEmpty().withMessage("Valid product ID is required"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("originalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),
  body("stockQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
  body("categoryId")
    .optional()
    .isString()
    .withMessage("Valid category ID is required"),
  handleValidationErrors,
];

// Category validation
export const validateCreateCategory = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  handleValidationErrors,
];

// Cart validation
export const validateAddToCart = [
  body("productId").notEmpty().withMessage("Valid product ID is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  handleValidationErrors,
];

export const validateUpdateCartItem = [
  param("id").notEmpty().withMessage("Valid cart item ID is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  handleValidationErrors,
];

// Order validation
export const validateCreateOrder = [
  body("shippingAddressId")
    .notEmpty()
    .withMessage("Valid shipping address ID is required"),
  body("billingAddressId")
    .notEmpty()
    .withMessage("Valid billing address ID is required"),
  body("paymentMethod")
    .isIn([
      "CREDIT_CARD",
      "DEBIT_CARD",
      "PAYPAL",
      "BANK_TRANSFER",
      "CASH_ON_DELIVERY",
    ])
    .withMessage("Valid payment method is required"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be less than 500 characters"),
  handleValidationErrors,
];

// Review validation
export const validateCreateReview = [
  body("productId").notEmpty().withMessage("Valid product ID is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("comment")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Comment must be between 10 and 1000 characters"),
  handleValidationErrors,
];

// Query validation
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sortBy").optional().isString().withMessage("Sort by must be a string"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
  handleValidationErrors,
];
