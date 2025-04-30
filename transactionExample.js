// transactionExample.js
const pool = require('./db');

async function doTransaction() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction(); // 開始交易

        /* 假設要同時將學生 'S10811005' 的系所由 CS001 換成 EE001
        const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
        await conn.query(updateStudent, ['BA001', 'S10811005']);
        */
        const studentId = 'S11811004';
        const newDeptId = 'EE001';

        // 1. 檢查學生是否存在
        const rows = await conn.query('SELECT * FROM STUDENT WHERE Student_ID = ?', [studentId]);
        if (!rows || rows.length === 0) {
            throw new Error(`查無此學號：${studentId}`);
        }

        // 2. 更新系所
        const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
        await conn.query(updateStudent, [newDeptId, studentId]);

        await conn.commit();
        console.log('交易成功，已提交');

        // 3. 查詢學生目前的系所名稱
        const checkSql = 'SELECT Student_ID, Name, Department_ID FROM STUDENT WHERE Student_ID = ?';
        const result = await conn.query(checkSql, [studentId]);
        if (result.length > 0) {
            console.log(`修改後的學生資料如下：`);
            console.table(result);
        } else {
            console.log('查詢失敗，找不到該學生資料');
        }
    } catch (err) {
        // 若有任何錯誤，回滾所有操作
        if (conn) await conn.rollback();
        console.error('交易失敗，已回滾：', err);
    } finally {
        if (conn) conn.release();
    }
}

doTransaction();
