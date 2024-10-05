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
