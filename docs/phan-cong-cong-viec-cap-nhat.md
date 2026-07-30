# Phân công công việc cập nhật - nhóm 5 người

## 1. Trạng thái hiện tại

### Đã hoàn thành

| Hạng mục | Artifact |
|---|---|
| Checkpoint 2 - prototype bấm được | `prototype/` |
| Workflow quiz | `workflow-quiz-ai.md`, ảnh workflow |
| Khảo sát 24 người | `docs/form_results/` |
| Tổng hợp khảo sát | `evidence/survey-results.md`, `evidence/survey-aggregate.csv` |
| Mining chatlog | `evidence/mining-method.md`, `evidence/mining-examples.csv` |
| Bảng impact | `evidence/impact-analysis.md` |
| Spec phần Product/Evidence/Design | `spec.md` §1, §2, §4 |

### Chưa hoàn thành

| Mức ưu tiên | Hạng mục còn thiếu |
|---|---|
| **P0 - chặn CP3** | AI call thật; nguồn slide/transcript thật; golden set ≥20; kết quả chạy lượt 1 |
| **P0 - chặn CP3** | Frontend gọi API thay cho 4 câu hardcode |
| **P1 - chặn CP4** | Spec §3, §5, §6, §7, §8, §9; quality bar chính thức |
| **P1 - chặn CP4** | Raw survey log/ẩn danh, xác nhận người ngoài nhóm, ≥3 willing users |
| **P1 - chặn CP5** | Validation ≥5 người, changelog và regression |
| **P1 - chặn CP5** | Slide 6 trang, demo script và dry run |
| **P2 - nộp cuối** | README nhóm, reflection 5 người, backup demo, chuẩn hóa `prototype/`/`codebase/` |

## 2. Critical path

```text
Nguồn bài học
      ↓
AI API + prompt + JSON schema ──→ Frontend tích hợp ──→ Prototype end-to-end
      ↓                                ↓
Golden set + run 1 ─────────────→ Sửa failure lớn nhất
                                       ↓
                              Spec chốt + validation
                                       ↓
                               Slide + dry run + demo
```

Ba người nằm trên critical path CP3 là **TV2 + TV3 + TV4**. TV1 và TV5 chạy evidence/spec/risk song song, không chờ code hoàn thành.

---

# 3. Phân công tóm tắt

| Người | Vai trò cập nhật | Trọng tâm ngay bây giờ | Không ôm thêm |
|---|---|---|---|
| **TV1** | Product Lead + Evidence + Spec Integrator | Đóng evidence gap, chốt scope, hợp nhất spec | Không code AI, không làm slide |
| **TV2** | Frontend + UX + Integration | Biến prototype hardcode thành UI gọi API thật | Không viết prompt/eval |
| **TV3** | AI Backend + Grounding | AI call thật, nguồn, schema, fallback, trace | Không polish UI |
| **TV4** | Evaluation + Quality Gate | Golden set, rubric, run 1/run 2, báo cáo % | Không tự sửa prompt mà không báo TV3 |
| **TV5** | Risk + Validation + Demo | 8 risk scenarios, 5 user tests, slide/demo | Không sửa core API |

---

# 4. TV1 - Product Lead, Evidence và Spec Integrator

## Công việc đã xong

- [x] User, JTBD và problem statement.
- [x] Mining chatlog và ví dụ có mã nguồn.
- [x] Tổng hợp khảo sát 24 người.
- [x] Bảng impact ba ứng viên.
- [x] Chốt desirability:
  - 23/24 muốn quiz.
  - 23/24 muốn tổng hợp điểm yếu.
  - Mặc định 10 câu.
  - MVP trắc nghiệm.
  - Ưu tiên cả bài và từng chương.
- [x] Viết `spec.md` §1, §2, §4.

## Công việc còn lại

### P0 - làm ngay

1. **Lấy nguồn bài học thật**
   - Xin một slide PDF/PPTX có số trang ổn định.
   - Nếu chưa có, chốt một transcript làm nguồn demo.
   - Bàn giao đường dẫn và quy tắc `source_ref` cho TV3.

2. **Đóng evidence gap**
   - Xác nhận 24 respondent đều ngoài nhóm.
   - Export Google Form/Sheets thành bản ẩn danh.
   - Không commit email.
   - Gửi `evidence/survey-follow-up.md` để tìm ≥3 willing users.

3. **Chốt scope bằng văn bản**
   - Một bài demo.
   - Mặc định 10 câu.
   - Trắc nghiệm một đáp án.
   - Cả bài/chương là P0; điểm kiến thức là P1 nếu kịp.
   - Dashboard giảng viên là mock, không thuộc lát cắt chấm.

### P1 - trước CP4

4. Nhận input từ các thành viên và hợp nhất `spec.md`:
   - TV5 → §5, §6.
   - TV4 → §7.
   - Cả nhóm → §3.
   - TV5 → validation plan cho §8.

5. Điền:
   - Tên nhóm, zone.
   - Tên thật của 5 thành viên.
   - ≥3 willing users.
   - Quality bar đã được nhóm duyệt.

6. Soát spec khớp prototype:
   - Không ghi “AI thật” khi vẫn hardcode.
   - Không dùng số dashboard mock như dữ liệu thật.
   - Không để lát cắt nói 10 câu nếu build vẫn có 4.

## File TV1 được phép sửa

- `spec.md`.
- `evidence/**`.
- README gốc của repo.
- Tài liệu kế hoạch trong `docs/`.

## Bàn giao

| Bàn giao cho | Nội dung |
|---|---|
| TV3 | Nguồn bài học, scope chính thức, yêu cầu 10 câu |
| TV4 | Evidence IDs và 10 case có thể phát triển từ chatlog |
| TV5 | Danh sách willing users |
| Cả nhóm | Spec đã hợp nhất và checklist còn thiếu |

## Definition of Done

- `spec.md` §1, §2, §4 không còn placeholder dữ liệu đã có.
- Có nguồn bài học thật hoặc transcript fallback.
- Có bản survey log ẩn danh hoặc ghi rõ lý do chưa có.
- Có ≥3 willing users.
- Bảng impact không tự bịa tần suất/thời gian.

---

# 5. TV2 - Frontend, UX và Integration

## Hiện trạng

- Prototype đã bấm được.
- Quiz đang dùng 4 câu hardcode trong `prototype/app/page.tsx`.
- Chưa có màn hình chọn phạm vi.
- README vẫn là nội dung starter.
- Test hiện tại là test của starter, chưa kiểm tra flow VLearn.

## P0 - trước CP3

1. **Tách câu hỏi hardcode**
   - Không để mảng `questions` là nguồn production của quiz.
   - Dùng type/interface chung với schema TV3.

2. **Thêm chọn phạm vi**
   - `Cả bài`.
   - `Từng chương`.
   - `Từng điểm kiến thức` có thể để P1 nếu chưa kịp.

3. **Thêm chọn số câu**
   - Mặc định 10.
   - Cho chọn 5 hoặc 10.

4. **Tích hợp API TV3**
   - Loading.
   - Thành công.
   - `need_clarification`.
   - `insufficient_source`.
   - Lỗi mạng/retry.

5. **Giữ chấm điểm rule-based**
   - So sánh đáp án user với `correct_option`.
   - Không gọi AI khi nộp bài.

6. **Hiển thị kết quả đúng khảo sát**
   - Điểm.
   - Câu đúng/sai.
   - Giải thích.
   - `source_ref`.
   - Điểm kiến thức yếu.

## P1 - trước CP5

7. Thêm correction:
   - Báo câu hỏi mơ hồ.
   - Tạo lại một câu hoặc làm lại quiz.

8. Cập nhật `prototype/README.md`:
   - Cách cài/chạy.
   - Phần nào mock.
   - Cách cấu hình API.
   - Lệnh build/test.

9. Thay test starter bằng test sản phẩm:
   - Trang render thành công.
   - Nút bắt đầu quiz tồn tại.
   - Flow chọn đáp án/chấm điểm.
   - State lỗi API.

10. Tạo backup:
   - Screenshot happy path.
   - Video ngắn nếu mạng lỗi.

## File TV2 được phép sửa

- `prototype/app/page.tsx`.
- `prototype/app/globals.css`.
- `prototype/tests/**`.
- `prototype/README.md`.
- Component UI mới trong `prototype/app/` hoặc `prototype/components/`.

Không sửa prompt hoặc eval rubric.

## Bàn giao

| Bàn giao cho | Nội dung |
|---|---|
| TV3 | Payload UI gửi lên API và lỗi tích hợp |
| TV4 | URL/lệnh chạy prototype để test |
| TV5 | Build ổn định cho validation và demo |

## Definition of Done

- Frontend không còn phụ thuộc vào 4 câu hardcode cho happy path.
- Có thể chọn phạm vi và tạo quiz 10 câu.
- Hiển thị đủ loading/success/clarification/failure.
- `npm run build` thành công.
- Test mới phản ánh VLearn quiz, không còn kiểm tra starter skeleton.

---

# 6. TV3 - AI Backend và Grounding

## P0 - trước CP3

1. **Chốt contract với TV2 trong 30 phút**

Input:

```json
{
  "lesson_id": "lesson-demo",
  "scope_type": "lesson|chapter|knowledge_point",
  "scope_value": "string",
  "question_count": 10
}
```

Output:

```json
{
  "status": "ok|need_clarification|insufficient_source",
  "message": "string",
  "questions": [
    {
      "id": "q1",
      "topic": "string",
      "stem": "string",
      "options": ["A", "B", "C", "D"],
      "correct_option": 0,
      "explanation": "string",
      "source_ref": "page-23",
      "confidence": "high|medium|low"
    }
  ]
}
```

2. **Tạo nguồn bài học**
   - Parse một slide PDF hoặc transcript.
   - Mỗi chunk có ID ổn định.
   - Không dùng nội dung giả cho AI call CP3.

3. **Tạo API route**
   - Ví dụ: `prototype/app/api/generate-quiz/route.ts`.
   - Nhận scope.
   - Lấy source chunks.
   - Gọi model thật.
   - Validate JSON.

4. **Prompt**
   - Chỉ dùng nguồn được cung cấp.
   - 10 câu trắc nghiệm, đúng một đáp án.
   - Mỗi câu có giải thích và nguồn.
   - Không đủ nguồn → không bịa.

5. **Graceful failure**
   - Phạm vi mơ hồ → `need_clarification`.
   - Nguồn không đủ → `insufficient_source`.
   - JSON sai → retry tối đa một lần.

6. **Trace**
   - Timestamp.
   - Case/input ID.
   - Model.
   - Latency.
   - Status.
   - Output.
   - Không log API key.

## P1 - sau run 1

7. Nhận failure số 1 từ TV4.
8. Chỉ sửa một vấn đề ưu tiên.
9. Version prompt `v1`, `v2`.
10. Bàn giao lại cho TV4 chạy toàn bộ regression.

## File TV3 được phép sửa

- `prototype/app/api/**`.
- `prototype/lib/**`.
- `prototype/prompts/**`.
- `prototype/.env.example`.
- `eval/traces/**`.

Không sửa UI lớn hoặc tự đánh dấu output của mình là pass.

## Definition of Done

- Có AI call thật ở quyết định tạo quiz.
- Không hardcode output trong API.
- 100% câu trả về có `source_ref`.
- Case thiếu nguồn không tạo câu hỏi giả.
- Có trace cho case chuẩn và case lỗi.
- API key không xuất hiện trong Git.

---

# 7. TV4 - Evaluation và Quality Gate

## P0 - trước CP3

1. Tạo cấu trúc:

```text
eval/
├── rubric.md
├── golden-set.csv
├── run-01-results.csv
├── run-01-summary.md
└── traces/
```

2. Định nghĩa pass/fail:
   - Groundedness.
   - Đúng phạm vi.
   - Đúng một đáp án.
   - Distractor hợp lý.
   - Giải thích có nguồn.
   - Failure đúng khi thiếu nguồn.
   - JSON đúng schema.

3. Tạo golden set ≥20:
   - 8-10 case thường.
   - ≥2 case cho mỗi lớp khó.
   - 2-4 case hiếm.
   - ≥10 case lấy/phát triển từ chatlog.

4. Chốt quality bar với TV1 trước khi đo:

> Gợi ý: ≥80% case pass; 100% có nguồn; 0 câu sai kiến thức hoặc có hai đáp án đúng.

5. Chạy toàn bộ lượt 1.
6. Ghi tất cả case, kể cả fail.
7. Tính % tổng và theo từng chiều.

## P1 - sau run 1

8. Chọn một failure nguy hiểm nhất.
9. Gửi failure cho TV3, không tự sửa prompt.
10. Sau khi TV3 sửa, chạy lại toàn bộ.
11. TV1 và TV4 chấm độc lập ít nhất 5 output khó.

## File TV4 được phép sửa

- `eval/**`.
- Không sửa trực tiếp prompt của TV3.

## Bàn giao

| Bàn giao cho | Nội dung |
|---|---|
| TV3 | Failure ưu tiên + ví dụ |
| TV1 | Quality bar và kết quả để điền spec §7 |
| TV5 | Case chuẩn/case lỗi tốt nhất cho demo |

## Definition of Done

- Golden set ≥20 đúng cơ cấu rubric.
- Run 1 đủ 100% case.
- Có tỷ lệ pass và phân tích failure.
- Quality bar được chốt trước kết quả.
- Không xóa case fail.

---

# 8. TV5 - Risk, Validation và Demo

## P0 - làm song song trước CP3

1. Viết ≥8 risk scenarios:
   - 2 nguồn sự thật.
   - 2 mơ hồ/thiếu thông tin.
   - 2 ngoài phạm vi.
   - 2 đặc thù giáo dục.

2. Với mỗi case ghi:
   - Tình huống.
   - Lớp lỗi.
   - Hành vi mong muốn.
   - HAX/PAIR áp dụng.

3. Viết bốn đường đi:
   - Happy.
   - Low-confidence.
   - Failure.
   - Correction.

4. Lưu bản làm việc vào:

```text
validation/risk-scenarios.md
validation/experience-paths.md
```

TV1 sẽ hợp nhất vào `spec.md` để tránh hai người sửa cùng file cùng lúc.

## P1 - trước CP5

5. Nhận ≥3 willing users từ TV1.
6. Tuyển đủ ≥5 người ngoài nhóm; mỗi thành viên hỗ trợ một người.
7. Chạy test 10 phút/người, không hướng dẫn.
8. Ghi:
   - Task.
   - Hành vi quan sát.
   - Quote.
   - Severity.
   - Có tin/dùng thật không.

9. Chọn 1-2 thay đổi:
   - TV2 sửa UI.
   - TV3 sửa AI nếu cần.
   - TV4 chạy regression.

10. Làm slide 6 trang và demo script.
11. Dry run 5 phút, có bấm giờ.
12. Chuẩn bị backup.

## File TV5 được phép sửa

- `validation/**`.
- `demo-script.md`.
- Source slide/demo, sau đó xuất `demo-slides.pdf`.
- `reflection/README.md`.

Không sửa core API hoặc kết quả eval.

## Definition of Done

- ≥8 risk scenarios phủ đủ 4 lớp.
- Có 4 đường đi trải nghiệm.
- ≥5 feedback có tên/vai; ≥2 willing users từ CP1/TV1.
- Có changelog.
- Slide 6 trang đúng rubric.
- Demo 5 phút có case chuẩn và case lỗi.

---

# 9. Công việc bắt buộc của cả nhóm

| Việc | TV1 | TV2 | TV3 | TV4 | TV5 |
|---|:---:|:---:|:---:|:---:|:---:|
| Nghiên cứu một sản phẩm tương tự | ✓ | ✓ | ✓ | ✓ | ✓ |
| Đề xuất ít nhất 4 golden cases | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tuyển/hỗ trợ ít nhất 1 user validation | ✓ | ✓ | ✓ | ✓ | ✓ |
| Viết reflection cá nhân | ✓ | ✓ | ✓ | ✓ | ✓ |
| Nói ít nhất một phần trong demo | ✓ | ✓ | ✓ | ✓ | ✓ |
| Hiểu và giải thích được phần mình làm | ✓ | ✓ | ✓ | ✓ | ✓ |

Gợi ý sản phẩm tương tự:

- TV1: Quizlet AI.
- TV2: Kahoot AI.
- TV3: NotebookLM.
- TV4: ChatGPT Study.
- TV5: Khanmigo.

---

# 10. Nhịp làm việc theo checkpoint

## Block A - 30 phút tiếp theo

| Người | Kết quả phải có |
|---|---|
| TV1 | Nguồn bài học + xác nhận scope + gửi follow-up |
| TV2 | UI scope/count dùng mock schema mới |
| TV3 | API route gọi model được một lần |
| TV4 | `eval/` + golden set khung 20 dòng |
| TV5 | Khung 8 risk scenarios |

## Block B - đến CP3

| Người | Kết quả phải có |
|---|---|
| TV1 | Evidence/spec cập nhật, source bàn giao xong |
| TV2 | Frontend gọi API, đủ trạng thái |
| TV3 | AI call thật + trace |
| TV4 | Golden set ≥20 + run 1 + % |
| TV5 | 8 risk + 4 paths bản nháp |

## Block C - CP3 đến CP4/spec deadline

| Người | Kết quả phải có |
|---|---|
| TV1 | Hợp nhất spec, chốt quality bar |
| TV2 | Chỉ sửa lỗi tích hợp/UI cần thiết |
| TV3 | Sửa failure số 1 |
| TV4 | Run 2 toàn bộ |
| TV5 | Hoàn thiện risk/paths và tuyển validation |

## Block D - CP4 đến CP5

| Người | Kết quả phải có |
|---|---|
| TV1 | Spec/changelog cập nhật từ feedback |
| TV2 | Sửa UI từ validation |
| TV3 | Sửa AI nếu feedback có căn cứ |
| TV4 | Regression |
| TV5 | 5 user tests + slide + dry run |

## Block E - CP6

- TV1: User/job/evidence/impact.
- TV2: Demo happy path.
- TV3: AI/grounding/failure path.
- TV4: Eval vs quality bar.
- TV5: User feedback/roadmap.

---

# 11. Quy tắc tránh xung đột

1. TV1 là người duy nhất hợp nhất `spec.md`.
2. TV2 sở hữu UI; TV3 sở hữu API/prompt; TV4 sở hữu eval; TV5 sở hữu validation/demo.
3. Thay đổi contract API phải báo TV2 + TV3 trước khi sửa.
4. Sau khi quality bar chốt, không đổi để làm đẹp kết quả.
5. Không dùng dashboard mock làm bằng chứng.
6. Không commit:
   - API key.
   - Email người khảo sát.
   - Raw data pack.
7. Mỗi lần bàn giao phải có:
   - File/link.
   - Cách chạy/kiểm.
   - Phần còn mock.
   - Người reviewer.

---

# 12. Bảng kiểm kết thúc công việc

| Artifact | Owner | Reviewer | Trạng thái |
|---|---|---|---|
| `spec.md` §1, §2, §4 | TV1 | TV5 | Gần xong |
| Raw survey log + willing users | TV1 | TV5 | Chưa |
| Nguồn bài học | TV1/TV3 | TV4 | Chưa |
| Frontend tích hợp | TV2 | TV5 | Chưa |
| AI API/prompt/trace | TV3 | TV4 | Chưa |
| `eval/` + run 1 | TV4 | TV1 | Chưa |
| Risk + 4 paths | TV5 | TV1 | Chưa |
| Validation ≥5 | TV5 | TV2 | Chưa |
| Slide/demo | TV5 | Cả nhóm | Chưa |
| Reflection 5 người | Từng người | TV5 | Chưa |

## Thứ tự ưu tiên nếu thiếu thời gian

1. AI call thật.
2. Golden set ≥20 và run 1.
3. Frontend end-to-end.
4. Spec chốt + quality bar.
5. Failure path.
6. Validation.
7. Slide/dry run.
8. UI polish và dashboard.
