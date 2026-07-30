# Evaluation

Thư mục lưu bằng chứng, golden set, raw traces và kết quả mọi lượt chạy.

```text
eval/
├── README.md
├── golden-set.csv
├── evidence/
├── prompts/
├── traces/
└── run-01-results.csv
```

Quy tắc:

- Golden set tối thiểu 20 case, có ít nhất 10 case phát triển từ chatlog.
- Phủ đủ bốn lớp khó và giữ cả case thất bại.
- Chốt quality bar trong `spec.md` trước khi chạy.
- Mỗi lần sửa prompt phải chạy lại toàn bộ bộ test.
- Không chép nguyên data pack hoặc thông tin nhận diện vào repo.
