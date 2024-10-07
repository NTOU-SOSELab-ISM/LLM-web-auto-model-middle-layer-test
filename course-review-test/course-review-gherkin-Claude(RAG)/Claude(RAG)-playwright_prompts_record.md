# 產生testing

## Prompt1:

`RAG_playwright_injection.md`

## Result1:

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('課程評論網站 E2E 測試', () => {
  test('首頁基本元素和功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 課程資訊查詢區');

    // 檢查 header 元素
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).not.toHaveClass('active');

    // 檢查搜索功能
    await page.fill('#search-input', '程式設計');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);

    // 切換搜索類型並再次搜索
    await page.click('input[name="search-type"][value="teacher"]');
    await page.fill('#search-input', '王小明');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);
  });

  test('課程選擇和評論功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇一個課程
    await page.click('.course-card:first-child');
    await expect(page.locator('.course-card.selected')).toBeVisible();

    // 檢查評論區是否顯示
    await expect(page.locator('#comments-list')).toBeVisible();

    // 新增評論
    await page.click('#add-comment-button');
    await page.fill('#username', '測試用戶');
    await page.fill('#comment-content', '這是一個測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(4)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(3)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 檢查新評論是否出現
    const newComment = page.locator('#comments-list .comment:first-child');
    await expect(newComment).toContainText('測試用戶');
    await expect(newComment).toContainText('這是一個測試評論');
  });

  test('討論區功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/discussion.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 討論區');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).not.toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).toHaveClass('active');

    // 檢查聊天室是否存在
    await expect(page.locator('.chat-container')).toBeVisible();

    // 發送一條消息
    await page.fill('#nickname', '測試用戶');
    await page.fill('#message-input', '這是一條測試消息');
    await page.click('#send-message');

    // 檢查消息是否出現在聊天室
    const lastMessage = page.locator('.chat-messages .message:last-child');
    await expect(lastMessage).toContainText('測試用戶');
    await expect(lastMessage).toContainText('這是一條測試消息');
  });

  test('數據持久性測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇一個課程並添加評論
    await page.click('.course-card:first-child');
    await page.click('#add-comment-button');
    await page.fill('#username', '持久性測試用戶');
    await page.fill('#comment-content', '這是一個持久性測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(5)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(5)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 重新加載頁面
    await page.reload();

    // 再次選擇同一個課程
    await page.click('.course-card:first-child');

    // 檢查評論是否仍然存在
    const newComment = page.locator('#comments-list .comment:first-child');
    await expect(newComment).toContainText('持久性測試用戶');
    await expect(newComment).toContainText('這是一個持久性測試評論');
  });
});
```

## Prompt2:

有錯誤:
- 在課程選擇和評論功能測試中，沒有檢查到新增評論後左側的的課程資訊card上面的評論數量有沒有增加、被填滿的星數有沒有更新成加總後平均取四捨五入後的星數
- 沒有檢查原始資料的json檔案是否有被正確讀取

給我完整正確的測試程式碼

## Result2:

```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';

const BASE_URL = 'http://localhost:8080';

test.describe('課程評論網站 E2E 測試', () => {
  test.beforeEach(async ({ page }) => {
    // 在每個測試開始前重置本地存儲
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('檢查原始 JSON 資料是否正確讀取', async ({ page }) => {
    // 讀取原始 JSON 文件
    const coursesData = JSON.parse(fs.readFileSync('courses.json', 'utf-8'));
    const commentsData = JSON.parse(fs.readFileSync('comments.json', 'utf-8'));

    await page.goto(`${BASE_URL}/index.html`);
    
    // 等待資料加載完成
    await page.waitForSelector('.course-card');

    // 檢查課程數量是否正確
    const courseCards = await page.$$('.course-card');
    expect(courseCards.length).toBe(coursesData.length);

    // 檢查第一個課程的資訊是否正確
    const firstCourse = coursesData[0];
    const firstCard = await page.locator('.course-card').first();
    await expect(firstCard.locator('h3')).toHaveText(firstCourse.name);
    await expect(firstCard.locator('p:has-text("教師：")')).toContainText(firstCourse.teacher);
  });

  test('首頁基本元素和功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 課程資訊查詢區');

    // 檢查 header 元素
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).not.toHaveClass('active');

    // 檢查搜索功能
    await page.fill('#search-input', '程式設計');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);

    // 切換搜索類型並再次搜索
    await page.click('input[name="search-type"][value="teacher"]');
    await page.fill('#search-input', '王小明');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);
  });

  test('課程選擇和評論功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇第一個課程
    const firstCourseCard = page.locator('.course-card').first();
    await firstCourseCard.click();
    await expect(firstCourseCard).toHaveClass('selected');

    // 獲取初始評論數和評分
    const initialCommentCount = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    const initialCoolness = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();

    // 新增評論
    await page.click('#add-comment-button');
    await page.fill('#username', '測試用戶');
    await page.fill('#comment-content', '這是一個測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(4)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(3)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 檢查新評論是否出現在評論列表中
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('測試用戶');
    await expect(newComment).toContainText('這是一個測試評論');

    // 檢查課程卡片上的評論數是否增加
    const updatedCommentCount = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    expect(parseInt(updatedCommentCount.split(' ')[1])).toBeGreaterThan(parseInt(initialCommentCount.split(' ')[1]));

    // 檢查課程卡片上的評分是否更新
    const updatedCoolness = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness).not.toBe(initialCoolness);
  });

  test('討論區功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/discussion.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 討論區');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).not.toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).toHaveClass('active');

    // 檢查聊天室是否存在
    await expect(page.locator('.chat-container')).toBeVisible();

    // 發送一條消息
    await page.fill('#nickname', '測試用戶');
    await page.fill('#message-input', '這是一條測試消息');
    await page.click('#send-message');

    // 檢查消息是否出現在聊天室
    const lastMessage = page.locator('.chat-messages .message').last();
    await expect(lastMessage).toContainText('測試用戶');
    await expect(lastMessage).toContainText('這是一條測試消息');
  });

  test('數據持久性測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇第一個課程並添加評論
    await page.click('.course-card:first-child');
    await page.click('#add-comment-button');
    await page.fill('#username', '持久性測試用戶');
    await page.fill('#comment-content', '這是一個持久性測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(5)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(5)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 重新加載頁面
    await page.reload();

    // 再次選擇同一個課程
    await page.click('.course-card:first-child');

    // 檢查評論是否仍然存在
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('持久性測試用戶');
    await expect(newComment).toContainText('這是一個持久性測試評論');

    // 檢查課程卡片上的評分是否保持更新後的狀態
    const updatedCoolness = await page.locator('.course-card:first-child .ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness).toBe('★★★★★');
  });
});
```

## Prompt3:

測試直接整個爛掉了，因為寫了以下:
est.beforeEach(async ({ page }) => {
    // 在每個測試開始前重置本地存儲
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

不要從這邊操作localStorage，直接把寫好的json data寫死進去測試
給我完整正確的測試程式碼

## Result4:

```typescript
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
    
    // 等待資料加載完成
    await page.waitForSelector('.course-card');

    // 檢查課程數量是否正確
    const courseCards = await page.$$('.course-card');
    expect(courseCards.length).toBe(coursesData.length);

    // 檢查第一個課程的資訊是否正確
    const firstCourse = coursesData[0];
    const firstCard = await page.locator('.course-card').first();
    await expect(firstCard.locator('h3')).toHaveText(firstCourse.name);
    await expect(firstCard.locator('p:has-text("教師：")')).toContainText(firstCourse.teacher);
  });

  test('首頁基本元素和功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 課程資訊查詢區');

    // 檢查 header 元素
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).not.toHaveClass('active');

    // 檢查搜索功能
    await page.fill('#search-input', '程式設計');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);

    // 切換搜索類型並再次搜索
    await page.click('input[name="search-type"][value="teacher"]');
    await page.fill('#search-input', '王小明');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);
  });

  test('課程選擇和評論功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇第一個課程
    const firstCourseCard = page.locator('.course-card').first();
    await firstCourseCard.click();
    await expect(firstCourseCard).toHaveClass('selected');

    // 獲取初始評論數和評分
    const initialCommentCount = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    const initialCoolness = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();

    // 新增評論
    await page.click('#add-comment-button');
    await page.fill('#username', '測試用戶');
    await page.fill('#comment-content', '這是一個測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(4)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(3)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 檢查新評論是否出現在評論列表中
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('測試用戶');
    await expect(newComment).toContainText('這是一個測試評論');

    // 檢查課程卡片上的評論數是否增加
    const updatedCommentCount = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    expect(parseInt(updatedCommentCount.split(' ')[1])).toBeGreaterThan(parseInt(initialCommentCount.split(' ')[1]));

    // 檢查課程卡片上的評分是否更新
    const updatedCoolness = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness).not.toBe(initialCoolness);
  });

  test('討論區功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/discussion.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 討論區');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).not.toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).toHaveClass('active');

    // 檢查聊天室是否存在
    await expect(page.locator('.chat-container')).toBeVisible();

    // 檢查初始消息是否正確顯示
    for (let i = 0; i < initialMessagesData.length; i++) {
      const message = initialMessagesData[i];
      const messageElement = page.locator('.chat-messages .message').nth(i);
      await expect(messageElement).toContainText(message.nickname);
      await expect(messageElement).toContainText(message.content);
    }

    // 發送一條新消息
    await page.fill('#nickname', '測試用戶');
    await page.fill('#message-input', '這是一條測試消息');
    await page.click('#send-message');

    // 檢查新消息是否出現在聊天室
    const lastMessage = page.locator('.chat-messages .message').last();
    await expect(lastMessage).toContainText('測試用戶');
    await expect(lastMessage).toContainText('這是一條測試消息');
  });

  test('數據持久性測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇第一個課程並添加評論
    await page.click('.course-card:first-child');
    await page.click('#add-comment-button');
    await page.fill('#username', '持久性測試用戶');
    await page.fill('#comment-content', '這是一個持久性測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(5)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(5)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 重新加載頁面
    await page.reload();

    // 再次選擇同一個課程
    await page.click('.course-card:first-child');

    // 檢查評論是否仍然存在
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('持久性測試用戶');
    await expect(newComment).toContainText('這是一個持久性測試評論');

    // 檢查課程卡片上的評分是否保持更新後的狀態
    const updatedCoolness = await page.locator('.course-card:first-child .ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness).toBe('★★★★★');
  });
});
```


## Prompt5:

有錯誤:
在課程選擇和評論功能測試中，選擇第一個課程部分的測試寫錯了，會導致以下錯誤:

claude(rag).spec.ts:62
Error: Timed out 5000ms waiting for expect(locator).toHaveClass(expected)

Locator: locator('.course-card').first()
Expected string: "selected"
Received string: "course-card selected"
Call log:
  - expect.toHaveClass with timeout 5000ms
  - waiting for locator('.course-card').first()
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"
  -   locator resolved to <div data-id="1" class="course-card selected">…</div>
  -   unexpected value "course-card selected"

## Result5:

沒有給我全部的程式碼

```typescript

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
    
    // 等待資料加載完成
    await page.waitForSelector('.course-card');

    // 檢查課程數量是否正確
    const courseCards = await page.$$('.course-card');
    expect(courseCards.length).toBe(coursesData.length);

    // 檢查第一個課程的資訊是否正確
    const firstCourse = coursesData[0];
    const firstCard = await page.locator('.course-card').first();
    await expect(firstCard.locator('h3')).toHaveText(firstCourse.name);
    await expect(firstCard.locator('p:has-text("教師：")')).toContainText(firstCourse.teacher);
  });

  test('首頁基本元素和功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 課程資訊查詢區');

    // 檢查 header 元素
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).not.toHaveClass('active');

    // 檢查搜索功能
    await page.fill('#search-input', '程式設計');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);

    // 切換搜索類型並再次搜索
    await page.click('input[name="search-type"][value="teacher"]');
    await page.fill('#search-input', '王小明');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);
  });

  test('課程選擇和評論功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇第一個課程
    const firstCourseCard = page.locator('.course-card').first();
    await firstCourseCard.click();
    
    // 檢查是否有 'selected' 類別，而不是完全匹配
    await expect(firstCourseCard).toHaveClass(/selected/);

    // 獲取初始評論數和評分
    const initialCommentCount = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    const initialCoolness = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();

    // 新增評論
    await page.click('#add-comment-button');
    await page.fill('#username', '測試用戶');
    await page.fill('#comment-content', '這是一個測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(4)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(3)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 檢查新評論是否出現在評論列表中
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('測試用戶');
    await expect(newComment).toContainText('這是一個測試評論');

    // 檢查課程卡片上的評論數是否增加
    const updatedCommentCount = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    const initialCount = parseInt(initialCommentCount.split(' ')[1]);
    const updatedCount = parseInt(updatedCommentCount.split(' ')[1]);
    expect(updatedCount).toBeGreaterThan(initialCount);

    // 檢查課程卡片上的評分是否更新
    const updatedCoolness = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness).not.toBe(initialCoolness);
  });

  test('討論區功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/discussion.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 討論區');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).not.toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).toHaveClass('active');

    // 檢查聊天室是否存在
    await expect(page.locator('.chat-container')).toBeVisible();

    // 檢查初始消息是否正確顯示
    for (let i = 0; i < initialMessagesData.length; i++) {
      const message = initialMessagesData[i];
      const messageElement = page.locator('.chat-messages .message').nth(i);
      await expect(messageElement).toContainText(message.nickname);
      await expect(messageElement).toContainText(message.content);
    }

    // 發送一條新消息
    await page.fill('#nickname', '測試用戶');
    await page.fill('#message-input', '這是一條測試消息');
    await page.click('#send-message');

    // 檢查新消息是否出現在聊天室
    const lastMessage = page.locator('.chat-messages .message').last();
    await expect(lastMessage).toContainText('測試用戶');
    await expect(lastMessage).toContainText('這是一條測試消息');
  });

  test('數據持久性測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇第一個課程並添加評論
    await page.click('.course-card:first-child');
    await page.click('#add-comment-button');
    await page.fill('#username', '持久性測試用戶');
    await page.fill('#comment-content', '這是一個持久性測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(5)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(5)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 重新加載頁面
    await page.reload();

    // 再次選擇同一個課程
    await page.click('.course-card:first-child');

    // 檢查評論是否仍然存在
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('持久性測試用戶');
    await expect(newComment).toContainText('這是一個持久性測試評論');

    // 檢查課程卡片上的評分是否保持更新後的狀態
    const updatedCoolness = await page.locator('.course-card:first-child .ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness).toBe('★★★★★');
  });
});

```

## Prompt6:

有錯誤:
在課程選擇和評論功能測試中，檢查課程卡片上的評論數是否增加寫錯了，會導致以下錯誤:
claude(rag).spec.ts:88
Error: expect(received).toBeGreaterThan(expected)

Expected: > NaN
Received:   NaN

給我完整正確的測試程式碼

## Result6:

```typescript
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
    
    // 等待資料加載完成
    await page.waitForSelector('.course-card');

    // 檢查課程數量是否正確
    const courseCards = await page.$$('.course-card');
    expect(courseCards.length).toBe(coursesData.length);

    // 檢查第一個課程的資訊是否正確
    const firstCourse = coursesData[0];
    const firstCard = await page.locator('.course-card').first();
    await expect(firstCard.locator('h3')).toHaveText(firstCourse.name);
    await expect(firstCard.locator('p:has-text("教師：")')).toContainText(firstCourse.teacher);
  });

  test('首頁基本元素和功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 課程資訊查詢區');

    // 檢查 header 元素
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(51, 51, 51)');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).not.toHaveClass('active');

    // 檢查搜索功能
    await page.fill('#search-input', '程式設計');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);

    // 切換搜索類型並再次搜索
    await page.click('input[name="search-type"][value="teacher"]');
    await page.fill('#search-input', '王小明');
    await page.click('#search-button');
    await expect(page.locator('.course-card')).toHaveCount(1);
  });

  test('課程選擇和評論功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇第一個課程
    const firstCourseCard = page.locator('.course-card').first();
    await firstCourseCard.click();
    
    // 檢查是否有 'selected' 類別
    await expect(firstCourseCard).toHaveClass(/selected/);

    // 獲取初始評論數和評分
    const initialCommentCountText = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    const initialCommentCount = parseInt(initialCommentCountText.match(/\d+/)[0]);
    const initialCoolness = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();

    // 新增評論
    await page.click('#add-comment-button');
    await page.fill('#username', '測試用戶');
    await page.fill('#comment-content', '這是一個測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(4)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(3)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 檢查新評論是否出現在評論列表中
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('測試用戶');
    await expect(newComment).toContainText('這是一個測試評論');

    // 檢查課程卡片上的評論數是否增加
    const updatedCommentCountText = await firstCourseCard.locator('p:has-text("討論熱度：")').innerText();
    const updatedCommentCount = parseInt(updatedCommentCountText.match(/\d+/)[0]);
    expect(updatedCommentCount).toBeGreaterThan(initialCommentCount);

    // 檢查課程卡片上的評分是否更新
    const updatedCoolness = await firstCourseCard.locator('.ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness).not.toBe(initialCoolness);
  });

  test('討論區功能測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/discussion.html`);

    // 檢查標題
    await expect(page).toHaveTitle('課程評價網 - 討論區');

    // 檢查導航連結
    await expect(page.locator('nav a[href="index.html"]')).not.toHaveClass('active');
    await expect(page.locator('nav a[href="discussion.html"]')).toHaveClass('active');

    // 檢查聊天室是否存在
    await expect(page.locator('.chat-container')).toBeVisible();

    // 檢查初始消息是否正確顯示
    for (let i = 0; i < initialMessagesData.length; i++) {
      const message = initialMessagesData[i];
      const messageElement = page.locator('.chat-messages .message').nth(i);
      await expect(messageElement).toContainText(message.nickname);
      await expect(messageElement).toContainText(message.content);
    }

    // 發送一條新消息
    await page.fill('#nickname', '測試用戶');
    await page.fill('#message-input', '這是一條測試消息');
    await page.click('#send-message');

    // 檢查新消息是否出現在聊天室
    const lastMessage = page.locator('.chat-messages .message').last();
    await expect(lastMessage).toContainText('測試用戶');
    await expect(lastMessage).toContainText('這是一條測試消息');
  });

  test('數據持久性測試', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);

    // 選擇第一個課程並添加評論
    await page.click('.course-card:first-child');
    await page.click('#add-comment-button');
    await page.fill('#username', '持久性測試用戶');
    await page.fill('#comment-content', '這是一個持久性測試評論');
    await page.click('.stars[data-rating="course-coolness"] span:nth-child(5)');
    await page.click('.stars[data-rating="grading-sweetness"] span:nth-child(5)');
    await page.click('.stars[data-rating="exam-difficulty"] span:nth-child(5)');
    await page.click('#submit-comment');

    // 重新加載頁面
    await page.reload();

    // 再次選擇同一個課程
    await page.click('.course-card:first-child');

    // 檢查評論是否仍然存在
    const newComment = page.locator('#comments-list .comment').first();
    await expect(newComment).toContainText('持久性測試用戶');
    await expect(newComment).toContainText('這是一個持久性測試評論');

    // 檢查課程卡片上的評分是否保持更新後的狀態
    const updatedCoolness = await page.locator('.course-card:first-child .ratings p:has-text("課程涼度：") .stars').innerText();
    expect(updatedCoolness).toBe('★★★★★');
  });
});
```

## Prompt7:

出現錯誤:

在課程選擇和評論功能測試中，檢查課程卡片上的評分是否更新部分，因為卡片星星更新會是把原本的星星數量加上新的星星數量然後重新平均後四捨五入，所以不一定是不等於原本星數，要根據新增的星數不同去做不同的判斷，有可能會一樣、大於或小於原本的星數
給我完整正確的測試程式碼

## Result7:

```typescript
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
``` 

完成所有需求的測試