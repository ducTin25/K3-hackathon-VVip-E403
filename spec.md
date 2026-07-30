w# AI SPEC - Kiểm tra mức độ hiểu từ slide · Nhóm VVip · Zone 

Hướng: [x] A - VLearn  [ ] B - Trợ lý Học viên  [ ] C - Làn mở  
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

> Trạng thái: TV1 đã hoàn thiện §1, §2 và §4 từ mining + khảo sát tổng hợp `n=24`. Prototype CP2 hiện nằm trong `prototype/`.

## §1. User & Job

### Job executor

**Học viên vừa đọc xong một phần bài giảng và muốn biết mình đã hiểu, nhớ đúng phần đó hay chưa.**

Workflow hiện tại:

1. Đọc slide/tài liệu.
2. Gặp phần không chắc hoặc muốn ôn lại.
3. Đọc lại, tua video, hỏi bạn/TA/tutor hoặc xin tóm tắt.
4. Tự phán đoán mình đã hiểu hay chưa.
5. Chuyển bài dù có thể vẫn còn lỗ hổng.

### Core JTBD

> **Kiểm tra xem mình đã hiểu và nhớ đúng phần vừa học trước khi chuyển sang nội dung tiếp theo.**

### Problem statement

> Sau khi đọc bài giảng, học viên chưa có cách nhanh để tự kiểm tra phần nào đã hiểu và phần nào còn hổng; họ chủ yếu đọc lại, hỏi giải thích hoặc xin tóm tắt, nên dễ nhầm cảm giác “đã xem” với “đã nắm được kiến thức”.

### Evidence

#### Đường A - khảo sát desirability

- Tổng phản hồi: **24**.
- Muốn làm quiz sau bài lý thuyết: **23/24 = 95,8%**.
- Muốn tổng hợp kiến thức và đánh giá điểm yếu: **23/24 = 95,8%**.
- Phạm vi được chọn nhiều nhất:
  - Cả bài: **15/24 = 62,5%**.
  - Từng chương: **13/24 = 54,2%**.
  - Từng điểm kiến thức: **8/24 = 33,3%**.
  - Câu này cho chọn nhiều đáp án.
- Số câu được chọn nhiều nhất: **10 câu, 10/24 = 41,7%**.
- Loại câu được chọn nhiều nhất: **Trắc nghiệm, 14/24 = 58,3%**.
- Kết quả chi tiết: `evidence/survey-results.md`.
- Dữ liệu máy đọc: `evidence/survey-aggregate.csv`.
- Ảnh gốc: `docs/form_results/`.

Giới hạn:

- Ảnh chưa xác minh cả 24 người đều ngoài nhóm.
- Chưa có raw log từng phản hồi trong repo.
- Form hỏi trực tiếp mức mong muốn với quiz, chưa đo tần suất/thời gian của pain.
- Chưa có quote nguyên văn hoặc danh sách ≥3 willing users.

Vì vậy, `95,8%` được dùng để chứng minh **mức quan tâm tới giải pháp**, không được viết thành `95,8% học viên đang gặp pain`.

#### Đường B - mining sơ bộ

Nguồn: `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`.

Phương pháp tái lập: `evidence/mining-method.md`.

| Tín hiệu | Số turn | Tỷ lệ trên 1.261 student/tutor turns |
|---|---:|---:|
| Query giải thích/không hiểu/làm rõ | 419 | 33,2% |
| Query tóm tắt/tổng hợp | 129 | 10,2% |
| Query trực tiếp nhắc quiz/trắc nghiệm | 3 | 0,24% |
| Tutor chủ động hỏi kiểm tra hiểu | 3 | 0,24% |
| Tutor có follow-up khác rỗng | 0 | 0% |
| Tutor có misconception khác rỗng | 0 | 0% |

Ví dụ ngắn có mã nguồn nằm tại `evidence/mining-examples.csv`, gồm:

- `T0849`: yêu cầu tạo quiz để hiểu và ôn lại toàn bộ slide.
- `T0257`: xin tóm tắt để làm quiz cuối giờ.
- `T0907`: nêu chủ đề quiz từ bài giảng.
- `T0649`, `T0699`, `T0415`, `T1019`: yêu cầu tóm tắt/tổng hợp kiến thức.
- `T0959`: yêu cầu giải thích kiến thức.

**Giới hạn diễn giải:** mining chứng minh cơ hội hỗ trợ học hiểu/ôn lại và khoảng trống kiểm tra hiểu của tutor. Khảo sát `n=24` bổ sung bằng chứng desirability rất cao cho giải pháp quiz.

## §2. Impact & quyết định chọn

Chi tiết: `evidence/impact-analysis.md`.

| Pain/ứng viên | Bằng chứng hiện có | Người gặp × tần suất × tổn thất | Khả thi | Quyết định |
|---|---|---|---|---|
| Không biết mình đã hiểu đúng; tạo quiz có nguồn để tự kiểm tra | 23/24 muốn quiz; 23/24 muốn tổng hợp điểm yếu; tutor hỏi kiểm tra hiểu 3/1.261 lượt | 23/24 bày tỏ nhu cầu giải pháp × tần suất chưa đo × tổn thất chưa đo | Cao với trắc nghiệm, một bài mẫu | **Chọn** |
| Mất thời gian rút ý chính; tạo tóm tắt có nguồn | 129/1.261 query tóm tắt/tổng hợp | Chưa suy ra user duy nhất; chưa đo phút | Rất cao | Loại tạm: tutor đã có khả năng tóm tắt, khác biệt thấp |
| Không hiểu đoạn slide; cải thiện giải thích theo đoạn | 419/1.261 query giải thích/làm rõ | Chưa suy ra user duy nhất; chưa đo hậu quả | Cao | Loại tạm: trùng năng lực lõi tutor hiện tại |

### Lý do chọn ứng viên quiz

1. Khớp ví dụ “kiểm tra hiểu thật cuối buổi” của Hướng A.
2. Hành vi hiện tại gần như không chủ động kiểm tra hiểu hoặc tạo follow-up.
3. Demo được trong 5 phút.
4. Có tiêu chí đo rõ: groundedness, đúng phạm vi, một đáp án đúng và giải thích có nguồn.
5. Prototype CP2 đã có flow làm quiz và xem kết quả.
6. Khảo sát cho thấy 95,8% muốn quiz và 95,8% muốn tổng hợp kiến thức/điểm yếu.
7. Kết quả thiết kế rõ: ưu tiên cả bài/chương, mặc định 10 câu, loại trắc nghiệm.

### Phần evidence còn phải xác minh

- Xác nhận 24 respondent đều ngoài nhóm.
- Export raw log hoặc bản ẩn danh.
- Bổ sung ≥3 người đồng ý thử prototype.
- Nếu còn thời gian, đo tần suất pain và thời gian/tổn thất mỗi lần.
- Có nguồn bài học ổn định.
- CP3 thay câu hỏi hardcode bằng AI call thật.

Những trường còn thiếu phải được trình bày trung thực; không tự suy ra từ biểu đồ.

## §3. Giải pháp tương tự đã nghiên cứu

> Owner: cả nhóm. Mỗi thành viên điền một sản phẩm theo 4 ý: flow / đáng học / đáng né / khác biệt của nhóm.

- Quizlet AI: `[TODO]`
- NotebookLM: `[TODO]`
- ChatGPT Study: `[TODO]`
- Khanmigo: `[TODO]`
- Kahoot AI: `[TODO]`

## §4. Thiết kế

### Lát cắt một câu

> **Một học viên vừa đọc xong một phạm vi bài giảng chọn phần cần ôn; hệ thống quyết định 10 câu trắc nghiệm có căn cứ, đáp án và giải thích để học viên nhận ra phần đã nắm và phần cần xem lại.**

### Non-goals

1. Không xây đăng nhập production.
2. Không hỗ trợ toàn bộ bài giảng của khóa; demo end-to-end trên một bài.
3. Không chấm câu hỏi tự luận trong MVP.
4. Không cập nhật điểm chính thức của học viên.
5. Không cá nhân hóa dài hạn qua nhiều buổi.
6. Không triển khai analytics/dashboard giảng viên bằng dữ liệu thật; dashboard đang có chỉ là mock phụ trợ, không thuộc lát cắt được đánh giá.

### Mức prototype

Nhắm tới: [ ] Sketch  [x] Mock  [ ] Working.

Hiện trạng CP2 trong `prototype/`:

| Thành phần | Trạng thái |
|---|---|
| Flow đọc bài → bắt đầu quiz → trả lời → kết quả | Bấm được |
| Chấm điểm | Rule-based theo mảng đáp án |
| Giải thích và nguồn slide | Nội dung mock |
| Bộ câu hỏi | 4 câu hardcode trong `prototype/app/page.tsx` |
| Chọn cả bài/chương/điểm kiến thức | Chưa có trong prototype |
| AI call tạo quiz | Chưa có |
| Dashboard giảng viên | Mock với số liệu giả, ngoài lát cắt |

Khoảng cách phải đóng trước CP3:

1. Thêm AI call thật ở quyết định tạo quiz.
2. Tạo 10 câu theo lựa chọn cao nhất của khảo sát; prototype hiện chỉ có 4.
3. Thêm chọn phạm vi hoặc sửa lát cắt/spec nếu nhóm quyết định bỏ lựa chọn này.
4. Lưu trace input/output.
5. Không trình bày số liệu dashboard mock như số thật.

### Automation

Chọn: [ ] Augment  [x] Conditional  [ ] Automate.

Lý do theo cost-of-error:

- Câu hỏi sai hoặc đáp án mơ hồ có thể khiến học viên học sai.
- User không phải lúc nào cũng đủ kiến thức để phát hiện lỗi.
- Hệ thống chỉ tự tạo khi câu hỏi/đáp án/giải thích trace được về nguồn đã chọn.
- Khi nguồn thiếu hoặc phạm vi mơ hồ, hệ thống yêu cầu thu hẹp phạm vi hoặc không tạo quiz.
- Chấm trắc nghiệm là so sánh đáp án bằng luật, không gọi AI lần hai.

### Flow mục tiêu

1. Học viên chọn bài.
2. Bấm `Tạo quiz`.
3. Chọn `cả bài`, `từng chương` hoặc `điểm kiến thức`.
4. Hệ thống lấy source chunks tương ứng.
5. AI tạo 10 câu trắc nghiệm theo schema, mỗi câu có `source_ref`.
6. Học viên trả lời.
7. Hệ thống chấm theo đáp án.
8. Hiển thị điểm, giải thích, nguồn và phần cần xem lại.

### §4b. Nguyên tắc HAX/PAIR

| Nguyên tắc | Áp cụ thể vào đâu | Hiện trạng CP2 |
|---|---|---|
| G1 - Làm rõ hệ thống làm được gì | Quiz card ghi “AI tạo từ slide”; phạm vi chỉ là nội dung bài đã chọn | Có một phần |
| G2 - Làm rõ hệ thống làm tốt đến đâu | Mỗi câu có trang nguồn; cần bổ sung trạng thái confidence/giới hạn | Có nguồn mock, thiếu confidence |
| G10 - Thu hẹp phạm vi khi nghi ngờ | Thiếu nguồn hoặc phạm vi quá rộng → yêu cầu chọn chương/điểm kiến thức | Chưa implement |
| G11 - Giải thích vì sao | Sau mỗi câu hiển thị giải thích và nút xem lại trang nguồn | Đã có trong mock |
| G9 - Sửa dễ dàng | Cho làm lại quiz; mục tiêu thêm báo/tạo lại một câu sai hoặc mơ hồ | Có làm lại toàn bộ, chưa sửa từng câu |
| PAIR - Trust/Explainability | Không chỉ hiện điểm; chỉ ra căn cứ và nội dung cần xem lại | Có trong mock, nguồn chưa nối dữ liệu thật |

## §5. Kiểu lỗi - 4 lớp chỗ khó + kịch bản

> Owner: TV5. Cần ≥8 kịch bản, mỗi lớp ≥2.

`[TODO TV5]`

## §6. Bốn đường đi của trải nghiệm

> Owner: TV5 phối hợp TV2/TV3.

- Happy path: `[TODO]`
- Low-confidence: `[TODO]`
- Failure/không căn cứ: `[TODO]`
- Correction: `[TODO]`
- Ngoài phạm vi: `[TODO]`
- Case đặc thù domain: `[TODO]`

## §7. Kiểm thử

> Owner: TV4.

- Chiều chất lượng: groundedness, scope relevance, answerability, distractor quality, explanation, graceful failure, output validity.
- Golden set: `[TODO ≥20 case]`.
- Quality bar đề xuất để nhóm duyệt trước 23:59:

> **Đạt khi ≥80% case pass toàn bộ tiêu chí, 100% câu hỏi có `source_ref` hợp lệ, và không có câu hỏi sai kiến thức hoặc có hai đáp án đúng.**

- Kết quả lượt chạy: `[TODO TV4]`.

## §8. Phân công & kế hoạch

Chi tiết công việc, handoff và Definition of Done: `docs/phan-cong-cong-viec-cap-nhat.md`.

| Vai trò | Thành viên | Việc chính hiện tại | Artifact |
|---|---|---|---|
| TV1 - Product/Evidence/Spec Integrator | `[ĐIỀN TÊN]` | Nguồn bài học, raw survey/willing users, hợp nhất spec | `evidence/`, `spec.md` |
| TV2 - Frontend/UX/Integration | `[ĐIỀN TÊN]` | Scope selector, 10 câu, gọi API, state lỗi, test | `prototype/app/`, `prototype/tests/`, prototype README |
| TV3 - AI Backend/Grounding | `[ĐIỀN TÊN]` | AI call thật, prompt/schema, nguồn, fallback, trace | `prototype/app/api/`, `prototype/lib/`, `prototype/prompts/`, `eval/traces/` |
| TV4 - Evaluation/Quality Gate | `[ĐIỀN TÊN]` | Golden set ≥20, rubric, run 1/run 2, quality bar | `eval/` |
| TV5 - Risk/Validation/Demo | `[ĐIỀN TÊN]` | 8 risk scenarios, 4 paths, 5 user tests, slide/dry run | `validation/`, `demo-script.md`, `demo-slides.pdf` |

Willing users:

1. `[CHƯA THU THẬP - form hiện tại không hỏi]`
2. `[CHƯA THU THẬP - form hiện tại không hỏi]`
3. `[CHƯA THU THẬP - form hiện tại không hỏi]`

Kế hoạch validation: `[TODO TV5 sau khi có willing users]`.

Multi-prototype: `[TODO nếu thực hiện]`.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| Sau CP2 | Chốt user là học viên vừa học xong; AI chỉ tạo quiz có nguồn; chấm điểm rule-based | Giữ lát cắt một user/một quyết định AI và giảm cost-of-error |
| Sau khi review form | Đưa câu hỏi pain/hành vi lên trước câu hỏi “có muốn quiz” | Tránh câu hỏi dẫn dắt; đáp ứng chuẩn evidence |
| Sau khi có prototype | Ghi rõ 4 câu đang hardcode, dashboard là mock và scope selector chưa có | Spec phải khớp artifact thật |
| Sau khi có 24 phản hồi | Chốt mặc định 10 câu, trắc nghiệm, ưu tiên cả bài/chương và màn hình tổng hợp điểm yếu | Lựa chọn lần lượt đạt 41,7%, 58,3%, 62,5%/54,2% và 95,8% |
