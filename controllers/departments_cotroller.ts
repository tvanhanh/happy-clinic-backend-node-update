import { Request, Response } from "express";
import Departments from "../models/Departments";
import mongoose from 'mongoose';


// Thêm phòng ban
export const addDepartments = async (req: Request, res: Response) => {
  try {
    const { departmentName, description } = req.body;
    console.log("Dữ liệu nhận từ frontend:", req.body);

    const newDepartment = new Departments({
      departmentName,
      description,
    });

    await newDepartment.save();

    res.status(201).json({ message: "Thêm thành công", department: newDepartment });
  } catch (error) {
    console.error("Lỗi khi tạo phòng ban", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Lấy danh sách tất cả phòng ban
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Departments.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error("Lỗi khi lấy phòng ban", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/// Cập nhật phòng ban
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    // ✅ ép id về string
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    const { departmentName, description } = req.body;

    // ✅ validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID không hợp lệ" });
      return;
    }

    const updated = await Departments.findByIdAndUpdate(
      id,
      { departmentName, description },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Không tìm thấy phòng ban" });
      return;
    }

    res.status(200).json({
      message: "Cập nhật thành công",
      department: updated,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng ban", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// Xoá phòng ban
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    // ✅ ép id về string
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    // ✅ validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID không hợp lệ" });
      return;
    }

    const deleted = await Departments.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Không tìm thấy phòng ban" });
      return;
    }

    res.status(200).json({ message: "Xoá thành công" });
  } catch (error) {
    console.error("Lỗi khi xoá phòng ban", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};