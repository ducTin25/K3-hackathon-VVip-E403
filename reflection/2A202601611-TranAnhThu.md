# Reflection — Trần Anh Thư · 2A202601611

## Vai trò và phần phụ trách

Vai trò chính của tôi trong nhóm là xây dựng **golden set 20 case** để đánh giá chất lượng quiz do AI sinh ra — bao phủ đủ các loại rủi ro: case bình thường (normal), case thuộc miền lân cận (domain), case hiếm (rare), nguồn mơ hồ (ambiguous), ngoài phạm vi kiến thức (out_of_scope) và prompt injection (adversarial). Sau khi script tự động chạy xong, tôi cũng là người chấm tay cột `grounding_review` cho cả 20 case theo đúng rubric.

Ngoài phần được giao, tôi chủ động đề xuất và xây thêm một tính năng không nằm trong phạm vi ban đầu (vốn chỉ tập trung vào học viên): trang **"Tổng quan lớp"** cho giảng viên — lưu lại kết quả từng lượt làm quiz, tổng hợp slide cả lớp còn yếu nhất, và một AI Brief tự tổng hợp gợi ý dạy lại. Tôi giữ nguyên tắc xuyên suốt là không được sửa logic học viên đã chạy tốt, chỉ được thêm route/trang mới.

## Tôi đã trực tiếp làm gì

- Thiết kế 20 golden case theo đúng cấu trúc `source_ref, origin, case_type, difficulty, slide_input, expected_status, expected_topic, hard_failure`, đảm bảo phủ đủ 6 loại case ở trên thay vì chỉ toàn case dễ.
- Sau khi có kết quả auto-check (`run-01-results.csv`), tự chấm tay `grounding_review` cho cả 20 case theo 4 tiêu chí trong rubric: grounded, single correct, misconception hợp lý, explanation có căn cứ.
- Trong lúc chấm, phát hiện `GS011` đã bị sửa nội dung (đổi từ case bình thường sang case adversarial về softmax) **sau khi** `run-01` đã chạy xong — nghĩa là trace đang lưu không còn khớp với định nghĩa case hiện tại trong `golden-set.csv`. Đối chiếu lại bằng `git log -p` để xác nhận đúng là do một commit sau đó của chính tôi.
- Thiết kế và xây trang "Tổng quan lớp": lưu attempt qua Cloudflare R2 (sau khi thử `fs` bị chặn quyền ghi và D1 cần deploy thật mới tạo được bảng), tổng hợp thống kê theo slide, và một AI Brief có bước validate bắt buộc — chặn không cho AI nhắc tới slide không tồn tại trong dữ liệu thật.
- Tự kiểm thử API bằng `curl` trước khi coi là xong, kể cả việc dựng lại cơ chế để AI Brief tự làm mới đúng lúc có học viên làm quiz thêm mà không tốn lệnh gọi AI thừa khi không có gì đổi.

## AI đã hỗ trợ tôi như thế nào

AI (Claude Code) hỗ trợ tôi chủ yếu ở việc tăng tốc thiết kế và code, nhưng quyết định cuối luôn phải do tôi kiểm lại:

1. Gợi ý và so sánh các phương án lưu trữ dữ liệu khi phát hiện `fs.writeFile` bị chặn trong Workers runtime và D1 cần deploy thật mới tạo bảng — cuối cùng chọn R2 giả lập cục bộ qua Miniflare, không cần deploy vẫn kiểm thử được.
2. Hỗ trợ viết prompt cho AI Brief kèm ràng buộc chống bịa (chỉ được nhắc `slideId` có thật) và một hàm validate chạy lại sau khi AI trả JSON, thay vì tin thẳng kết quả AI.
3. Hỗ trợ rà lỗi giao diện khó thấy bằng mắt thường: một bug nhãn "Trang 5" nhưng bấm vào lại nhảy sang trang 7 do hai trường đánh số khác nhau trong dữ liệu nguồn, và một bug đáp án đúng của quiz luôn rơi vào vị trí A do AI có xu hướng lặp lại thứ tự trong ví dụ của prompt.

Tôi không nhận thẳng mọi đề xuất của AI. Có lúc AI tự ý chạy thử một lượt tạo dữ liệu test bằng tay và điền sai định dạng điểm số (gửi điểm dạng phần trăm thay vì số câu đúng thật), khiến bảng thống kê hiển thị điểm trung bình 155% — một con số vô lý mà tôi phát hiện ngay khi xem qua, không phải do AI tự nhận ra trước.

## Một case fail và bài học rút ra

Case khiến tôi chú ý nhất không phải là một case AI sinh sai, mà là lỗi trong chính quy trình quản lý golden set: `GS011` bị tôi sửa nội dung sau khi `run-01` đã chạy và lưu trace xong, nhưng không ai chạy lại eval cho case đó. Nếu chấm tay mà không đối chiếu lại, tôi đã suýt chấm `grounding_review` cho một nội dung không còn tồn tại — tức là kết quả đánh giá sẽ sai mà không ai biết, vì các cột auto vẫn hiển thị bình thường như không có gì xảy ra.

Bài học tôi rút ra là: **golden set không phải dữ liệu tĩnh chỉ viết một lần**. Bất kỳ thay đổi nào trên `golden-set.csv` sau khi đã có một lượt eval đều bắt buộc phải chạy lại đúng case đó trước khi chấm tay, nếu không toàn bộ quy trình "hai người chấm độc lập" sẽ mất ý nghĩa vì đang chấm nhầm nội dung. Một tỷ lệ pass đẹp (85%, vượt ngưỡng 80%) cũng không có nghĩa hệ thống đã đạt bar — vì rubric còn một điều kiện cứng riêng (không được có case nào fail vì hai đáp án đúng) mà `GS002` vi phạm, nên bar thực tế vẫn coi là chưa đạt dù con số phần trăm trông ổn.

## Nếu làm lại, tôi sẽ thay đổi gì

- Khoá `golden-set.csv` lại sau khi đã chạy eval lần đầu; nếu cần sửa case nào, bắt buộc chạy lại eval đúng case đó ngay, không để lệch giữa dữ liệu chấm và dữ liệu thật.
- Cẩn thận hơn khi tự tạo dữ liệu test thủ công trên cùng môi trường dữ liệu dùng để demo — dùng đúng schema/định dạng thật (điểm là số câu đúng, không phải phần trăm) để không làm nhiễu số liệu chung.
- Chốt rubric và schema sớm hơn, trước khi golden set bị chỉnh sửa nhiều lần, để tránh việc tài liệu rubric mô tả một schema đã cũ so với code thật.
- Ưu tiên chạy validation với người dùng thật sớm hơn, thay vì dồn hết thời gian vào việc mở rộng tính năng (như trang giảng viên) trong khi phần đánh giá bằng người thật vẫn đang ở 0/5.
