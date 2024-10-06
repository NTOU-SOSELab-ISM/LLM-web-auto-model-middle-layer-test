graph TD
    A[Course Review Website] --> B[課程資訊查詢區]
    A --> C[討論區]

    B --> D[Header]
    B --> E[搜尋功能]
    B --> F[課程列表]
    B --> G[課程詳情]
    B --> H[評論功能]

    C --> I[Header]
    C --> J[聊天室]

    K[E2E Tests] --> L[Header styling and navigation]
    K --> M[Page background color]
    K --> N[Course search functionality]
    K --> O[Course card styling and information]
    K --> P[Course selection and comment display]
    K --> Q[Add new comment and verify updates]
    K --> R[Discussion board functionality and styling]
    K --> S[Verify initial JSON data]

    T[JSON Data] --> U[courses.json]
    T --> V[comments.json]
    T --> W[initial_messages.json]

    X[HTML Files] --> Y[index.html]
    X --> Z[discussion.html]

    AA[JavaScript Files] --> AB[script.js]
    AA --> AC[discussion.js]

    AD[CSS Files] --> AE[style.css]

    K -.-> T
    K -.-> X
    K -.-> AA
    K -.-> AD

    B -.-> Y
    B -.-> AB
    B -.-> AE
    B -.-> U
    B -.-> V

    C -.-> Z
    C -.-> AC
    C -.-> AE
    C -.-> W

    classDef page fill:#f9f,stroke:#333,stroke-width:2px;
    classDef test fill:#bbf,stroke:#333,stroke-width:2px;
    classDef data fill:#bfb,stroke:#333,stroke-width:2px;
    classDef file fill:#fbb,stroke:#333,stroke-width:2px;

    class A,B,C page;
    class K,L,M,N,O,P,Q,R,S test;
    class T,U,V,W data;
    class X,Y,Z,AA,AB,AC,AD,AE file;