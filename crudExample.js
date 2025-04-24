// crudExample.js
const pool = require('./db');

async function basicCrud() {
  let conn;
  try {
    conn = await pool.getConnection();

    // 1. INSERT 新增
    const Student_ID = 'S11121001';

    const rows = await conn.query(
      'SELECT COUNT(*) AS cnt FROM STUDENT WHERE Student_ID = ?', [ Student_ID ]);

      if (Number(rows[0].cnt) === 0) {
        sql = 'INSERT INTO STUDENT (Student_ID, Name, Birth_Date, Gender, Email, Phone, Address, Admission_Year, Status, Department_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await conn.query(sql, [Student_ID, '哎呦威', '2004-03-18', 'M', `${Student_ID}@std.ntu.edu.tw`, '0976-318-478', '台北市南港區信南港二段18號', 2021, '在學', 'CS001']);
      console.log('已新增一筆學生資料');
    } else {
      console.log('新增失敗，學號已經存在');
    }

    // 2. SELECT 查詢
    sql = 'SELECT * FROM STUDENT WHERE Department_ID = ?';
    const departmentRows = await conn.query(sql, ['CS001']);
    console.log('查詢結果：', departmentRows);
    

    // 3. UPDATE 更新
    sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
    const result = await conn.query(sql, ['黃志強', 'S10731001']);
    if (result.affectedRows > 0) {
        console.log('已更新學生名稱');
    } else {
        console.log('更新失敗，找不到對應的學生資料');
    }
    

    // 4. DELETE 刪除
    sql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
    const deleteResult = await conn.query(sql, ['S12345678']);
    if (deleteResult.affectedRows > 0) {
      console.log('已刪除該學生');
    } else {
      console.log('查無此人，刪除失敗');
    }
  } catch (err) {
    console.error('操作失敗：', err);
  } finally {
    if (conn) conn.release();
  }
}

basicCrud();
