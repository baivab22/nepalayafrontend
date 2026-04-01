import { Router, type IRouter } from "express";
import { AdmissionModel, FacultyModel, NewsModel } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/admin/dashboard", async (_req, res) => {
  try {
    const [studentsCount, teachersCount] = await Promise.all([
      AdmissionModel.countDocuments().exec(),
      FacultyModel.countDocuments().exec(),
    ]);

    const genderValues = ["male", "female", "other"] as const;

    const genderCounts = await Promise.all(
      genderValues.map(async (gender) => ({
        name: gender.charAt(0).toUpperCase() + gender.slice(1),
        value: await AdmissionModel.countDocuments({ gender }).exec(),
      })),
    );

    const attendanceChart = [
      { day: "Mon", present: 120, absent: 10 },
      { day: "Tue", present: 118, absent: 12 },
      { day: "Wed", present: 122, absent: 8 },
      { day: "Thu", present: 119, absent: 11 },
      { day: "Fri", present: 121, absent: 9 },
      { day: "Sat", present: 80, absent: 5 },
      { day: "Sun", present: 0, absent: 0 },
    ];

    const totalPresent = attendanceChart.reduce((sum, d) => sum + d.present, 0);
    const totalAbsent = attendanceChart.reduce((sum, d) => sum + d.absent, 0);
    const attendanceRate =
      totalPresent + totalAbsent === 0
        ? 0
        : (totalPresent / (totalPresent + totalAbsent)) * 100;

    const faculty = await FacultyModel.find().exec();
    const departmentMap = new Map<string, number>();
    for (const member of faculty) {
      const dept = (member as any).department || "Other";
      departmentMap.set(dept, (departmentMap.get(dept) ?? 0) + 1);
    }

    const departmentStats = Array.from(departmentMap.entries()).map(
      ([name, count]) => ({ name, count }),
    );

    const news = await NewsModel.find().sort({ createdAt: -1 }).limit(6).exec();
    const notices = news.map((item) => ({
      _id: (item as any)._id,
      title: (item as any).title,
      date: (item as any).date,
      image: (item as any).image,
      views: 0,
    }));

    const monthlyRevenue = [
      { month: "Jan", revenue: 120000 },
      { month: "Feb", revenue: 135000 },
      { month: "Mar", revenue: 150000 },
      { month: "Apr", revenue: 165000 },
      { month: "May", revenue: 172000 },
      { month: "Jun", revenue: 180000 },
    ];

    const response = {
      students: studentsCount,
      teachers: teachersCount,
      employees: 25,
      earnings: 2500000,
      genderChart: genderCounts,
      attendanceChart,
      notices,
      departmentStats,
      monthlyRevenue,
      attendanceRate,
      studentGrowth: 12,
      teacherGrowth: 8,
    };

    res.json(response);
  } catch (err) {
    console.error("Failed to build admin dashboard stats", err);
    res.status(500).json({ error: "Failed to fetch admin dashboard stats" });
  }
});

export default router;
