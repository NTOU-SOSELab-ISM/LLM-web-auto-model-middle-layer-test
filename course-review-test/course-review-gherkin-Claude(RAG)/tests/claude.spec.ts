import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Course Review Website E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
  });

  test('Header styling and navigation', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)'); // 深灰色
    await expect(page.locator('header .logo')).toContainText('課程評價網');
    
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(2);
    await expect(navLinks.nth(0)).toHaveClass(/active/);
    
    await page.click('text=討論區');
    await expect(page).toHaveURL('http://localhost:8080/discussion.html');
    await expect(navLinks.nth(1)).toHaveClass(/active/);
    
    await page.click('text=課程資訊查詢區');
    await expect(page).toHaveURL('http://localhost:8080/index.html');
    await expect(navLinks.nth(0)).toHaveClass(/active/);
  });

  test('Page background color', async ({ page }) => {
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(240, 240, 240)'); // 淺灰色
  });

  test('Course search functionality', async ({ page }) => {
    await page.fill('#search-input', '程式設計');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toContainText('程式設計概論');

    await page.click('input[value="teacher"]');
    await page.fill('#search-input', '王小明');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toContainText('王小明');
  });

  test('Course card styling and information', async ({ page }) => {
    const firstCard = page.locator('.course-card').first();
    await expect(firstCard).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // 白色背景
    await expect(firstCard).toHaveCSS('border-radius', '4px'); // 圓角

    await expect(firstCard.locator('h3')).toBeVisible(); // 課程名稱
    await expect(firstCard.locator('p:has-text("教師：")')).toBeVisible(); // 老師姓名
    await expect(firstCard.locator('.ratings')).toBeVisible(); // 評分區域
    await expect(firstCard.locator('p:has-text("討論熱度：")')).toBeVisible(); // 討論熱度
  });

  test('Course selection and comment display', async ({ page }) => {
    await page.click('.course-card:first-child');
    await expect(page.locator('.course-card:first-child')).toHaveClass(/selected/);
    await expect(page.locator('.course-card:first-child')).toHaveCSS('border-color', 'rgb(51, 51, 51)'); // 深灰色邊框
    await expect(page.locator('#course-details')).toBeVisible();
    await expect(page.locator('#comments-list .comment')).toHaveCount(2);
  });

  test('Add new comment and verify updates', async ({ page }) => {
    await page.click('.course-card:first-child');
    const initialCommentCountText = await page.locator('.course-card:first-child p:has-text("討論熱度：")').innerText();
    const initialCommentCount = parseInt(initialCommentCountText.split('：')[1].trim());

    const getAverageRating = async (ratingType: string) => {
      const stars = await page.locator(`.course-card:first-child .ratings p:has-text("${ratingType}") .stars`).innerText();
      return stars.split('').filter(char => char === '★').length;
    };

    const initialCoolness = await getAverageRating('課程涼度');
    const initialSweetness = await getAverageRating('給分甜度');
    const initialDifficulty = await getAverageRating('考試難度');

    await page.click('#add-comment-button');
    await page.fill('#username', 'Test User');
    await page.fill('#comment-content', 'This is a test comment');

    const newCoolness = 4;
    const newSweetness = 3;
    const newDifficulty = 2;

    await page.click(`.stars[data-rating="course-coolness"] span:nth-child(${newCoolness})`);
    await page.click(`.stars[data-rating="grading-sweetness"] span:nth-child(${newSweetness})`);
    await page.click(`.stars[data-rating="exam-difficulty"] span:nth-child(${newDifficulty})`);
    await page.click('#submit-comment');
    
    // 檢查新評論
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('Test User');
    await expect(newComment).toContainText('This is a test comment');
    await expect(newComment.locator('.stars').nth(0)).toContainText('★'.repeat(newCoolness) + '☆'.repeat(5 - newCoolness));
    await expect(newComment.locator('.stars').nth(1)).toContainText('★'.repeat(newSweetness) + '☆'.repeat(5 - newSweetness));
    await expect(newComment.locator('.stars').nth(2)).toContainText('★'.repeat(newDifficulty) + '☆'.repeat(5 - newDifficulty));

    // 檢查課程卡片更新
    const updatedCommentCountText = await page.locator('.course-card:first-child p:has-text("討論熱度：")').innerText();
    const updatedCommentCount = parseInt(updatedCommentCountText.split('：')[1].trim());
    expect(updatedCommentCount).toBe(initialCommentCount + 1);

    const updatedCoolness = await getAverageRating('課程涼度');
    const updatedSweetness = await getAverageRating('給分甜度');
    const updatedDifficulty = await getAverageRating('考試難度');

    // 檢查評分是否在合理範圍內
    expect(updatedCoolness).toBeGreaterThanOrEqual(Math.min(initialCoolness, newCoolness));
    expect(updatedCoolness).toBeLessThanOrEqual(Math.max(initialCoolness, newCoolness));

    expect(updatedSweetness).toBeGreaterThanOrEqual(Math.min(initialSweetness, newSweetness));
    expect(updatedSweetness).toBeLessThanOrEqual(Math.max(initialSweetness, newSweetness));

    expect(updatedDifficulty).toBeGreaterThanOrEqual(Math.min(initialDifficulty, newDifficulty));
    expect(updatedDifficulty).toBeLessThanOrEqual(Math.max(initialDifficulty, newDifficulty));
  });

  test('Discussion board functionality and styling', async ({ page }) => {
    await page.goto('http://localhost:8080/discussion.html');
    
    const chatContainer = page.locator('.chat-container');
    await expect(chatContainer).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // 白色背景
    await expect(chatContainer).toHaveCSS('border', '1px solid rgb(221, 221, 221)'); // 邊框

    await expect(page.locator('#chat-messages .message')).toHaveCount(10);

    await page.fill('#nickname', 'Test User');
    await page.fill('#message-input', 'Hello, this is a test message!');
    await page.click('#send-message');

    await expect(page.locator('#chat-messages .message')).toHaveCount(11);
    const lastMessage = page.locator('#chat-messages .message').last();
    await expect(lastMessage).toContainText('Test User');
    await expect(lastMessage).toContainText('Hello, this is a test message!');
  });

  test('Verify initial JSON data', async ({ page }) => {
    // 讀取並解析 JSON 文件
    const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../courses.json'), 'utf-8'));
    const commentsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../comments.json'), 'utf-8'));
    const initialMessagesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../initial_messages.json'), 'utf-8'));

    // 驗證課程數據
    const courseCards = await page.locator('.course-card').count();
    expect(courseCards).toBe(coursesData.length);

    for (let i = 0; i < courseCards; i++) {
      const card = page.locator('.course-card').nth(i);
      await expect(card).toContainText(coursesData[i].name);
      await expect(card).toContainText(coursesData[i].teacher);
      await expect(card).toContainText(`討論熱度：${coursesData[i].commentCount}`);
    }

    // 驗證評論數據
    await page.click('.course-card:first-child');
    const comments = await page.locator('#comments-list .comment').count();
    const courseComments = commentsData.filter(comment => comment.courseId === 1);
    expect(comments).toBe(courseComments.length);

    // 驗證初始聊天消息
    await page.goto('http://localhost:8080/discussion.html');
    const messages = await page.locator('#chat-messages .message').count();
    expect(messages).toBe(initialMessagesData.length);
  });
});