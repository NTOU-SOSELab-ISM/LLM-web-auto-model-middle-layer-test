import { test, expect } from '@playwright/test';

test.describe('Typing Practice Website', () => {

  test('should toggle background color when clicking the toggle button', async ({ page }) => {
    // Navigate to the index page
    await page.goto('http://localhost:8080');

    // 選擇背景切換按鈕
    const backgroundToggle = page.getByTestId('background-toggle');
    
    // 確認初始背景為 light 模式
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', 'rgb(240, 240, 240)'); // light mode color
    
    // 點擊按鈕切換背景到 dark 模式
    await backgroundToggle.click();
    await expect(body).toHaveCSS('background-color', 'rgb(44, 62, 80)'); // dark mode color
    
    // 再次點擊切換回 light 模式
    await backgroundToggle.click();
    await expect(body).toHaveCSS('background-color', 'rgb(240, 240, 240)');
  });

  test('should generate text based on difficulty and length selections', async ({ page }) => {
    // Navigate to the index page
    await page.goto('http://localhost:8080');
    
    // 選擇難度和文本長度
    const difficultySelector = page.getByTestId('difficulty-selector');
    const lengthSelector = page.getByTestId('length-selector');
    const textDisplay = page.getByTestId('text-display');
    
    // 選擇 "中等" 難度 和 "長文本"
    await difficultySelector.selectOption('medium');
    await lengthSelector.selectOption('long');
    
    // 等待文本生成
    await page.waitForTimeout(1000); // 等待文本更新

    // 確認生成的文本長度大於0
    const generatedText = await textDisplay.textContent();
    expect(generatedText?.length).toBeGreaterThan(0);
  });

  test('should start the timer and track WPM and accuracy during typing', async ({ page }) => {
    // Navigate to the index page
    await page.goto('http://localhost:8080');
    
    // 選擇文本框
    const inputBox = page.getByTestId('input-box');
    const timer = page.getByTestId('timer');
    const wpmDisplay = page.getByTestId('wpm');
    const accuracyDisplay = page.getByTestId('accuracy');
    
    // 開始輸入時，應該啟動計時器
    await inputBox.type('a quick brown fox');
    await expect(timer).not.toHaveText('時間: 00:00');
    
    // 確認 WPM 和 準確率有變化
    const wpm = await wpmDisplay.textContent();
    const accuracy = await accuracyDisplay.textContent();
    expect(Number(wpm?.split(' ')[1])).toBeGreaterThan(0);
    expect(Number(accuracy?.split(' ')[1].replace('%', ''))).toBeLessThanOrEqual(100);
  });

  test('should display results after typing is complete', async ({ page }) => {
    // Navigate to the index page
    await page.goto('http://localhost:8080');

    // 選擇文本框並模擬輸入完成
    const inputBox = page.getByTestId('input-box');
    const textDisplay = page.getByTestId('text-display');
    const resultTime = page.getByTestId('result-time');
    const resultWords = page.getByTestId('result-words');
    const resultWpm = page.getByTestId('result-wpm');
    const resultAccuracy = page.getByTestId('result-accuracy');
    const closeResults = page.getByTestId('close-results');

    // 模擬快速完成打字
    const textToType = await textDisplay.textContent();
    if (textToType) {
      await inputBox.type(textToType);
    }
    
    // 確認結果顯示
    await expect(resultTime).toBeVisible();
    await expect(resultWords).toBeVisible();
    await expect(resultWpm).toBeVisible();
    await expect(resultAccuracy).toBeVisible();
    
    // 點擊關閉按鈕
    await closeResults.click();
    await expect(resultTime).not.toBeVisible();
  });

});
