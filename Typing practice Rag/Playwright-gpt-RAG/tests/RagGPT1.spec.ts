// import { test, expect } from '@playwright/test';

// test.describe('Typing Practice Website', () => {
  
//   test('Background toggle changes colors', async ({ page }) => {
//     // 打開網頁
//     await page.goto('http://localhost:8080');
    
//     // 選擇背景切換按鈕，檢查初始背景顏色
//     const backgroundToggle = await page.getByTestId('background-toggle');
//     await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(240, 240, 240)');
    
//     // 點擊背景切換按鈕
//     await backgroundToggle.click();
    
//     // 檢查切換後的背景顏色
//     await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(44, 62, 80)');
//   });

//   test('Select difficulty and length', async ({ page }) => {
//     // 打開網頁
//     await page.goto('http://localhost:8080');
    
//     // 選擇難度選單
//     const difficultySelector = await page.getByTestId('difficulty-selector');
    
//     // 檢查初始難度
//     await expect(difficultySelector).toHaveValue('easy');
    
//     // 切換到中等難度
//     await difficultySelector.selectOption('medium');
//     await expect(difficultySelector).toHaveValue('medium');

//     // 選擇文本長度
//     const lengthSelector = await page.getByTestId('length-selector');
    
//     // 檢查初始文本長度
//     await expect(lengthSelector).toHaveValue('short');
    
//     // 切換到長文本
//     await lengthSelector.selectOption('long');
//     await expect(lengthSelector).toHaveValue('long');
//   });

//   test('Typing test functionality', async ({ page }) => {
//     // 打開網頁
//     await page.goto('http://localhost:8080');
    
//     // 確保初始WPM為0
//     const wpmDisplay = await page.getByTestId('wpm');
//     await expect(wpmDisplay).toHaveText('WPM: 0');

//     // 模擬在輸入框內輸入文字
//     const inputBox = await page.getByTestId('input-box');
//     await inputBox.fill('this is a typing test');

//     // 檢查WPM顯示已更新
//     await expect(wpmDisplay).not.toHaveText('WPM: 0');
//   });

//   test('Result display after typing', async ({ page }) => {
//     // 打開網頁
//     await page.goto('http://localhost:8080');
    
//     // 模擬打字並完成測試
//     const inputBox = await page.getByTestId('input-box');
//     await inputBox.fill('this is a typing test');
    
//     // 等待結果顯示
//     const resultTime = await page.getByTestId('result-time');
//     await expect(resultTime).toBeVisible();
    
//     const resultWpm = await page.getByTestId('result-wpm');
//     await expect(resultWpm).toBeVisible();
    
//     const resultAccuracy = await page.getByTestId('result-accuracy');
//     await expect(resultAccuracy).toBeVisible();
//   });

//   test('Close results button', async ({ page }) => {
//     // 打開網頁
//     await page.goto('http://localhost:8080');

//     // 模擬完成測試，顯示結果
//     const inputBox = await page.getByTestId('input-box');
//     await inputBox.fill('this is a typing test');

//     // 點擊關閉結果按鈕
//     const closeResults = await page.getByTestId('close-results');
//     await closeResults.click();

//     // 確認結果窗口已關閉
//     const results = await page.getByTestId('results');
//     await expect(results).toBeHidden();
//   });

// });
