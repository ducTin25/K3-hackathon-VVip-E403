# Reflection — Nguyễn Đức Tín · 2A202601185

## Vai trò và phần phụ trách

Trong nhóm, tôi phụ trách chính phần prototype và tích hợp AI. Công việc của tôi là đưa luồng tạo quiz từ bản mock thành một luồng có AI chạy thật: lấy nội dung slide đã được duyệt, gọi DeepSeek để tạo câu hỏi, kiểm tra đầu ra và trả kết quả cho giao diện. Tôi cũng tham gia xây dựng phần chẩn đoán sau khi học viên hoàn thành quiz.

Mục tiêu tôi theo đuổi không chỉ là làm cho AI trả về được câu hỏi, mà là bảo đảm câu hỏi có căn cứ, dẫn đúng slide và không được phát hành nếu đầu ra sai cấu trúc hoặc dùng nguồn ngoài phạm vi.

## Tôi đã trực tiếp làm gì

Tôi đã trực tiếp thực hiện các phần sau:

- Xây dựng API tạo quiz và kết nối API với giao diện.
- Tích hợp DeepSeek bằng API key trong biến môi trường, không đưa key vào repository.
- Viết prompt yêu cầu AI chỉ sử dụng các slide được duyệt và coi nội dung slide là dữ liệu, không phải chỉ dẫn.
- Xây dựng validator cho câu hỏi: đúng số câu, đúng bốn lựa chọn, một đáp án đúng, source hợp lệ, số trang khớp và misconception đúng cấu trúc.
- Thêm cơ chế thử lại khi AI trả JSON không hợp lệ.
- Xây dựng luồng chấm điểm bằng code thay vì để AI tự quyết định điểm.
- Xây dựng phần phân tích điểm mạnh, điểm yếu và đề xuất nội dung cần ôn; nếu AI lỗi thì dùng kết quả dự phòng theo luật.

## AI đã hỗ trợ tôi như thế nào

AI hỗ trợ tôi tăng tốc ở ba việc chính:

1. Gợi ý cấu trúc prompt và JSON output để kết quả dễ kiểm tra bằng code.
2. Hỗ trợ viết và rà soát code cho API, validator và cơ chế fallback.
3. Hỗ trợ giải thích lỗi trong quá trình nối giao diện với API và kiểm tra các trường hợp đầu ra không đúng schema.

Tôi không sử dụng trực tiếp mọi đề xuất của AI. Tôi kiểm tra lại bằng source slide, schema và luồng chạy của prototype. Qua quá trình này, tôi hiểu rằng AI có thể tạo ra code hoặc câu hỏi trông rất hợp lý nhưng vẫn sai ở những chi tiết khó thấy. Vì vậy, phần quan trọng nhất không phải chỉ là prompt, mà còn là validator và cách hệ thống xử lý khi AI trả kết quả không hợp lệ.

## Một case fail và bài học rút ra

Từ kết quả kiểm thử chung của nhóm, case fail khiến tôi chú ý nhất là `GS016`. Tôi không trực tiếp xây dựng hay chấm golden set này, nhưng case cho thấy một rủi ro liên quan trực tiếp đến phần tích hợp AI mà tôi phụ trách. Nguồn đầu vào chỉ có câu: “Agent dùng context để làm việc tốt hơn.” Đây là một nhận định quá chung chung, không đủ căn cứ để tạo câu hỏi chẩn đoán có chất lượng. Theo thiết kế, AI phải trả `insufficient_source`.

Tuy nhiên, model vẫn tạo câu hỏi và còn bổ sung các ý như agent “hiểu ngữ cảnh”, “đưa ra quyết định phù hợp” và “cải thiện hiệu suất”. Những nội dung này nghe hợp lý nhưng không xuất hiện trong nguồn.

Bài học tôi rút ra là: yêu cầu trong prompt chưa đủ để bảo đảm AI sẽ từ chối đúng lúc. Hệ thống cần một bước kiểm tra độ đầy đủ của nguồn trước khi gọi model, đồng thời phải giữ các case thất bại trong golden set để kiểm tra lại sau mỗi lần sửa. Tôi cũng nhận ra rằng tỷ lệ đẹp chưa có nghĩa là hệ thống đã đạt quality bar. Run 01 đạt 85%, cao hơn ngưỡng 80%, nhưng vẫn chưa đạt toàn bộ cam kết vì còn một case có thể có nhiều đáp án đúng.

## Nếu làm lại, tôi sẽ thay đổi gì

Nếu làm lại, tôi sẽ ưu tiên evaluation sớm hơn thay vì hoàn thiện nhiều phần giao diện trước. Tôi sẽ:

- Chốt schema và quality bar trước khi viết sâu phần UI.
- Gắn rõ mỗi golden case với một trong bốn lớp rủi ro.
- Bổ sung bước kiểm tra nguồn quá ngắn hoặc quá chung chung trước khi gọi AI.
- Kiểm tra trùng ý nghĩa giữa các câu, không chỉ kiểm tra trùng nguyên văn.
- Tách dữ liệu đáp án khỏi client và lưu attempt ở server để tránh việc kết quả bị chỉnh sửa.
- Nhờ hai thành viên chấm độc lập các case khó ngay từ lượt đầu để làm rõ rubric.
- Cập nhật spec cùng lúc với code để tài liệu không mô tả sai trạng thái của prototype.

Điều quan trọng nhất tôi học được là một sản phẩm AI tốt không được đánh giá bằng việc “AI có trả lời hay không”, mà bằng khả năng biết lúc nào nên trả lời, lúc nào phải từ chối và liệu người khác có thể kiểm chứng kết quả của nó hay không.
