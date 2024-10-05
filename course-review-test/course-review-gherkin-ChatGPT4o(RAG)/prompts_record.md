# 產生gherkin

對以下使用者需求轉成用gherkin語法寫成的feature file: + `user_prompts`

## Result1

```gherkin
Feature: Course Review Website

  Scenario: Navigating between Course Info Search Area and Discussion Area
    Given I am on any page
    When I click on "課程資訊查詢區" or "討論區" in the header
    Then I should be redirected to the corresponding page

  Scenario: Displaying Header on Course Info Search Area
    Given I am on the "課程資訊查詢區" page
    Then I should see a header with a dark grey background
    And the header should contain an icon and the text "課程評價網" on the left
    And on the right, there should be two clickable options: "課程資訊查詢區" and "討論區"

  Scenario: Search Filters in Course Info Search Area
    Given I am on the "課程資訊查詢區" page
    Then I should see a light grey background below the header
    And I should see a search input field at the top
    And I should be able to select between "依課名查詢" or "依老師名字查詢"
    When I type in a keyword
    Then I should see filtered course information based on the keyword and selected search option

  Scenario: Displaying Course Information Cards
    Given I am on the "課程資訊查詢區" page
    When I perform a search
    Then the left side should display course information cards
    And each card should display the course name, teacher's name, course rating, and discussion heat
    And the course rating should have three categories: "課程涼度", "給分甜度", and "考試難度" with star icons representing average ratings rounded to the nearest whole number
    And the right side of each card should display the discussion heat count with an icon

  Scenario: Selecting a Course Card and Viewing Reviews
    Given I have performed a search
    When I click on a course card
    Then the selected card should have a dark grey border to highlight it
    And I should see a button labeled "新增課程評論" on the right side
    And the button should display a form for adding a course review when clicked
    And below the button, I should see existing user reviews for the selected course
    And each review card should display the user's name, review content, and ratings for "課程涼度", "給分甜度", and "考試難度" with star icons

  Scenario: Submitting a New Course Review
    Given I have clicked on "新增課程評論" for a course
    When I fill in the form with my name, review content, and ratings
    And I submit the review
    Then the new review should be added to the top of the review list
    And the form should switch back to the "顯示課程評論" mode

  Scenario: Displaying Header on Discussion Area
    Given I am on the "討論區" page
    Then I should see a header with the same dark grey background as "課程資訊查詢區"
    And the active page in the header should be highlighted while the inactive page is dimmed

  Scenario: Chat Room in Discussion Area
    Given I am on the "討論區" page
    Then I should see a chat area with a light grey background
    And below the chat area, I should see input fields for selecting color, nickname, and message content
    And I should be able to enter a message and send it by clicking a button or pressing Enter
    And each message should display the timestamp, nickname with selected color, and message content
    And the chat history should update with each new message

  Scenario: Initial Fake Data for Course Info Search Area
    Given I visit the "課程資訊查詢區" page
    Then I should see at least 6 course cards with pre-generated fake data
    And each course should have at least 5 reviews generated from fake data
    And all the data should be stored in a JSON file

  Scenario: Initial Fake Data for Discussion Area
    Given I visit the "討論區" page
    Then I should see at least 3 different users and 10 initial chat messages generated from fake data
    And all the data should be stored in a JSON file
```

# 產生code

## Prompt1

`RAG_injection.md` + `gherkin.md`

## Result1

有錯誤

- 搜尋欄下方不是淺灰底
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示
- 點擊左側的課程資訊card物件後，右側沒有顯示任何資訊
- 點擊做測的課程資訊card物件後，不會有深色外框框住
- 討論熱度應該是評論數量
- 討論區的內容沒有送出後儲存在local storage，重整後會消失

![alt text](result1.png)

## Prompt2

有錯誤

- 搜尋欄下方不是淺灰底
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示
- 點擊左側的課程資訊card物件後，右側沒有顯示任何資訊
- 點擊做測的課程資訊card物件後，不會有深色外框框住
- 討論熱度應該是評論數量
- 討論區的內容沒有送出後儲存在local storage，重整後會消失

修正以以上錯誤並給我完整程式碼

## Result2

已修正以下錯誤:
- 搜尋欄下方不是淺灰底
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示
- 點擊左側的課程資訊card物件後，右側沒有顯示任何資訊
- 點擊做測的課程資訊card物件後，不會有深色外框框住
- 討論熱度應該是評論數量

還是有的錯誤:

- 討論區的內容沒有送出後儲存在local storage，重整後會消失
- 在課程資訊查詢區的新增課程評論功能中，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會填滿對應數量的星星
- 在課程資訊查詢區的新增課程評論功能中，按下提交按鈕後的評論card中的星星不會顯示相對應數量的填滿顏色的星星，都是空心的星星
- 在課程資訊查詢區的新增課程評論功能中，提交評論後不會同時更新課程資訊card的平均星數和評論數量

![alt text](result2.png)

## Prompt3

已修正以下錯誤:
- 搜尋欄下方不是淺灰底
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示
- 點擊左側的課程資訊card物件後，右側沒有顯示任何資訊
- 點擊做測的課程資訊card物件後，不會有深色外框框住
- 討論熱度應該是評論數量

還是有的錯誤:

- 討論區的內容沒有送出後儲存在local storage，重整後會消失
- 在課程資訊查詢區的新增課程評論功能中，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會填滿對應數量的星星
- 在課程資訊查詢區的新增課程評論功能中，按下提交按鈕後的評論card中的星星不會顯示相對應數量的填滿顏色的星星，都是空心的星星
- 在課程資訊查詢區的新增課程評論功能中，提交評論後不會同時更新課程資訊card的平均星數和評論數量

修正以以上錯誤並給我完整程式碼

## Result3

已修正以下錯誤:
- 在課程資訊查詢區的新增課程評論功能中，提交評論後不會同時更新課程資訊card的平均星數和評論數量

出現的錯誤:
- 討論區的內容沒有送出後儲存在local storage，重整後會消失，需要把討論區的訊息儲存到local storage中
- 在課程資訊查詢區的新增課程評論功能中，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會填滿對應數量的星星
- 在課程資訊查詢區的新增課程評論功能中，按下提交按鈕後的評論card中的星星不會顯示相對應數量的填滿顏色的星星，都是空心的星星
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示

![alt text](result3.png)

## Prompt4

已修正以下錯誤:
- 在課程資訊查詢區的新增課程評論功能中，提交評論後不會同時更新課程資訊card的平均星數和評論數量

出現的錯誤:
- 討論區的內容沒有送出後儲存在local storage，重整後會消失，需要把討論區的訊息儲存到local storage中
- 在課程資訊查詢區的新增課程評論功能中，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會填滿對應數量的星星
- 在課程資訊查詢區的新增課程評論功能中，按下提交按鈕後的評論card中的星星不會顯示相對應數量的填滿顏色的星星，都是空心的星星
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示

修正以以上錯誤並給我完整程式碼

## Result4

已修正以下錯誤:
- 在課程資訊查詢區的新增課程評論功能中，按下提交按鈕後的評論card中的星星不會顯示相對應數量的填滿顏色的星星，都是空心的星星

還是有的錯誤:
- 討論區的內容沒有送出後儲存在local storage，重整後會消失，需要把討論區的訊息儲存到local storage中
- 在課程資訊查詢區的新增課程評論功能中，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會更新成填滿對應數量的星星
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示，需要預設顯示所有課程資訊

## Prompt5

已修正以下錯誤:
- 在課程資訊查詢區的新增課程評論功能中，按下提交按鈕後的評論card中的星星不會顯示相對應數量的填滿顏色的星星，都是空心的星星

還是有的錯誤:
- 討論區的內容沒有送出後儲存在local storage，重整後會消失，需要把討論區的訊息儲存到local storage中
- 在課程資訊查詢區的新增課程評論功能中，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會更新成填滿對應數量的星星
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示，需要預設顯示所有課程資訊

修正以以上錯誤並給我完整程式碼

## Result5

已修正以下錯誤:
- 討論區的內容沒有送出後儲存在local storage，重整後會消失，需要把討論區的訊息儲存到local storage中
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示，需要預設顯示所有課程資訊

還是有的錯誤:
- 在課程資訊查詢區的新增課程評論功能中，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會更新成填滿對應數量的星星

## Prompt6

已修正以下錯誤:
- 討論區的內容沒有送出後儲存在local storage，重整後會消失，需要把討論區的訊息儲存到local storage中
- 預設沒有顯示所有課程資訊，要按下搜尋才會顯示，需要預設顯示所有課程資訊

還是有的錯誤:
- 在課程資訊查詢區的新增課程評論功能中，在新增課程功能下的對於:課程涼度評分、給分甜度評分、考試難度評分的星星icon點擊後不會把到被點擊到的星星變成填滿的星星，需要修正成點擊後會填滿對應數量的星星

修正以以上錯誤並給我完整程式碼

## Result6

![alt text](result6.png)

## Prompt7

已修正以下錯誤:
- 在課程資訊查詢區的新增課程評論功能中，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會更新成填滿對應數量的星星

出現的錯誤:
- 在課程資訊查詢區的新增課程評論功能中，按下提交按鈕後新增的評論card中的星星不會顯示相對應數量的填滿顏色的星星，都是空心的星星，應該要填滿對應數量的星星

修正以以上錯誤並給我完整程式碼

## Result7

還是一樣的錯誤

## Prompt8

還是一樣的錯誤，沒有改善 
我再更詳細的說明:

在課程資訊查詢區的新增課程評論功能中，當我按下新增課程評論的按鈕後，可以對課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊進行評分，按下提交後，新增的評論card中的星星不會顯示相對應數量的填滿顏色的星星，都是空心的星星，應該要填滿對應數量的星星

修正以以上錯誤並給我完整程式碼

## Result8
雖然沒有給我完整程式碼，只給了我部份的js code，但是已經修正了所有錯誤，完成所有需求

![alt text](result8.png)

# 產生mermaid的prompts

## Prompt1

根據以下的使用者需求和符合此需求所產生的程式碼產生出程式碼對應需求的mermaid 描述語言:
`gherkin.md` + `index.html` + `discussion.html` + `script.js` + `style.css`

## Result1

無法顯示，語法錯誤

```mermaid
flowchart TD
    A[Course Review Website]
    
    subgraph Header_Navigation
    B1[Click on "課程資訊查詢區"]
    B2[Click on "討論區"]
    B1 --> B3[Redirect to "課程資訊查詢區" Page]
    B2 --> B4[Redirect to "討論區" Page]
    end
    
    subgraph Course_Info_Area
    C1[Display Header with Dark Grey Background]
    C2[Search Bar with Filters]
    C3[Display Course Cards]
    C1 --> C2
    C2 --> C3
    C3 --> C4[Click on a Course Card]
    C4 --> C5[Highlight Selected Course Card]
    C5 --> C6[Show "新增課程評論" Button and Existing Reviews]
    C6 --> C7[Submit New Review and Update Review List]
    end
    
    subgraph Discussion_Area
    D1[Display Header with Dark Grey Background]
    D2[Chatbox Area]
    D2 --> D3[Send Messages with Nickname and Color]
    end
    
    subgraph Fake_Data
    E1[Load Fake Data for Course Info]
    E2[Load Fake Data for Discussion Area]
    E1 --> C3
    E2 --> D2
    end

    A --> Header_Navigation
    A --> Course_Info_Area
    A --> Discussion_Area
    A --> Fake_Data
```

## Prompt2

無法顯示，有語法錯誤，重新生成

## Result2

```mermaid
flowchart TD
    A[Course Review Website]

    subgraph Header_Navigation
        B1[Click on "課程資訊查詢區"]
        B2[Click on "討論區"]
        B1 --> B3[Redirect to "課程資訊查詢區"]
        B2 --> B4[Redirect to "討論區"]
    end

    subgraph Course_Info_Area
        C1[Display Header with Dark Grey Background]
        C2[Show Search Bar with Filters]
        C3[Display Course Cards]
        C1 --> C2
        C2 --> C3
        C3 --> C4[Click on a Course Card]
        C4 --> C5[Highlight Selected Course Card]
        C5 --> C6[Show "新增課程評論" Button]
        C6 --> C7[Submit New Review and Update Review List]
    end

    subgraph Discussion_Area
        D1[Display Header with Dark Grey Background]
        D2[Show Chatbox]
        D2 --> D3[Send Message with Nickname and Color]
    end

    subgraph Fake_Data
        E1[Load Fake Data for Course Info]
        E2[Load Fake Data for Discussion Area]
        E1 --> C3
        E2 --> D2
    end

    A --> Header_Navigation
    A --> Course_Info_Area
    A --> Discussion_Area
    A --> Fake_Data
```

還是一樣無法顯示

## Prompt3

還是一樣無法顯示

## Result3


還是一樣無法顯示，語法錯誤
```mermaid
graph TD
    A[課程評價網]

    %% Header Navigation
    subgraph Header_Navigation
        B1[點擊 "課程資訊查詢區"]
        B2[點擊 "討論區"]
        B1 --> B3[重定向到 "課程資訊查詢區" 頁面]
        B2 --> B4[重定向到 "討論區" 頁面]
    end

    %% Course Info Area
    subgraph Course_Info_Area
        C1[顯示具有深灰背景的標頭]
        C2[顯示搜尋欄及篩選選項]
        C3[顯示課程資訊卡片]
        C4[點擊課程卡片]
        C5[高亮顯示選中的課程卡片]
        C6[顯示 "新增課程評論" 按鈕及現有評論]
        C7[提交新評論並更新評論列表]

        C1 --> C2
        C2 --> C3
        C3 --> C4
        C4 --> C5
        C5 --> C6
        C6 --> C7
    end

    %% Discussion Area
    subgraph Discussion_Area
        D1[顯示具有深灰背景的標頭]
        D2[顯示聊天室區域]
        D3[發送帶有暱稱和顏色的訊息]

        D1 --> D2
        D2 --> D3
    end

    %% Fake Data Initialization
    subgraph Fake_Data
        E1[載入課程資訊的假資料]
        E2[載入討論區的假資料]
        E1 --> C3
        E2 --> D2
    end

    %% Main Connections
    A --> Header_Navigation
    A --> Course_Info_Area
    A --> Discussion_Area
    A --> Fake_Data

```

## Prompt4

還是一樣無法顯示，語法錯誤

Error: Error: Parse error on line 6:
...tion B1[點擊 "課程資訊查詢區"] B2
----------------------^
Expecting 'SQE', 'DOUBLECIRCLEEND', 'PE', '-)', 'STADIUMEND', 'SUBROUTINEEND', 'PIPE', 'CYLINDEREND', 'DIAMOND_STOP', 'TAGEND', 'TRAPEND', 'INVTRAPEND', 'UNICODE_TEXT', 'TEXT', 'TAGSTART', got 'STR'


## Result4

```mermaid
graph TD
    A[課程評價網]

    %% Header Navigation
    subgraph Header_Navigation
        B1[點擊 課程資訊查詢區]
        B2[點擊 討論區]
        B1 --> B3[重定向到 課程資訊查詢區]
        B2 --> B4[重定向到 討論區]
    end

    %% Course Info Area
    subgraph Course_Info_Area
        C1[顯示具有深灰背景的標頭]
        C2[顯示搜尋欄及篩選選項]
        C3[顯示課程資訊卡片]
        C4[點擊課程卡片]
        C5[高亮顯示選中的課程卡片]
        C6[顯示 新增課程評論 按鈕]
        C7[提交新評論並更新評論列表]

        C1 --> C2
        C2 --> C3
        C3 --> C4
        C4 --> C5
        C5 --> C6
        C6 --> C7
    end

    %% Discussion Area
    subgraph Discussion_Area
        D1[顯示具有深灰背景的標頭]
        D2[顯示聊天室區域]
        D3[發送帶有暱稱和顏色的訊息]

        D1 --> D2
        D2 --> D3
    end

    %% Fake Data Initialization
    subgraph Fake_Data
        E1[載入課程資訊的假資料]
        E2[載入討論區的假資料]
        E1 --> C3
        E2 --> D2
    end

    %% Main Connections
    A --> Header_Navigation
    A --> Course_Info_Area
    A --> Discussion_Area
    A --> Fake_Data

```

結果正常顯示