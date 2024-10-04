### Prompt 1：「請根據以下prompt和附件檔案生出playwright測試腳本，附件檔案為完整的網頁程式碼」

prompt就是user_prompts.md，附件檔案就是那些完整網頁程式碼

GPT丟出來的ts腳本放在tests/llmTest1.spec.ts

----

### Prompt 2：「你的playwright測試沒有測試到「討論區」的部分，請幫我更改playwright腳本」

GPT丟出來的ts腳本放在tests/llmTest2.spec.ts

然而，他生討論區的test爛掉了，所以讓他再生一次

----

### Prompt 3：「在驗證顏色的時候發生了錯誤，錯誤訊息為 Timed out 5000ms waiting for expect(locator).toHaveCSS(expected)，請修改playwright測試腳本」

GPT丟出來的ts腳本放在tests/llmTest3.spec.ts

該測的功能都有測到了

