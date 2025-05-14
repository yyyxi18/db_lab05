const { sequelize, Student, Course, Enrollment } = require('./models');

async function transferStudent(studentId, oldDeptId, newDeptId) {
  const transaction = await sequelize.transaction();
  try {
    // Step 1: 更新學生所屬系所
    await Student.update(
      { Department_ID: newDeptId },
      { where: { Student_ID: studentId }, transaction }
    );

    // Step 2: 將舊系所必修課程標記為「轉系退選」
    const oldRequiredCourses = await Course.findAll({
      where: {
        Department_ID: oldDeptId,
        Is_Required: true
      },
      attributes: ['Course_ID'],
      transaction
    });

    const oldCourseIds = oldRequiredCourses.map(course => course.Course_ID);

    await Enrollment.update(
      { Status: '轉系退選' },
      {
        where: {
          Student_ID: studentId,
          Course_ID: oldCourseIds
        },
        transaction
      }
    );

    // Step 3: 新系所必修課程加選
    const newRequiredCourses = await Course.findAll({
      where: {
        Department_ID: newDeptId,
        Is_Required: true
      },
      attributes: ['Course_ID'],
      transaction
    });

    const currentSemester = '112-1';

    for (const course of newRequiredCourses) {
      await Enrollment.create({
        Student_ID: studentId,
        Course_ID: course.Course_ID,
        Semester: currentSemester,
        Status: '轉系加選'
      }, { transaction });
    }

    await transaction.commit();
    console.log(`學生 ${studentId} 已從 ${oldDeptId} 轉到 ${newDeptId}`);
  } catch (err) {
    await transaction.rollback();
    console.error('轉系處理失敗：', err);
  }
}

// 執行範例
transferStudent('S10811005', 'CS001', 'EE001');
