# Hướng dẫn chuẩn bị dữ liệu slide cho hệ thống AI tạo quiz

## 1. Mục tiêu bàn giao

Đội chuẩn bị dữ liệu cần chuyển mỗi bài giảng thành một file JSON có cấu trúc:

```text
Khóa học → Bài học → Chương → Slide → Nội dung nguồn
```

File JSON giúp hệ thống biết chính xác:

- Slide thuộc bài học nào.
- Slide thuộc chương nào.
- Vị trí slide trong file PDF.
- Số được in trên slide nếu có.
- Nội dung nào được phép dùng để tạo quiz.
- Nguồn cần hiển thị khi giải thích đáp án.

Đội chuẩn bị dữ liệu không cần tạo câu hỏi, đáp án, lời giải hoặc đánh giá điểm yếu. Những phần đó do AI thực hiện.

## 2. File cần bàn giao

Mỗi bài học bàn giao:

```text
[lesson-id]/
├── lesson.json
└── source.pdf
```

Ví dụ:

```text
DAY03/
├── lesson.json
└── day03-tu-chatbot-den-agentic.pdf
```

Nếu PDF thuộc dữ liệu hạn chế, không đưa `source.pdf` vào Git. File `lesson.json` cũng chỉ được commit khi nội dung đã được phép sử dụng.

## 3. Quy tắc đặt ID

ID chỉ dùng chữ cái viết hoa không dấu, số và dấu gạch ngang.

| Thành phần | Format | Ví dụ |
|---|---|---|
| Khóa học | `[TEN-KHOA]` | `AI-THUC-CHIEN` |
| Bài học | `DAY[NN]` hoặc `LESSON-[NN]` | `DAY03` |
| Chương | `[LESSON]-CH-[NN]` | `DAY03-CH-02` |
| Slide | `[LESSON]-S[NNN]` | `DAY03-S023` |
| Điểm kiến thức | `[LESSON]-KP-[TEN]` | `DAY03-KP-OBSERVATION` |

Quy tắc:

- Mỗi ID phải duy nhất trong toàn bộ bài.
- Không thay đổi ID sau khi dữ liệu đã được dùng tạo quiz.
- Không dùng tiêu đề tiếng Việt trực tiếp làm ID.
- Không dùng số slide in trên trang làm `slideId`.

## 4. Phân biệt số trang và số slide

Mỗi slide cần lưu riêng:

| Trường | Ý nghĩa | Ví dụ |
|---|---|---:|
| `order` | Thứ tự slide trong bài | `23` |
| `pdfPage` | Trang vật lý trong file PDF, bắt đầu từ 1 | `23` |
| `displaySlideNumber` | Số được in trên slide; có thể khác trang PDF | `"21"` |

Ví dụ PDF có hai trang bìa:

```text
pdfPage = 23
displaySlideNumber = "21"
```

Nếu slide không in số, điền:

```json
"displaySlideNumber": null
```

## 5. Cấu trúc file `lesson.json`

```json
{
  "schemaVersion": "1.0",
  "course": {
    "courseId": "AI-THUC-CHIEN",
    "courseTitle": "AI Thực Chiến"
  },
  "lesson": {
    "lessonId": "DAY03",
    "lessonTitle": "Từ Chatbot đến Agentic Agent",
    "sourceFile": "day03-tu-chatbot-den-agentic.pdf",
    "totalSlides": 2,
    "language": "vi",
    "status": "approved"
  },
  "chapters": [
    {
      "chapterId": "DAY03-CH-01",
      "order": 1,
      "title": "AI Agent",
      "description": "Khái niệm và đặc điểm của AI Agent"
    },
    {
      "chapterId": "DAY03-CH-02",
      "order": 2,
      "title": "ReAct Loop",
      "description": "Vòng lặp Thought, Action và Observation"
    }
  ],
  "slides": [
    {
      "slideId": "DAY03-S008",
      "order": 8,
      "pdfPage": 8,
      "displaySlideNumber": "8",
      "chapterId": "DAY03-CH-01",
      "title": "AI Agent khác Chatbot như thế nào?",
      "contentType": "concept",
      "rawText": "AI Agent có khả năng lập kế hoạch, hành động thông qua công cụ và quan sát kết quả. Chatbot thông thường chủ yếu sinh phản hồi.",
      "visualDescription": "Bảng so sánh Chatbot và AI Agent.",
      "speakerNotes": "",
      "tags": [
        "AI Agent",
        "Chatbot"
      ],
      "quizEligible": true,
      "reviewStatus": "approved",
      "aiAnalysis": {
        "status": "pending",
        "summary": "",
        "keyPoints": [],
        "learningObjectives": [],
        "terms": [],
        "needsReview": false,
        "reviewReason": ""
      }
    },
    {
      "slideId": "DAY03-S023",
      "order": 23,
      "pdfPage": 23,
      "displaySlideNumber": "21",
      "chapterId": "DAY03-CH-02",
      "title": "Thought → Action → Observation",
      "contentType": "process",
      "rawText": "ReAct gồm vòng lặp Thought, Action và Observation. Sau khi thực hiện Action, agent nhận Observation và sử dụng kết quả này để quyết định bước tiếp theo.",
      "visualDescription": "Sơ đồ vòng lặp từ Thought đến Action, Observation rồi quay lại Thought.",
      "speakerNotes": "",
      "tags": [
        "ReAct",
        "Thought",
        "Action",
        "Observation"
      ],
      "quizEligible": true,
      "reviewStatus": "approved",
      "aiAnalysis": {
        "status": "pending",
        "summary": "",
        "keyPoints": [],
        "learningObjectives": [],
        "terms": [],
        "needsReview": false,
        "reviewReason": ""
      }
    }
  ]
}
```

## 6. Template cho từng slide

Sao chép object dưới đây cho mỗi slide:

```json
{
  "slideId": "DAY03-S001",
  "order": 1,
  "pdfPage": 1,
  "displaySlideNumber": null,
  "chapterId": "DAY03-CH-01",
  "title": "Điền tiêu đề slide",
  "contentType": "concept",
  "rawText": "Điền đầy đủ nội dung chữ trên slide.",
  "visualDescription": "",
  "speakerNotes": "",
  "tags": [],
  "quizEligible": true,
  "reviewStatus": "draft",
  "aiAnalysis": {
    "status": "pending",
    "summary": "",
    "keyPoints": [],
    "learningObjectives": [],
    "terms": [],
    "needsReview": false,
    "reviewReason": ""
  }
}
```

## 7. Trường đội dữ liệu phải điền

| Trường | Bắt buộc | Hướng dẫn |
|---|---:|---|
| `slideId` | Có | ID duy nhất theo quy tắc |
| `order` | Có | Thứ tự slide trong bài |
| `pdfPage` | Có | Trang trong PDF, bắt đầu từ 1 |
| `displaySlideNumber` | Không | Số in trên slide hoặc `null` |
| `chapterId` | Có | Phải tồn tại trong `chapters` |
| `title` | Có | Tiêu đề chính của slide |
| `contentType` | Có | Chọn trong danh sách cho phép |
| `rawText` | Có | Nội dung nguyên gốc dùng làm nguồn sự thật |
| `visualDescription` | Khi cần | Mô tả sơ đồ/hình ảnh chứa kiến thức |
| `speakerNotes` | Không | Ghi chú giảng viên nếu được phép sử dụng |
| `tags` | Không | Thuật ngữ hoặc từ khóa chính |
| `quizEligible` | Có | Slide có được dùng tạo quiz không |
| `reviewStatus` | Có | Trạng thái kiểm tra dữ liệu |

Không cần điền nội dung trong `aiAnalysis`; giữ trạng thái `pending`.

## 8. Giá trị hợp lệ

### `contentType`

```text
title       Slide tiêu đề bài/chương
agenda      Mục lục
concept     Khái niệm
definition  Định nghĩa
process     Quy trình hoặc các bước
example     Ví dụ
diagram     Sơ đồ/hình ảnh mang kiến thức
exercise    Bài tập
summary     Tổng kết
reference   Tài liệu tham khảo
```

### `reviewStatus`

```text
draft         Chưa kiểm tra
approved      Đã đối chiếu với slide gốc
needs_review  Nội dung chưa chắc chắn
```

### `quizEligible`

Đặt `false` cho:

- Slide bìa.
- Mục lục.
- Slide chỉ có tên chương.
- Tài liệu tham khảo.
- Slide thiếu nội dung để tạo câu một đáp án.
- Slide OCR lỗi hoặc chưa được duyệt.

Đặt `true` cho:

- Khái niệm.
- Định nghĩa.
- Quy trình.
- Ví dụ có đủ dữ kiện.
- Sơ đồ đã có `visualDescription` rõ ràng.

## 9. Cách nhập nội dung slide

### `rawText`

- Chép đúng nội dung slide, không tự bổ sung kiến thức.
- Giữ nguyên thuật ngữ chuyên môn.
- Không tự sửa một câu chưa hiểu thành câu mới.
- Có thể bỏ footer, logo và số trang lặp lại.
- Không đưa email, API key hoặc thông tin nhận diện không cần thiết.
- Chuẩn hóa tiếng Việt Unicode NFC.

### `visualDescription`

Điền khi hình ảnh/sơ đồ mang thông tin không có trong `rawText`.

Không đạt:

```text
Sơ đồ ReAct.
```

Đạt:

```text
Sơ đồ vòng lặp Thought → Action → Observation; từ Observation có mũi
tên quay lại Thought khi chưa đủ thông tin.
```

Nếu không thể mô tả chắc chắn, để `quizEligible=false` và:

```json
"reviewStatus": "needs_review"
```

## 10. Quy trình chuẩn bị

1. Tạo thông tin `course` và `lesson`.
2. Liệt kê tất cả chương theo đúng thứ tự.
3. Cấp `chapterId` cho từng chương.
4. Đi qua PDF từ trang đầu đến trang cuối.
5. Tạo một object cho mỗi slide.
6. Gắn slide vào đúng `chapterId`.
7. Nhập `rawText` và mô tả hình ảnh nếu cần.
8. Đặt `quizEligible`.
9. Một người khác đối chiếu JSON với PDF.
10. Chuyển `reviewStatus` từ `draft` sang `approved`.
11. Chạy kiểm tra JSON trước khi bàn giao.

## 11. Quy tắc kiểm tra

File chỉ được bàn giao khi:

- [ ] JSON parse được, không có dấu phẩy thừa.
- [ ] `schemaVersion` là `"1.0"`.
- [ ] Không có hai `chapterId` trùng nhau.
- [ ] Không có hai `slideId` trùng nhau.
- [ ] Mọi `chapterId` của slide đều tồn tại trong `chapters`.
- [ ] `order` và `pdfPage` là số nguyên lớn hơn 0.
- [ ] Thứ tự slide tăng dần.
- [ ] `totalSlides` bằng số phần tử trong `slides`.
- [ ] Mỗi slide có `rawText` hoặc `visualDescription` đủ nghĩa.
- [ ] Slide `quizEligible=true` phải có `reviewStatus=approved`.
- [ ] Slide chỉ có tiêu đề/mục lục không được dùng tạo quiz.
- [ ] Thuật ngữ Việt–Anh không bị OCR sai, ví dụ `AI`, `LLM`, `ReAct`.
- [ ] Không có ký tự lỗi mã hóa.
- [ ] Không chứa credential hoặc dữ liệu nhận diện không cần thiết.
- [ ] Có người thứ hai đối chiếu ít nhất các slide được phép tạo quiz.

## 12. Trường hợp đặc biệt

### Một trang PDF chứa nhiều slide

Không dùng chung một `slideId`. Tách thành:

```text
DAY03-S023-A
DAY03-S023-B
```

Cả hai có cùng `pdfPage=23`, nhưng `order` và `slideId` khác nhau.

### Slide thuộc vùng chuyển tiếp chương

Gắn vào chương mới nếu đây là slide giới thiệu chương. Nếu chưa chắc chắn:

```json
{
  "quizEligible": false,
  "reviewStatus": "needs_review"
}
```

### Slide không có tiêu đề

Đặt tiêu đề mô tả ngắn trong ngoặc vuông:

```json
"title": "[Ví dụ vòng lặp ReAct]"
```

Không thay đổi `rawText`.

### Slide có công thức hoặc sơ đồ phức tạp

- Điền phần chữ lấy được vào `rawText`.
- Mô tả quan hệ trong `visualDescription`.
- Nếu đáp án phụ thuộc vào chi tiết hình ảnh chưa mô tả chắc chắn, đặt `quizEligible=false`.

## 13. Phần AI sẽ xử lý sau khi nhận dữ liệu

AI chỉ cập nhật:

```json
{
  "aiAnalysis": {
    "status": "completed",
    "summary": "Tóm tắt có căn cứ.",
    "keyPoints": [
      "Ý chính 1",
      "Ý chính 2"
    ],
    "learningObjectives": [
      "Mục tiêu học tập"
    ],
    "terms": [
      "Thuật ngữ"
    ],
    "needsReview": false,
    "reviewReason": ""
  }
}
```

AI không được thay đổi:

- `slideId`.
- `order`.
- `pdfPage`.
- `displaySlideNumber`.
- `chapterId`.
- `rawText`.
- `quizEligible`.
- `reviewStatus`.

## 14. Người duyệt và tiêu chí chấp nhận

Tối thiểu hai vai trò:

1. **Người nhập dữ liệu:** tạo chapter và slide objects.
2. **Người duyệt:** đối chiếu với PDF và xác nhận nội dung.

Tài liệu được chấp nhận khi:

- Cấu trúc bài/chương/slide đúng với PDF.
- Mọi slide tạo quiz đều có nội dung nguồn đủ rõ.
- Có thể truy ngược từ `slideId` đến đúng trang PDF.
- Không có slide chưa duyệt được đưa vào AI.
- JSON vượt qua toàn bộ checklist mục 11.

