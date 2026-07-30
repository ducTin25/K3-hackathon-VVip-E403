# generate-quiz-v1

Model mặc định: `gemini-3.6-flash`  
Temperature: `0.2`  
Output: JSON Schema

## Quyết định AI trung tâm

Từ một đoạn slide/transcript có mã nguồn, quyết định:

- có đủ căn cứ để sinh quiz hay không;
- một câu hỏi kiểm tra hiểu/áp dụng;
- đúng một đáp án đúng;
- ba distractor tương ứng ba misconception;
- giải thích và trang/mã nguồn để kiểm chứng.

Prompt thực thi nằm trong `codebase/lib/quiz-generator.ts`. Nếu nguồn thiếu hoặc mơ hồ, model phải trả `status=insufficient_source` thay vì đoán.
