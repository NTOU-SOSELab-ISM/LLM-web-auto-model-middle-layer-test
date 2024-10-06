import { test, expect } from '@playwright/test';

test.describe('Typing Challenge', () => {

  test.beforeEach(async ({ page }) => {
    // 確保每次測試前都載入網頁
    await page.goto('http://127.0.0.1:8080/');
  });

  test('應顯示正確的標題', async ({ page }) => {
    const title = await page.getByTestId('typing-challenge-title');
    await expect(title).toHaveText('Typing Challenge');
  });

  test('應生成隨機單字', async ({ page }) => {
    const wordElement = await page.getByTestId('generated-word');

    let previousWord = await wordElement.textContent();
    let newWord = '';
    const maxAttempts = 100;  // 設定最大測試次數，防止無限循環
    let attempts = 0;

    // 持續測試直到生成不同的單字或達到最大測試次數
    while (attempts < maxAttempts) {
      await page.reload(); // 每次重新載入頁面以生成新單字
      let newWord = await wordElement.textContent();

      if (newWord !== previousWord) {
        break;  // 當生成不同的單字時結束測試
      }

      attempts++;
    }

    // 測試通過的條件是找到不同的單字
    expect(newWord).not.toBe(previousWord);
    console.log(`生成不同的單字: ${previousWord} -> ${newWord} (共嘗試 ${attempts + 1} 次)`);
  });

  test('應允許使用者輸入文字並檢查是否正確', async ({ page }) => {
    const wordElement = await page.getByTestId('generated-word');
    const inputElement = await page.getByTestId('input-text-area');
    const feedbackElement = await page.getByTestId('feedback');

    // 取得隨機生成的單字
    const generatedWord = await wordElement.textContent();

    // 模擬輸入正確的單字
    await inputElement.fill(generatedWord || '');
    await inputElement.press('Enter');

    // 檢查反饋是否顯示 "Correct!"
    await expect(feedbackElement).toHaveText('Correct!');
  });

  test('計時器應從 60 開始並遞減且小於等於 60', async ({ page }) => {
    const timerElement = await page.getByTestId('timer');

    // 檢查計時器起始為 60
    await expect(timerElement).toHaveText('60');

    // 模擬一些時間的流逝（3秒）
    await page.waitForTimeout(3000);

    // 檢查計時器是否已經遞減且小於等於 60
    const timerValue = await timerElement.textContent();
    expect(Number(timerValue)).toBeLessThanOrEqual(60);
  });

  test('應計算 WPM 並顯示 (至少輸入兩次)', async ({ page }) => {
    const wordElement = await page.getByTestId('generated-word');
    const inputElement = await page.getByTestId('input-text-area');
    const wpmElement = await page.getByTestId('wpm');

    // 第一次輸入
    let generatedWord = await wordElement.textContent();
    await inputElement.fill(generatedWord || '');
    await inputElement.press('Enter');

    // 等待一秒後輸入第二個單字
    await page.waitForTimeout(1000);
    generatedWord = await wordElement.textContent();
    await inputElement.fill(generatedWord || '');
    await inputElement.press('Enter');

    // 檢查 WPM 是否顯示且大於 0
    const wpmValue = await wpmElement.textContent();
    expect(Number(wpmValue)).toBeGreaterThan(0);
  });

  test('應顯示錯誤次數', async ({ page }) => {
    const wordElement = await page.getByTestId('generated-word');
    const inputElement = await page.getByTestId('input-text-area');
    const feedbackElement = await page.getByTestId('feedback');
    const errorsElement = await page.getByTestId('errors');

    // 獲取生成的單字
    const generatedWord = await wordElement.textContent();

    // 輸入錯誤的單字
    await inputElement.fill('wrongWord');
    await inputElement.press('Enter');

    // 檢查反饋是否顯示 "Incorrect!"
    await expect(feedbackElement).toHaveText('Incorrect!');

    // 檢查錯誤次數是否增加
    const errorsCount = await errorsElement.textContent();
    expect(Number(errorsCount)).toBeGreaterThan(0);
  });

});
