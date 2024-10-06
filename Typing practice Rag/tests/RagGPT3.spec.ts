// import { test, expect } from '@playwright/test';

// test.describe('Typing Practice Website with dynamic text', () => {
  
//   test('Background toggle changes colors', async ({ page }) => {
//     await page.goto('http://localhost:8080');

//     const backgroundToggle = await page.getByTestId('background-toggle');
//     await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(240, 240, 240)');
    
//     await backgroundToggle.click();
//     await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(44, 62, 80)');
//   });

//   test('Select difficulty and length', async ({ page }) => {
//     await page.goto('http://localhost:8080');

//     const difficultySelector = await page.getByTestId('difficulty-selector');
//     await expect(difficultySelector).toHaveValue('easy');
//     await difficultySelector.selectOption('medium');
//     await expect(difficultySelector).toHaveValue('medium');

//     const lengthSelector = await page.getByTestId('length-selector');
//     await expect(lengthSelector).toHaveValue('short');
//     await lengthSelector.selectOption('long');
//     await expect(lengthSelector).toHaveValue('long');
//   });

//   test('Typing test functionality with dynamic text', async ({ page }) => {
//     await page.goto('http://localhost:8080');

//     // 提取隨機生成的文本
//     const textDisplay = await page.getByTestId('text-display');
//     const generatedText = await textDisplay.innerText();

//     // 確保生成的文本不是空的
//     await expect(generatedText.length).toBeGreaterThan(0);

//     // 模擬在輸入框內輸入文本，使用隨機生成的文本
//     const inputBox = await page.getByTestId('input-box');
//     await inputBox.fill(generatedText);

//     // 檢查 WPM 和 Accuracy 更新
//     const wpmDisplay = await page.getByTestId('wpm');
//     const accuracyDisplay = await page.getByTestId('accuracy');
    
//     await page.waitForTimeout(2000); // 等待 2 秒進行 WPM 和準確率更新
//     await expect(wpmDisplay).not.toHaveText('WPM: 0');
//     await expect(accuracyDisplay).toHaveText(/準確率: \d+%/); // 確保顯示了準確率
//   });

//   test('Display results after typing test', async ({ page }) => {
//     await page.goto('http://localhost:8080');

//     // 提取隨機生成的文本
//     const textDisplay = await page.getByTestId('text-display');
//     const generatedText = await textDisplay.innerText();

//     // 模擬輸入隨機生成的文本
//     const inputBox = await page.getByTestId('input-box');
//     await inputBox.fill(generatedText);

//     // 確保結果顯示
//     const resultTime = await page.getByTestId('result-time');
//     await expect(resultTime).toBeVisible();
    
//     const resultWpm = await page.getByTestId('result-wpm');
//     await expect(resultWpm).toBeVisible();
    
//     const resultAccuracy = await page.getByTestId('result-accuracy');
//     await expect(resultAccuracy).toBeVisible();
//   });

//   test('Close results button functionality', async ({ page }) => {
//     await page.goto('http://localhost:8080');

//     // 提取隨機生成的文本並完成測試
//     const textDisplay = await page.getByTestId('text-display');
//     const generatedText = await textDisplay.innerText();
    
//     const inputBox = await page.getByTestId('input-box');
//     await inputBox.fill(generatedText);

//     // 點擊關閉結果按鈕
//     const closeResults = await page.getByTestId('close-results');
//     await closeResults.click();

//     // 確認結果窗口已關閉
//     const results = await page.getByTestId('results');
//     await expect(results).toBeHidden();
//   });

// });
