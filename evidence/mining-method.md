# Phương pháp mining chatlog - nhu cầu ôn và kiểm tra mức độ hiểu

## 1. Câu hỏi phân tích

1. Học viên có đang dùng tutor để giải thích hoặc tổng hợp nội dung đã học không?
2. Học viên có trực tiếp yêu cầu quiz/ôn tập không?
3. Tutor hiện tại có chủ động kiểm tra hiểu hoặc tạo chuỗi luyện tập tiếp nối không?

## 2. Nguồn dữ liệu

- File: `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`.
- 2.522 message.
- 1.261 message vai trò `student`.
- 1.261 message vai trò `tutor`.
- 585 hội thoại, 369 user.
- Thời gian: 22/07-29/07/2026.

## 3. Đơn vị đếm

- Tín hiệu nhu cầu: một `turn_id` có message vai trò `student`.
- Hành vi tutor: một `turn_id` có message vai trò `tutor`.
- Mỗi turn có đúng một message student và một message tutor nên số message và số turn bằng nhau trong từng vai trò.

## 4. Tiền xử lý

Nhiều message student có dạng:

```text
(Trang N, đoạn được chọn: "...")
câu người dùng thực sự gửi
```

Để tránh đếm từ khóa nằm trong đoạn slide được chọn, phân tích dùng **dòng không rỗng cuối cùng** làm `normalized_query`.

## 5. Rule phân loại

| Nhãn | Regex trên `normalized_query` | Ý nghĩa |
|---|---|---|
| `explain_need` | `giải thích|không hiểu|chưa hiểu|làm rõ` | Cần làm rõ kiến thức |
| `summary_need` | `tóm tắt|tổng hợp` | Cần cô đọng/ôn lại nội dung |
| `quiz_request` | `quiz|trắc nghiệm` | Yêu cầu trực tiếp liên quan quiz |
| `review_request` | `ôn tập|ôn lại|ghi nhớ|học lại` | Yêu cầu trực tiếp liên quan ôn tập |

Các nhóm có thể chồng lấp; không cộng các nhóm để suy ra tổng số user duy nhất.

## 6. Kết quả tái lập

| Chỉ số | Số lượng | Tỷ lệ |
|---|---:|---:|
| Student turns | 1.261 | 100% |
| `explain_need` | 419 | 33,2% |
| `summary_need` | 129 | 10,2% |
| `quiz_request` | 3 | 0,24% |
| Tutor có `asked_check_question=True` | 3/1.261 | 0,24% |
| Tutor có `follow_ups` khác `[]` | 0/1.261 | 0% |
| Tutor có `misconceptions` khác `[]` | 0/1.261 | 0% |
| Tutor có citations rỗng `[]` | 582/1.261 | 46,2% |

## 7. Cách kiểm lại bằng PowerShell

```powershell
$all = Import-Csv -Encoding UTF8 `
  'data\vlearn-pack\chatlog\chat_history_anonymized_for_hackathon.csv'

$student = $all |
  Where-Object role -eq 'student' |
  ForEach-Object {
    $lines = @($_.content -split "`r?`n" | Where-Object { $_.Trim() })
    [pscustomobject]@{
      turn_id = $_.turn_id
      query = if ($lines.Count) { $lines[-1].Trim() } else { '' }
    }
  }

@($student | Where-Object query -Match '(?i)giải thích|không hiểu|chưa hiểu|làm rõ').Count
@($student | Where-Object query -Match '(?i)tóm tắt|tổng hợp').Count
@($student | Where-Object query -Match '(?i)\bquiz\b|trắc nghiệm').Count

$tutor = @($all | Where-Object role -eq 'tutor')
@($tutor | Where-Object asked_check_question -eq 'True').Count
@($tutor | Where-Object follow_ups -ne '[]').Count
@($tutor | Where-Object misconceptions -ne '[]').Count
@($tutor | Where-Object citations -eq '[]').Count
```

## 8. Diễn giải được phép

- Dữ liệu cho thấy tutor được dùng nhiều cho giải thích và tóm tắt.
- Dữ liệu cho thấy flow hiện tại hầu như không chủ động kiểm tra hiểu hoặc tạo follow-up.
- Có yêu cầu quiz thật, nhưng chỉ ba turn trực tiếp nhắc quiz.

## 9. Diễn giải không được phép

- Không được nói “đa số học viên muốn quiz”.
- Không được dùng 419 lượt giải thích để khẳng định 419 học viên muốn quiz.
- Không được cộng 419 + 129 + 3 vì các nhóm có thể chồng lấp.
- Không được coi absence của `follow_ups` là bằng chứng duy nhất rằng user đau.

## 10. Kết luận evidence

Mining đủ làm **bằng chứng cơ hội sản phẩm**, nhưng bằng chứng quyết định chọn quiz phải được củng cố bằng khảo sát hành vi ≥20 người. Kết quả khảo sát phải được báo trung thực kể cả khi không đạt 50%.
