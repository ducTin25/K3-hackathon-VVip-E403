# Reflection — Dương Văn Vũ · 2A202601663

## Vai trò và phần phụ trách

- Phụ trách phần Validation & Demo.
- Chuẩn bị checklist validation, kịch bản test user và phần demo 5 phút.
- Theo dõi feedback thật trong `validation/feedback-log.csv`.
- Chuẩn bị nội dung demo slide/script để nhóm trình bày rõ user, problem, solution, eval và feedback.

## Tôi đã trực tiếp làm gì

- Rà soát các đầu việc còn thiếu của role Validation & Demo.
- Tạo và cập nhật bộ artifact validation: `session-plan.md`, `risk-scenarios.md`, `experience-paths.md`, `changelog.md`.
- Kiểm tra `feedback-log.csv` để đảm bảo feedback là dữ liệu thật, không tự bịa quote hay tên user.
- Tổng hợp 5 feedback validation thật sau khi nhóm pull bản mới từ `main`.
- Tạo nội dung `demo-slides.md` theo 6 trang: User & Job, lý do chọn giải pháp, demo live, kết quả đo, user feedback, next steps.
- Tạo `demo-script.md` cho phần trình bày 5 phút.
- Đưa case fail `GS016` vào phần demo để nhóm không chỉ trình bày happy path.

## AI đã hỗ trợ tôi như thế nào

- AI giúp rà nhanh repo để tìm các file còn thiếu trong `validation/`, `reflection/`, `spec.md` và demo.
- AI giúp chuyển checklist thành các tài liệu có cấu trúc rõ ràng, dễ nộp và dễ kiểm tra.
- AI giúp tổng hợp số liệu từ `eval/run-01-results.csv` và `validation/feedback-log.csv` để đưa vào slide.
- AI giúp viết bản nháp demo slide và demo script dựa trên artifact thật trong repo.
- Tôi vẫn kiểm tra lại các số liệu và chỉ giữ thông tin có bằng chứng trong file, tránh ghi quá mức hoặc bịa kết quả validation.

## Một case fail và bài học rút ra

- Case fail tôi chú ý nhất là `GS016`.
- Với nguồn mơ hồ, hệ thống đáng ra phải trả `insufficient_source`, nhưng model lại sinh câu hỏi.
- Lỗi này nguy hiểm vì câu hỏi nghe hợp lý nhưng không đủ căn cứ từ nguồn, có thể làm người học tin vào nội dung không kiểm chứng được.
- Bài học: demo sản phẩm AI không nên chỉ khoe output đẹp; phải có failure path và phải giữ lại case fail trong kết quả đo.
- Từ case này tôi hiểu rõ hơn vì sao nhóm chọn automation kiểu conditional, bắt buộc có source reference và cần quality bar chặt.

## Nếu làm lại, tôi sẽ thay đổi gì

- Tôi sẽ chuẩn bị validation sớm hơn, không để gần cuối mới gom feedback.
- Tôi sẽ chốt danh sách willing users ngay sau khảo sát.
- Tôi sẽ chạy thử ít nhất 2 phiên user test sớm để phát hiện điểm kẹt trước khi hoàn thiện demo.
- Tôi sẽ chuẩn bị demo backup song song với demo live, gồm trace AI, screenshot và một failure case rõ.
- Tôi sẽ cập nhật slide dựa trên feedback thật sớm hơn, thay vì chỉ dựa trên nhận định nội bộ của nhóm.
