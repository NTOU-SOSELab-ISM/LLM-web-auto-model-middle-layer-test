const { test, expect } = require('@playwright/test');

test.describe('課程評論網站測試', () => {
  test.beforeEach(async ({ page }) => {
    // 前往首頁
    await page.goto('http://localhost:8080/');
  });

  test('在「課程資訊查詢區」與「討論區」之間切換', async ({ page }) => {
    // 確認當前在課程資訊查詢區
    await expect(page.locator('header .nav a.active')).toHaveText('課程資訊查詢區');

    // 點擊「討論區」進行切換
    await page.click('header .nav a:has-text("討論區")');
    
    // 驗證是否已切換到討論區
    await expect(page.locator('header .nav a.active')).toHaveText('討論區');
  });

  test('根據課程名稱進行搜尋', async ({ page }) => {
    // 輸入搜尋關鍵字
    await page.fill('#search', '程式設計入門');
    
    // 選擇按課程名稱搜尋
    await page.selectOption('#search-type', 'course');

    // 點擊搜尋按鈕
    await page.click('button:has-text("搜尋")');

    // 確認搜尋結果是否包含目標課程
    const courseCard = page.locator('.card').filter({ hasText: '程式設計入門' });
    await expect(courseCard).toBeVisible();
  });

  test('提交一則課程評論', async ({ page }) => {
    // 先搜尋一門課程
    await page.fill('#search', '程式設計入門');
    await page.selectOption('#search-type', 'course');
    await page.click('button:has-text("搜尋")');

    // 點擊選擇這門課程
    await page.click('.card:has-text("程式設計入門")');

    // 點擊「新增課程評論」按鈕
    await page.click('#add-review-btn');

    // 填寫評論表單
    await page.fill('#user-name', '測試使用者');
    await page.fill('#user-comment', '這是一則測試評論。');
    await page.fill('#coolness-rating', '4');
    await page.fill('#grading-rating', '3');
    await page.fill('#difficulty-rating', '2');

    // 提交評論
    await page.click('button:has-text("提交")');

    // 驗證新評論是否顯示在課程評論列表中
    const review = page.locator('.card').filter({ hasText: '這是一則測試評論。' });
    await expect(review).toBeVisible();
  });

  test('在討論區發送訊息', async ({ page }) => {
    // 切換到討論區
    await page.click('header .nav a:has-text("討論區")');
    
    // 輸入暱稱、選擇顏色並發送訊息
    await page.fill('#user-name', '測試使用者');
    await page.fill('#message', '這是一則測試訊息。');
    await page.fill('#user-color', '#ff0000'); // 選擇顏色

    // 點擊發送按鈕
    await page.click('button:has-text("發送")');

    // 等待訊息出現在聊天室
    const message = page.locator('#chat-box div').filter({ hasText: '測試使用者' });
    await expect(message).toBeVisible();  // 等待訊息顯示

    // 再次等待確保渲染完成
    await page.waitForTimeout(500);  // 給渲染一點時間

    // 驗證訊息是否顯示在聊天室中並檢查顏色
    await expect(message).toContainText('這是一則測試訊息。');
    
    // 驗證顏色是否正確
    const coloredMessage = message.locator('span');  // 假設顏色套用在 span 內的暱稱上
    await expect(coloredMessage).toHaveCSS('color', 'rgb(255, 0, 0)'); // 驗證顏色
  });
});
