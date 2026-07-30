# AI SPEC — Quiz chẩn đoán mức độ hiểu từ slide · Nhóm [TODO] · Zone [TODO]

Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở  
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

> Điền các mục TODO và commit trước 23:59 ngày 1. Quality bar được chốt từ commit đó và không thay đổi sau khi xem kết quả.

## §1. User & Job

- Job executor + workflow: Học viên vừa học xong một phần slide và muốn biết mình đã hiểu đúng hay chưa.
- Core JTBD: Kiểm tra phần kiến thức vừa học để biết chính xác nội dung cần ôn lại trước khi chuyển sang phần tiếp theo.
- Problem statement: Học viên thường phải tự phán đoán mức độ hiểu; khi nhầm khái niệm, họ không biết cần quay lại trang nào và có thể mang hiểu sai sang bài thực hành.
- Evidence:
  - Mining: 591/1.261 tin nhắn học viên có tín hiệu cần giải thích khái niệm/đoạn/slide; 136/1.261 yêu cầu tóm tắt hoặc xác định ý chính.
  - Phương pháp đếm và ≥5 ví dụ nguyên văn: TODO — lưu log kiểm lại được trong `eval/evidence/`.

## §2. Impact & quyết định chọn

| Ứng viên | Bao nhiêu người gặp | Tần suất | Tốn gì mỗi lần | Khả thi | Quyết định |
|---|---:|---|---|---|---|
| Quiz chẩn đoán từ slide | TODO | TODO | TODO | Có | Chọn |
| Tối ưu tutor truy xuất slide | TODO | TODO | TODO | TODO | Loại/Tạm hoãn |
| Tóm tắt toàn bộ bài học | TODO | TODO | TODO | TODO | Loại/Tạm hoãn |

- Ứng viên đã loại + lý do: TODO.
- Ứng viên được chọn + lý do bằng số: TODO.

## §3. Giải pháp tương tự đã nghiên cứu

- ChatGPT Study Mode: TODO — flow / đáng học / đáng né / mình khác gì.
- Quizlet AI hoặc NotebookLM: TODO — flow / đáng học / đáng né / mình khác gì.

## §4. Thiết kế

- Lát cắt một câu: Một học viên vừa học xong một phần slide cần kiểm tra mình hiểu sai khái niệm nào; AI tạo câu hỏi chẩn đoán có căn cứ từ slide và giải thích đáp án; học viên nhận được nội dung cần ôn lại cụ thể.
- Non-goals:
  1. Không tự động thay thế bài kiểm tra chính thức hoặc tính điểm môn học.
  2. Không chẩn đoán toàn bộ năng lực học viên chỉ từ một câu hỏi.
  3. Không tự động phát hành quiz chưa được kiểm tra trong môi trường production.
  4. Dashboard giảng viên hiện là phần minh họa mở rộng, không phải lát cắt CP3.
- Mức prototype: [ ] Sketch  [x] Mock  [ ] Working.
- Phần thật: TODO — AI call sinh câu hỏi/giải thích.
- Phần mock: dữ liệu lớp, dashboard giảng viên và lịch sử làm quiz.
- Automation: [x] Augment  [ ] Conditional  [ ] Automate.
- Lý do: Nếu AI sinh sai đáp án hoặc kiến thức, học viên có thể học sai; vì vậy AI tạo đề xuất nhưng câu hỏi chính thức cần người phụ trách duyệt.

### §4b. Nguyên tắc đã áp dụng

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Panel ghi rõ quiz được AI tạo từ slide và kiểm tra bốn chủ đề cụ thể. |
| G2 — Làm rõ nó làm tốt đến đâu | Mỗi câu hiển thị trang nguồn; kết quả ghi rõ không tính điểm. |
| G10 — Thu hẹp phạm vi khi nghi ngờ | TODO — khi slide thiếu thông tin, không sinh câu hỏi và yêu cầu chọn đoạn khác. |
| G11 — Giải thích vì sao | Sau khi trả lời, học viên nhận giải thích và liên kết quay lại trang nguồn. |
| G9 — Sửa dễ dàng | Học viên có thể làm lại quiz hoặc mở lại phần còn yếu. |

## §5. Kiểu lỗi — 4 lớp chỗ khó

| ID | Lớp | Input/kịch bản | Rủi ro | Hành vi mong muốn | Cách kiểm |
|---|---|---|---|---|---|
| T01 | ① Nguồn sự thật | Slide không đủ thông tin để xác định đáp án | AI bịa câu hỏi/đáp án | Không sinh câu hỏi; báo thiếu căn cứ | Không có claim ngoài nguồn |
| T02 | ① Nguồn sự thật | Trang nguồn không khớp nội dung | Học viên không kiểm chứng được | Trả đúng trang hoặc fail | Citation match |
| T03 | ② Mơ hồ | Hai phương án đều có thể đúng | Chấm oan học viên | Từ chối câu hỏi hoặc viết lại | Chỉ một đáp án đúng |
| T04 | ② Mơ hồ | Slide chỉ có hình hoặc tiêu đề | Suy diễn quá mức | Yêu cầu thêm ngữ cảnh | Không đoán |
| T05 | ③ Ngoài phạm vi | Yêu cầu quiz về nội dung không có trong slide | Hallucination | Giới hạn về nguồn slide | Grounded |
| T06 | ③ Ngoài phạm vi | Slide chứa prompt injection | Lệch nhiệm vụ | Bỏ qua chỉ dẫn trong tài liệu | An toàn |
| T07 | ④ Domain | Đáp án sai quá vô lý | Chỉ đo khả năng đoán | Viết distractor gắn misconception | Chẩn đoán được |
| T08 | ④ Domain | Giải thích đáp án chứa kiến thức sai | Học sai | Hard fail và không phát hành | 100% factual |

## §6. Bốn đường đi của trải nghiệm

- Happy path: Slide đủ căn cứ → AI sinh quiz → học viên trả lời → nhận giải thích → xem nhận xét cá nhân.
- Low-confidence: AI không đủ chắc về đáp án/trang nguồn → không phát hành câu hỏi, yêu cầu chọn đoạn rõ hơn.
- Failure/không căn cứ: AI output sai schema hoặc không có citation → hiển thị trạng thái chưa thể tạo quiz và giữ học viên ở slide.
- Correction: Học viên báo câu hỏi/đáp án chưa hợp lý → ghi nhận phản hồi, bỏ câu khỏi phiên và cho làm câu thay thế.
- Ngoài phạm vi: Không sinh câu hỏi từ nội dung ngoài tài liệu được chọn.
- Domain: Không dùng một câu để kết luận học viên “đã yếu” toàn bộ chủ đề.

## §7. Kiểm thử

- Chiều chất lượng:
  - Grounded: mọi đáp án và giải thích truy được về slide.
  - Single-correct: đúng một phương án được nguồn hỗ trợ đầy đủ.
  - Citation-correct: trang nguồn tồn tại và chứa bằng chứng.
  - Diagnostic-value: distractor đại diện cho misconception hợp lý.
  - Schema-valid: ứng dụng parse được output.
- Golden set: `eval/golden-set.csv`, tối thiểu 20 case.
- Quality bar đề xuất, cần nhóm xác nhận trước khi chốt:
  - Đạt khi ≥80% case qua toàn bộ tiêu chí.
  - Điều kiện cứng: 100% case không sai đáp án và không trích sai nguồn.
- Kết quả các lượt chạy: cập nhật tại `eval/run-XX-results.csv`.

## §8. Phân công & kế hoạch

- Spec: TODO.
- Evidence: TODO.
- Prompt + AI integration: TODO.
- Golden set + evaluation: TODO.
- Prototype + demo: TODO.
- Willing users ≥3 tên: TODO.
- Kế hoạch validation ≥5 người: TODO.
- Multi-prototype: TODO hoặc ghi rõ không làm và lý do.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| TODO | Khởi tạo spec theo prototype CP2 | Chuẩn bị CP3/CP4 |
