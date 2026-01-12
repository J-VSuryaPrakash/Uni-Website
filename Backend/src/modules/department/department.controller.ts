import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import DepartmentService from "./department.service";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.validation";

const departmentService = new DepartmentService();

export const createDepartment = asyncHandler(async (req, res) => {

    const data = createDepartmentSchema.parse(req.body);

    const department = await departmentService.createDepartment(data);

    res.status(201).json(
        new ApiResponse(201, department, "Department created successfully")
    );
});

export const updateDepartment = asyncHandler(async (req, res) => {

    const id = Number(req.params.id);

    const data = updateDepartmentSchema.parse(req.body);
    const updatedDepartment = await departmentService.updateDepartment(id, data);

    res.status(200).json(
        new ApiResponse(200, updatedDepartment, "Department updated successfully")
    );
});

export const getAllDepartments = asyncHandler(async (req, res) => {

    const departments = await departmentService.getAllDepartments();

    res.status(200).json(
        new ApiResponse(200, departments, "Departments retrieved successfully")
    );
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  
    const id = Number(req.params.id);

    const deletedDepartment = await departmentService.deleteDepartment(id);
    res.status(200).json(
        new ApiResponse(200, deletedDepartment, "Department deleted successfully")
    );
});