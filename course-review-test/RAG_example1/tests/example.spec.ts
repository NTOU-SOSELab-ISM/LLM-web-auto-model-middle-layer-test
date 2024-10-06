// tests/e2e.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('旅遊景點評論網 E2E 測試', () => {

  test('頁面導航測試', async ({ page }) => {
    // 访问首页
    await page.goto('/');

    // 验证当前在“景點資訊查詢區”页面
    await expect(page).toHaveTitle('旅遊景點評論網 - 景點資訊查詢區');

    // 验证 header 的背景颜色
    const header = page.locator('header');
    await expect(header).toHaveCSS('background-color', 'rgb(0, 51, 102)');

    // 点击“討論區”链接
    await page.click('a.nav-link:has-text("討論區")');

    // 验证当前在“討論區”页面
    await expect(page).toHaveTitle('旅遊景點評論網 - 討論區');

    // 验证导航链接的高亮
    const discussionLink = page.locator('a.nav-link:has-text("討論區")');
    await expect(await discussionLink.getAttribute('class')).toMatch(/active/);

    // 验证非当前页文字变暗
    const otherLinks = page.locator('.nav-link:not(.active)');
    for (const link of await otherLinks.elementHandles()) {
      const color = await link.evaluate((node) => getComputedStyle(node).color);
      expect(color).toBe('rgb(255, 255, 255)');
    }

    // 验证页面背景颜色
    const body = page.locator('body');
    const bodyBackground = await body.evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(bodyBackground).toBe('rgb(204, 230, 255)');

    // 返回“景點資訊查詢區”页面
    await page.click('a.nav-link:has-text("景點資訊查詢區")');
    await expect(page).toHaveTitle('旅遊景點評論網 - 景點資訊查詢區');
  });

  test('景點資訊卡片資訊驗證', async ({ page }) => {
    await page.goto('/');

    // 等待景点卡片加载
    await page.waitForSelector('.card');

    // 从 attractions.json 中读取数据
    const attractionsData = JSON.parse(fs.readFileSync('data/attractions.json', 'utf-8'));

    for (const attraction of attractionsData) {
      const card = page.locator(`.card:has-text("${attraction.name}")`);
      await expect(card).toBeVisible();

      // 检查景点名称
      await expect(card.locator('h3')).toHaveText(attraction.name);

      // 检查地区
      await expect(card.locator('.region')).toHaveText(attraction.region);

      // 检查评分星级
      const sceneryStars = card.locator('.ratings div:has-text("景色評分：") .stars');
      const serviceStars = card.locator('.ratings div:has-text("服務評分：") .stars');
      const satisfactionStars = card.locator('.ratings div:has-text("整體滿意度：") .stars');

      // 验证每个评分的星星数量
      await checkStars(sceneryStars, attraction.rating.scenery);
      await checkStars(serviceStars, attraction.rating.service);
      await checkStars(satisfactionStars, attraction.rating.satisfaction);

      // 检查人气（评论数量）
      const popularityText = await card.locator('.popularity').innerText();
      const commentCount = attraction.comments.length;
      expect(popularityText).toContain(`人氣：${commentCount}`);
    }

    // 星级验证函数
    async function checkStars(starsLocator, expectedCount) {
      const stars = starsLocator.locator('span');
      for (let i = 0; i < 5; i++) {
        const star = stars.nth(i);
        const starText = await star.textContent();
        if (i < expectedCount) {
          expect(starText).toBe('★');
        } else {
          expect(starText).toBe('☆');
        }
      }
    }
  });

  test('景點資訊查詢區的搜尋功能測試', async ({ page }) => {
    await page.goto('/');

    // 等待景点卡片加载
    await page.waitForSelector('.card');

    // 输入关键字并选择按名称搜索
    await page.fill('#searchInput', '台北101');
    await page.selectOption('#searchType', 'name');
    await page.click('#searchButton');

    // 验证搜索结果
    const resultCard = page.locator('.card:has-text("台北101")');
    await expect(resultCard).toBeVisible();

    // 验证非相关结果未显示
    const otherCards = page.locator('.card:not(:has-text("台北101"))');
    await expect(otherCards).toHaveCount(0);

    // 按地区搜索
    await page.fill('#searchInput', '南投縣');
    await page.selectOption('#searchType', 'region');
    await page.click('#searchButton');

    // 验证搜索结果
    const regionCard = page.locator('.card:has-text("日月潭")');
    await expect(regionCard).toBeVisible();

    const nonRegionCards = page.locator('.card:not(:has-text("日月潭"))');
    await expect(nonRegionCards).toHaveCount(0);
  });

  test('選擇景點並添加評論測試', async ({ page }) => {
    await page.goto('/');

    // 选择景点卡片
    const attractionCard = page.locator('.card:has-text("台北101")');
    await attractionCard.click();

    // 验证卡片高亮
    await expect(await attractionCard.getAttribute('class')).toMatch(/selected/);

    // 点击“新增景點評論”按钮
    const addReviewButton = page.locator('#addReviewButton');
    await expect(addReviewButton).toBeVisible();
    await addReviewButton.click();

    // 填写评论表单
    await page.fill('#username', '測試用戶');
    await page.fill('#comment', '這是一條測試評論。');

    // 选择评分
    await page.click('.stars[data-type="scenery"] .star:nth-child(4)');
    await page.click('.stars[data-type="service"] .star:nth-child(5)');
    await page.click('.stars[data-type="satisfaction"] .star:nth-child(3)');

    // 提交评论
    await page.click('#submitReview');

    // 验证评论显示
    const newComment = page.locator('#reviewsDisplay .comment').first();
    await expect(newComment).toContainText('測試用戶');
    await expect(newComment).toContainText('這是一條測試評論。');

    // 验证显示的星级评分是否正确
    const sceneryStars = newComment.locator('.ratings div:has-text("景色評分：") .stars');
    const serviceStars = newComment.locator('.ratings div:has-text("服務評分：") .stars');
    const satisfactionStars = newComment.locator('.ratings div:has-text("整體滿意度：") .stars');

    await checkStars(sceneryStars, 4);
    await checkStars(serviceStars, 5);
    await checkStars(satisfactionStars, 3);

    // 星级验证函数
    async function checkStars(starsLocator, expectedCount) {
      const stars = starsLocator.locator('span');
      for (let i = 0; i < 5; i++) {
        const star = stars.nth(i);
        const starText = await star.textContent();
        if (i < expectedCount) {
          expect(starText).toBe('★');
        } else {
          expect(starText).toBe('☆');
        }
      }
    }
  });

  test('討論區的消息發送測試', async ({ page }) => {
    await page.goto('/discussion.html');

    // 验证页面背景颜色
    const body = page.locator('body');
    const bodyBackground = await body.evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(bodyBackground).toBe('rgb(204, 230, 255)');

    // 填写昵称、颜色和消息
    await page.fill('#nickname', '測試用戶');
    await page.fill('#nicknameColor', '#ff6600');
    await page.fill('#messageInput', '這是一條測試消息。');

    // 发送消息
    await page.click('#sendMessage');

    // 验证消息显示
    const newMessage = page.locator('#chatbox .message').last();
    await expect(newMessage).toContainText('測試用戶');
    await expect(newMessage).toContainText('這是一條測試消息。');

    // 验证昵称颜色
    const nickname = newMessage.locator('.nickname');
    const nicknameColor = await nickname.evaluate((node) => getComputedStyle(node).color);
    expect(nicknameColor).toBe('rgb(255, 102, 0)');
  });

  test('留言板的留言發布測試', async ({ page }) => {
    await page.goto('/message.html');

    // 验证页面背景颜色
    const body = page.locator('body');
    const bodyBackground = await body.evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(bodyBackground).toBe('rgb(204, 230, 255)');

    // 填写用户名和留言内容
    await page.fill('#messageUsername', '測試用戶');
    await page.fill('#messageContent', '這是一條測試留言。');

    // 发布留言
    await page.click('#postMessage');

    // 验证留言显示
    const newMessage = page.locator('#messageList .message-card').first();
    await expect(newMessage).toContainText('測試用戶');
    await expect(newMessage).toContainText('這是一條測試留言。');
  });

  test('數據持久性測試', async ({ page }) => {
    await page.goto('/');

    // 添加评论
    const attractionCard = page.locator('.card:has-text("台北101")');
    await attractionCard.click();

    const addReviewButton = page.locator('#addReviewButton');
    await addReviewButton.click();

    await page.fill('#username', '持久性測試');
    await page.fill('#comment', '這是一條持久性測試評論。');
    await page.click('.stars[data-type="scenery"] .star:nth-child(5)');
    await page.click('.stars[data-type="service"] .star:nth-child(5)');
    await page.click('.stars[data-type="satisfaction"] .star:nth-child(5)');
    await page.click('#submitReview');

    // 刷新页面
    await page.reload();

    // 验证评论仍然存在
    await attractionCard.click();
    const newComment = page.locator('#reviewsDisplay .comment').first();
    await expect(newComment).toContainText('持久性測試');
    await expect(newComment).toContainText('這是一條持久性測試評論。');
  });

});
