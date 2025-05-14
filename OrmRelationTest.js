const { Student, Course, Department } = require('./models');

async function testRelations() {
  try {
    // === 查詢學生與其系所 ===
    const student = await Student.findByPk('S10811005', {
      include: {
        model: Department,
        attributes: ['Department_ID', 'Department_Name']
      }
    });

    console.log(`學生 ${student.Name} 屬於 ${student.Department.Department_Name} 系`);

    // === 查詢學生與其所有修課 ===
    const studentWithCourses = await Student.findByPk('S10811005', {
      include: {
        model: Course,
        through: { attributes: [] }, // 不顯示 ENROLLMENT 表的中介欄位
        attributes: ['Course_ID', 'Title', 'Credits']
      }
    });

    console.log(`${studentWithCourses.Name} 選修的課程：`);
    studentWithCourses.Courses.forEach(course => {
      console.log(`- ${course.Title} (${course.Credits} 學分)`);
    });

    // === 查詢課程與所有修課學生 ===
    const courseWithStudents = await Course.findByPk('CS101', {
      include: {
        model: Student,
        through: { attributes: [] }, // 不顯示 ENROLLMENT 表的中介欄位
        attributes: ['Student_ID', 'Name']
      }
    });

    console.log(`選修 ${courseWithStudents.Title} 的學生：`);
    courseWithStudents.Students.forEach(student => {
      console.log(`- ${student.Name} (${student.Student_ID})`);
    });

  } catch (err) {
    console.error('關聯查詢出錯：', err);
  }
}

testRelations();
