import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:8080';

// Helper function to calculate expected rating after adding a new rating
function calculateNewAverage(oldAverage: number, totalComments: number, newRating: number): number {
  return Math.round(((oldAverage * totalComments) + newRating) / (totalComments + 1));
}

test.describe('課程評論網站 E2E 測試', () => {

  test('應該可以從課程資訊查詢區跳轉到討論區', async ({ page }) => {
    await page.goto(`${baseUrl}/index.html`);

    // 確認頁面上有「課程資訊查詢區」的標題
    await expect(page).toHaveTitle(/課程評價網 - 課程資訊查詢區/);
    
    // 檢查 header 背景顏色
    const header = page.locator('header');
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)');  // 深灰色背景
    
    // 點擊討論區連結
    await page.click('text=討論區');
    
    // 檢查是否跳轉到討論區
    await expect(page).toHaveTitle(/課程評價網 - 討論區/);
    
    // 檢查 header 顏色是否一致
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)');
  });

  test('應該可以搜尋課程並顯示相關結果', async ({ page }) => {
    await page.goto(`${baseUrl}/index.html`);

    // 檢查 JSON 資料是否正確讀取
    const coursesJson = await page.evaluate(async () => {
      const response = await fetch('courses.json');
      return await response.json();
    });
    expect(coursesJson.length).toBeGreaterThan(0);

    // 輸入課程名稱關鍵字
    await page.fill('#search-input', '程式設計');
    
    // 點擊搜索按鈕
    await page.click('#search-button');
    
    // 檢查結果是否包含程式設計的課程
    const courseCard = await page.locator('.course-card:has-text("程式設計")');
    await expect(courseCard).toBeVisible();
  });

  test('應該可以依老師名字查詢', async ({ page }) => {
    await page.goto(`${baseUrl}/index.html`);

    // 選擇依老師名字查詢
    await page.click('input[value="teacher"]');
    
    // 輸入老師名字
    await page.fill('#search-input', '王小明');
    
    // 點擊搜索按鈕
    await page.click('#search-button');
    
    // 檢查結果是否包含老師「王小明」的課程
    const courseCard = await page.locator('.course-card:has-text("王小明")');
    await expect(courseCard).toBeVisible();
  });

  test('應該可以選擇課程並顯示對應的評論', async ({ page }) => {
    await page.goto(`${baseUrl}/index.html`);

    // 點擊某個課程
    await page.click('.course-card:has-text("程式設計概論")');
    
    // 檢查是否顯示評論區
    const commentSection = page.locator('#comments-list');
    await expect(commentSection).toBeVisible();
    
    // 檢查該課程的評論是否顯示
    const commentCard = await page.locator('.comment:has-text("這門課很有趣")');
    await expect(commentCard).toBeVisible();
  });

  test('應該可以新增課程評論，並檢查星星與評論數量更新', async ({ page }) => {
    await page.goto(`${baseUrl}/index.html`);
    
    // 選擇某個課程
    const courseCard = await page.locator('.course-card:has-text("程式設計概論")');
    await courseCard.click();

    // 取得初始的課程資訊
    const initialCommentCount = await courseCard.locator('p:has-text("討論熱度")').innerText();
    const initialCoolnessStars = await courseCard.locator('.ratings p:has-text("課程涼度") .stars').innerText();
    const initialSweetnessStars = await courseCard.locator('.ratings p:has-text("給分甜度") .stars').innerText();
    const initialDifficultyStars = await courseCard.locator('.ratings p:has-text("考試難度") .stars').innerText();

    // 提取當前的星星數與評論數
    const initialCoolnessRating = initialCoolnessStars.length - initialCoolnessStars.split('☆').length + 1;
    const initialSweetnessRating = initialSweetnessStars.length - initialSweetnessStars.split('☆').length + 1;
    const initialDifficultyRating = initialDifficultyStars.length - initialDifficultyStars.split('☆').length + 1;
    const commentCount = parseInt(initialCommentCount.match(/\d+/)[0]);

    // 點擊新增評論按鈕
    await page.click('#add-comment-button');
    
    // 填寫評論表單
    await page.fill('#username', '測試用戶');
    await page.fill('#comment-content', '這是一個自動化測試的評論');
    
    // 評分涼度、甜度和難度
    const newCoolnessRating = 4;
    const newSweetnessRating = 3;
    const newDifficultyRating = 2;
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(4)');  // 涼度 4 星
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(3)');  // 甜度 3 星
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(2)');  // 難度 2 星
    
    // 提交評論
    await page.click('#submit-comment');

    // 確認新評論是否出現在評論區
    const newComment = page.locator('.comment:has-text("測試用戶")');
    await expect(newComment).toBeVisible();

    // 計算預期的星星數量
    const expectedCoolnessRating = calculateNewAverage(initialCoolnessRating, commentCount, newCoolnessRating);
    const expectedSweetnessRating = calculateNewAverage(initialSweetnessRating, commentCount, newSweetnessRating);
    const expectedDifficultyRating = calculateNewAverage(initialDifficultyRating, commentCount, newDifficultyRating);

    // 檢查左側課程卡片的評論數量是否增加
    const updatedCommentCount = await courseCard.locator('p:has-text("討論熱度")').innerText();
    expect(updatedCommentCount).toContain(`${commentCount + 1} 💬`);

    // 檢查左側課程卡片的星星評分是否更新
    const updatedCoolnessStars = await courseCard.locator('.ratings p:has-text("課程涼度") .stars').innerText();
    expect(updatedCoolnessStars).toBe('★'.repeat(expectedCoolnessRating) + '☆'.repeat(5 - expectedCoolnessRating));

    const updatedSweetnessStars = await courseCard.locator('.ratings p:has-text("給分甜度") .stars').innerText();
    expect(updatedSweetnessStars).toBe('★'.repeat(expectedSweetnessRating) + '☆'.repeat(5 - expectedSweetnessRating));

    const updatedDifficultyStars = await courseCard.locator('.ratings p:has-text("考試難度") .stars').innerText();
    expect(updatedDifficultyStars).toBe('★'.repeat(expectedDifficultyRating) + '☆'.repeat(5 - expectedDifficultyRating));
  });

  test('討論區應該可以發送並顯示訊息', async ({ page }) => {
    await page.goto(`${baseUrl}/discussion.html`);
    
    // 檢查 JSON 資料是否正確讀取
    const messagesJson = await page.evaluate(async () => {
      const response = await fetch('initial_messages.json');
      return await response.json();
    });
    expect(messagesJson.length).toBeGreaterThan(0);

    // 填寫訊息資訊
    await page.fill('#nickname', '討論測試用戶');
    await page.fill('#message-input', '這是一個自動化測試訊息');
    
    // 發送訊息
    await page.click('#send-message');
    
    // 確認訊息出現在聊天室中
    const newMessage = page.locator('.message:has-text("討論測試用戶")');
    await expect(newMessage).toBeVisible();
    await expect(newMessage).toContainText('這是一個自動化測試訊息');
  });
});
