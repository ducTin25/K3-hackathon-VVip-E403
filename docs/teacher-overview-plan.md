# Plan — Tổng quan lớp cho giảng viên (chưa code, chỉ thiết kế)

> Roadmap, không phải việc đang chấm. `spec.md` hiện khai dashboard giảng viên là **non-goal** của lát cắt đang chấm ("mock, không thuộc lát cắt chấm"). Plan này viết để làm SAU, khi có thời gian — **cần TV1 duyệt phạm vi trước khi bất kỳ ai code**, vì đổi lát cắt đã chốt.

## 0. Nguyên tắc bắt buộc khi triển khai

**Chỉ THÊM, không SỬA.** Không đụng vào:
- `lib/quiz-generator.ts`, `lib/diagnosis.ts` — logic AI đã chạy đúng, đã qua CP3.
- `app/api/generate-quiz`, `app/api/diagnosis` — route đã hoàn thiện.
- Luồng học viên hiện tại trong `app/page.tsx` (learn → quiz → result) — không đổi hành vi.

Mọi thứ dưới đây là **route mới, bảng mới, trang mới** — nối vào bằng 1 điểm chèn duy nhất (mục 5).

## 1. Vì sao hữu ích — đối chiếu thị trường, không tự nghĩ

Tra cứu nhanh pattern dashboard giảng viên/learning-analytics hiện hành (SchoolAI, MasteryTrack, các nền tảng AI tutoring 2026):

- **Mastery theo kỹ năng/chủ đề, không theo thời gian học** — mục tiêu kiểu "nắm vững 4 chủ đề mới" hiệu quả hơn "học đủ 30 phút".
- **Tự động phát hiện misconception phổ biến của cả lớp** — vd hệ thống thấy được "40% học viên hiểu sai lý thuyết X" thay vì giảng viên phải tự đọc từng bài làm.
- **2 tầng: tổng quan lớp (macro) + xem chi tiết từng điểm yếu (drill-down)** — không dồn hết vào 1 màn hình.
- **Sentiment/confidence riêng biệt với đúng-sai** — học viên "hiểu đúng nhưng không tự tin" cần hỗ trợ khác học viên "tự tin nhưng hiểu sai". Hệ thống hiện tại đã có `confidence` trong diagnosis từng học viên — có thể tận dụng lại, không cần làm mới.

→ Mô hình đề xuất bên dưới khớp đúng pattern đã được thị trường validate, không phải bịa ra.

**Nguồn tra cứu:**
- [How to use the Teacher Dashboard to understand student needs in real time — SchoolAI](https://schoolai.com/blog/how-to-use-schoolai-teacher-dashboard-understand-student-needs-real-time)
- [AI Learning Analytics Dashboards: Turning Data into Action — 8allocate](https://8allocate.com/blog/ai-learning-analytics-dashboards-for-instructors-turning-data-into-actionable-insights/)
- [Mastery-based dashboards from MasteryTrack](https://practices.learningaccelerator.org/strategies/mastery-based-dashboards-from-masterytrack)

## 2. Trước khi build — kiểm tra giả thuyết rẻ nhất trước (đúng quy trình nhóm đã dùng)

Đừng lặp lại sai lầm "build trước, hỏi có hữu ích sau". Theo đúng `02-guide.md` §1.4 (đã dùng để chọn tính năng chính): khảo sát nhanh 3-5 giảng viên/TA thật, hỏi về **lần gần nhất cụ thể**:

> *"Lần gần nhất bạn muốn biết cả lớp hiểu sai chỗ nào sau 1 buổi dạy, bạn đã làm gì? Mất bao lâu?"*

Nếu câu trả lời phổ biến là "chưa từng cần" hoặc "tự hỏi miệng học viên là đủ" → giá trị thấp hơn tưởng, nên hạ ưu tiên. Làm bước này TRƯỚC khi viết dòng code nào của mục 4-6.

## 3. Kiến trúc — tách 2 lớp, lớp rẻ làm trước

### Lớp 1 — Thống kê xác định (0 AI call, làm trước, đáng tin 100%)

Đếm đúng/sai/bỏ qua theo từng `slideId`/`topic` trên **toàn bộ lượt làm đã lưu** → bảng "% đúng theo slide", sắp thấp nhất lên đầu = chỗ cả lớp yếu nhất. Thuần aggregate (SQL/JS), không AI, không rủi ro bịa.

**Lớp này một mình đã trả lời được câu hỏi chính của giảng viên.** Nên dừng ở đây trước, đo xem có ai dùng thật không, rồi mới tính lớp 2.

### Lớp 2 — AI Brief tổng hợp (optional, làm sau, nếu lớp 1 chứng minh hữu ích)

Tận dụng dữ liệu **đã có sẵn** — mỗi lượt làm qua `/api/diagnosis` đã tạo ra `weaknesses[].misconception` có căn cứ (đã validate chặt theo `lib/diagnosis.ts`). Lớp 2 chỉ cần **gom nhóm** các misconception đã ghi nhận trên nhiều học viên thành 1 gợi ý ngắn cho giảng viên — không cần đọc lại câu trả lời gốc, không cần model mới phân tích từ đầu.

**Lưu ý quan trọng:** đây là **quyết định AI thứ 2** trong hệ thống — khác user (giảng viên, không phải học viên), khác job. Theo đúng định nghĩa lát cắt "1 user · 1 việc · 1 quyết định AI" của đề bài, về bản chất đây là **1 lát cắt riêng**, không phải phần mở rộng của lát cắt hiện tại. Nếu muốn đưa vào chấm điểm, phải khai như 1 tính năng mới, có evidence/quality bar riêng — không tự động "ăn theo" điểm của lát cắt quiz.

## 4. Dữ liệu cần thêm (schema mới, không sửa gì cũ)

`db/schema.ts` hiện đang rỗng (`// Intentionally empty by default`) — thêm 2 bảng, không đụng file nào khác:

```ts
attempts       { id, scopeType, scopeId, questionCount, score, answeredCount, skippedCount, createdAt }
attempt_items  { attemptId (FK), questionId, topic, slideId, pdfPage, isCorrect, isSkipped, misconception }
```

Không cần bảng user/đăng nhập — giữ đúng non-goal đã khai ("không tài khoản thật"), thống kê ở **mức lớp**, không theo dõi cá nhân từng học viên.

## 5. Điểm nối vào code — đúng 1 chỗ, không đụng gì khác

Trong `finishQuiz()` (`app/page.tsx`, sau dòng gọi `/api/diagnosis` thành công): thêm **1 lời gọi "fire-and-forget"** tới route mới `POST /api/attempts` để lưu kết quả — bọc try/catch riêng, lỗi lưu không được phép ảnh hưởng trải nghiệm học viên đang xem kết quả. Đây là **dòng duy nhất** chạm vào file hiện có; mọi thứ còn lại là file mới:

- `app/api/attempts/route.ts` (mới) — nhận + lưu.
- `app/api/class-overview/route.ts` (mới) — đọc + tính aggregate, trả JSON.
- `app/overview/page.tsx` (mới) — trang hiển thị.
- Nút "Tổng quan lớp" đang `disabled` trong `Header` (`app/page.tsx` dòng ~330): bỏ `disabled`, trỏ sang `/overview` — đây là dòng sửa duy nhất ngoài điểm nối ở trên.

## 6. Thiết kế màn hình

Nhóm từng có sẵn 1 bản mock rất sát ý này (`Dashboard`/`TopicDetail` trong phiên bản `prototype/app/page.tsx` cũ, trước khi tách sang `codebase/`) — dùng lại làm tham chiếu thị giác, build lại bằng **data thật** thay vì số dựng sẵn.

1. **Metric tổng**: số học viên đã làm, điểm trung bình lớp.
2. **Bảng/heatmap chủ đề yếu nhất** — sắp % đúng thấp nhất lên đầu, bấm vào xem chi tiết misconception + link đúng slide/page (dùng lại `slideHref()` đã có sẵn trong `app/page.tsx`, không viết lại).
3. *(Phase 2, có AI)* khối "AI Brief" — tổng hợp ngắn, luôn kèm trích dẫn slideId/pdfPage đúng cách hệ thống đã làm ở phần quiz, có thể tắt/bật.

## 7. Thứ tự triển khai — không làm hết 1 lần

1. Thêm bảng + route lưu attempt (chưa hiển thị gì — chỉ âm thầm thu thập).
2. Chạy thử ≥1 buổi có nhiều lượt làm quiz thật để có dữ liệu.
3. Build Lớp 1 (bảng thống kê) — dừng ở đây, đo xem giảng viên có dùng thật không.
4. Chỉ làm Lớp 2 (AI Brief) nếu bước 3 chứng minh được giá trị thật, và sau khi khai riêng như 1 lát cắt AI mới trong spec.
