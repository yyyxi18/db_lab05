// app.js
const express = require('express');
const pool = require('./db'); // 前面建立的 db.js
const app = express();
const PORT = 3000;

// 處理表單與 JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 靜態檔案目錄
app.use(express.static('public'));

// 測試路由
app.get('/', (req, res) => {
  res.send('Hello, Express + MariaDB!');
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器已啟動，網址：http://localhost:${PORT}`);
});

// 接收表單並寫入資料庫
app.post('/student', async (req, res) => {
    const { student_id, name, gender, email, department_id } = req.body;
    
    // 簡單驗證
    if (!student_id || !name) {
      return res.status(400).send('學號和姓名為必填欄位');
    }
    
    try {
      const conn = await pool.getConnection();
      const sql = 'INSERT INTO STUDENT (Student_ID, Name, Gender, Email, Department_ID) VALUES (?, ?, ?, ?, ?)';
      await conn.query(sql, [student_id, name, gender, email, department_id]);
      conn.release();
      
      res.send(`已成功新增學生：${name}`);
    } catch (err) {
      console.error('新增學生失敗：', err);
      res.status(500).send('新增失敗：' + err.message);
    }
  });



// 設定 EJS 模板引擎
app.set('view engine', 'ejs');

// 顯示學生列表
app.get('/studentList', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const sql = `
        SELECT s.Student_ID, s.Name, s.Gender, s.Email, d.Name AS Department_Name
        FROM STUDENT s
        LEFT JOIN DEPARTMENT d ON s.Department_ID = d.Department_ID
      `;
      const rows = await conn.query(sql);
      conn.release();
      
      res.render('studentList', { students: rows });
    } catch (err) {
      console.error('讀取學生失敗：', err);
      res.status(500).send('讀取失敗：' + err.message);
    }
  });
  

  // 學生列表 API
app.get('/api/students', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM STUDENT');
      conn.release();
      
      res.json(rows);
    } catch (err) {
      console.error('API 讀取失敗：', err);
      res.status(500).json({ error: '讀取失敗' });
    }
  });
  
  // 單一學生 API
  app.get('/api/students/:id', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query(
        'SELECT * FROM STUDENT WHERE Student_ID = ?',
        [req.params.id]
      );
      conn.release();
      
      if (rows.length === 0) {
        return res.status(404).json({ error: '找不到此學生' });
      }
      
      res.json(rows[0]);
    } catch (err) {
      console.error('API 讀取失敗：', err);
      res.status(500).json({ error: '讀取失敗' });
    }
  });
  
  // 新增學生 API
  app.post('/api/students', async (req, res) => {
    const { student_id, name, gender, email, department_id } = req.body;
    
    if (!student_id || !name) {
      return res.status(400).json({ error: '學號和姓名為必填欄位' });
    }
    
    try {
      const conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO STUDENT (Student_ID, Name, Gender, Email, Department_ID) VALUES (?, ?, ?, ?, ?)',
        [student_id, name, gender, email, department_id]
      );
      conn.release();
      
      res.status(201).json({
        message: '新增成功',
        student: { student_id, name, gender, email, department_id }
      });
    } catch (err) {
      console.error('API 新增失敗：', err);
      res.status(500).json({ error: '新增失敗: ' + err.message });
    }
  });
  
  // 更新學生 API
  app.put('/api/students/:id', async (req, res) => {
    const { name, gender, email, department_id } = req.body;
    
    try {
      const conn = await pool.getConnection();
      await conn.query(
        'UPDATE STUDENT SET Name = ?, Gender = ?, Email = ?, Department_ID = ? WHERE Student_ID = ?',
        [name, gender, email, department_id, req.params.id]
      );
      conn.release();
      
      res.json({ message: '更新成功' });
    } catch (err) {
      console.error('API 更新失敗：', err);
      res.status(500).json({ error: '更新失敗: ' + err.message });
    }
  });
  
  // 刪除學生 API
  app.delete('/api/students/:id', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM STUDENT WHERE Student_ID = ?', [req.params.id]);
      conn.release();
      
      res.json({ message: '刪除成功' });
    } catch (err) {
      console.error('API 刪除失敗：', err);
      res.status(500).json({ error: '刪除失敗: ' + err.message });
    }
  });
  