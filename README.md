## 完成 CRUD  要有檢查學號機制
<img width="867" alt="image" src="https://github.com/user-attachments/assets/8249a0c2-ca82-4e9a-abec-70308c39cf35" />

1. 新增的部分先透過查詢該學號是否存在 STUDENT 表格，如果存在則會提示 "學號已存在" ，如果不存在則會提示新增成功，回到 MariaDB 檢查是否執行成功。
2. 更新的部分一樣先透過學號查詢是否有刺人存在，並將Name的地方改成要更新的內容。
3. 刪除的部分，原本講義給的範例學號 S10810001 ，因為透過查詢學號有查到這個人，因此成功刪除
4. 查詢會一次把指定表格的內容顯示出來

## 0430 transactionExample.js
<img width="294" alt="image" src="https://github.com/user-attachments/assets/959cbf13-a4c6-46f8-a548-4c56c5cb24ef" />
<img width="464" alt="image" src="https://github.com/user-attachments/assets/3a4cea1a-c89c-4c19-bde7-1e26f2fe860a" />

