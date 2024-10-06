// tests/e2e.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('美食餐廳評價網 E2E 測試', () => {

  test('頁面導航測試', async ({ page }) => {
    // 访问首页
    await page.goto('/index.html');

    // 验证当前在“餐廳資訊查詢區”页面
    await expect(page).toHaveTitle('美食餐廳評價網 - 餐廳資訊查詢區');

    // 验证 header 的背景颜色
    const header = page.locator('header');
    const headerBackground = await header.evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(headerBackground).toBe('rgb(139, 0, 0)'); // 深红色

    // 验证导航链接
    const activeLink = page.locator('nav a.active');
    await expect(activeLink).toHaveText('餐廳資訊查詢區');

    // 点击“美食討論區”链接
    await page.click('nav a:has-text("美食討論區")');

    // 验证当前在“美食討論區”页面
    await expect(page).toHaveTitle('美食餐廳評價網 - 美食討論區');

    // 验证导航链接的高亮
    const discussionLink = page.locator('nav a:has-text("美食討論區")');
    await expect(await discussionLink.getAttribute('class')).toMatch(/active/);

    // 返回“餐廳資訊查詢區”页面
    await page.click('nav a:has-text("餐廳資訊查詢區")');
    await expect(page).toHaveTitle('美食餐廳評價網 - 餐廳資訊查詢區');
  });

  test('餐廳資訊卡片資訊驗證', async ({ page }) => {
    await page.goto('/index.html');

    // 等待餐厅卡片加载
    await page.waitForSelector('.restaurant-card');

    // 从 data.json 中读取数据
    const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    const restaurants = data.restaurants;

    for (const restaurant of restaurants) {
      const card = page.locator(`.restaurant-card:has-text("${restaurant.name}")`);
      await expect(card).toBeVisible();

      // 检查餐厅名称
      await expect(card.locator('h3')).toHaveText(restaurant.name);

      // 修正位置的选择器
      const locationElement = card.locator('p').filter({ hasText: /^位置：/ });
      await expect(locationElement).toHaveText(`位置：${restaurant.city}`);

      // 检查评分星级
      const diversityStars = card
        .locator('.rating-row')
        .filter({ hasText: '菜式多樣性評分：' })
        .locator('i.fa-star');
      const serviceStars = card
        .locator('.rating-row')
        .filter({ hasText: '服務評分：' })
        .locator('i.fa-star');
      const priceStars = card
        .locator('.rating-row')
        .filter({ hasText: '價格合理度：' })
        .locator('i.fa-star');

      await checkStars(diversityStars, restaurant.avgDiversity);
      await checkStars(serviceStars, restaurant.avgService);
      await checkStars(priceStars, restaurant.avgPrice);

      // 修正人气值的选择器
      const popularityElement = card.locator('p').filter({ hasText: /^人氣值：/ });
      const popularityText = await popularityElement.innerText();
      expect(popularityText).toContain(`人氣值：${restaurant.popularity}`);
    }

    // 星级验证函数
    async function checkStars(starsLocator, expectedCount) {
      const stars = await starsLocator.elementHandles();
      let filledCount = 0;
      for (const star of stars) {
        const className = await star.getAttribute('class');
        if (className?.includes('fas')) {
          filledCount++;
        }
      }
      expect(filledCount).toBe(expectedCount);
      expect(stars.length).toBe(5);
    }
  });
  test('餐廳資訊查詢區的搜尋功能測試', async ({ page }) => {
    await page.goto('/index.html');

    // 等待餐厅卡片加载
    await page.waitForSelector('.restaurant-card');

    // 输入关键字并选择按餐厅名称查询
    await page.fill('#searchInput', '美味餐廳A');
    await page.check('input[name="filter"][value="name"]');
    await page.click('#searchButton');

    // 验证搜索结果
    const resultCard = page.locator('.restaurant-card:has-text("美味餐廳A")');
    await expect(resultCard).toBeVisible();

    // 验证非相关结果未显示
    const otherCards = page.locator('.restaurant-card:not(:has-text("美味餐廳A"))');
    await expect(otherCards).toHaveCount(0);

    // 按菜式查询
    await page.fill('#searchInput', '日式');
    await page.check('input[name="filter"][value="cuisine"]');
    await page.click('#searchButton');

    // 验证搜索结果
    const cuisineCard = page.locator('.restaurant-card:has-text("風味餐廳B")');
    await expect(cuisineCard).toBeVisible();

    const nonCuisineCards = page.locator('.restaurant-card:not(:has-text("風味餐廳B"))');
    await expect(nonCuisineCards).toHaveCount(0);
  });

  test('選擇餐廳並添加評論測試', async ({ page }) => {
    await page.goto('/index.html');

    // 选择餐厅卡片
    const restaurantCard = page.locator('.restaurant-card:has-text("美味餐廳A")');
    await restaurantCard.click();

    // 验证卡片高亮
    await expect(await restaurantCard.getAttribute('class')).toMatch(/selected/);

    // 点击“新增餐廳評論”按钮
    const addCommentButton = page.locator('#addCommentButton');
    await expect(addCommentButton).toBeVisible();
    await addCommentButton.click();

    // 显示评论表单
    const commentForm = page.locator('#commentForm');
    await expect(commentForm).toBeVisible();

    // 填写评论表单
    await page.fill('#userName', '測試用戶');
    await page.fill('#commentContent', '這是一條測試評論。');

    // 选择评分
    await selectStars('#diversityRating', 4);
    await selectStars('#serviceRating', 5);
    await selectStars('#priceRating', 3);

    // 提交评论
    await page.click('#submitComment');

    // 验证评论显示
    const newComment = page.locator('.comment-card').first();
    await expect(newComment).toContainText('測試用戶');
    await expect(newComment).toContainText('這是一條測試評論。');

    // 验证评分
    const diversityStars = newComment
        .locator('.rating-row')
        .filter({ hasText: '菜式多樣性評分：' })
        .locator('i.fa-star');

    const serviceStars = newComment
        .locator('.rating-row')
        .filter({ hasText: '服務評分：' })
        .locator('i.fa-star');

    const priceStars = newComment
        .locator('.rating-row')
        .filter({ hasText: '價格合理度：' })
        .locator('i.fa-star');

    await checkStars(diversityStars, 4);
    await checkStars(serviceStars, 5);
    await checkStars(priceStars, 3);

    // 星级选择函数
    async function selectStars(selector, count) {
      for (let i = 1; i <= count; i++) {
        await page.click(`${selector} i:nth-child(${i})`);
      }
    }

    // 星级验证函数
    async function checkStars(starsLocator, expectedCount) {
      const stars = await starsLocator.elementHandles();
      let filledCount = 0;
      for (const star of stars) {
        const className = await star.getAttribute('class');
        // 兼容 'fas' 和 'fa-solid' 两种类名
        if (className?.includes('fas') || className?.includes('fa-solid')) {
          filledCount++;
        }
      }
      expect(filledCount).toBe(expectedCount);
      expect(stars.length).toBe(5);
    }
  });

  test('美食討論區的消息發送測試', async ({ page }) => {
    await page.goto('/discussion.html');

    // 填写昵称、颜色和消息
    await page.fill('#chatUserName', '測試用戶');
    await page.fill('#userColor', '#ff6600');
    await page.fill('#chatInput', '這是一條測試消息。');

    // 发送消息
    await page.click('#sendChat');

    // 验证消息显示
    const newMessage = page.locator('.chat-message').last();
    await expect(newMessage).toContainText('測試用戶');
    await expect(newMessage).toContainText('這是一條測試消息。');

    // 验证昵称颜色
    const nickname = newMessage.locator('p strong');
    const nicknameColor = await nickname.evaluate((node) => getComputedStyle(node).color);
    expect(nicknameColor).toBe('rgb(255, 102, 0)');
  });

  test('食客意見區的留言發布測試', async ({ page }) => {
    await page.goto('/feedback.html');

    // 点击“新增留言”按钮
    await page.click('#addFeedbackButton');

    // 显示留言表单
    const feedbackForm = page.locator('#feedbackForm');
    await expect(feedbackForm).toBeVisible();

    // 填写用户名和留言内容
    await page.fill('#feedbackUserName', '測試用戶');
    await page.fill('#feedbackContent', '這是一條測試留言。');

    // 提交留言
    await page.click('#submitFeedback');

    // 验证留言显示
    const newFeedback = page.locator('.feedback-card').first();
    await expect(newFeedback).toContainText('測試用戶');
    await expect(newFeedback).toContainText('這是一條測試留言。');
  });

  test('數據持久性測試', async ({ page }) => {
    await page.goto('/index.html');

    // 选择餐厅并添加评论
    const restaurantCard = page.locator('.restaurant-card:has-text("美味餐廳A")');
    await restaurantCard.click();

    await page.click('#addCommentButton');
    await page.fill('#userName', '持久性測試');
    await page.fill('#commentContent', '這是一條持久性測試評論。');
    await selectStars('#diversityRating', 5);
    await selectStars('#serviceRating', 5);
    await selectStars('#priceRating', 5);
    await page.click('#submitComment');

    // 刷新页面
    await page.reload();

    // 验证评论仍然存在
    await restaurantCard.click();
    const newComment = page.locator('.comment-card').first();
    await expect(newComment).toContainText('持久性測試');
    await expect(newComment).toContainText('這是一條持久性測試評論。');

    // 星级选择函数
    async function selectStars(selector, count) {
      for (let i = 1; i <= count; i++) {
        await page.click(`${selector} i:nth-child(${i})`);
      }
    }
  });

});
