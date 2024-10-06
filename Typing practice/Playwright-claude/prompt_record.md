# Generate Playwright E2E test by Claude 3.5 Sonnet

## Prompt 1
這是一個打字練習網頁（**index.html style.css script.js**）與網頁需求書(**website_requirement.md**)，我想要使用**Playwright**進行端對端測試，幫我使用Typescirpt生成測試腳本，並給我完整的程式碼。在html tag中含有**aria-label**與**data-testid**屬性，請盡量用**page.getByTestId()** 進行選擇，並註明現在的測試對象為何。

## Prompt 2
在 _Difficulty and length selector functionality_ 測試中，**difficultySelector**和**lengthSelector**的定位有問題，幫我用 **page.getByTestId()** 來進行定位，並給我完整的程式碼。

順利完成測試

```ts
import { test, expect } from '@playwright/test';

test.describe('Typing Practice Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
  });

  test('Background toggle button functionality', async ({ page }) => {
    // 測試背景切換按鈕
    const body = page.locator('body');
    const backgroundToggle = page.getByRole('button', { name: '切換背景' });

    await expect(body).not.toHaveClass(/dark/);
    await backgroundToggle.click();
    await expect(body).toHaveClass(/dark/);
    await backgroundToggle.click();
    await expect(body).not.toHaveClass(/dark/);
  });

  test('Difficulty and length selector functionality', async ({ page }) => {
    // 測試難度和長度選擇器
    const difficultySelector = page.getByTestId('difficulty-selector');
    const lengthSelector = page.getByTestId('length-selector');
    const textDisplay = page.getByTestId('text-display');

    await difficultySelector.selectOption('medium');
    await lengthSelector.selectOption('long');
    
    const initialText = await textDisplay.innerText();
    
    await difficultySelector.selectOption('easy');
    await lengthSelector.selectOption('short');
    
    const newText = await textDisplay.innerText();
    
    expect(initialText).not.toEqual(newText);
    expect(newText.length).toBeLessThan(initialText.length);
  });

  test('Typing functionality and stats update', async ({ page }) => {
    // 測試打字功能和統計更新
    const inputBox = page.getByRole('textbox');
    const textDisplay = page.getByTestId('text-display');
    const timer = page.getByTestId('timer');
    const wpm = page.getByTestId('wpm');
    const accuracy = page.getByTestId('accuracy');

    const text = await textDisplay.innerText();
    
    await inputBox.type(text.substring(0, 10), { delay: 100 }); // 輸入前10個字符

    await expect(timer).not.toHaveText('時間: 00:00');
    await expect(wpm).not.toHaveText('WPM: 0');
    await expect(accuracy).toHaveText('準確率: 100%');
  });

  test('Virtual keyboard highlighting', async ({ page }) => {
    // 測試虛擬鍵盤高亮
    const inputBox = page.getByRole('textbox');
    const virtualKeyboard = page.getByTestId('virtual-keyboard');

    await inputBox.type('a');
    const keyA = virtualKeyboard.getByTestId('key-a');
    await expect(keyA).toHaveClass(/active/);
  });

  test('Results display after completion', async ({ page }) => {
    // 測試完成後結果顯示
    const inputBox = page.getByRole('textbox');
    const textDisplay = page.getByTestId('text-display');
    const results = page.getByTestId('results');

    const text = await textDisplay.innerText();
    await inputBox.type(text, { delay: 50 }); // 快速輸入全部文本

    await expect(results).toBeVisible();
    await expect(results).toContainText('練習結果');
    await expect(results).toContainText('完成時間');
    await expect(results).toContainText('WPM');
    await expect(results).toContainText('準確率');
  });
});
```