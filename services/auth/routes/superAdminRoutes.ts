// services/auth/routes/superAdminRoutes.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { requireAuth } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

// 🔒 الراوتر متاح فقط للـ superadmin

// إنشاء حساب admin أو superadmin
router.post(
  "/create-admin",
  requireAuth,
  requireRole(["superadmin"]),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!["admin", "superadmin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      res.status(201).json({ message: `${role} created successfully` });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ message: "Error creating admin" });
    }
  }
);

// الحصول على كل المستخدمين
router.get("/users", requireAuth, requireRole(["superadmin"]), async (req, res) => {
  try {
    const users = await User.find({}, "-password -resetPasswordToken -resetPasswordExpires");
    res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// حذف مستخدم
router.delete("/user/:id", requireAuth, requireRole(["superadmin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// تحديث بيانات مستخدم (اسم، صلاحية، إلخ)
router.patch("/user/:id", requireAuth, requireRole(["superadmin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // { name: "مستخدم جديد" } أو role أو أي حاجة

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // نحدث الحقول المرسلة فقط
    Object.keys(updates).forEach((key) => {
      (user as any)[key] = updates[key];
    });

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

export default router;



/*
// services/auth/routes/superAdminRoutes.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { requireAuth } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

// 🔒 هذا الراوتر متاح فقط للـ superadmin

// ✅ إنشاء admin أو superadmin
router.post("/create-admin", requireAuth, requireRole(["superadmin"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: `${role} created successfully` });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Error creating admin" });
  }
});

// ✅ عرض كل المستخدمين
router.get("/users", requireAuth, requireRole(["superadmin"]), async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // استبعاد الباسورد
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ تعديل صلاحيات مستخدم
router.put("/update-role/:id", requireAuth, requireRole(["superadmin"]), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["user", "admin", "superadmin", "support", "moderator", "manager"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
});

// ✅ حذف مستخدم
router.delete("/delete-user/:id", requireAuth, requireRole(["superadmin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;


*/

/*
// services/auth/routes/superAdminRoutes.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { requireAuth } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

// 🔒 هذا الراوتر متاح فقط للـ superadmin
router.post("/create-admin", requireAuth, requireRole(["superadmin"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: `${role} created successfully` });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Error creating admin" });
  }
});

export default router;

*/
