## Prompt1

`RAG_injection.md` + `user_prompts`

## Result1

結果有錯誤

- data.json產生出來的資料太少筆，課程至少要有五筆，課程評論至少要有六筆
- 按下新增課程評論的按鈕後，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會填滿
- 按下提交按鈕後星星不會顯示相對應數量的填滿顏色的星星
- 在課程評論查詢區中，頁面會出現scroll bar，會連header一起滾動，我要的效果是整個頁面無法滾動，是左右兩邊的區塊內部可以滾動
- 課程評論的區的課程卡片部分太高了，直接佔滿了整個區域高
- 課程卡片不應該顯示討論熱度，應該是評論數量
- 討論區頁面沒有顯示在data.json中的歷史討論訊息
- 無法送出討論區的訊息

![alt text](result1.png)

## Prompt2

結果有錯誤

- data.json產生出來的資料太少筆，課程至少要有五筆，課程評論至少要有六筆
- 按下新增課程評論的按鈕後，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會填滿
- 按下提交按鈕後星星不會顯示相對應數量的填滿顏色的星星
- 在課程評論查詢區中，頁面會出現scroll bar，會連header一起滾動，我要的效果是整個頁面無法滾動，是左右兩邊的區塊內部可以滾動
- 課程評論的區的課程卡片部分太高了，直接佔滿了整個區域高
- 課程卡片不應該顯示討論熱度，應該是評論數量
- 討論區頁面沒有顯示在data.json中的歷史討論訊息
- 無法送出討論區的訊息

修正以以上錯誤並給我完整程式碼 

## Result2

沒有修好任何錯誤，反而連任何的課程card都沒出現了
而且並沒有給我完整程式碼，只給我了data.json 和 script.js

![alt text](result2.png)

## Prompt3

沒有修好任何錯誤，反而連任何的課程card都沒出現了，修正後給我好的完整程式碼

## Result3

修好了
- 按下新增課程評論的按鈕後，課程涼度評分、給分甜度評分、考試難度評分的星星圖案點擊後不會填滿
- data.json產生出來的資料太少筆，課程至少要有五筆，課程評論至少要有六筆
- 按下提交按鈕後星星不會顯示相對應數量的填滿顏色的星星
- 在課程評論查詢區中，頁面會出現scroll bar，會連header一起滾動，我要的效果是整個頁面無法滾動，是左右兩邊的區塊內部可以滾動
- 課程評論的區的課程卡片部分太高了，直接佔滿了整個區域高
- 課程卡片不應該顯示討論熱度，應該是評論數量

還是有的錯誤

- 討論區頁面沒有顯示在data.json中的歷史討論訊息
- 無法送出討論區的訊息

新錯誤

- 在課程評論查詢區中，左右兩邊的區塊沒有平分空間，右邊區塊右邊會有一大塊空白
- 左右兩側的區塊底部沒有顯示出一個padding，看起來是被切掉了

![alt text](result3.png)


## Prompt4

還是有的錯誤

- 討論區頁面沒有顯示在data.json中的歷史討論訊息
- 無法送出討論區的訊息

新錯誤

- 在課程評論查詢區中，左右兩邊的區塊沒有平分空間，右邊區塊右邊會有一大塊空白
- 左右兩側的區塊底部沒有顯示出一個padding，看起來是被切掉了

修正以以上錯誤並給我完整程式碼

## Result4

遇到一個問題，他給的javascript不是全部的檔案，會省略掉重複的部分

![alt text](result4-1.png)

修掉的錯誤:

- 討論區頁面沒有顯示在data.json中的歷史討論訊息
- 無法送出討論區的訊息
- 在課程評論查詢區中，左右兩邊的區塊沒有平分空間，右邊區塊右邊會有一大塊空白

基本上使用者需求都有達成，但就是一些Prompts沒有仔細說明的css排版部分不美觀，但這部分不算是錯誤

![alt text](result4-2.png)

![alt text](result4-3.png)