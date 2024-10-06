import { test, expect } from '@playwright/test';

test('Initial display of timer and text to type', async ({ page }) => {
  // 導航到測試頁面
  await page.goto('http://localhost:8080');

  // 選擇計時器與練習文本的對象
  const timer = page.getByTestId('timer'); // 計時器
  const textToType = page.getByTestId('text-to-type'); // 練習文本

  // 檢查初始狀態下的顯示
  await expect(timer).toHaveText('Time left: 5s'); // 檢查計時器顯示是否正確
  await expect(textToType).toHaveText('The quick brown fox jumps over the lazy dog.'); // 檢查練習文本
});
test('Typing partial text and checking correct marking', async ({ page }) => {
    // 導航到測試頁面
    await page.goto('http://localhost:8080');
  
    // 選擇輸入框與練習文本的對象
    const inputTextArea = page.getByTestId('input-text-area'); // 輸入框
    const textToType = page.getByTestId('text-to-type'); // 練習文本
  
    // 模擬使用者輸入部分文本
    await inputTextArea.fill('The quick brown'); // 輸入 "The quick brown"
  
    // 確認輸入的部分文本有正確的標記
    await expect(textToType).toContainText('The quick brown'); // 確認正確的部分
  });
  test('Timer countdown and disabling input after time up', async ({ page }) => {
    // 導航到測試頁面
    await page.goto('http://localhost:8080');
  
    // 選擇計時器與結果顯示的對象
    const timer = page.getByTestId('timer'); // 計時器
    const inputTextArea = page.getByTestId('input-text-area'); // 輸入框
    const result = page.getByTestId('result'); // 結果區域
  
    // 等待時間結束
    await page.waitForTimeout(6000); // 等待 6 秒，確保時間倒數結束
  
    // 檢查輸入框是否被禁用，並顯示時間到期訊息
    await expect(inputTextArea).toBeDisabled(); // 輸入框應該禁用
    await expect(result).toHaveText("Time's up!"); // 檢查是否顯示 "Time's up!"
  });
  test('Complete the text and display success message', async ({ page }) => {
    // 導航到測試頁面
    await page.goto('http://localhost:8080');
  
    // 選擇輸入框與結果顯示的對象
    const inputTextArea = page.getByTestId('input-text-area'); // 輸入框
    const result = page.getByTestId('result'); // 結果區域
  
    // 模擬完整輸入文本
    await inputTextArea.fill('The quick brown fox jumps over the lazy dog.');
  
    // 等待一點時間來檢查
    await page.waitForTimeout(1000);
  
    // 檢查結果是否顯示完成訊息，並確認輸入框被禁用
    await expect(result).toHaveText('恭喜！你完成了！'); // 顯示完成訊息
    await expect(inputTextArea).toBeDisabled(); // 確認輸入框禁用
  });
  