# Kế hoạch nhóm 5 người sau Checkpoint 2

> **Cập nhật:** dùng `docs/phan-cong-cong-viec-cap-nhat.md` làm bản phân công hiện hành. Tài liệu này giữ vai trò phân tích nền và kế hoạch tổng thể.

## 0. Tóm tắt quyết định

**Kết luận: GO CÓ ĐIỀU KIỆN.**

Đề tài “trợ lý tạo quiz 5-10 câu từ slide bài học để học viên tự kiểm tra sau khi học” **phù hợp với Hướng A - tính năng AI mới trên VLearn**, vì đề bài nêu trực tiếp ví dụ “kiểm tra hiểu thật cuối buổi”. Ý tưởng có thể demo trong 5 phút và có một quyết định AI rõ ràng.

Nhóm chỉ nên tiếp tục nếu chốt các điều kiện sau:

1. Thu hẹp job về **kiểm tra mức hiểu của phần vừa học**, không xây một hệ thống học tập đầy đủ.
2. Quyết định AI trung tâm chỉ là **tạo 5-10 câu trắc nghiệm, đáp án và giải thích có căn cứ từ phạm vi đã chọn**.
3. Chấm điểm bằng luật dựa trên đáp án đã tạo, **không dùng thêm một AI call để chấm**, tránh biến lát cắt thành hai quyết định AI.
4. Mỗi câu hỏi và giải thích phải có `source_ref` trỏ về trang slide hoặc mã đoạn transcript.
5. Nếu nguồn không đủ hoặc mơ hồ, hệ thống phải yêu cầu thu hẹp phạm vi hoặc từ chối tạo, không bịa câu hỏi.
6. Khảo sát `n=24` cho thấy 23/24 (95,8%) muốn quiz, nhưng form đo desirability chứ chưa đo tần suất/tổn thất của pain; cần raw log và xác nhận người trả lời ngoài nhóm.
7. Prototype bấm được đã có trong `prototype/`. Trước khi nộp, nhóm cần đổi tên thành `codebase/` hoặc ghi rõ trong README rằng `prototype/` chính là codebase được chấm.

---

# PHẦN I - PHÂN TÍCH TRƯỚC KHI LẬP KẾ HOẠCH

## 1. Giả định và hiện trạng repo

### 1.1. Giả định

- Checkpoint 2 đã được TA xác nhận hoàn thành theo thông tin của nhóm.
- Chưa có tên 5 thành viên, vì vậy tài liệu dùng ký hiệu `TV1` đến `TV5`; nhóm cần thay bằng tên và mã học viên trong README.
- Chưa biết thế mạnh kỹ thuật của từng thành viên; vai trò có thể đổi người nhưng không được bỏ đầu ra.
- Lịch thực thi bám thứ tự CP3 → CP4 → hạn `spec.md` → CP5 → CP6. Nhóm dùng giờ K3 hoặc K4 tương ứng trong rubric.

### 1.2. Artifact đang có

- `workflow-quiz-ai.md`: workflow Mermaid.
- `Quiz Creation Workflow with.png`: ảnh workflow.
- Có commit CP2 trong Git.
- `prototype/`: prototype Next.js/vinext bấm được, hiện dùng 4 câu hỏi hardcode và dữ liệu dashboard mock.
- Có data pack gồm 1.261 lượt hỏi của học viên, 1.261 phản hồi tutor và 6 transcript sạch.

### 1.3. Artifact bắt buộc còn thiếu trong repo

- `spec.md` đã có bản nháp phần TV1; các owner khác cần hoàn thiện.
- Tên thư mục chuẩn `codebase/` hoặc ghi chú ánh xạ từ `prototype/`.
- `eval/` chứa golden set và kết quả các lượt chạy.
- `validation/` chứa feedback log.
- `demo-slides.pdf`.
- `reflection/` gồm 5 file cá nhân.
- README của nhóm có thành viên và phân công cụ thể.

> Việc cần làm ngay: cập nhật `prototype/README.md` theo đúng sản phẩm của nhóm, vì README hiện vẫn là nội dung starter; ghi rõ cách chạy, phần mock, phần AI thật và artifact được chấm.

## 2. Bài toán người dùng

### 2.1. Job executor đề xuất

**Học viên vừa đọc xong một phần bài giảng và muốn biết mình đã hiểu, nhớ đúng phần đó hay chưa.**

Không dùng “học viên nói chung”. Khi khảo sát và validation, ưu tiên:

- Học viên vừa học xong một bài hoặc một chương.
- Học viên đang ôn trước bài kiểm tra/Kahoot.
- Học viên cần tìm nhanh lỗ hổng kiến thức trước khi chuyển bài.

### 2.2. Core JTBD, không nhắc AI hay sản phẩm

> **Kiểm tra xem mình đã hiểu và nhớ đúng phần vừa học trước khi chuyển sang nội dung tiếp theo.**

Câu này theo cấu trúc `verb + object + contextual clarifier` của tài liệu JTBD:

- Verb: kiểm tra.
- Object: mức hiểu và ghi nhớ.
- Contextual clarifier: sau khi học, trước khi chuyển nội dung.

### 2.3. Problem statement, không dùng chữ “AI”

> Sau khi đọc bài giảng, học viên chưa có cách nhanh để tự kiểm tra phần nào đã hiểu và phần nào còn hổng; họ chủ yếu đọc lại, hỏi giải thích hoặc xin tóm tắt, nên dễ nhầm cảm giác “đã xem” với “đã nắm được kiến thức”.

### 2.4. Lát cắt một câu đề xuất

> **Một học viên vừa đọc xong một phạm vi bài giảng chọn phần cần ôn; hệ thống quyết định 5-10 câu trắc nghiệm có căn cứ, đáp án và giải thích để học viên nhận ra phần đã nắm và phần cần xem lại.**

Kiểm tra format:

- Một user: học viên vừa học xong.
- Một việc: kiểm tra mức hiểu phần đã chọn.
- Một quyết định AI: tạo bộ câu hỏi, đáp án và giải thích có căn cứ.
- Một kết quả: biết phần đã nắm và phần cần xem lại.

## 3. Bằng chứng sơ bộ từ data pack

Phân tích sơ bộ trên 1.261 tin nhắn vai trò `student` bằng tìm từ khóa, chưa phải kết quả evidence chính thức:

| Tín hiệu | Kết quả sơ bộ | Ý nghĩa |
|---|---:|---|
| Tin nhắn liên quan “giải thích/không hiểu/chưa hiểu” | 469/1.261 | Nhu cầu làm rõ kiến thức cao |
| Tin nhắn liên quan “tóm tắt/tổng hợp” | 141/1.261 | Học viên cần công cụ hỗ trợ ôn lại |
| Tin nhắn trực tiếp nhắc quiz/trắc nghiệm | 3/1.261 | Có tín hiệu thật nhưng số lượng còn thấp |
| Tutor chủ động hỏi để kiểm tra hiểu | 3/1.261 phản hồi tutor | Flow hiện tại gần như không kiểm tra hiểu |
| `follow_ups` khác rỗng | 0/1.261 phản hồi tutor | Chưa có chuỗi luyện tập tiếp nối |
| `misconceptions` khác rỗng | 0/1.261 phản hồi tutor | Chưa ghi nhận lỗ hổng/hiểu lầm |

Ví dụ đáng chú ý:

- Turn `T0849`: học viên yêu cầu tạo quiz để hiểu và ôn toàn bộ slide; tutor chỉ trả một câu hỏi mở thay vì một quiz hoàn chỉnh.
- Turn `T0257`: học viên muốn tóm tắt để làm quiz Kahoot nhưng tutor báo thiếu nội dung nguồn.
- Turn `T0907`: học viên nêu chủ đề quiz; tutor trả danh sách kiến thức thay vì tạo trải nghiệm quiz.

### 3.1. Hạn chế của bằng chứng hiện tại

- Tìm từ khóa chỉ là bước khám phá pattern, chưa phải phương pháp mining đủ chặt để lấy 6 điểm evidence.
- Chỉ có ba yêu cầu nhắc trực tiếp đến quiz, nên chưa thể kết luận pain quiz phổ biến.
- Các tín hiệu giải thích/tóm tắt chứng minh nhu cầu hỗ trợ học hiểu, không tự động chứng minh học viên muốn đúng giải pháp quiz.

### 3.2. Evidence cần bổ sung

Ưu tiên **đường A - khảo sát**, vì pain quiz chưa đủ mạnh trong chatlog:

- Khảo sát ≥20 học viên ngoài nhóm.
- ≥50% xác nhận họ từng không biết mình đã hiểu bài đến đâu sau khi học.
- Ghi đầy đủ câu hỏi và từng câu trả lời, không chỉ biểu đồ tổng hợp.
- Hỏi hành vi quá khứ, không hỏi “bạn có muốn tính năng này không?”.

Bốn câu khảo sát gợi ý:

1. Lần gần nhất học xong một bài nhưng chưa chắc mình đã hiểu, bạn làm gì tiếp theo?
2. Bạn mất bao lâu để tự kiểm tra hoặc ôn lại phần vừa học?
3. Điều gì khó nhất trong cách bạn đang dùng?
4. Trong 4 tuần gần đây tình huống này xảy ra bao nhiêu lần?

Nếu làm thêm đường B:

- Định nghĩa rõ tiêu chí “học viên cần kiểm tra hiểu”.
- Đọc tay 30-50 turn trước khi chốt rule.
- Đếm toàn bộ theo rule.
- Giữ ít nhất 5 ví dụ ngắn kèm `turn_id`.
- Không sao chép data pack dài vào repo nộp bài.

### 3.3. Kết quả khảo sát đã có

- 24 phản hồi.
- 23/24 (95,8%) muốn làm quiz sau bài lý thuyết.
- 23/24 (95,8%) muốn tổng hợp kiến thức và điểm yếu.
- Phạm vi ưu tiên: cả bài 15/24, từng chương 13/24, từng điểm kiến thức 8/24; câu hỏi cho chọn nhiều đáp án.
- Số câu được chọn nhiều nhất: 10 câu, 10/24.
- Loại câu được chọn nhiều nhất: trắc nghiệm, 14/24.
- Chi tiết: `evidence/survey-results.md`.
- Giới hạn: chưa có raw log, quote, tần suất, thời gian và willing users.

## 4. Đánh giá tính hợp lý của đề tài

### 4.1. Điểm mạnh

1. **Khớp đề bài:** thuộc Hướng A, tính năng mới trên VLearn; “kiểm tra hiểu thật cuối buổi” được nêu như ví dụ hợp lệ.
2. **Job tồn tại khi bỏ AI:** học viên vẫn cần kiểm tra mức hiểu sau khi học.
3. **AI có leverage rõ:** mô hình có thể biến nội dung phi cấu trúc thành câu hỏi, phương án, đáp án và giải thích.
4. **Demo được trong 5 phút:** chọn bài → chọn phạm vi → tạo quiz → làm → xem kết quả và nguồn.
5. **Có failure đáng để trình bày:** thiếu nguồn, nguồn mơ hồ, đáp án không duy nhất, câu hỏi vượt phạm vi.
6. **Có thể đo:** groundedness, đúng phạm vi, đáp án không mơ hồ, chất lượng phương án nhiễu và xử lý thiếu nguồn.

### 4.2. Điểm chưa hợp lý nếu giữ nguyên ý tưởng rộng

1. Ba tùy chọn “cả bài / từng chương / điểm kiến thức” có thể làm đội build ba pipeline khác nhau.
2. Workflow đang ghi “AI chấm điểm và đánh giá”, tạo cảm giác có quyết định AI thứ hai.
3. Tạo câu hỏi sai có thể khiến học viên học sai; cost-of-error không còn “rẻ”.
4. Repo chưa có slide bài giảng dù ý tưởng phụ thuộc trực tiếp vào slide.
5. Chưa có evidence đủ mạnh cho pain quiz.
6. Nếu hỗ trợ câu hỏi tự luận ngay, việc chấm điểm và rubric phức tạp vượt thời gian hackathon.

### 4.3. Điều chỉnh để đề tài khả thi

- Giữ ba tùy chọn ở UI nhưng dùng **một pipeline chung**: mọi lựa chọn đều quy về danh sách `source_chunk_id`.
- Chỉ làm một bài giảng mẫu end-to-end; không cần hỗ trợ toàn bộ khóa.
- Quiz MVP chỉ gồm câu hỏi trắc nghiệm một đáp án đúng.
- AI tạo `correct_option`; hệ thống tính điểm bằng so sánh đáp án.
- “Đánh giá” là phản hồi theo luật, ví dụ:
  - 0-49%: xem lại phạm vi đã chọn.
  - 50-79%: đã nắm phần chính, cần xem lại các nguồn gắn với câu sai.
  - 80-100%: đạt mục tiêu ôn tập.
- Mỗi câu phải có nguồn. Không có nguồn → không tạo câu đó.
- Không đủ tối thiểu 5 câu đạt chuẩn → báo thiếu nội dung và đề nghị đổi/thu hẹp phạm vi.

## 5. Phạm vi MVP đề xuất

### 5.1. Happy path

1. Đăng nhập giả lập hoặc bỏ qua xác thực thật.
2. Chọn một bài giảng mẫu.
3. Xem nội dung/preview bài giảng.
4. Bấm `Tạo quiz`.
5. Chọn một trong ba phạm vi:
   - Cả bài.
   - Từng chương.
   - Điểm kiến thức muốn ôn.
6. Hệ thống chuẩn hóa phạm vi thành các đoạn nguồn.
7. AI tạo 5-10 câu trắc nghiệm theo JSON schema.
8. Học viên chọn đáp án và nộp.
9. Hệ thống chấm theo đáp án.
10. Hiển thị điểm, đáp án đúng, giải thích và nguồn cần xem lại.

### 5.2. Bốn đường đi phải có

| Đường đi | Hành vi cần thể hiện |
|---|---|
| Happy path | Nguồn đủ, tạo quiz và chấm end-to-end |
| Low-confidence | Nguồn quá rộng/mơ hồ → đề nghị chọn chương hoặc điểm kiến thức |
| Failure/không căn cứ | Không tìm được nguồn → không tạo câu hỏi, nêu lý do và cách tiếp tục |
| Correction | User báo câu hỏi sai/mơ hồ hoặc tạo lại câu đó từ cùng nguồn |

### 5.3. Non-goals

1. Không xây đăng nhập production.
2. Không hỗ trợ toàn bộ bài giảng của khóa trong prototype.
3. Không chấm câu hỏi tự luận.
4. Không xây dashboard cho giảng viên.
5. Không cá nhân hóa dài hạn theo lịch sử nhiều buổi.
6. Không tự cập nhật điểm chính thức của học viên.
7. Không dùng vector database nếu direct context/chunking đã đủ cho một bài mẫu.

## 6. Mức automation

**Đề xuất: Conditional.**

- Hệ thống tự tạo quiz khi tất cả câu hỏi có thể trace về nguồn đã chọn.
- Hệ thống thu hẹp phạm vi hoặc từ chối khi nguồn thiếu/mơ hồ.
- Học viên có thể bỏ qua, tạo lại hoặc báo câu hỏi.

Lý do theo cost-of-error:

- Câu hỏi sai hoặc đáp án mơ hồ có thể khiến học viên học sai.
- User có thể phát hiện một số lỗi nhưng không phải lúc nào cũng đủ kiến thức để phát hiện.
- Vì vậy không nên automate vô điều kiện và cũng không cần giảng viên duyệt từng câu trong phạm vi prototype học viên tự ôn.

## 7. Quality bar đề xuất

Nhóm phải thảo luận và chốt con số trong `spec.md` trước hạn 23:59 ngày 1. Gợi ý:

> **Đạt khi ≥80% case trong golden set pass toàn bộ tiêu chí, 100% câu hỏi có `source_ref` hợp lệ, và không có câu hỏi sai kiến thức hoặc có hai đáp án đúng.**

Các chiều chất lượng:

| Chiều | Pass khi |
|---|---|
| Groundedness | Stem, đáp án và giải thích đều suy ra được từ nguồn |
| Scope relevance | Không hỏi ngoài phạm vi user đã chọn |
| Answerability | Có đúng một đáp án đúng rõ ràng |
| Distractor quality | Phương án sai hợp lý nhưng không gây tranh cãi |
| Explanation | Giải thích vì sao đúng/sai và chỉ về nguồn |
| Graceful failure | Thiếu nguồn thì không bịa và có bước tiếp theo |
| Output validity | JSON đúng schema, đủ 5-10 câu khi nguồn cho phép |

---

# PHẦN II - TÀI NGUYÊN CẦN CÓ

## 8. Tài nguyên bắt buộc

| Nhóm tài nguyên | Cần gì | Hiện trạng | Hành động |
|---|---|---|---|
| Nguồn bài học | 1-2 bộ slide PDF/PPTX có số trang ổn định | Chưa có trong repo | Xin slide từ BTC/giảng viên; fallback dùng transcript có mã `[Txx-NNN]` |
| Dữ liệu evidence | Chatlog + khảo sát ≥20 người | Có chatlog và 24 phản hồi tổng hợp; thiếu raw log/pain metrics | TV1 export log ẩn danh và bổ sung willing users |
| Người thử | ≥3 willing users từ CP1; ≥5 người validation | Chưa thấy log trong repo | Mỗi thành viên tuyển ít nhất 1 người |
| AI API | Gemini/API key khóa học hoặc provider được phép | Chưa xác minh | TV3 kiểm tra key, quota và latency; key chỉ để trong `.env` |
| Runtime | JavaScript/TypeScript, Next.js/vinext | Đã có trong `prototype/` | Giữ stack, không đổi; TV3 bổ sung AI route/schema |
| Eval | Golden set ≥20 case, ≥10 phát triển từ chatlog | Chưa có | TV4 sở hữu |
| Repo artifact | `spec.md`, `prototype/`, `evidence/` đã có; `eval/`, `validation/`, `reflection/` còn thiếu | Một phần | Từng owner hoàn thiện |
| Thiết bị | Laptop demo, mạng, trình duyệt, màn hình dự phòng | Chưa xác minh | TV5 lập checklist demo |

## 9. Stack kỹ thuật khuyến nghị

Chọn theo kỹ năng nhóm; không đổi stack sau khi bắt đầu CP3.

### Phương án mặc định nếu cần đi nhanh

- UI: Streamlit.
- Backend: Python.
- Đọc PDF: `pypdf` hoặc `pdfplumber`.
- Validation output: Pydantic/JSON Schema.
- AI: Gemini theo hướng dẫn sự kiện hoặc API key BTC cấp.
- Eval: CSV/JSON + script Python; dùng Promptfoo nếu nhóm đã quen.
- Secrets: `.env`, thêm vào `.gitignore`.

### Phương án nếu nhóm mạnh web

- UI: React/Vite hoặc Next.js.
- Backend: API route/Node.js.
- Validation output: Zod/JSON Schema.
- Eval: Promptfoo hoặc script Node.js.

### Không cần cho MVP

- Database production.
- OAuth thật.
- Vector database.
- Hệ thống role/permission đầy đủ.
- Deploy production.

## 10. Hợp đồng dữ liệu giữa frontend và AI

Chốt schema này trước khi TV2 và TV3 code song song.

### Input tối thiểu

```json
{
  "lesson_id": "lesson-demo-01",
  "scope_type": "lesson|chapter|knowledge_point",
  "scope_value": "string",
  "source_chunks": [
    {
      "source_ref": "page-12 hoặc T04-035",
      "content": "nội dung nguồn"
    }
  ],
  "question_count": 5
}
```

### Output tối thiểu

```json
{
  "status": "ok|need_clarification|insufficient_source",
  "message": "string",
  "questions": [
    {
      "id": "q1",
      "stem": "string",
      "options": ["A", "B", "C", "D"],
      "correct_option": 0,
      "explanation": "string",
      "source_ref": "page-12 hoặc T04-035",
      "confidence": "high|medium|low"
    }
  ]
}
```

---

# PHẦN III - KẾ HOẠCH CHI TIẾT CHO 5 NGƯỜI

## 11. Nguyên tắc phân công

- Mỗi artifact có đúng một owner chịu trách nhiệm hoàn thành.
- Mỗi phần quan trọng có một reviewer khác owner.
- Không ai chỉ làm slide hoặc ghi chép; mỗi người phải có phần giải thích được tại CP5/CP6.
- Mọi người nghiên cứu một giải pháp tương tự trong 15 phút và đóng góp ít nhất một case vào golden set.
- Mọi người viết reflection cá nhân trước CP6.

## 12. Phân công theo người

### TV1 - Product Lead, Evidence và Spec

**Trách nhiệm chính**

- Chốt job executor, core JTBD, problem statement và lát cắt một câu.
- Thiết kế và triển khai khảo sát ≥20 người.
- Tổng hợp bằng chứng, bảng impact ≥3 ứng viên và ứng viên bị loại.
- Owner `spec.md` §1, §2, §4 và điều phối chốt quality bar.
- Theo dõi tiến độ checkpoint và phạm vi/non-goals.

**Đầu ra**

- `evidence/survey-questions.md`.
- `evidence/survey-log.csv` hoặc `.md`.
- `evidence/mining-method.md`.
- `spec.md` §1, §2, §4.

**Definition of Done**

- ≥20 người ngoài nhóm; log từng câu trả lời.
- Nếu dùng đường A: ≥50% xác nhận đúng pain.
- Bảng impact có số cho ≥3 ứng viên.
- Lát cắt đúng format và khớp prototype.
- Reviewer: TV5.

### TV2 - UX và Frontend

**Trách nhiệm chính**

- Duy trì prototype CP2 trong `prototype/`, sửa README starter và quyết định đổi tên/ánh xạ sang `codebase/`.
- Implement flow chọn bài, chọn ba phạm vi, làm quiz và xem kết quả.
- Thể hiện bốn đường đi: happy, low-confidence, failure, correction.
- Hiển thị nguồn và nút “Báo câu hỏi/Tạo lại”.
- Tối ưu để demo trong 2 phút, không tập trung trang trí ngoài scope.

**Đầu ra**

- `prototype/` với hướng dẫn chạy đúng sản phẩm.
- UI bấm được end-to-end.
- Screenshot/clip backup demo.

**Definition of Done**

- Một lệnh chạy được prototype trên máy demo.
- Không can thiệp tay giữa flow.
- Ba tùy chọn phạm vi cùng dùng một contract API.
- Có màn hình loading, lỗi, thiếu nguồn và kết quả.
- Reviewer: TV5.

### TV3 - AI/Backend và Grounding

Thiết kế kỹ thuật chi tiết về kiến trúc AI, system prompt, guardrails, parser/OCR tiếng Việt, tool pipeline và phương án RAG: `docs/ke-hoach-thiet-ke-ai-quiz.md`.

**Trách nhiệm chính**

- Nhận source chunks theo contract và tạo quiz JSON.
- Thiết kế prompt, schema, retry khi JSON lỗi.
- Gắn `source_ref` cho mọi câu hỏi.
- Implement nhánh `need_clarification` và `insufficient_source`.
- Lưu trace tối thiểu: input ID, output, model, latency, trạng thái; không log API key.
- Cung cấp một AI call thật ở quyết định trung tâm.

**Đầu ra**

- Module/API tạo quiz.
- Prompt versioned trong `prototype/prompts/`.
- Trace mẫu trong `eval/traces/`.
- README cấu hình `.env.example`.

**Definition of Done**

- Không hardcode câu hỏi demo.
- Output đúng schema.
- Không tạo câu khi không trace được nguồn.
- AI call thật chạy được trên case chuẩn và case thiếu nguồn.
- Reviewer: TV4.

### TV4 - Evaluation, Golden Set và Quality

**Trách nhiệm chính**

- Viết định nghĩa pass/fail cho từng chiều chất lượng.
- Tạo golden set ≥20 case:
  - ≥2 case cho mỗi lớp khó.
  - 8-10 case thường.
  - 2-4 case hiếm.
  - ≥10 case lấy hoặc phát triển từ chatlog thật.
- Chạy lượt 1 toàn bộ trước CP3, ghi đủ pass/fail.
- Phân tích failure lớn nhất, phối hợp TV3 sửa một lỗi, chạy lại toàn bộ.
- Tổ chức TV1 và TV4 chấm độc lập ít nhất 5 output khó.

**Đầu ra**

- `eval/golden-set.csv` hoặc `.json`.
- `eval/rubric.md`.
- `eval/run-01-results.csv`.
- `eval/run-01-summary.md`.
- Nếu kịp: `eval/run-02-*`.

**Definition of Done**

- Không bỏ case fail khỏi bảng.
- Có % tổng và % theo từng chiều.
- So sánh với quality bar đã chốt.
- Có phân tích nguyên nhân nếu chưa đạt.
- Reviewer: TV1.

### TV5 - Risk, Validation, Repo và Demo

**Trách nhiệm chính**

- Tạo skeleton repo chuẩn và checklist nộp.
- Owner `spec.md` §5, §6, §8, §9.
- Viết ≥8 kịch bản rủi ro, phủ đủ 4 lớp.
- Tuyển và điều phối ≥5 người validation.
- Ghi feedback nguyên văn, severity và changelog.
- Owner slide 6 trang, demo script, backup và dry run.

**Đầu ra**

- `validation/feedback-log.md`.
- `validation/changelog.md`.
- `demo-script.md`.
- `demo-slides.pdf`.
- `reflection/README.md` và checklist 5 reflection.

**Definition of Done**

- ≥5 người ngoài nhóm, trong đó ≥2 willing users đã khai.
- Có ít nhất một thay đổi từ feedback hoặc lý do giữ nguyên có căn cứ.
- Demo đúng 5 phút, có một case chuẩn và một case lỗi.
- Mỗi thành viên có phần nói.
- Reviewer: TV2.

## 13. Công việc chung bắt buộc

| Việc | Cách chia |
|---|---|
| Nghiên cứu sản phẩm tương tự | Mỗi người 1 sản phẩm: Quizlet AI, NotebookLM, ChatGPT Study, Khanmigo, Kahoot AI |
| Tuyển user validation | Mỗi người tuyển ít nhất 1 người |
| Golden set | Mỗi người đề xuất ít nhất 4 case; TV4 chuẩn hóa và loại trùng |
| Review output AI | TV1 và TV4 chấm độc lập; TV3 không tự chấm toàn bộ output của mình |
| Reflection | Mỗi người một file: vai trò, phần làm, AI hỗ trợ, bài học từ case fail |
| Q&A | Mỗi người chuẩn bị trả lời phần mình sở hữu |

## 14. Handoff và phụ thuộc

| Từ | Sang | Handoff cần chốt | Hạn |
|---|---|---|---|
| TV1 | Cả nhóm | Lát cắt, non-goals, quality bar nháp | Ngay sau CP2 |
| TV3 | TV2 | Input/output schema + API mock | Trong 30 phút đầu |
| TV2 | TV3 | UI gửi đúng `scope_type/scope_value` | Trước tích hợp AI |
| TV1 | TV4 | Evidence IDs và 10 case phát triển từ chatlog | Trước khi chốt golden set |
| TV3 | TV4 | Runner/API + trace format | Trước lượt đo 1 |
| TV4 | TV3 | Failure ưu tiên số 1 | Sau lượt đo 1 |
| TV2/TV3 | TV5 | Prototype ổn định + case demo | Trước validation |
| TV5 | TV1 | Feedback + thay đổi | Trước chốt changelog/spec |

---

# PHẦN IV - KẾ HOẠCH THEO CHECKPOINT

## 15. Ngay sau CP2 - khóa phạm vi và dựng xương sống

**Timebox: 20-30 phút.**

1. TV1 đọc to lát cắt và non-goals; cả nhóm đồng ý.
2. TV2/TV3 chốt stack và JSON schema.
3. TV5 tạo cấu trúc thư mục chuẩn.
4. TV1 nhập 24 phản hồi vào spec; tiếp tục xin raw log và willing users.
5. TV4 tạo file golden set và rubric trống.
6. Xác nhận nguồn slide:
   - Có slide: chọn đúng một bài demo.
   - Chưa có slide: dùng một transcript sạch làm nguồn và ghi rõ đây là fallback.

**Cổng quyết định**

- Không có nguồn bài học → dừng build UI mới, ưu tiên lấy nguồn.
- Không có API key → gọi TA ngay; không hardcode để giả AI.
- README prototype còn là starter → cập nhật ngay để TA chạy và xác minh được.

## 16. Từ CP2 đến CP3 - AI thật và lượt đo đầu

### Luồng song song

- TV1: chạy khảo sát + viết spec §1-§2.
- TV2: frontend và bốn đường đi.
- TV3: parser/chunk + prompt + AI call + trace.
- TV4: golden set ≥20 + rubric + runner.
- TV5: 8 risk scenarios + repo skeleton + test tích hợp.

### Thứ tự tích hợp

1. TV3 trả mock JSON đúng schema.
2. TV2 tích hợp mock JSON.
3. TV3 thay mock bằng AI call thật.
4. TV4 chạy đủ golden set.
5. Cả nhóm chọn một lỗi đau nhất.
6. TV3 sửa prompt/guardrail.
7. Nếu còn thời gian, TV4 chạy lại toàn bộ.

### CP3 phải show

- Một AI call thật, không hardcode.
- Golden set ≥20 case.
- Bảng lượt chạy 1 có đầy đủ case và tỷ lệ %.
- Một case chuẩn và một case thiếu/mơ hồ.
- Trace không chứa secret.

## 17. Từ CP3 đến CP4 và hạn spec

### TV1

- Chốt evidence chuẩn A/B.
- Chốt bảng impact và ứng viên đã loại.
- Chốt automation và non-goals.

### TV5

- Hoàn thiện 4 lớp, ≥8 kịch bản và 4 đường đi.
- Kiểm tra ≥4 nguyên tắc HAX/PAIR có vị trí cụ thể:
  - G1: màn hình nói rõ chỉ tạo quiz từ nguồn đã chọn.
  - G2: hiển thị nguồn và giới hạn.
  - G10: thiếu/mơ hồ thì thu hẹp phạm vi.
  - G9 hoặc G15: báo/tạo lại câu hỏi.
  - Có thể thêm G11: giải thích gắn với nguồn.

### TV4

- Chốt quality bar bằng số.
- Chốt định nghĩa các chiều chất lượng.
- Gắn link eval vào spec §7.

### TV2/TV3

- Chỉ sửa để khớp spec và failure đã thấy.
- Không thêm feature sau CP4.

### CP4 phải show

- Spec gần hoàn chỉnh.
- Evidence đạt chuẩn.
- Bảng impact.
- 4 lớp + 8 kịch bản.
- ≥4 nguyên tắc áp vào vị trí cụ thể.
- Quality bar bằng số.

### Hạn cứng

- Commit `spec.md` trước 23:59 ngày 1.
- Quality bar giữ nguyên sau commit này.

## 18. Từ CP4 đến CP5 - validation và dry run

1. TV5 giao task thật cho từng người thử, không hướng dẫn thao tác.
2. Mỗi phiên khoảng 10 phút:
   - Quan sát user bấm.
   - Hỏi điều khó hiểu/khó chịu nhất.
   - Hỏi họ có tin kết quả không và vì sao.
   - Hỏi họ có dùng thật không và vì sao.
3. Ghi quote nguyên văn và severity.
4. Chọn 1-2 thay đổi có tác động cao, phạm vi nhỏ.
5. TV2/TV3 sửa; TV4 chạy regression case liên quan.
6. TV1 cập nhật changelog trong spec.
7. TV5 hoàn thiện slide và dry run có bấm giờ.

### CP5 phải show

- ≥5 feedback có tên/vai.
- ≥2 người là willing user đã khai.
- Changelog có thay đổi hoặc lý do giữ nguyên.
- Slide final.
- Demo 5 phút đã dry run.
- Thành viên ngẫu nhiên giải thích được phần mình làm.

## 19. CP6 - demo

### Chia phần nói

| Người | Phần trình bày |
|---|---|
| TV1 | Slide 1-2: user/job, evidence, impact |
| TV2 | Demo happy path và UI |
| TV3 | Case lỗi, grounding và automation |
| TV4 | Quality bar, golden set, kết quả đo |
| TV5 | Feedback user, thay đổi và bước tiếp theo |

### Kịch bản 5 phút

1. 0:00-0:45 - User, job và pain có số.
2. 0:45-1:30 - Vì sao chọn quiz so với ≥2 ứng viên khác.
3. 1:30-3:30 - Demo một case chuẩn và một case thiếu nguồn.
4. 3:30-4:15 - Kết quả eval so với quality bar.
5. 4:15-5:00 - Feedback thật, thay đổi và nếu có thêm một tuần.

### Backup

- Screenshot từng màn hình.
- Video ngắn happy path.
- Một output AI đã lưu nhưng ghi rõ chỉ dùng khi mạng lỗi.
- Case demo ổn định và case lạ để luyện Q&A.

---

# PHẦN V - CẤU TRÚC REPO VÀ KIỂM SOÁT RỦI RO

## 20. Cấu trúc repo mục tiêu

```text
repo/
├── README.md
├── spec.md
├── demo-slides.pdf
├── demo-script.md
├── docs/
│   └── ke-hoach-nhom-5-nguoi-sau-checkpoint-2.md
├── evidence/
│   ├── survey-questions.md
│   ├── survey-log.csv
│   └── mining-method.md
├── codebase/          # hoặc đổi tên/ánh xạ từ prototype/
│   ├── README.md
│   ├── .env.example
│   ├── prompts/
│   └── ...
├── eval/
│   ├── rubric.md
│   ├── golden-set.csv
│   ├── run-01-results.csv
│   ├── run-01-summary.md
│   └── traces/
├── validation/
│   ├── feedback-log.md
│   └── changelog.md
└── reflection/
    ├── TV1.md
    ├── TV2.md
    ├── TV3.md
    ├── TV4.md
    └── TV5.md
```

Không sao chép nguyên data pack vào repo nộp bài công khai. Trong evidence/eval chỉ ghi mã turn/mã đoạn và trích ngắn tối thiểu.

## 21. Risk register

| Rủi ro | Mức | Dấu hiệu | Giảm thiểu | Owner |
|---|---|---|---|---|
| Form chưa chứng minh pain theo hành vi | Cao | Có 95,8% muốn quiz nhưng không có tần suất/thời gian/quote | Gọi đúng đây là desirability; kết hợp mining; xin raw log và follow-up ngắn | TV1 |
| Không có slide thật | Rất cao | Repo không có `slides/` | Xin ngay; fallback transcript có mã nguồn; ghi rõ phần mock | TV1/TV3 |
| AI bịa câu hỏi/đáp án | Rất cao | Không trace được về nguồn | `source_ref` bắt buộc; hard condition 100%; thiếu nguồn thì từ chối | TV3/TV4 |
| Đáp án có hơn một lựa chọn đúng | Cao | Hai reviewer bất đồng | Rubric answerability; loại/regenerate câu; test case riêng | TV4 |
| Ba phạm vi làm scope nổ | Cao | Ba pipeline code khác nhau | Chuẩn hóa tất cả về `source_chunks`; chỉ một bài demo | TV2/TV3 |
| AI grading thành quyết định thứ hai | Trung bình | Có LLM call sau khi submit | Chấm rule-based; feedback theo ngưỡng | TV2 |
| Không kịp CP3 | Cao | Chưa có AI call/golden set khi còn <60 phút | Dừng UI polish; ưu tiên 1 API call + 20 case + run 1 | TV1 |
| Latency/API lỗi khi demo | Trung bình | >8 giây hoặc rate limit | Loading state, retry 1 lần, backup video/output | TV3/TV5 |
| Secret hoặc data nhạy cảm bị commit | Rất cao | `.env`/raw data xuất hiện trong Git | `.gitignore`, secret scan, chỉ dùng ID/trích ngắn | TV3/TV5 |
| Thành viên không giải thích được phần mình | Cao | Chỉ một người hiểu hệ thống | Peer walkthrough, mỗi người trình bày phần mình trước CP5 | TV5 |

## 22. Thứ tự ưu tiên khi thiếu thời gian

1. AI call thật ở quyết định trung tâm.
2. Golden set ≥20 và lượt đo 1.
3. Evidence chuẩn A/B.
4. Spec đúng rubric và quality bar.
5. Bốn đường đi + xử lý thiếu nguồn.
6. Validation ≥5 người.
7. Slide và dry run.
8. UI polish.
9. Feature phụ.

## 23. Checklist hoàn tất

### Trước CP3

- [x] Prototype CP2 có trong `prototype/`.
- [ ] README prototype mô tả đúng sản phẩm và phần mock.
- [ ] Có nguồn bài học với ID ổn định.
- [ ] AI call thật.
- [ ] Golden set ≥20.
- [ ] Run 1 đủ mọi case và có %.

### Trước commit spec 23:59

- [ ] Evidence A hoặc B đạt chuẩn.
- [ ] Pain cụ thể, không nhắc AI.
- [ ] Bảng impact ≥3 ứng viên và ứng viên loại.
- [ ] Lát cắt một câu.
- [ ] ≥3 non-goals.
- [ ] Automation conditional + cost-of-error.
- [ ] ≥4 HAX/PAIR có vị trí áp dụng.
- [ ] 4 lớp + ≥8 kịch bản.
- [ ] Quality bar bằng số.

### Trước CP5

- [ ] ≥5 feedback có tên/vai.
- [ ] ≥2 willing users.
- [ ] Changelog.
- [ ] Regression test sau thay đổi.
- [ ] Slide 6 trang.
- [ ] Dry run 5 phút.

### Trước CP6

- [ ] Mỗi người có phần nói.
- [ ] Có case chuẩn và case lỗi.
- [ ] Có backup demo.
- [ ] Repo đủ cấu trúc.
- [ ] 5 reflection.
- [ ] Không có API key hoặc data pack thô trong commit.

---

# PHẦN VI - TÀI LIỆU ĐÃ ĐỐI CHIẾU

- `README.md`: lịch checkpoint, cấu trúc repo và luật bảo mật.
- `01-de-bai.md`: Hướng A, lát cắt một câu và 5 tiêu chí nghiệm thu.
- `02-guide.md`: JTBD, evidence, automation, HAX/PAIR, build, eval, validation và demo.
- `03-template-ai-spec.md`: cấu trúc `spec.md`.
- `04-rubric.md`: điều kiện tính điểm CP3-CP6 và 75 điểm artifact.
- `workflow-quiz-ai.md` và `Quiz Creation Workflow with.png`: flow hiện tại của nhóm.
- `data/vlearn-pack/README.md`: phạm vi và luật dùng dữ liệu.
- `data/vlearn-pack/chatlog/DATA_DICTIONARY.md`: cấu trúc 2.522 message.
- `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`: tín hiệu hành vi sơ bộ.
- `data/vlearn-pack/transcript/README.md`: sáu transcript và mã trích dẫn.
- `tham-khao/worksheet-jtbd-day-du.md`: job executor, job statement, alternatives và AI leverage.
- `tham-khao/Strategyn_JTBD_Playbook.pdf`, chương 2-3: định nghĩa market theo job, công thức job statement và job map tám bước.

## Ghi chú người duyệt

Trước khi bắt đầu, cả nhóm cần duyệt và điền:

- Tên thật cho TV1-TV5.
- Stack được chọn.
- Bài giảng demo.
- Provider/model AI.
- Quality bar chính thức.
- Thời gian checkpoint theo K3 hoặc K4.
- Quyết định đổi tên `prototype/` thành `codebase/` hoặc ghi ánh xạ rõ trong README.
