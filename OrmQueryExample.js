const { Student, Course, Enrollment } = require('./models'); // 假設你有一個 models/index.js 匯出所有模型

async function findUngraded() {
  try {
    const results = await Enrollment.findAll({
      where: {
        Grade: null
      },
      include: [
        {
          model: Student,
          attributes: ['Student_ID', 'Name']
        },
        {
          model: Course,
          attributes: ['Course_ID', 'Title']
        }
      ]
    });

    console.log('未評分的選課記錄：');
    results.forEach(record => {
      const student = record.Student;
      const course = record.Course;
      console.log(`學生：${student.Name} (${student.Student_ID}), 課程：${course.Title} (${course.Course_ID})`);
    });

    return results;
  } catch (err) {
    console.error('查詢失敗：', err);
  }
}

findUngraded();
