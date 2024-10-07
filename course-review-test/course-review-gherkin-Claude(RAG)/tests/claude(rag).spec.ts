import { test, expect } from '@playwright/test';
import fs from 'fs';

const BASE_URL = 'http://localhost:8080';

// 讀取測試數據
const coursesData = JSON.parse(fs.readFileSync('courses.json', 'utf-8'));
const commentsData = JSON.parse(fs.readFileSync('comments.json', 'utf-8'));
const initialMessagesData = JSON.parse(fs.readFileSync('initial_messages.json', 'utf-8'));

test.describe('課程評論網站 E2E 測試', () => {
  test('檢查原始 JSON 資料是否正確讀取', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);
    
    await page.waitForSelector('.course-card');

    const courseCards = await page.$$('.course-card');
    expect(courseCards.length).toBe(coursesData.length);

    const firstCourse = coursesData[0];
    const firstCard = await page.locator('.course-card').first();
    await expect(firstCard.locator('h3')).toHaveText(firstCourse.name);
    await expect(firstCard.locator('p:has-text("教師：")')).toContainText(firstCourse.teacher);
  });

  test('首頁基本元素和功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    await expect(page).toHaveTitle('課程評價網 - 課程資訊查詢區');

    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)');

    await expect(page.locator('nav a[href="index.html"]')).toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).not.toHaveClass('active');

    await page.fill('#search-input', '程式設計');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);

    await page.click('input[name="search-type"][value="teacher"]');
    await page.fill('#search-input', '王小明');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);
  });

  test('課程選擇和評論功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    const firstCourseCard = page.locator('.course-card').first();
    await firstCourseCard.click();
    
    await expect(firstCourseCard).toHaveClass(/selected/);

    const initialCommentCountText = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    const initialCommentCount = parseInt(initialCommentCountText.match(/\d+/)[0]);
    
    const initialCoolnessText = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();
    const initialCoolness = initialCoolnessText.split('★').length - 1;

    await page.click('#add-comment-button');
    await page.fill('#username', '測試用戶');
    await page.fill('#comment-content', '這是一個測試評論');
    
    // 新增的評分
    const newCoolness = 4;
    const newSweetness = 3;
    const newDifficulty = 5;
    
    await page.click(`.stars[data-rating="course-coolness"] span:nth-child(${newCoolness})`);
    await page.click(`.stars[data-rating="grading-sweetness"] span:nth-child(${newSweetness})`);
    await page.click(`.stars[data-rating="exam-difficulty"] span:nth-child(${newDifficulty})`);
    await page.click('#submit-comment');

    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('測試用戶');
    await expect(newComment).toContainText('這是一個測試評論');

    const updatedCommentCountText = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    const updatedCommentCount = parseInt(updatedCommentCountText.match(/\d+/)[0]);
    expect(updatedCommentCount).toBe(initialCommentCount + 1);

    const updatedCoolnessText = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();
    const updatedCoolness = updatedCoolnessText.split('★').length - 1;

    // 計算預期的新評分
    const expectedNewCoolness = Math.round((initialCoolness * initialCommentCount + newCoolness) / (initialCommentCount + 1));

    expect(updatedCoolness).toBe(expectedNewCoolness);
  });

  test('討論區功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/discussion.html`);

    await expect(page).toHaveTitle('課程評價網 - 討論區');

    await expect(page.locator('nav a[href="index.html"]')).not.toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).toHaveClass('active');

    await expect(page.locator('.chat-container')).toBeVisible();

    for (let i = 0; i < initialMessagesData.length; i++) {
      const message = initialMessagesData[i];
      const messageElement = page.locator('.chat-messages .message').nth(i);
      await expect(messageElement).toContainText(message.nickname);
      await expect(messageElement).toContainText(message.content);
    }

    await page.fill('#nickname', '測試用戶');
    await page.fill('#message-input', '這是一條測試消息');
    await page.click('#send-message');

    const lastMessage = page.locator('.chat-messages .message').last();
    await expect(lastMessage).toContainText('測試用戶');
    await expect(lastMessage).toContainText('這是一條測試消息');
  });

  test('數據持久性測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    await page.click('.course-card:first-child');
    await page.click('#add-comment-button');
    await page.fill('#username', '持久性測試用戶');
    await page.fill('#comment-content', '這是一個持久性測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(5)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(5)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    await page.reload();

    await page.click('.course-card:first-child');

    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('持久性測試用戶');
    await expect(newComment).toContainText('這是一個持久性測試評論');

    const updatedCoolness = await page.locator('.course-card:first-child .ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness.split('★').length - 1).toBeGreaterThanOrEqual(4);  // 假設新評論會使評分至少維持在4星或以上
  });
});