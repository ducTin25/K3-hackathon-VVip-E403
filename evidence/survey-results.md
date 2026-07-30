# Kết quả khảo sát nhu cầu tạo quiz từ slide bài giảng

## 1. Nguồn và phạm vi dữ liệu

- Tổng phản hồi hiển thị trên Google Forms: **24**.
- Nguồn ảnh tổng hợp:
  - `docs/form_results/1785398020287_5461511038421174325_5461511038421174325_ef44961d69190fe533247bef9a463d5b.jpg`.
  - `docs/form_results/1785398044631_5461511038421174325_5461511038421174325_faba1e5dcb111c6a43541b6b05c8dabb.jpg`.
- Thời gian khảo sát: **chưa có trong ảnh**.
- Số người ngoài nhóm: **chưa xác minh từ ảnh tổng hợp**.
- Raw log từng người: **chưa được cung cấp trong repo**.

Các số người được quy đổi từ tỷ lệ trên mẫu `n = 24`:

- 95,8% = 23 người.
- 62,5% = 15 người.
- 58,3% = 14 người.
- 54,2% = 13 người.
- 41,7% = 10 người.
- 33,3% = 8 người.
- 25,0% = 6 người.
- 20,8% = 5 người.
- 8,3% = 2 người.
- 4,2% = 1 người.

## 2. Kết quả từng câu hỏi

### 2.1. Mong muốn làm quiz sau bài lý thuyết

**Câu hỏi:** Sau mỗi bài học lý thuyết, bạn có muốn làm quiz ôn tập kiến thức vừa học không?

| Lựa chọn | Số người | Tỷ lệ |
|---|---:|---:|
| Có | 23 | 95,8% |
| Không | 1 | 4,2% |

**Kết luận:** mức quan tâm tới giải pháp quiz rất cao trong mẫu khảo sát.

### 2.2. Phạm vi ôn tập

**Câu hỏi:** Nếu có, bạn muốn ôn tập theo từng chương hay cả bài?

Đây là câu chọn nhiều đáp án nên tổng lượt chọn lớn hơn 24.

| Phạm vi | Lượt chọn | Tỷ lệ trên 24 người |
|---|---:|---:|
| Cả bài | 15 | 62,5% |
| Từng chương | 13 | 54,2% |
| Từng điểm kiến thức | 8 | 33,3% |

**Kết luận thiết kế:** ưu tiên `Cả bài` và `Từng chương`; vẫn giữ `Từng điểm kiến thức` như lựa chọn thứ ba.

### 2.3. Số câu trong một quiz

**Câu hỏi:** Bạn muốn một bài quiz có bao nhiêu câu hỏi?

| Lựa chọn | Số người | Tỷ lệ |
|---|---:|---:|
| 10 câu | 10 | 41,7% |
| 15 câu | 6 | 25,0% |
| 5 câu | 5 | 20,8% |
| Nhiều hơn | 1 | 4,2% |
| 7-8 câu | 1 | 4,2% |
| Tùy theo nội dung bài giảng | 1 | 4,2% |

**Kết luận thiết kế:** chọn **10 câu làm mặc định**. MVP có thể cho chọn nhanh `5 câu` hoặc `10 câu`; không ưu tiên 15 câu trong hackathon vì tăng thời gian sinh, làm và đánh giá.

### 2.4. Loại câu hỏi

**Câu hỏi:** Bạn muốn làm câu hỏi bằng trắc nghiệm hay tự luận?

| Loại | Số người | Tỷ lệ |
|---|---:|---:|
| Trắc nghiệm | 14 | 58,3% |
| Cả hai | 8 | 33,3% |
| Tự luận | 2 | 8,3% |

**Kết luận thiết kế:** MVP chỉ cần trắc nghiệm một đáp án đúng. Tự luận là backlog vì cần thêm quyết định AI để chấm và làm tăng cost-of-error.

### 2.5. Tổng hợp kiến thức và điểm yếu

**Câu hỏi:** Sau khi làm bài quiz, bạn muốn được tổng hợp kiến thức và đánh giá điểm yếu không?

| Lựa chọn | Số người | Tỷ lệ |
|---|---:|---:|
| Có | 23 | 95,8% |
| Không | 1 | 4,2% |

**Kết luận thiết kế:** màn hình kết quả phải có:

1. Điểm số.
2. Câu đúng/sai.
3. Giải thích.
4. Trang nguồn cần xem lại.
5. Danh sách điểm kiến thức còn yếu.

## 3. Kết luận sản phẩm

Khảo sát **đạt cổng desirability của giải pháp**:

- `23/24 = 95,8%` muốn làm quiz sau bài lý thuyết.
- `23/24 = 95,8%` muốn tổng hợp kiến thức và đánh giá điểm yếu.
- `10 câu` là lựa chọn có tỷ lệ cao nhất.
- `Trắc nghiệm` là loại câu được chọn nhiều nhất.
- `Cả bài` và `Từng chương` là hai phạm vi ưu tiên.

Quyết định:

> **GO với MVP quiz trắc nghiệm 10 câu, tạo từ cả bài hoặc một chương, có giải thích, nguồn và tổng hợp điểm yếu. Giữ lựa chọn điểm kiến thức nếu không làm chậm critical path.**

## 4. Giới hạn bằng chứng

Khảo sát hiện tại đo mức mong muốn đối với **giải pháp đã nêu sẵn**, chưa đo đầy đủ pain theo chuẩn hành vi:

- Không hỏi lần gần nhất user gặp khó khăn.
- Không đo tần suất trong 4 tuần.
- Không đo thời gian/tổn thất mỗi lần.
- Không hỏi current alternatives.
- Không có quote nguyên văn.
- Không hỏi willing users.
- Ảnh tổng hợp không chứng minh cả 24 người đều ngoài nhóm.
- Chưa có log từng câu trả lời trong repo.

Do đó:

- Có thể dùng `95,8%` để chứng minh **mức quan tâm/desirability**.
- Không nên viết `95,8% học viên đang gặp pain`.
- Evidence A chỉ hoàn chỉnh khi có raw log và xác nhận người trả lời ngoài nhóm.
- Evidence B trong `mining-method.md` tiếp tục là căn cứ cho khoảng trống kiểm tra hiểu của tutor.

## 5. Phần dữ liệu còn thiếu

| Dữ liệu | Trạng thái | Cách bổ sung nhanh |
|---|---|---|
| Tần suất pain | Chưa có | Gửi một câu follow-up: số lần trong 4 tuần |
| Thời gian/tổn thất | Chưa có | Hỏi lần gần nhất mất bao lâu |
| Current alternative | Chưa có | Hỏi họ đã đọc lại/tua video/hỏi ai |
| Quote nguyên văn | Chưa có | Thêm một câu trả lời dài về lần gần nhất |
| ≥3 willing users | Chưa có | Hỏi ai đồng ý test prototype 10 phút |
| Log từng phản hồi | Chưa có | Export Google Sheets/CSV và tạo bản ẩn danh |

## 6. Checklist TV1

- [x] Tổng hợp `n = 24`.
- [x] Quy đổi tỷ lệ thành số người.
- [x] Chốt phạm vi ưu tiên.
- [x] Chốt mặc định 10 câu.
- [x] Chốt trắc nghiệm cho MVP.
- [x] Chốt feedback điểm yếu sau quiz.
- [x] Cập nhật `spec.md` §1, §2, §4.
- [x] Cập nhật bảng impact.
- [ ] Export raw log ẩn danh.
- [ ] Xác nhận 24 người đều ngoài nhóm.
- [ ] Bổ sung ≥3 willing users.
