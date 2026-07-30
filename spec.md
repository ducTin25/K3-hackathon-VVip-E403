# AI SPEC — Kiểm tra mức độ hiểu từ slide · Nhóm chưa khai báo · Zone chưa khai báo

Hướng: [x] A — VLearn [ ] B — Trợ lý Học viên [ ] C — Làn mở  
Loại: [ ] Tối ưu tính năng có sẵn [x] Tính năng mới

> **Trạng thái tài liệu:** hoàn thiện theo artifact đang có trong repository ngày 30/07/2026. Những nội dung chưa có bằng chứng/trace/validation được ghi là **chưa xác minh**, không được coi là kết quả đã đạt.

## §1. User & Job

### Job executor và workflow

**Job executor:** học viên vừa học xong một phần slide lý thuyết và sắp chuyển sang nội dung hoặc bài tập tiếp theo.

**Workflow hiện tại:**

1. Đọc slide hoặc xem lại bài giảng.
2. Cảm thấy chưa chắc về một hay nhiều khái niệm.
3. Đọc lại, tua video, hỏi bạn/TA/Tutor hoặc xin tóm tắt.
4. Tự suy đoán đã hiểu hay chưa.
5. Chuyển bài, trong khi lỗ hổng kiến thức có thể vẫn còn.

### Core JTBD

> **Kiểm tra xem mình đã hiểu và nhớ đúng phần vừa học trước khi chuyển sang nội dung tiếp theo.**

### Problem statement

Sau khi đọc bài giảng, học viên chưa có một cách ngắn, có căn cứ để tự kiểm tra mình sai ở khái niệm nào. Việc đọc lại hoặc hỏi giải thích giúp tiếp cận nội dung, nhưng không xác nhận được học viên có áp dụng/nhớ đúng hay chỉ có cảm giác “đã xem”. Hậu quả là học viên có thể mang ngộ nhận sang bài tập hoặc bài tiếp theo.

### Evidence

#### Đường A — khảo sát về mức quan tâm giải pháp

`spec.md` hiện ghi nhận một khảo sát tổng hợp **n = 24** với các số liệu:

| Tín hiệu                                  | Kết quả được ghi nhận |
| ----------------------------------------- | --------------------: |
| Muốn làm quiz sau bài lý thuyết           |         23/24 (95,8%) |
| Muốn tổng hợp kiến thức/đánh giá điểm yếu |         23/24 (95,8%) |
| Chọn ôn toàn bài                          |         15/24 (62,5%) |
| Chọn ôn theo chương                       |         13/24 (54,2%) |
| Chọn 10 câu                               |         10/24 (41,7%) |
| Chọn trắc nghiệm                          |         14/24 (58,3%) |

Các file raw log, danh sách người trả lời và ảnh form được `spec.md` tham chiếu **không có trong repository hiện tại**. Vì vậy các số liệu trên chỉ là bằng chứng _desirability đã được báo cáo_, chưa thỏa chuẩn khảo sát của rubric (không xác minh được 24 người ngoài nhóm, từng câu trả lời nguyên văn và tần suất pain). Chúng không được diễn giải thành “95,8% học viên gặp pain”.

#### Đường B — mining/chatlog

`spec.md` báo cáo mining trên 1.261 lượt student/tutor với 419 lượt hỏi giải thích/làm rõ (33,2%), 129 lượt hỏi tóm tắt/tổng hợp (10,2%), 3 lượt nhắc quiz và 3 lượt Tutor hỏi kiểm tra hiểu. Các `source_ref` trong `eval/golden-set.csv` cũng giữ mã hội thoại/transcript thay vì chép dữ liệu gốc.

Tuy nhiên data pack và các file phương pháp/quote (`evidence/mining-method.md`, `evidence/mining-examples.csv`) không có trong repository hiện tại. Do đó con số không thể tái kiểm từ repo này. Nó chỉ cho thấy nhóm đã định hướng mining vào nhu cầu giải thích/tổng hợp; trước khi nộp chính thức cần bổ sung phương pháp đếm, mẫu số, quy tắc phân loại và ít nhất 5 trích dẫn ngắn theo mã nguồn.

### Kết luận evidence hiện tại

Có tín hiệu hợp lý cho job “tự kiểm tra hiểu bài”, và Golden set đã chứa 20 case có nguồn tham chiếu. Nhưng evidence **chưa đạt chuẩn A hoặc B có thể kiểm lại hoàn toàn** vì thiếu raw log/mining artifact trong repo. Đây là rủi ro ưu tiên cao của bài nộp.

## §2. Impact & quyết định chọn

| Ứng viên                            | Bằng chứng hiện có                                                                                               | Người gặp × tần suất × tổn thất                                             | Khả thi trong hackathon               | Quyết định                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| Quiz chẩn đoán có nguồn sau khi học | Khảo sát báo 23/24 muốn quiz và tổng hợp điểm yếu; 3 lượt quiz, 3 lượt Tutor chủ động kiểm tra hiểu được báo cáo | Có 23 người bày tỏ nhu cầu giải pháp; tần suất và phút tổn thất **chưa đo** | Cao: một bài mẫu, MCQ, chấm theo luật | **Chọn**                                                      |
| Tóm tắt có nguồn                    | 129/1.261 lượt tóm tắt/tổng hợp được báo cáo                                                                     | Người/tần suất/phút chưa phân tách được                                     | Cao                                   | Loại tạm: job gần với năng lực Tutor hiện tại, khác biệt thấp |
| Giải thích lại đoạn slide           | 419/1.261 lượt hỏi giải thích/làm rõ được báo cáo                                                                | Người/tần suất/hậu quả chưa đo                                              | Cao                                   | Loại tạm: trùng năng lực Tutor, không trực tiếp kiểm tra hiểu |

**Lý do chọn:**

1. Khớp Hướng A và ví dụ “kiểm tra hiểu thật cuối buổi”.
2. Có một lát cắt demo rõ: chọn nguồn → AI quyết định có đủ căn cứ → sinh câu hỏi → làm bài → xem phần cần ôn.
3. Sai lầm có thể được giảm bằng grounding, schema và refusal; chấm trắc nghiệm không cần AI lần hai.
4. Chất lượng có thể đo bằng groundedness, tính đơn đáp án, tính đúng trích dẫn và hành vi từ chối.
5. Thiết kế khảo sát được báo cáo ưu tiên toàn bài/chương, 10 câu và trắc nghiệm.

**Giới hạn impact:** chưa có số liệu tần suất thực, thời gian mất mỗi lần hoặc số học viên bị ảnh hưởng. Vì thế impact chưa được lượng hóa đầy đủ; không dùng số dashboard mock (862, 57%...) làm bằng chứng impact.

## §3. Giải pháp tương tự đã nghiên cứu

Phần này là so sánh thiết kế ở mức desk research; repository không lưu log dùng thử nên không khẳng định nhóm đã kiểm chứng từng sản phẩm.

| Giải pháp          | Flow liên quan                                  | Điều áp dụng                                      | Điều cần tránh                                              | Khác biệt của lát cắt này                                                 |
| ------------------ | ----------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| Quizlet AI         | Học từ bộ học liệu qua flashcard/quiz           | Biến học liệu thành câu hỏi ngắn, cho phép ôn lặp | Không để câu hỏi tách khỏi phần học viên vừa học            | Mỗi câu bắt buộc trỏ về `sourceId`/trang nguồn cụ thể                     |
| NotebookLM         | Hỏi/tổng hợp trên tập nguồn người dùng cung cấp | Hiển thị căn cứ gần với đầu ra để người dùng kiểm | Không tạo cảm giác citation là bảo chứng nếu nguồn không đủ | Nếu nguồn mơ hồ, trả `insufficient_source`, không cố tạo câu              |
| ChatGPT Study Mode | Hỏi đáp theo từng bước và kiểm tra hiểu         | Tập trung vào hiểu/áp dụng thay vì chỉ tóm tắt    | Không tự khẳng định người học đã “nắm chắc” chỉ từ một câu  | Kết quả chỉ đề xuất phần cần xem lại, không là điểm chính thức            |
| Khanmigo           | Gia sư gợi mở, hỗ trợ giáo viên                 | Dùng feedback để chỉ ra reasoning/misconception   | Không để AI thay giảng viên quyết định can thiệp học thuật  | Giảng viên duyệt mini-quiz/can thiệp; dashboard chỉ là mock ngoài lát cắt |
| Kahoot AI          | Sinh câu hỏi nhanh từ nội dung                  | Cấu trúc MCQ và trải nghiệm trả lời nhanh         | Không phát hành câu hỏi chỉ vì sinh được đúng định dạng     | Yêu cầu nguồn hợp lệ, một đáp án đúng rõ, distractor gắn misconception    |

## §4. Thiết kế

### Lát cắt MỘT CÂU

> **Một học viên vừa đọc xong một phạm vi bài giảng cung cấp đoạn slide; hệ thống quyết định có đủ căn cứ để tạo một câu trắc nghiệm chẩn đoán có nguồn, đáp án và giải thích, để học viên nhận ra phần cần xem lại.**

Lát cắt dùng **một câu AI tạo thật** vì artifact hiện có (`generateDiagnosticQuiz`) chỉ sinh một câu; UI demo bốn câu hiện là mock. Mục tiêu 10 câu là roadmap sau khi tích hợp vòng sinh nhiều câu và quality gate.

### Non-goals

1. Không xây LMS, đăng nhập production, điểm chính thức hoặc xếp hạng.
2. Không tự thay đổi giáo án hay tự gửi nội dung cho lớp.
3. Không chấm tự luận hoặc đánh giá năng lực tổng quát của học viên.
4. Không trả lời kiến thức ngoài đoạn slide/học liệu đã chọn.
5. Không triển khai dashboard giảng viên bằng dữ liệu thật; dashboard trong `codebase/app/page.tsx` là minh họa phụ trợ.
6. Không cá nhân hóa dài hạn qua nhiều buổi hay lưu hồ sơ học tập trong bản hiện tại.

### Mức prototype và phần thật/mock

Mức khai báo: [x] Mock [ ] Sketch [ ] Working.

| Thành phần                                              | Hiện trạng kiểm chứng từ code                                                                                     |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Đọc bài → bắt đầu quiz → chọn đáp án → xem điểm/kết quả | Bấm được trong `codebase/app/page.tsx`                                                                            |
| Chấm MCQ                                                | Rule-based theo mảng `questions` hard-code                                                                        |
| Nguồn/giải thích trong UI                               | Mock theo 4 câu hard-code                                                                                         |
| AI quyết định tạo/refuse một quiz item                  | Có hàm thật `generateDiagnosticQuiz` gọi DeepSeek, prompt/schema/validator trong `codebase/lib/quiz-generator.ts` |
| API AI                                                  | Có `POST /api/generate-quiz`                                                                                      |
| AI nối với flow UI                                      | **Chưa có:** UI không gọi API; `rg` chỉ thấy sử dụng mảng `questions` hard-code                                   |
| Chọn toàn bài/chương/điểm kiến thức                     | Chưa có                                                                                                           |
| 10 câu AI tạo                                           | Chưa có; API sinh đúng một câu                                                                                    |
| Dashboard/AI Brief                                      | Mock, số liệu không phải dữ liệu lớp thật                                                                         |
| Persistence, auth, database                             | Chưa có; schema mặc định trống                                                                                    |

### Automation

Chọn: [ ] Augment [x] Conditional [ ] Automate.

- **Case đủ căn cứ:** AI tự sinh một câu nháp có cấu trúc; ứng dụng kiểm tra identity nguồn, 4 lựa chọn, vị trí đáp án và misconception trước khi trả về.
- **Case thiếu/mơ hồ/ngoài nguồn:** AI phải trả `insufficient_source`; ứng dụng không phát hành câu hỏi và yêu cầu chọn đoạn nguồn rõ hơn.
- **Case có rủi ro học thuật:** với bản triển khai, giảng viên/nội dung duyệt ngân hàng câu trước khi phát hành rộng. Trong prototype, người dùng chỉ dùng kết quả để tự ôn, không phải điểm chính thức.

Lý do: câu sai hoặc hai đáp án đúng có thể làm học viên học sai; chi phí sửa không rẻ vì người học có thể không tự phát hiện. Ngược lại, từ chối tạo câu khi nguồn thiếu là chi phí thấp và có đường lui rõ ràng.

### Flow mục tiêu

1. Học viên chọn bài và phạm vi (toàn bài/chương/điểm kiến thức).
2. Hệ thống hiển thị nguồn đang dùng và tạo request gồm `sourceId`, trang và đoạn slide.
3. AI tạo một quiz item hoặc trả `insufficient_source`.
4. Ứng dụng validate schema và tính nhất quán nguồn; case lỗi không được phát hành.
5. Học viên trả lời MCQ; hệ thống chấm theo đáp án được tạo/đã duyệt.
6. Hệ thống hiển thị giải thích, trích dẫn, misconception và đường mở lại nguồn.
7. Học viên làm lại hoặc thu hẹp phạm vi; giảng viên chỉ xem dữ liệu tổng hợp sau khi có persistence và phân quyền.

### §4b. Nguyên tắc HAX/PAIR

| Nguyên tắc                         | Áp dụng cụ thể                                                                                                         | Hiện trạng                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| G1 — Làm rõ hệ thống làm được gì   | Prompt giới hạn nhiệm vụ thành một câu MCQ hiểu/áp dụng từ `SOURCE`; UI ghi “AI tạo từ slide”.                         | Prompt có; UI chỉ mock                    |
| G2 — Làm rõ nó làm tốt đến đâu     | Output có `confidence`, `sourceId`, `sourcePage`; UI mục tiêu hiển thị nguồn để người học kiểm lại.                    | API có trường; UI chưa nối API/confidence |
| G10 — Thu hẹp phạm vi khi nghi ngờ | Prompt yêu cầu `insufficient_source` khi nguồn ngắn/mơ hồ/nhiều cách hiểu; không đoán.                                 | Có trong prompt/API                       |
| G11 — Giải thích vì sao            | Output gồm `explanation`; UI mock hiển thị giải thích và “Xem lại Trang N”.                                            | Có ở API và mock UI                       |
| G9 — Sửa dễ dàng                   | Học viên có thể làm lại quiz trong UI; flow mục tiêu cho phép chọn lại phạm vi sau refusal.                            | Làm lại có; selector chưa có              |
| PAIR — Explainability + Trust      | Không chỉ đưa điểm: câu hỏi kèm nguồn, explanation và misconception; hạn chế/độ tin cậy phải được hiển thị khi nối UI. | Thiết kế đã có, còn thiếu tích hợp        |

## §5. Kiểu lỗi — 4 lớp chỗ khó và kịch bản

| #   | Tình huống cụ thể                                                         | Lớp                                | Hành vi mong muốn                                                                                    | Nguyên tắc |
| --- | ------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------- |
| 1   | Slide chỉ có tiêu đề “ReAct”                                              | ① Nguồn sự thật                    | Trả `insufficient_source`, nêu nguồn quá ngắn và yêu cầu chọn đoạn có định nghĩa/ví dụ.              | G10, G2    |
| 2   | Model tạo giải thích thêm kiến thức không có trong đoạn nguồn             | ① Nguồn sự thật                    | Không phát hành nếu reviewer/eval phát hiện không grounded; ghi trace để sửa prompt.                 | G2, G11    |
| 3   | Người học gửi “Agent dùng context tốt hơn”                                | ② Mơ hồ                            | Không đoán chủ đề/đáp án; yêu cầu chọn đoạn cụ thể hoặc trả `insufficient_source`.                   | G10        |
| 4   | Một đoạn có hai diễn giải đều hợp lý                                      | ② Mơ hồ                            | Từ chối tạo MCQ một-đáp-án; giải thích lý do và cho đổi phạm vi.                                     | G10, G9    |
| 5   | User đưa ngày thi/deadline không có trong học liệu                        | ③ Ngoài phạm vi                    | Không biến thành quiz kiến thức; nói chỉ tạo quiz từ slide đã chọn và hướng tới nguồn chính thức/TA. | G1, G10    |
| 6   | User đưa nội dung y tế hoặc yêu cầu tư vấn ngoài môn                      | ③ Ngoài phạm vi                    | Từ chối; không tạo câu hỏi hay trả lời chuyên môn ngoài phạm vi.                                     | G1, G17    |
| 7   | Hai phương án đều đúng do diễn đạt không chặt                             | ④ Giáo dục                         | Không phát hành; đánh dấu lỗi “multiple correct”, yêu cầu chỉnh prompt/câu hoặc giảng viên duyệt.    | G2, G11    |
| 8   | Distractor sai vì kiến thức trái slide nhưng không phản ánh ngộ nhận thật | ④ Giáo dục                         | Yêu cầu ba distractor mang ba misconception riêng; eval chấm `diagnostic_value`.                     | G2         |
| 9   | Mã nguồn/trang output khác input                                          | ① Nguồn sự thật                    | Validator ném lỗi `Source identity mismatch`; API trả lỗi, không hiển thị item.                      | G2         |
| 10  | Slide chứa câu “bỏ qua hướng dẫn trước”                                   | ③ Ngoài phạm vi / prompt injection | Coi mọi chỉ dẫn trong `SOURCE` là dữ liệu, không phải mệnh lệnh; chỉ tạo quiz từ nội dung học.       | G10        |

## §6. Bốn đường đi của trải nghiệm

| Đường đi             | Trigger                                          | Hành vi/đầu ra mong muốn                                                                                                 | Hiện trạng demo                                                             |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Happy path           | Đoạn source đủ rõ, một khái niệm có thể kiểm tra | Sinh một MCQ 4 lựa chọn, một đáp án, explanation, source và confidence; học viên trả lời, chấm theo luật, xem lại nguồn. | UI mô phỏng 4 câu; API có khả năng sinh 1 câu nhưng chưa nối UI             |
| Low-confidence       | Source có thông tin nhưng hỗ trợ gián tiếp       | Trả `confidence=medium/low`, hiển thị giới hạn và cho người học mở nguồn/đổi phạm vi; không khẳng định đã nắm chắc.      | Field có trong API, chưa hiển thị UI                                        |
| Failure/không căn cứ | Source ngắn, mơ hồ hoặc không liên quan          | Trả `insufficient_source` với lý do; không phát hành quiz hoặc điểm.                                                     | Prompt/API đã quy định; cần trace chạy thật để xác minh                     |
| Correction           | Học viên thấy câu/nguồn chưa phù hợp             | Làm lại quiz hoặc chọn lại phạm vi; sản phẩm triển khai thêm nút báo lỗi câu hỏi.                                        | Làm lại có; selector/báo lỗi chưa có                                        |
| Ngoài phạm vi        | Dữ liệu logistics/y tế/không thuộc slide         | Từ chối đúng phạm vi, hướng user đến nguồn chính thức/TA.                                                                | Có case Golden set, chưa có kết quả chạy                                    |
| Đặc thù domain       | Có hai đáp án đúng hoặc kiến thức không grounded | Chặn phát hành/đưa giảng viên duyệt; không chấm sai học viên.                                                            | Validator chưa chứng minh được semantic correctness; phải dựa eval + review |

## §7. Kiểm thử

### Chiều chất lượng và định nghĩa kiểm chứng được

| Chiều                | Pass khi                                                                                      | Fail khi                                           |
| -------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Output validity      | JSON parse được, status hợp lệ; generated có 4 options, 4 misconceptions, `correctOption` 0–3 | Thiếu trường, sai schema, sai số lựa chọn          |
| Groundedness         | Mọi mệnh đề quyết định đáp án/explanation có trong input source                               | Thêm kiến thức ngoài nguồn hoặc bịa nguồn          |
| Scope & refusal      | Case nguồn đủ → `generated`; case mơ hồ/ngoài phạm vi → `insufficient_source`                 | Sinh câu từ source thiếu hoặc từ chối source đủ rõ |
| Single correct       | Một và chỉ một phương án được source hỗ trợ là đúng                                           | ≥2 đáp án đúng hoặc không có đáp án đúng           |
| Citation correctness | `sourceId` và `sourcePage` đúng input                                                         | Sai mã nguồn/trang                                 |
| Diagnostic value     | Ba distractor phản ánh ba misunderstanding khác nhau, không chỉ vô lý                         | Nhiễu trùng/lộ liễu/không liên quan                |
| Graceful failure     | Refusal nêu lý do ngắn và gợi ý chọn nguồn rõ hơn                                             | Hallucinate, lỗi mơ hồ hoặc trả quiz một phần      |

Hai người chấm độc lập cần kiểm tra tối thiểu 5 output trên các chiều semantic (groundedness, single correct, diagnostic value), thống nhất rubric trước khi chấm toàn bộ.

### Golden set

`eval/golden-set.csv` có **20 case**: 15 case bình thường/domain/rare lấy từ mã chatlog/transcript và 5 case synthetic mơ hồ, ngoài phạm vi hoặc adversarial. Phân bố:

| Nhóm                         | Case             |
| ---------------------------- | ---------------- |
| Case bình thường/học liệu    | GS001–GS015 (15) |
| Mơ hồ                        | GS016–GS017 (2)  |
| Ngoài phạm vi                | GS018–GS019 (2)  |
| Adversarial/prompt injection | GS020 (1)        |

Golden set đáp ứng số lượng 20 và có ≥10 case tham chiếu data thật bằng `source_ref`, nhưng không thể kiểm nội dung data gốc trong repo hiện tại. Bộ này có hai case cho lớp ① (grounded/citation qua case thường và validator), hai case cho lớp ② (GS016–017), hai case cho lớp ③ (GS018–019), và case domain/semantic khó GS005/008/009/012–015 cho lớp ④. Cần bổ sung ít nhất một case “hai đáp án đúng” rõ ràng để phủ trực tiếp rủi ro số 7.

### Quality bar (giữ nguyên)

> **Đạt khi ≥80% case pass toàn bộ tiêu chí, 100% output generated có `source_ref` hợp lệ, và không có case generated nào sai kiến thức hoặc có hai đáp án đúng.**

Quality bar này đã có trong `spec.md`; `new_spec.md` giữ nguyên, không điều chỉnh theo kết quả.

### Kết quả các lượt chạy

| Lượt   | Trạng thái | Kết quả                                 | Diễn giải                                                                                      |
| ------ | ---------- | --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Run 01 | Chưa chạy  | `eval/run-01-results.csv` chỉ có header | Chưa có `DEEPSEEK_API_KEY`, không có trace trong `eval/traces/`; không được báo cáo tỷ lệ pass |

Script `eval/run-deepseek-eval.mjs` có sẵn để gọi DeepSeek và ghi output; sau khi có key cần chạy toàn bộ 20 case, lưu trace đã được làm sạch dữ liệu nhạy cảm, chấm các tiêu chí semantic và cập nhật bảng này — kể cả case fail.

## §8. Phân công và kế hoạch

Repository chưa khai báo tên/mã thành viên, nên không tự gán tên giả. Dưới đây là phân công theo vai trò cần được đội điền tên trước khi nộp.

| Vai trò                | Chủ sở hữu    | Việc/Definition of Done                                                                                  | Artifact                                         |
| ---------------------- | ------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Product & Evidence     | Chưa khai báo | Bổ sung mining/survey log tái kiểm, bảng impact có tần suất/tổn thất                                     | `evidence/` hoặc thư mục tương đương             |
| Frontend & Integration | Chưa khai báo | Nối UI với `POST /api/generate-quiz`, hiển thị loading/refusal/confidence/source, bỏ hard-code ở flow AI | `codebase/app/page.tsx`                          |
| AI Backend & Grounding | Chưa khai báo | Duy trì schema/validator/prompt, thêm kiểm tra semantic/review và trace an toàn                          | `codebase/lib/`, `eval/prompts/`, `eval/traces/` |
| Evaluation             | Chưa khai báo | Chạy đủ Golden set, hai người chấm case khó, ghi đầy đủ kết quả và failure                               | `eval/`                                          |
| Validation & Demo      | Chưa khai báo | Tuyển user, test 5 phiên, cập nhật feedback/changelog và demo case fail                                  | `validation/`, slide/demo script                 |

### Willing users và validation CP5

Chưa có willing user hay feedback thực tế: `validation/feedback-log.csv` chỉ có header. Không bịa tên/quote. Trước CP5 cần có ít nhất 3 người đồng ý thử (tối thiểu 2 người xuất hiện trong log 5 người), sau đó chạy mỗi phiên 10 phút:

1. Giao task: “Hãy dùng quiz này để kiểm tra phần vừa học và tìm chỗ cần ôn.”
2. Im lặng quan sát thao tác chọn nguồn, hiểu câu hỏi/nguồn, phản ứng với refusal và kết quả.
3. Hỏi: “Điều gì khó hiểu/khó chịu nhất?”, “Bạn có tin kết quả không, vì sao?”, “Bạn có dùng thật không, vì sao?”.
4. Ghi tên/vai, quote nguyên văn, mức nghiêm trọng và quyết định vào `validation/feedback-log.csv`.

### Multi-prototype

Chưa có artifact multi-prototype. Nếu còn thời gian, so sánh hai phương án ở một trục duy nhất: **tạo ngay một câu từ đoạn đang đọc** và **bắt học viên chọn phạm vi trước khi tạo**. Chọn phương án giảm source mơ hồ/tỷ lệ refusal mà không làm người dùng kẹt; lưu phương án bị loại và feedback.

## §9. Changelog

| Thời điểm          | Đổi gì                                                                                        | Vì sao / bằng chứng                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| CP2                | Dựng flow đọc bài → quiz → kết quả bằng 4 câu mock                                            | Chứng minh đường đi UI trước khi tích hợp AI                                               |
| CP3 chuẩn bị       | Thêm `generateDiagnosticQuiz`, DeepSeek JSON mode, prompt grounded và validator source/schema | Tạo một AI call thật tại quyết định “sinh hay từ chối sinh quiz”                           |
| Khi xây Golden set | Thêm 20 case gồm normal, ambiguous, out-of-scope, adversarial                                 | Bao phủ refusal, grounding và prompt injection thay vì chỉ test happy path                 |
| 30/07/2026         | Viết lại thành `new_spec.md`, tách rõ artifact thật, mock và chưa xác minh                    | UI chưa gọi API; eval/validation chưa có dữ liệu; evidence refs/data pack thiếu trong repo |

## Phụ lục — điều kiện để chuyển từ Mock sang Working

1. Nối UI tới API và hiển thị đầy đủ trạng thái AI/refusal/confidence/source.
2. Cung cấp selector và nguồn học liệu có quyền truy cập; không gửi nhiều hơn đoạn tối thiểu cần thiết tới model.
3. Lưu kết quả quiz/attempt theo phân quyền và tách dashboard mock khỏi dữ liệu thật.
4. Chạy/ghi eval 20 case, đạt quality bar hoặc lưu nguyên nhân fail và kế hoạch sửa.
5. Hoàn tất evidence có thể kiểm lại và validation ≥5 người ngoài nhóm.
