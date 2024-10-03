以下是Claude生出來的mermaid檔案：

```mermaid
%% 網站結構圖
graph TD
    A[首頁 index.html] --> B[課程資訊查詢區]
    A --> C[討論區 discussion.html]
    B --> D[搜索課程]
    B --> E[查看課程詳情]
    B --> F[添加課程評論]
    C --> G[查看歷史消息]
    C --> H[發送新消息]

%% 課程資訊查詢流程
flowchart LR
    A[開始] --> B{用戶訪問課程資訊查詢區}
    B --> C[顯示所有課程]
    C --> D{用戶搜索課程?}
    D -->|是| E[過濾並顯示符合條件的課程]
    D -->|否| F{用戶選擇課程?}
    E --> F
    F -->|是| G[顯示課程詳情和評論]
    G --> H{用戶添加評論?}
    H -->|是| I[顯示評論表單]
    I --> J[提交評論]
    J --> K[更新課程評論列表]
    H -->|否| F
    F -->|否| B

%% 討論區流程
sequenceDiagram
    participant U as 用戶
    participant D as 討論區頁面
    participant S as 服務器
    
    U->>D: 訪問討論區
    D->>S: 請求歷史消息
    S-->>D: 返回歷史消息
    D->>U: 顯示歷史消息
    U->>D: 輸入新消息
    D->>S: 發送新消息
    S-->>D: 確認消息發送
    D->>U: 更新消息列表

%% 數據模型
classDiagram
    class Course {
        +int id
        +string name
        +string teacher
        +int coolness
        +int grading
        +int difficulty
        +int discussionHeat
        +Review[] reviews
    }
    class Review {
        +int id
        +string username
        +string content
        +int coolness
        +int grading
        +int difficulty
    }
    class Message {
        +int id
        +string nickname
        +string color
        +string content
        +DateTime timestamp
    }
    Course "1" -- "*" Review : has
```

### Prompt 2
「在hackmd中，貌似 H[發送新消息]這種中括號裡面包著暱稱的用法會錯誤，能幫我更改一下嗎」

```mermaid
%% 網站結構圖
graph TD
    A["首頁 index.html"] --> B["課程資訊查詢區"]
    A --> C["討論區 discussion.html"]
    B --> D["搜索課程"]
    B --> E["查看課程詳情"]
    B --> F["添加課程評論"]
    C --> G["查看歷史消息"]
    C --> H["發送新消息"]

%% 課程資訊查詢流程
flowchart LR
    A["開始"] --> B{"用戶訪問課程資訊查詢區"}
    B --> C["顯示所有課程"]
    C --> D{"用戶搜索課程?"}
    D -->|是| E["過濾並顯示符合條件的課程"]
    D -->|否| F{"用戶選擇課程?"}
    E --> F
    F -->|是| G["顯示課程詳情和評論"]
    G --> H{"用戶添加評論?"}
    H -->|是| I["顯示評論表單"]
    I --> J["提交評論"]
    J --> K["更新課程評論列表"]
    H -->|否| F
    F -->|否| B

%% 討論區流程
sequenceDiagram
    participant U as 用戶
    participant D as 討論區頁面
    participant S as 服務器
    
    U->>D: 訪問討論區
    D->>S: 請求歷史消息
    S-->>D: 返回歷史消息
    D->>U: 顯示歷史消息
    U->>D: 輸入新消息
    D->>S: 發送新消息
    S-->>D: 確認消息發送
    D->>U: 更新消息列表

%% 數據模型
classDiagram
    class Course {
        +int id
        +string name
        +string teacher
        +int coolness
        +int grading
        +int difficulty
        +int discussionHeat
        +Review[] reviews
    }
    class Review {
        +int id
        +string username
        +string content
        +int coolness
        +int grading
        +int difficulty
    }
    class Message {
        +int id
        +string nickname
        +string color
        +string content
        +DateTime timestamp
    }
    Course "1" -- "*" Review : has
```

### Prompt 3

我直接丟給他報錯資訊
「Error: Parse error on line 9:
...   C --> H["發送新消息"]flowchart LR」

```mermaid
%%{init: {'theme': 'neutral' }}%%

%% 網站結構圖
graph TD
    A["首頁 index.html"] --> B["課程資訊查詢區"]
    A --> C["討論區 discussion.html"]
    B --> D["搜索課程"]
    B --> E["查看課程詳情"]
    B --> F["添加課程評論"]
    C --> G["查看歷史消息"]
    C --> H["發送新消息"]

---

%% 課程資訊查詢流程
flowchart LR
    A["開始"] --> B{"用戶訪問課程資訊查詢區"}
    B --> C["顯示所有課程"]
    C --> D{"用戶搜索課程?"}
    D -->|是| E["過濾並顯示符合條件的課程"]
    D -->|否| F{"用戶選擇課程?"}
    E --> F
    F -->|是| G["顯示課程詳情和評論"]
    G --> H{"用戶添加評論?"}
    H -->|是| I["顯示評論表單"]
    I --> J["提交評論"]
    J --> K["更新課程評論列表"]
    H -->|否| F
    F -->|否| B

---

%% 討論區流程
sequenceDiagram
    participant U as 用戶
    participant D as 討論區頁面
    participant S as 服務器
    
    U->>D: 訪問討論區
    D->>S: 請求歷史消息
    S-->>D: 返回歷史消息
    D->>U: 顯示歷史消息
    U->>D: 輸入新消息
    D->>S: 發送新消息
    S-->>D: 確認消息發送
    D->>U: 更新消息列表

---

%% 數據模型
classDiagram
    class Course {
        +int id
        +string name
        +string teacher
        +int coolness
        +int grading
        +int difficulty
        +int discussionHeat
        +Review[] reviews
    }
    class Review {
        +int id
        +string username
        +string content
        +int coolness
        +int grading
        +int difficulty
    }
    class Message {
        +int id
        +string nickname
        +string color
        +string content
        +DateTime timestamp
    }
    Course "1" -- "*" Review : has
```