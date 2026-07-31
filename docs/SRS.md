# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## Hệ thống VLearn — Quiz chẩn đoán kiến thức từ slide

| Thuộc tính | Nội dung |
|---|---|
| Mã tài liệu | VLEARN-SRS-001 |
| Phiên bản | 1.0 |
| Ngày cập nhật | 31/07/2026 |
| Trạng thái | Baseline theo MVP hiện tại |
| Nền tảng | Web responsive |
| Ngôn ngữ tài liệu | Tiếng Việt |
| Phạm vi dữ liệu | Bài học `DAY03` — “Từ Chatbot Đến Agentic Agent” |

---

## 1. Lịch sử cập nhật

| Phiên bản | Ngày | Người cập nhật | Nội dung |
|---|---|---|---|
| 1.0 | 31/07/2026 | Codex | Tạo SRS từ mã nguồn, dữ liệu bài học và tài liệu kiến trúc hiện có |

## 2. Mục đích tài liệu

Tài liệu này mô tả yêu cầu phần mềm của VLearn để các bên BA, PM, Dev, QA và người duyệt có cùng căn cứ khi phát triển và kiểm thử.

SRS phản ánh chức năng đang có trong MVP:

- Học viên đọc slide Day 03 bằng trình xem slide riêng.
- Học viên tạo quiz từ toàn bài, một chương hoặc một slide kiến thức.
- AI tạo câu hỏi trắc nghiệm có dẫn nguồn từ nội dung slide đã duyệt.
- Hệ thống chấm điểm bằng luật, tách câu trả lời sai và câu bỏ qua.
- AI phân tích điểm mạnh, điểm yếu, hổng kiến thức và đề xuất nội dung cần ôn.
- Giảng viên xem thống kê tổng hợp theo slide và nhận gợi ý dạy lại từ AI.

Tài liệu `docs/architechture.md` là tài liệu thiết kế kỹ thuật tham khảo, không phải nguồn yêu cầu chính vì một số phần chưa đồng bộ với ứng dụng hiện tại.

## 3. Tổng quan hệ thống

### 3.1. Bài toán

Sau khi học bằng slide, học viên cần kiểm tra nhanh mình đã hiểu đúng nội dung nào, hiểu sai nội dung nào và nội dung nào chưa đủ kiến thức để trả lời. Giảng viên cần xem xu hướng của cả lớp để quyết định nội dung cần giải thích lại hoặc luyện tập thêm.

### 3.2. Mục tiêu

- Tạo quiz dựa đúng trên slide chính thức, không dùng kiến thức ngoài nguồn.
- Dẫn học viên về đúng trang slide của từng câu hỏi.
- Không đánh đồng câu bỏ qua với câu trả lời sai.
- Đưa ra nhận xét có bằng chứng, không suy diễn năng lực tổng quát của học viên.
- Cung cấp thống kê cấp lớp để hỗ trợ giảng viên ra quyết định.

### 3.3. Phạm vi MVP

#### Trong phạm vi

- Một bài học Day 03 gồm 78 trang PDF và 12 chương.
- 49 slide có `quizEligible=true` và `reviewStatus="approved"` được phép làm nguồn tạo quiz.
- Tạo quiz 5 hoặc 10 câu.
- Quiz trắc nghiệm một đáp án đúng, mỗi câu có 4 lựa chọn.
- Phạm vi quiz: toàn bài, một chương hoặc một slide kiến thức.
- Đọc từng trang PDF bằng PDF.js, không hiển thị thanh công cụ PDF mặc định của trình duyệt.
- Chấm điểm, nhận xét cá nhân, liên kết nguồn và gợi ý ôn tập.
- Lưu lượt làm vào Cloudflare R2 để tổng hợp dashboard giảng viên.
- Dashboard giảng viên và AI brief theo dữ liệu lượt làm thực tế.

#### Ngoài phạm vi

- Upload hoặc quản trị bài giảng trong giao diện.
- Tự động OCR, phân tích PDF hoặc tạo metadata tại runtime.
- Câu hỏi tự luận.
- RAG, embedding hoặc vector database.
- Sửa nội dung slide và metadata từ giao diện.
- Quản lý lớp, khóa học, danh sách học viên hoặc phân nhóm.
- Xem lịch sử chi tiết theo từng học viên.
- Chứng nhận hoàn thành hoặc xuất báo cáo.
- Phân quyền production hoàn chỉnh.

## 4. Vai trò người dùng

| Role ID | Vai trò | Trách nhiệm và quyền trong MVP |
|---|---|---|
| ROLE-STUDENT | Học viên | Xem slide, chọn phạm vi, tạo và làm quiz, bỏ qua câu hỏi, xem kết quả và tài nguyên ôn tập |
| ROLE-TEACHER | Giảng viên | Xem thống kê tổng hợp lớp, nhận định AI và mở slide để đối chiếu |
| ROLE-SYSTEM | Hệ thống | Nạp dữ liệu, lọc nguồn, gọi AI, kiểm tra kết quả AI, chấm điểm, lưu và tổng hợp lượt làm |
| ROLE-REVIEWER | Người duyệt dữ liệu | Duyệt metadata slide ngoài luồng runtime; không có màn hình trong MVP |

> **TBD / Need confirmation:** Ứng dụng hiện chưa thực thi phân quyền học viên/giảng viên tại route. Tên học viên trên giao diện là dữ liệu trình bày cố định. File `chatgpt-auth.ts` có tiện ích đọc danh tính từ header nhưng chưa được nối vào các màn hình nghiệp vụ.

## 5. Tài liệu và nguồn liên quan

| Ref ID | Tài liệu/Nguồn | Mục đích |
|---|---|---|
| REF-01 | `data/day03-tu-chatbot-den-agentic-agent-react-v7.pdf` | Slide gốc Day 03 |
| REF-02 | `data/lesson.json` | Metadata chính thức của slide |
| REF-03 | `codebase/data/lessons/DAY03.json` | Bản dữ liệu được ứng dụng sử dụng |
| REF-04 | `docs/architechture.md` | Thiết kế AI ban đầu, chỉ dùng tham khảo |
| REF-05 | `spec.md` | Bối cảnh sản phẩm, JTBD và guardrail |
| REF-06 | Mã nguồn trong `codebase/` | Nguồn xác nhận hành vi MVP hiện tại |

## 6. Thuật ngữ và viết tắt

| Thuật ngữ | Giải thích |
|---|---|
| AI | Trí tuệ nhân tạo |
| AI Agent | Hệ thống AI có thể lập kế hoạch, hành động và quan sát kết quả |
| API | Giao diện lập trình ứng dụng |
| MCQ | Câu hỏi trắc nghiệm nhiều lựa chọn |
| PDF page | Số trang vật lý trong file PDF, dùng để mở đúng nội dung |
| Display slide number | Số trang được in/hiển thị trong nội dung slide |
| Scope | Phạm vi kiến thức dùng để tạo quiz |
| Misconception | Cách hiểu sai được gắn với một phương án nhiễu |
| Knowledge gap | Vùng kiến thức chưa đủ bằng chứng do học viên bỏ qua câu hỏi |
| Fallback | Kết quả dự phòng được tạo bằng luật khi AI lỗi |
| R2 | Object storage của Cloudflare dùng để lưu lượt làm và AI brief |
| SRS | Software Requirements Specification |

## 7. Luồng nghiệp vụ

### 7.1. Luồng học viên

1. Hệ thống tải catalog bài học và hiển thị trang đọc slide.
2. Học viên xem slide bằng nút trước/sau hoặc chọn chương/phạm vi.
3. Học viên chọn phạm vi: toàn bài, chương hoặc slide kiến thức.
4. Học viên chọn 5 hoặc 10 câu và yêu cầu tạo quiz.
5. Backend chỉ lấy các slide đã duyệt, đủ điều kiện và thuộc phạm vi.
6. DeepSeek sinh quiz bằng tiếng Việt; hệ thống kiểm tra schema và dẫn nguồn.
7. Học viên chọn đáp án hoặc “Bỏ qua · Chưa biết”.
8. Hệ thống hiển thị phản hồi của câu và chuyển sang câu tiếp theo.
9. Sau câu cuối, backend chấm điểm bằng luật và tạo bằng chứng.
10. AI phân tích kết quả; nếu AI lỗi, hệ thống dùng nhận xét fallback.
11. Học viên xem điểm, câu đúng/sai/bỏ qua, nguồn slide và kế hoạch ôn tập.
12. Hệ thống lưu lượt làm theo cơ chế fire-and-forget; lỗi lưu không được làm gián đoạn trang kết quả.

### 7.2. Luồng giảng viên

1. Giảng viên mở trang “Bảng điều khiển giảng viên”.
2. Hệ thống đọc toàn bộ lượt làm đã lưu và tổng hợp theo slide.
3. Hệ thống hiển thị số lượt làm, điểm trung bình và các slide yếu nhất.
4. AI tạo nhận định và tối đa 3 hành động ưu tiên từ thống kê thật.
5. Khi số lượt làm không đổi, hệ thống dùng AI brief đã lưu.
6. Khi có lượt làm mới, hệ thống tự tạo lại brief.
7. Giảng viên bấm vào trang slide để mở trình xem slide dành riêng cho giảng viên.

### 7.3. Phân loại kết quả

| Trạng thái câu | Điều kiện | Cách tính | Ý nghĩa chẩn đoán |
|---|---|---|---|
| Đúng | Phương án chọn bằng `correctOption` | Cộng 1 điểm | Có bằng chứng tích cực cho chủ đề |
| Cần ôn | Có chọn đáp án nhưng không đúng | Không cộng điểm; nằm trong mẫu số câu đã trả lời | Có thể tạo weakness và misconception |
| Hổng kiến thức | Chọn bỏ qua, giá trị `null` | Không cộng điểm; không nằm trong mẫu số câu đã trả lời | Tạo knowledge gap, không tạo misconception |

## 8. Danh sách chức năng

| Function ID | Tên chức năng | Role | Màn hình/API liên quan |
|---|---|---|---|
| FN-001 | Tải catalog bài học | Hệ thống | SCR-STU-01, API-001 |
| FN-002 | Xem và điều hướng slide | Học viên | SCR-STU-01 |
| FN-003 | Chọn phạm vi quiz | Học viên | SCR-STU-01 |
| FN-004 | Tạo quiz bằng AI | Học viên/Hệ thống | SCR-STU-01, SCR-STU-02, API-002 |
| FN-005 | Làm quiz và bỏ qua câu hỏi | Học viên | SCR-STU-03 |
| FN-006 | Chấm điểm và chẩn đoán | Hệ thống | SCR-STU-04, API-003 |
| FN-007 | Xem kết quả và nguồn kiến thức | Học viên | SCR-STU-04 |
| FN-008 | Lưu lượt làm | Hệ thống | API-004 |
| FN-009 | Tổng hợp thống kê lớp | Giảng viên/Hệ thống | SCR-TEA-01, API-005 |
| FN-010 | Tạo nhận định dạy lại bằng AI | Giảng viên/Hệ thống | SCR-TEA-01, API-006 |
| FN-011 | Xem slide ở góc nhìn giảng viên | Giảng viên | SCR-TEA-02, API-001 |

## 9. Yêu cầu chức năng chi tiết

### 9.1. FN-001 — Tải catalog bài học

| Thuộc tính | Nội dung |
|---|---|
| Mục đích | Cung cấp metadata cần thiết cho giao diện mà không làm lộ nội dung nguồn dùng để tạo quiz |
| Trigger | Mở trang học viên hoặc trang xem slide giảng viên |
| Điều kiện | File `DAY03.json` tồn tại và hợp lệ |

#### Yêu cầu

- **FR-001:** Hệ thống phải trả thông tin bài học, danh sách chương, danh sách slide và đường dẫn PDF.
- **FR-002:** Catalog phải có 78 slide và 12 chương theo nguồn Day 03.
- **FR-003:** Mỗi slide trong catalog phải có `slideId`, `pdfPage`, `displaySlideNumber`, `chapterId`, `title`, `quizEligible` và `reviewStatus`.
- **FR-004:** API catalog không được trả `rawText`, `sourceText` hoặc nội dung nguồn tương đương cho client.
- **FR-005:** Khi tải catalog lỗi, trang học viên phải hiển thị thông báo lỗi và không được gửi yêu cầu tạo quiz với dữ liệu chưa xác định.

### 9.2. FN-002 — Xem và điều hướng slide

| Thuộc tính | Nội dung |
|---|---|
| Mục đích | Cho phép người dùng đọc đúng một trang slide mà không dùng trình xem PDF mặc định |
| Trigger | Catalog tải thành công hoặc URL chứa `pdfPage` |
| Điều kiện | PDF tồn tại tại đường dẫn tĩnh |

#### Yêu cầu

- **FR-006:** Trình xem phải dùng PDF.js để render duy nhất trang đang chọn lên canvas.
- **FR-007:** Trình xem không hiển thị toolbar tải xuống/in/thumbnail mặc định của trình duyệt.
- **FR-008:** Người dùng phải chuyển được sang trang trước và trang sau.
- **FR-009:** Nút trang trước phải disabled tại trang 1; nút trang sau phải disabled tại trang cuối.
- **FR-010:** Nếu URL có `?pdfPage=N` hợp lệ từ 1 đến 78, trang đọc phải mở đúng PDF page `N`.
- **FR-011:** Liên kết nguồn phải sử dụng `pdfPage`, không sử dụng `displaySlideNumber`.
- **FR-012:** Nhãn hiển thị dùng `Trang {displaySlideNumber}` khi có; nếu không có thì dùng `Trang PDF {pdfPage}`.
- **FR-013:** Khi không tải hoặc không render được PDF, trình xem phải hiển thị thông báo “Không thể hiển thị slide” kèm nguyên nhân phù hợp.

### 9.3. FN-003 — Chọn phạm vi quiz

#### Yêu cầu

- **FR-014:** Học viên phải chọn được một trong ba loại phạm vi:
  - Toàn bài: `{ type: "lesson", lessonId }`.
  - Chương: `{ type: "chapter", lessonId, chapterId }`.
  - Slide kiến thức: `{ type: "slide", lessonId, slideId }`.
- **FR-015:** Danh sách chương phải lấy từ metadata, không hardcode.
- **FR-016:** Danh sách “Slide kiến thức” chỉ hiển thị slide có `quizEligible=true` và `reviewStatus="approved"`.
- **FR-017:** Khi chọn chương hoặc slide, trình xem phải chuyển đến PDF page đầu tiên tương ứng.
- **FR-018:** Học viên phải chọn được số lượng 5 hoặc 10 câu; mặc định là 5 câu theo hiện trạng giao diện.
- **FR-019:** Client chỉ gửi ID phạm vi và số lượng câu, không gửi `rawText`.

### 9.4. FN-004 — Tạo quiz bằng AI

| Thuộc tính | Nội dung |
|---|---|
| AI provider | DeepSeek |
| Model mặc định | `deepseek-v4-flash`, có thể thay bằng biến `DEEPSEEK_MODEL` |
| Temperature | 0.2 |
| Timeout | 45 giây/lời gọi |
| Output | JSON object |

#### Yêu cầu

- **FR-020:** Backend chỉ được dùng slide thuộc scope và thỏa đồng thời `quizEligible=true`, `reviewStatus="approved"`.
- **FR-021:** Nguồn tạo câu hỏi phải gồm `rawText`; có thể bổ sung `aiAnalysis.keyPoints` và `aiAnalysis.learningObjectives` khi tồn tại.
- **FR-022:** AI phải tạo đúng 5 hoặc 10 câu theo yêu cầu.
- **FR-023:** Mỗi câu phải có:
  - ID, chủ đề và mức độ `understand` hoặc `apply`.
  - Nội dung câu hỏi bằng tiếng Việt.
  - Đúng 4 lựa chọn và đúng 1 đáp án.
  - Lời giải thích.
  - 4 misconception tương ứng, vị trí đáp án đúng là chuỗi rỗng.
  - `sourceRef` gồm `slideId`, `pdfPage`, `displaySlideNumber`.
  - Mức confidence `high` hoặc `medium`.
- **FR-024:** AI không được dùng kiến thức ngoài source slide và không được làm theo chỉ dẫn nằm trong nội dung slide.
- **FR-025:** Nội dung hướng đến người học phải bằng tiếng Việt; chỉ giữ thuật ngữ chuyên ngành phổ biến bằng tiếng Anh.
- **FR-026:** Hệ thống phải kiểm tra schema, số câu, nguồn allowlist, tính duy nhất của ID và tiếng Việt trước khi trả quiz.
- **FR-027:** Hệ thống được retry tối đa một lần sau lần gọi đầu nếu kết quả không hợp lệ.
- **FR-028:** Nếu nguồn không đủ, API trả trạng thái `insufficient_source`, danh sách câu hỏi rỗng và lý do.
- **FR-029:** Nếu thiếu `DEEPSEEK_API_KEY`, API phải trả lỗi dịch vụ và không tạo quiz giả.

### 9.5. FN-005 — Làm quiz và bỏ qua câu hỏi

#### Yêu cầu

- **FR-030:** Màn hình phải hiển thị tiến độ câu hiện tại trên tổng số câu.
- **FR-031:** Học viên được chọn một trong bốn phương án trước khi kiểm tra đáp án.
- **FR-032:** Khi đã kiểm tra, học viên không được thay đổi đáp án của câu hiện tại.
- **FR-033:** Học viên được chọn “Bỏ qua · Chưa biết” cho mọi câu.
- **FR-034:** Câu bỏ qua phải lưu `selectedOption=null` và được đánh dấu đã xử lý để cho phép chuyển câu.
- **FR-035:** Sau khi kiểm tra, hệ thống phải hiển thị trạng thái đúng/sai/bỏ qua, giải thích và nguồn slide.
- **FR-036:** Học viên phải mở được nguồn của câu trong tab mới mà không làm mất trạng thái quiz ở tab hiện tại.
- **FR-037:** Học viên được thoát về bài học trong khi đang làm quiz. Dữ liệu lượt làm dở không bắt buộc lưu trong MVP.

### 9.6. FN-006 — Chấm điểm và chẩn đoán

#### Yêu cầu chấm điểm

- **FR-038:** Điểm phải do code tính, AI không được tính hoặc thay đổi điểm.
- **FR-039:** Mỗi câu đúng cộng 1; câu sai và câu bỏ qua không cộng điểm.
- **FR-040:** Mẫu số điểm cá nhân phải là số câu đã trả lời, không gồm câu bỏ qua.
- **FR-041:** Evidence phải chứa `score`, `answeredQuestions`, `skippedQuestions`, `totalQuestions` và chi tiết từng câu.

#### Yêu cầu chẩn đoán

- **FR-042:** AI chỉ được dùng attempt evidence và danh sách tài nguyên ôn tập được backend cho phép.
- **FR-043:** Mỗi strength chỉ được trích dẫn question ID thực sự đúng.
- **FR-044:** Mỗi weakness phải có ít nhất một question ID thực sự sai và không được dùng câu bỏ qua.
- **FR-045:** Mỗi knowledge gap phải có ít nhất một question ID bị bỏ qua.
- **FR-046:** Câu bỏ qua không được tạo misconception hoặc bị mô tả là hiểu sai.
- **FR-047:** Recommendation chỉ được trỏ đến slide trong allowlist của lượt làm.
- **FR-048:** Nội dung chẩn đoán phải bằng tiếng Việt, ngoại trừ thuật ngữ chuyên ngành.
- **FR-049:** Nếu AI lỗi hoặc output không hợp lệ, hệ thống phải tạo diagnosis fallback bằng luật và đánh dấu cho giao diện biết.

### 9.7. FN-007 — Xem kết quả và nguồn kiến thức

#### Yêu cầu

- **FR-050:** Màn hình kết quả phải hiển thị tổng quan, điểm đúng trên số câu đã trả lời và số câu bỏ qua.
- **FR-051:** Mỗi card câu trả lời phải hiển thị một trong ba trạng thái: “Đúng”, “Cần ôn”, “Hổng kiến thức”.
- **FR-052:** Mỗi card phải hiển thị nhãn trang nguồn và liên kết mở đúng `pdfPage`.
- **FR-053:** Ví dụ đối chiếu bắt buộc: `DAY03-S007` hiển thị “Trang 5” nhưng liên kết/mở PDF page 7.
- **FR-054:** Màn hình phải hiển thị kế hoạch ôn tập từ recommendations và liên kết slide tương ứng.
- **FR-055:** Nếu dùng fallback, giao diện phải thông báo kết quả phân tích là dự phòng.
- **FR-056:** Học viên phải có hành động làm lại quiz hiện tại hoặc tạo quiz mới.

### 9.8. FN-008 — Lưu lượt làm

#### Yêu cầu

- **FR-057:** Sau khi có kết quả, client gửi lượt làm đến API lưu trữ theo cơ chế fire-and-forget.
- **FR-058:** Lỗi lưu không được thay đổi điểm, chẩn đoán hoặc ngăn học viên xem kết quả.
- **FR-059:** Mỗi lượt làm phải có ID duy nhất, thời gian tạo, scope, điểm, số câu đã trả lời/bỏ qua/tổng số và chi tiết từng câu.
- **FR-060:** Dữ liệu phải tách `isCorrect` và `isSkipped`.
- **FR-061:** Misconception chỉ lưu cho câu sai; câu đúng và câu bỏ qua phải lưu chuỗi rỗng.
- **FR-062:** Dữ liệu MVP được lưu trong object `attempts.json` trên R2 binding `BUCKET`.

> **TBD / Need confirmation:** Chính sách retention, giới hạn kích thước object, cơ chế chống ghi đè khi có request đồng thời và yêu cầu xóa dữ liệu.

### 9.9. FN-009 — Tổng hợp thống kê lớp

#### Yêu cầu

- **FR-063:** Hệ thống phải tổng hợp tất cả lượt làm đã lưu.
- **FR-064:** Dashboard phải hiển thị tổng số lượt làm và điểm trung bình theo phần trăm.
- **FR-065:** Điểm trung bình lớp được tính bằng tổng số câu đúng chia tổng số câu đã trả lời; câu bỏ qua không nằm trong mẫu số.
- **FR-066:** Thống kê theo slide phải gồm:
  - Số câu đúng, sai và bỏ qua.
  - Tỷ lệ đúng.
  - Tối đa 3 misconception phổ biến.
  - Số câu sai theo mức `understand` và `apply`.
- **FR-067:** Các slide phải được sắp xếp theo tỷ lệ đúng tăng dần để slide yếu xuất hiện trước.
- **FR-068:** Khi chưa có lượt làm, dashboard phải hiển thị trạng thái rỗng, không hiển thị số liệu giả.
- **FR-069:** Mỗi slide trong dashboard phải có liên kết mở đúng trang trong SCR-TEA-02.

### 9.10. FN-010 — Nhận định và gợi ý dạy lại bằng AI

#### Yêu cầu

- **FR-070:** AI brief chỉ được dùng số liệu đã tổng hợp theo slide.
- **FR-071:** AI phải phân biệt:
  - Sai nhiều: có hiểu lầm cần sửa.
  - Bỏ qua nhiều: chưa biết/chưa đủ kiến thức, cần giới thiệu hoặc dạy lại từ đầu.
- **FR-072:** Nếu sai mức `understand` trội hơn, gợi ý ưu tiên giải thích lại lý thuyết.
- **FR-073:** Nếu sai mức `apply` trội hơn, gợi ý ưu tiên bài tập tình huống.
- **FR-074:** Brief gồm tóm tắt 2–3 câu và tối đa 3 hành động ưu tiên.
- **FR-075:** Văn bản cho giảng viên không được hiển thị mã slide nội bộ hoặc tên trường JSON.
- **FR-076:** Mỗi hành động phải tham chiếu đúng một `slideId` tồn tại trong thống kê.
- **FR-077:** Brief phải được cache kèm số lượt làm đã dùng để phân tích.
- **FR-078:** GET dùng cache khi số lượt làm không đổi và tự làm mới khi có lượt làm mới.
- **FR-079:** Khi AI brief lỗi, dashboard phải hiển thị lỗi riêng; thống kê thuần vẫn phải sử dụng được.

### 9.11. FN-011 — Xem slide dành cho giảng viên

#### Yêu cầu

- **FR-080:** Route `/overview/slide?page=N` phải hiển thị trình xem slide độc lập với luồng học viên.
- **FR-081:** Trang phải cho phép quay lại dashboard, chuyển trang trước/sau và mở trang được chỉ định.
- **FR-082:** Trang phải hiển thị tiêu đề và metadata của slide khi catalog khả dụng.
- **FR-083:** Trang phải nêu rõ đây là giao diện đối chiếu của giảng viên, không phải giao diện học viên.

## 10. Đặc tả màn hình

### 10.1. SCR-STU-01 — Không gian học / Đọc slide

| Object ID | Đối tượng | Loại | Bắt buộc | Giá trị/Hành động |
|---|---|---|---|---|
| STU01-01 | Logo VLearn | Image/Label | Có | Nhận diện hệ thống |
| STU01-02 | Trạng thái hệ thống | Label | Có | “Hệ thống sẵn sàng” hoặc “AI đang xử lý” |
| STU01-03 | Danh sách chương | Button list | Có | Chọn chương và mở slide đầu tiên |
| STU01-04 | Trình xem slide | Canvas | Có | Render một PDF page |
| STU01-05 | Slide trước | Icon button | Có | Giảm `pdfPage` 1 |
| STU01-06 | Slide tiếp theo | Icon button | Có | Tăng `pdfPage` 1 |
| STU01-07 | Mở slide ở tab mới | Hyperlink | Có | Mở `/?pdfPage={pdfPage}` |
| STU01-08 | Loại phạm vi | Segmented button | Có | Cả bài / Chương / Slide kiến thức |
| STU01-09 | Giá trị phạm vi | Dropdown | Tùy loại | Chọn chapter ID hoặc slide ID |
| STU01-10 | Số câu hỏi | Segmented button | Có | 5 hoặc 10 |
| STU01-11 | Tạo quiz | Button | Có | Gọi API-002 |
| STU01-12 | Thông báo lỗi | Alert | Khi lỗi | Hiển thị lỗi catalog/tạo quiz |

### 10.2. SCR-STU-02 — Trạng thái AI xử lý

| Object ID | Đối tượng | Loại | Nội dung |
|---|---|---|---|
| STU02-01 | Loading indicator | Animation | Cho biết request đang xử lý |
| STU02-02 | Tiêu đề | Heading | “Đang tạo quiz có căn cứ” hoặc “Đang tổng hợp kết quả của bạn” |
| STU02-03 | Mô tả | Text | Giải thích hệ thống đang dùng slide và kiểm tra nguồn |

### 10.3. SCR-STU-03 — Làm quiz

| Object ID | Đối tượng | Loại | Bắt buộc | Hành động |
|---|---|---|---|---|
| STU03-01 | Tiến độ | Label/Progress | Có | Hiển thị câu hiện tại/tổng số |
| STU03-02 | Nguồn câu hỏi | Hyperlink | Có | Mở đúng `pdfPage` trong tab mới |
| STU03-03 | Nội dung câu hỏi | Text | Có | Nội dung tiếng Việt |
| STU03-04 | Bốn đáp án | Button group | Có | Chọn một phương án |
| STU03-05 | Bỏ qua · Chưa biết | Button | Có | Ghi nhận `null`, không tính sai |
| STU03-06 | Kiểm tra/Tiếp tục | Button | Có | Khóa đáp án, sau đó chuyển câu |
| STU03-07 | Phản hồi | Panel | Sau kiểm tra | Trạng thái, explanation, topic |
| STU03-08 | Thoát | Button | Có | Quay lại SCR-STU-01 |

### 10.4. SCR-STU-04 — Kết quả cá nhân

| Object ID | Đối tượng | Loại | Nội dung/Hành động |
|---|---|---|---|
| STU04-01 | Tổng quan | Summary card | Điểm, số bỏ qua, overall summary |
| STU04-02 | Confidence | Label | high/medium/low |
| STU04-03 | Tổng hợp câu trả lời | Card list | Trạng thái từng câu và trang nguồn |
| STU04-04 | Kế hoạch ngắn | Card list | Recommendation và link slide |
| STU04-05 | Cảnh báo fallback | Alert | Hiện khi AI diagnosis lỗi |
| STU04-06 | Làm lại | Button | Reset đáp án, giữ bộ câu hỏi |
| STU04-07 | Tạo quiz mới | Button | Quay lại SCR-STU-01 |

### 10.5. SCR-TEA-01 — Bảng điều khiển giảng viên

| Object ID | Đối tượng | Loại | Nội dung/Hành động |
|---|---|---|---|
| TEA01-01 | Về không gian học | Hyperlink | Mở `/` |
| TEA01-02 | Tổng số lượt làm | Statistic card | Dữ liệu thật từ R2 |
| TEA01-03 | Điểm trung bình | Statistic card | Phần trăm trên câu đã trả lời |
| TEA01-04 | Slide yếu nhất | Data cards | Đúng/sai/bỏ qua, tỷ lệ đúng, misconception |
| TEA01-05 | Link trang slide | Hyperlink | Mở SCR-TEA-02 |
| TEA01-06 | AI brief | Panel | Summary và tối đa 3 hành động ưu tiên |
| TEA01-07 | Empty state | Information | Hiện khi chưa có lượt làm |
| TEA01-08 | Error state | Alert | Lỗi thống kê hoặc AI brief |

### 10.6. SCR-TEA-02 — Xem slide góc nhìn giảng viên

| Object ID | Đối tượng | Loại | Nội dung/Hành động |
|---|---|---|---|
| TEA02-01 | Quay lại dashboard | Hyperlink | Mở `/overview` |
| TEA02-02 | Tiêu đề slide | Heading | Tên và số trang |
| TEA02-03 | Trình xem | Canvas | Render một PDF page |
| TEA02-04 | Trang trước/sau | Icon button | Điều hướng trong 1–78 |
| TEA02-05 | Ghi chú ngữ cảnh | Text | Xác nhận đây là góc nhìn giảng viên |

## 11. Đặc tả API

| API ID | Method và path | Input | Output chính | Lỗi chính |
|---|---|---|---|---|
| API-001 | `GET /api/lesson` | Không | `{ok, catalog}` | 500 khi không nạp được dữ liệu |
| API-002 | `POST /api/generate-quiz` | `{scope, questionCount}` | `{ok, result, meta}` | 400 input/nguồn; 503 thiếu API key |
| API-003 | `POST /api/diagnosis` | `{scope, questions, selectedOptions}` | Điểm, số trả lời/bỏ qua, diagnosis, fallback | 400 payload/evidence không hợp lệ |
| API-004 | `POST /api/attempts` | Attempt payload | `{ok, id}` | 400 payload hoặc lưu R2 lỗi |
| API-005 | `GET /api/class-overview` | Không | Tổng lượt, điểm trung bình, slide stats | 500 khi đọc/tổng hợp lỗi |
| API-006 | `GET /api/class-overview/brief` | Không | Brief cache hoặc brief mới | 500 khi AI/lưu cache lỗi |
| API-007 | `POST /api/class-overview/brief` | Không | Brief được tạo mới | 500 khi AI/lưu cache lỗi |

## 12. Quy tắc nghiệp vụ và validation

| Rule ID | Đối tượng | Điều kiện | Hành vi mong đợi |
|---|---|---|---|
| BR-001 | Nguồn quiz | Slide chưa approved hoặc không quiz-eligible | Không được đưa vào prompt |
| BR-002 | Scope | Lesson/chapter/slide ID không tồn tại | Từ chối request |
| BR-003 | Số câu | Không phải 5 hoặc 10 | Trả lỗi validation |
| BR-004 | Câu hỏi | Không đủ 4 đáp án hoặc có `correctOption` ngoài 0–3 | Reject output AI |
| BR-005 | Dẫn nguồn | `slideId` ngoài allowlist | Reject output AI |
| BR-006 | Ngôn ngữ | Nội dung người dùng không phải tiếng Việt | Reject và retry/fallback tùy luồng |
| BR-007 | Đáp án gửi chấm | Khác `null` và số nguyên 0–3 | Từ chối attempt |
| BR-008 | Câu bỏ qua | `selectedOption=null` | `isSkipped=true`, `isCorrect=false`, misconception rỗng |
| BR-009 | Weakness | Evidence chứa câu đúng hoặc bỏ qua | Reject diagnosis AI |
| BR-010 | Knowledge gap | Evidence không phải câu bỏ qua | Reject diagnosis AI |
| BR-011 | Recommendation | Slide/knowledge point ngoài allowlist | Reject diagnosis AI |
| BR-012 | Liên kết slide | Có chênh lệch số in và PDF page | Hiển thị số in, điều hướng bằng PDF page |
| BR-013 | Lưu lượt làm | API-004 lỗi | Không ảnh hưởng kết quả học viên |
| BR-014 | AI brief | Không có lượt làm | Summary trạng thái rỗng, `priorityActions=[]` |
| BR-015 | AI brief cache | Số lượt làm không đổi | Không gọi AI lại |

## 13. Danh sách thông báo lỗi

| Message ID | Tình huống | Nội dung/Quy tắc |
|---|---|---|
| MSG-001 | Catalog lỗi | “Không thể tải dữ liệu bài học” hoặc thông điệp server tương đương |
| MSG-002 | Tạo quiz lỗi | “Không thể tạo quiz” kèm nguyên nhân an toàn |
| MSG-003 | Nguồn không đủ | Hiển thị `insufficiencyReason` và quay lại màn hình học |
| MSG-004 | Thiếu API key | Thông báo dịch vụ AI chưa được cấu hình; không lộ secret |
| MSG-005 | Chẩn đoán AI lỗi | Hiển thị cảnh báo và kết quả fallback |
| MSG-006 | PDF lỗi | “Không thể hiển thị slide” kèm mô tả lỗi tải/render |
| MSG-007 | Chưa có lượt làm | “Chưa có lượt làm quiz nào được ghi nhận...” |
| MSG-008 | Dashboard lỗi | Thông báo không tải được thống kê |
| MSG-009 | AI brief lỗi | Thông báo riêng trong panel brief, không che thống kê |
| MSG-010 | R2 chưa cấu hình | Thông báo kiểm tra binding `BUCKET`; chỉ dành cho vận hành |

> Nội dung chính xác của một số lỗi kỹ thuật hiện lấy từ exception. Trước production cần chuẩn hóa thông điệp thân thiện và không lộ chi tiết nội bộ.

## 14. Mô hình dữ liệu nghiệp vụ

### 14.1. Lesson

- `lessonId`, `lessonTitle`, `sourceFile`, `totalSlides`, `language`, `status`.
- Có danh sách `chapters` và `slides`.

### 14.2. Slide

- Định danh: `slideId`, `order`, `chapterId`.
- Điều hướng: `pdfPage`, `displaySlideNumber`.
- Nội dung: `title`, `rawText`, `aiAnalysis`.
- Kiểm soát nguồn: `quizEligible`, `reviewStatus`.

### 14.3. Quiz question

- `id`, `topic`, `level`, `question`.
- `options[4]`, `correctOption`, `explanation`.
- `sourceRef`, `misconceptions[4]`, `confidence`.

### 14.4. Attempt

- Metadata: `id`, `createdAt`, `scopeType`, `scopeId`.
- Kết quả: `score`, `answeredQuestions`, `skippedQuestions`, `totalQuestions`.
- `answers[]`: question, topic, slide, đúng/bỏ qua, misconception, level, confidence.

### 14.5. Learning diagnosis

- `overallSummary`.
- `strengths[]`.
- `weaknesses[]`.
- `knowledgeGaps[]`.
- `recommendations[]`.
- `confidence`, `limitations[]`.

### 14.6. Class overview

- `totalAttempts`, `averageScorePercent`.
- `slides[]` gồm count đúng/sai/bỏ qua, tỷ lệ đúng, misconception và wrong by level.

## 15. Yêu cầu phi chức năng

### 15.1. Bảo mật và riêng tư

- **NFR-SEC-001:** `DEEPSEEK_API_KEY` chỉ được đọc ở server và không được trả cho client hoặc ghi log.
- **NFR-SEC-002:** Nội dung slide phải được coi là dữ liệu, không phải chỉ dẫn cho model.
- **NFR-SEC-003:** API catalog không được lộ `rawText`.
- **NFR-SEC-004:** Output AI phải được validate trước khi dùng.
- **NFR-SEC-005:** Route production cần xác thực và phân quyền theo vai trò.
- **NFR-SEC-006:** Không lưu thông tin định danh học viên khi chưa có chính sách đồng ý và retention được duyệt.

### 15.2. Hiệu năng và khả dụng

- **NFR-PERF-001:** Timeout mỗi lời gọi DeepSeek là 45 giây.
- **NFR-PERF-002:** Chỉ render một trang PDF tại một thời điểm.
- **NFR-PERF-003:** Không gọi lại AI brief khi dữ liệu lượt làm không thay đổi.
- **NFR-AVL-001:** Diagnosis phải có fallback bằng luật.
- **NFR-AVL-002:** Lỗi lưu lượt làm không được làm hỏng luồng kết quả.
- **NFR-AVL-003:** Lỗi AI brief không được làm mất dashboard thống kê thuần.

### 15.3. Khả năng sử dụng và truy cập

- **NFR-UX-001:** Giao diện phải responsive trên desktop và mobile.
- **NFR-UX-002:** Cỡ chữ card thống kê câu trả lời phải đọc được, không nhỏ hơn kích thước nội dung phụ chung của giao diện.
- **NFR-UX-003:** Nút icon và liên kết nguồn phải có `aria-label` mô tả hành động.
- **NFR-UX-004:** Trạng thái loading và error phải dùng semantics phù hợp (`role=status`, `role=alert` khi áp dụng).
- **NFR-UX-005:** Không được yêu cầu người dùng dùng toolbar PDF trình duyệt để điều hướng.

> **TBD / Need confirmation:** Mức tuân thủ WCAG mục tiêu, danh sách trình duyệt/thiết bị hỗ trợ và chỉ tiêu thời gian phản hồi ngoài timeout AI.

### 15.4. Tương thích và vận hành

- **NFR-OPS-001:** Runtime Node yêu cầu phiên bản từ 22.13.0.
- **NFR-OPS-002:** Môi trường phải có R2 binding tên `BUCKET`.
- **NFR-OPS-003:** PDF và lesson JSON phải được triển khai cùng ứng dụng.
- **NFR-OPS-004:** Ứng dụng phải build và lint thành công trước khi phát hành.

## 16. Tiêu chí nghiệm thu

| AC ID | Given | When | Then |
|---|---|---|---|
| AC-001 | Dữ liệu Day 03 hợp lệ | Gọi API-001 | Catalog có 78 slide, 12 chương và không chứa `rawText`/`sourceText` |
| AC-002 | Có 49 slide approved và quiz-eligible | Mở phạm vi Slide kiến thức | Chỉ 49 slide này xuất hiện |
| AC-003 | Chọn toàn bài/chương/slide | Tạo quiz | Backend chỉ gửi nguồn thuộc đúng phạm vi cho AI |
| AC-004 | Chọn 5 hoặc 10 câu | AI trả output hợp lệ | Giao diện nhận đúng số câu |
| AC-005 | AI trả câu/giải thích tiếng Anh | Validator chạy | Output bị từ chối và được retry hoặc báo lỗi |
| AC-006 | Đang ở một câu quiz | Bấm “Bỏ qua · Chưa biết” | Câu được ghi `null`, không tính sai và sinh knowledge gap |
| AC-007 | Trả lời sai | Chẩn đoán chạy | Câu có thể tạo weakness/misconception, không tạo knowledge gap |
| AC-008 | `DAY03-S007` có display 5, PDF page 7 | Bấm “Trang 5” | Tab mới mở trình xem tại PDF page 7 |
| AC-009 | Đang ở dashboard kết quả | Bấm nguồn câu hỏi | Tab mới mở đúng slide và tab kết quả giữ nguyên |
| AC-010 | DeepSeek diagnosis lỗi | Hoàn thành quiz | Điểm vẫn đúng và màn hình hiển thị fallback |
| AC-011 | API lưu attempt lỗi | Hoàn thành quiz | Học viên vẫn xem được kết quả bình thường |
| AC-012 | Có lượt làm thật | Mở dashboard giảng viên | Số lượt, điểm trung bình và slide stats khớp dữ liệu |
| AC-013 | Slide có bỏ qua trội | AI brief chạy | Gợi ý dạy/giới thiệu lại, không gọi đó là hiểu lầm |
| AC-014 | Slide có câu sai trội | AI brief chạy | Gợi ý sửa hiểu lầm hoặc luyện áp dụng tùy level |
| AC-015 | Không có lượt làm | Mở dashboard | Hiển thị empty state và không có số liệu giả |
| AC-016 | PDF tải được | Mở trang học viên/giảng viên | Chỉ một slide được render, không có toolbar PDF mặc định |
| AC-017 | PDF không tải được | Mở trình xem | Có trạng thái lỗi rõ ràng, không làm crash toàn trang |
| AC-018 | Màn hình desktop và mobile | Thực hiện luồng end-to-end | Không mất nút chính, link nguồn hoặc nội dung card |

## 17. Ma trận truy vết

| Mục tiêu | Function/Requirement | Acceptance Criteria | Nguồn |
|---|---|---|---|
| Quiz có căn cứ | FN-003, FN-004; FR-014–029 | AC-001–005 | REF-02, REF-03, REF-06 |
| Mở đúng slide | FN-002, FN-007; FR-006–013, FR-050–054 | AC-008, AC-009, AC-016 | REF-01, REF-02, REF-06 |
| Phân biệt sai và bỏ qua | FN-005, FN-006; FR-033–049 | AC-006, AC-007, AC-010 | REF-06 |
| Kết quả không phụ thuộc AI | FN-006; FR-038–049 | AC-010 | REF-05, REF-06 |
| Dashboard cấp lớp | FN-008–010; FR-057–079 | AC-011–015 | REF-06 |
| Trải nghiệm slide riêng | FN-002, FN-011; FR-006–013, FR-080–083 | AC-016, AC-017 | REF-06 |

## 18. Giả định, ràng buộc và điểm cần xác nhận

### 18.1. Giả định đã chốt cho MVP

- PDF và `lesson.json` là nguồn chính thức của Day 03.
- Metadata được chuẩn bị và duyệt trước khi chạy ứng dụng.
- DeepSeek là provider AI cho quiz, diagnosis và teacher brief.
- Hệ thống chỉ demo một bài học.
- `pdfPage` là định danh điều hướng đáng tin cậy; `displaySlideNumber` chỉ dùng làm nhãn.

### 18.2. Ràng buộc

- Chỉ slide approved và quiz-eligible được dùng tạo quiz.
- Không có RAG hoặc tìm kiếm Internet.
- Điểm số luôn do code tính.
- Recommendation chỉ được tham chiếu nguồn thuộc allowlist.
- R2 binding là điều kiện để lưu lượt làm và dùng dashboard có dữ liệu bền vững.

### 18.3. Need confirmation trước production

| TBD ID | Nội dung cần xác nhận | Ảnh hưởng |
|---|---|---|
| TBD-001 | Cơ chế đăng nhập và ánh xạ role học viên/giảng viên | Bảo mật route và dữ liệu |
| TBD-002 | Có lưu danh tính học viên hay chỉ thống kê ẩn danh | Data model, privacy, dashboard |
| TBD-003 | Retention và quyền xóa lượt làm/AI brief | Tuân thủ và vận hành |
| TBD-004 | Cơ chế chống race condition khi nhiều lượt ghi `attempts.json` | Toàn vẹn dữ liệu |
| TBD-005 | Trình duyệt, thiết bị và chuẩn WCAG mục tiêu | QA phi chức năng |
| TBD-006 | SLA, giới hạn rate và hành vi khi DeepSeek quá tải | Khả dụng |
| TBD-007 | Quy trình quản trị bài học mới sau Day 03 | Khả năng mở rộng |
| TBD-008 | Quyền truy cập PDF và bản quyền học liệu khi triển khai công khai | Pháp lý/bảo mật |
| TBD-009 | Cách hiển thị điểm khi học viên bỏ qua toàn bộ (`0/0`) | UX và báo cáo |
| TBD-010 | Chuẩn hóa danh sách mã lỗi và thông điệp production | UX, hỗ trợ vận hành |

## 19. Checklist chất lượng SRS

- [x] Có mục đích, phạm vi, vai trò và thuật ngữ.
- [x] Có luồng học viên và giảng viên.
- [x] Mỗi chức năng có ID ổn định và yêu cầu có thể kiểm thử.
- [x] Có danh sách màn hình và object chính.
- [x] Có quy tắc nghiệp vụ, validation và lỗi.
- [x] Có yêu cầu phi chức năng.
- [x] Có acceptance criteria và ma trận truy vết.
- [x] Nội dung chưa có căn cứ được đánh dấu `TBD / Need confirmation`.
- [ ] Role và permission production đã được khách hàng xác nhận.
- [ ] Chính sách dữ liệu, retention và privacy đã được xác nhận.
- [ ] Wireframe/Figma chính thức đã được gắn vào từng screen ID.
- [ ] Mã lỗi và thông điệp production đã được duyệt.

