# Evidence - phần phụ trách TV1

## Trạng thái

| Artifact | Trạng thái | Ghi chú |
|---|---|---|
| Bộ câu hỏi khảo sát | Sẵn sàng | Xem `survey-questions.md` |
| Form Google đã tạo | Đã có 24 phản hồi | Form đo desirability; chưa đo đầy đủ hành vi quá khứ |
| Kết quả tổng hợp | Đã nhập | Xem `survey-results.md` và `survey-aggregate.csv` |
| Log từng phản hồi | Chưa có trong repo | Xuất bản ẩn danh theo `survey-log-template.csv` |
| Follow-up đóng evidence gap | Sẵn sàng gửi | Xem `survey-follow-up.md` |
| Mining chatlog | Có kết quả sơ bộ tái lập được | Xem `mining-method.md` |
| Ví dụ mining | Có 8 ví dụ ngắn | Xem `mining-examples.csv` |
| Bảng impact | Đã cập nhật quyết định GO | Xem `impact-analysis.md`; tần suất/tổn thất vẫn chưa đo |

## Cảnh báo

- Form hiện tại cho thấy `23/24 = 95,8%` muốn quiz và `23/24 = 95,8%` muốn tổng hợp điểm yếu. Đây là bằng chứng **desirability**, chưa phải tỷ lệ gặp pain.
- Để đạt chuẩn evidence A của rubric, cần ≥20 người ngoài nhóm, ≥50% xác nhận pain, và giữ log từng câu trả lời.
- Không đưa email hoặc thông tin định danh không cần thiết vào repo. Dùng mã `R001`, `R002`... trong bản export nộp bài.
- Không tự điền kết quả chưa thu thập. Các ô `[CHỜ DỮ LIỆU]` trong `spec.md` phải được thay bằng số thật.

## Quy trình hoàn tất

1. Xác nhận 24 người trả lời đều ngoài nhóm.
2. Xuất Google Sheets/CSV.
3. Tạo một bản ẩn danh theo `survey-log-template.csv`.
4. Nếu còn thời gian, gửi follow-up để đo tần suất, thời gian, current alternatives và willing users.
5. Nhờ TV5 review log trước khi commit.
