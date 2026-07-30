# Workflow trợ lý AI tạo quiz từ slide bài học

```mermaid
flowchart TD
    A([Bắt đầu]) --> B[Đăng nhập hệ thống]
    B --> C{Đăng nhập thành công?}

    C -- Không --> D[Thông báo lỗi]
    D --> B
    C -- Có --> E[Chọn bài giảng muốn học]

    E --> F[Lướt đọc slide bài giảng]
    F --> G[Nghe thầy cô giảng]
    G --> H{Đã học hết bài?}

    H -- Chưa --> F
    H -- Rồi --> I[Bấm nút Tạo quiz]

    I --> J[AI phân tích nội dung slide]
    J --> K[AI tạo 5–10 câu hỏi]
    K --> L[Hiển thị quiz]

    L --> M[Học sinh làm quiz]
    M --> N[Nộp bài]
    N --> O[AI chấm điểm và đánh giá]

    O --> P[Xem điểm số]
    P --> Q[Xem đáp án và giải thích]
    Q --> R([Hoàn thành])

    style A fill:#d1fae5,stroke:#10b981
    style R fill:#d1fae5,stroke:#10b981
    style C fill:#fef3c7,stroke:#f59e0b
    style H fill:#fef3c7,stroke:#f59e0b
    style J fill:#ede9fe,stroke:#8b5cf6
    style K fill:#ede9fe,stroke:#8b5cf6
    style O fill:#ede9fe,stroke:#8b5cf6
    style D fill:#fee2e2,stroke:#ef4444
```

Luồng chính: **Đăng nhập → Chọn bài giảng → Học nội dung → Tạo quiz → Làm quiz → AI chấm điểm → Xem kết quả và đánh giá.**
