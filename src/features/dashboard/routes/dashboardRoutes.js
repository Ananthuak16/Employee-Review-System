import express from 'express';
import { adminDashboard, employeeDashboard,  addEmployeeForm, addEmployee } from '../controller/dashboard_controller.js';

const router = express.Router();

// Admin Dashboard
router.get('/admin-dashboard', adminDashboard);

// Employee Dashboard
router.get('/employee-dashboard/:id', employeeDashboard);

// Add Employee Form
router.get('/add-employee', addEmployeeForm);
router.post('/add-employee', addEmployee);



export default router;
