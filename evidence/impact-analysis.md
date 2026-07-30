# Bảng impact và quyết định chọn

## Trạng thái

**Quyết định: GO về desirability của giải pháp**, dựa trên 24 phản hồi khảo sát. Evidence về tần suất và tổn thất của pain vẫn cần bổ sung; không được diễn giải `23/24 muốn quiz` thành `23/24 đang gặp pain`.

## Ba ứng viên

| Pain/ứng viên | Bằng chứng hiện có | Bao nhiêu người gặp | Tần suất | Tổn thất mỗi lần | Khả thi trong hackathon | Quyết định |
|---|---|---|---|---|---|---|
| Không biết mình đã hiểu đúng phần vừa học; tạo quiz có nguồn để tự kiểm tra | 23/24 muốn làm quiz; 23/24 muốn tổng hợp điểm yếu; 3 yêu cầu quiz trực tiếp; tutor chỉ hỏi kiểm tra hiểu 3/1.261 lượt | 23/24 bày tỏ nhu cầu giải pháp; số người gặp pain chưa đo trực tiếp | Chưa đo trên từng người; hệ thống ghi nhận 3 yêu cầu quiz trong 8 ngày | Chưa đo phút; hậu quả giả định cần xác minh là không nhận ra lỗ hổng | Cao nếu giới hạn trắc nghiệm và một bài mẫu | **Chọn** |
| Mất thời gian rút ý chính sau bài; tạo bản tóm tắt có nguồn | 129/1.261 query trực tiếp tóm tắt/tổng hợp | Không suy ra user duy nhất từ turn; cần khảo sát | Nhiều turn trong 8 ngày | Chưa đo bằng phút | Rất cao | Loại tạm: tutor hiện tại đã trả tóm tắt; khác biệt sản phẩm thấp |
| Không hiểu đoạn slide cụ thể; cải thiện giải thích theo đoạn | 419/1.261 query giải thích/không hiểu/làm rõ | Không suy ra user duy nhất từ turn; cần group theo user nếu chọn | Cao nhất trong mining | Chưa đo bằng phút/niềm tin | Cao | Loại tạm: là năng lực lõi tutor hiện tại, ít mới hơn |

## Lý do chọn ứng viên quiz

1. Khớp ví dụ “kiểm tra hiểu thật cuối buổi” của Hướng A.
2. Flow hiện tại có khoảng trống rõ: gần như không chủ động kiểm tra hiểu, không có follow-up.
3. Demo được một lát cắt end-to-end trong 5 phút.
4. Có tiêu chí chất lượng đo được: có nguồn, đúng phạm vi, một đáp án đúng, giải thích trace được.
5. Prototype CP2 đã tồn tại.
6. Khảo sát `n=24` cho thấy 95,8% muốn quiz và 95,8% muốn tổng hợp kiến thức/điểm yếu.
7. 10 câu là lựa chọn cao nhất (41,7%); trắc nghiệm là loại được chọn nhiều nhất (58,3%).

## Căn cứ chốt thiết kế

- Phạm vi ưu tiên: `Cả bài` 15/24 và `Từng chương` 13/24; câu hỏi cho chọn nhiều đáp án.
- Số câu mặc định: `10 câu`, 10/24.
- Loại câu MVP: `Trắc nghiệm`, 14/24; thêm tự luận vào backlog.
- Kết quả: phải có tổng hợp kiến thức và điểm yếu, được 23/24 người chọn.

## Điều kiện còn phải hoàn tất

- Xác minh 24 người trả lời đều ngoài nhóm.
- Export log từng phản hồi hoặc bản ẩn danh.
- Bổ sung tần suất pain và thời gian/tổn thất nếu còn thời gian.
- Có ≥3 người đồng ý thử prototype; form hiện tại chưa hỏi.
- Nhóm lấy được một nguồn bài học ổn định.
- CP3 thay bộ câu hỏi hardcode bằng ít nhất một AI call thật.

## Giới hạn cần trình bày trung thực

- Câu hỏi đầu khảo sát hỏi trực tiếp “có muốn làm quiz”, nên đo solution desirability chứ không đo pain theo hành vi quá khứ.
- Biểu đồ tổng hợp không cung cấp quote nguyên văn, current alternatives, tần suất hay thời gian.
- Không được viết bảng impact như thể các dữ liệu chưa đo đã tồn tại.
- Kết hợp kết quả khảo sát với mining và nói rõ giới hạn sẽ đáng tin hơn việc cố gọi form hiện tại là evidence pain hoàn chỉnh.
