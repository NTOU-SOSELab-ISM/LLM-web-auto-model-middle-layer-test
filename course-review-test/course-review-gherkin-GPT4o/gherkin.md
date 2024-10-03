Feature: 課程評論網站

  Scenario: 點選左上角的「課程評價網」回到首頁
    Given 使用者在任何頁面
    When 使用者點擊左上角的「課程評價網」
    Then 使用者將會被導向 indel.html 頁面

  Scenario: 課程資訊查詢區顯示所有課程
    Given 使用者進入「課程資訊查詢區」
    When 頁面加載完成
    Then 左側顯示所有課程的card物件
    And 每個card顯示課程名稱、老師姓名、評分、討論熱度

  Scenario: 點擊某個課程物件顯示其評論
    Given 使用者在「課程資訊查詢區」的課程列表
    When 使用者點擊任意課程card
    Then 該課程的所有評論會在右側顯示
    And 左側該課程的card會加上深灰色邊框作為選中標記

  Scenario: 搜尋課程關鍵字並顯示結果
    Given 使用者在「課程資訊查詢區」
    When 使用者在搜尋框輸入關鍵字
    And 選擇 "依課名查詢" 或 "依老師名字查詢"
    And 點擊搜尋按鈕
    Then 如果 fakeData 裡有符合的課程，應顯示相應結果
    And 如果 fakeData 裡無符合的課程，應顯示「查無結果」提示

  Scenario: 課程評論fakeData資料量不足
    Given 頁面顯示 fakeData 資料
    When 系統加載所有課程數據
    Then 顯示超過 6 個課程物件
    And 每個課程至少有 5 則以上的評論

  Scenario: 新增課程評論按鈕無回應
    Given 使用者點擊「新增課程評論」按鈕
    When 按鈕應該切換至「新增評論」模式
    Then 使用者可以看到輸入框，用於填寫評論
    And 評分部分可點擊選擇星星數量
    When 使用者提交評論
    Then 新增的評論會即時顯示在評論列表最上方

  Scenario: 顯示討論區歷史訊息
    Given 使用者進入「討論區」
    When 討論區頁面加載完成
    Then 顯示至少 3 位不同使用者的歷史訊息
    And 每個訊息顯示時間、使用者暱稱、訊息顏色、訊息內容

  Scenario: 新增討論區訊息
    Given 使用者在「討論區」的訊息輸入框中
    When 使用者輸入訊息顏色、暱稱和訊息內容
    And 點擊發送按鈕或按下 Enter
    Then 新訊息會顯示在討論區
    And 訊息顯示使用者設定的顏色與暱稱
    And 記錄發送的時間
