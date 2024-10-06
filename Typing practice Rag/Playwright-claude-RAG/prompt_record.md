# Use RAG to generate Playwright E2E test by Claude 3.5 Sonnet

## Prompt 1

- 這是一個打字練習網頁（**index.html style.css script.js**）與網頁需求書(**website_requirement.md**)，我想要使用**Playwright**進行端對端測試。
- 我提供了兩個使用**Playwright**進行端對端測試的腳本範例(**Rag file(playwright).md**)。
- 幫我學習範例中的腳本，使用Typescirpt生成測試腳本，並給我完整的程式碼。在html tag中含有**aria-label**與**data-testid**屬性，請盡量用**page.getByTestId()** 進行選擇，並註明現在的測試對象為何。