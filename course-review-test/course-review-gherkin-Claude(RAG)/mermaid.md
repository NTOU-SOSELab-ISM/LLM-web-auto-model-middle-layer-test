graph TD
    A[User] -->|Visits| B(Website)
    B --> C{Header}
    C -->|Click| D[Course Information]
    C -->|Click| E[Discussion Board]
    
    D --> F[Search Area]
    F -->|Input| G[Search by Course Name]
    F -->|Input| H[Search by Teacher Name]
    F -->|Click| I[Search Button]
    I --> J[Display Course List]
    
    J -->|Click| K[View Course Details]
    K --> L[Display Comments]
    K --> M[Add New Comment]
    M -->|Submit| N[Update Course Card]
    N --> J
    
    E --> O[Chat Container]
    O --> P[View Historical Messages]
    O --> Q[Send New Message]
    Q -->|Input| R[Choose Color]
    Q -->|Input| S[Enter Nickname]
    Q -->|Input| T[Type Message]
    Q -->|Click/Enter| U[Send Button]
    U --> V[Display New Message]
    V --> O
    
    W[Local Storage] -->|Load| O
    V -->|Save| W
    
    subgraph "Course Information Page"
    F
    G
    H
    I
    J
    K
    L
    M
    N
    end
    
    subgraph "Discussion Board Page"
    O
    P
    Q
    R
    S
    T
    U
    V
    end