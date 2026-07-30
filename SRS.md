# SRS — VLearn Quiz AI

| Thuộc tính | Nội dung |
|---|---|
| Phiên bản | 1.0 |
| Ngày | 30/07/2026 |
| Trạng thái | Baseline cho prototype |
| Phạm vi | Tính năng quiz củng cố kiến thức từ slide và dashboard chẩn đoán cho giảng viên |

## 1. Mục đích và bối cảnh

VLearn Quiz AI giúp học viên tự kiểm tra mức độ hiểu sau khi học bài, đồng thời giúp giảng viên nhận ra các chủ đề và ngộ nhận cần can thiệp. Hệ thống dùng nội dung bài giảng đã được chọn làm nguồn tạo/giải thích câu hỏi; kết quả quiz và tín hiệu hỏi Tutor được tổng hợp thành dashboard.

### 1.1 Vấn đề

Sau khi đọc slide, học viên khó biết mình đang hiểu sai phần nào. Giảng viên cũng khó phát hiện sớm ngộ nhận của cả lớp nếu chỉ dựa vào điểm tổng. Việc xem lại toàn bộ bài học tốn thời gian và không chỉ ra phần cần ôn tập.

### 1.2 Mục tiêu

- Cho học viên làm quiz ngắn theo bài/chương/điểm kiến thức đã chọn.
- Cung cấp đáp án, giải thích và vị trí nguồn để học viên tự kiểm tra.
- Đưa ra gợi ý ôn tập cá nhân dựa trên câu trả lời sai.
- Tổng hợp tỷ lệ làm bài, tỷ lệ đúng và các tín hiệu từ quiz/Tutor để giảng viên ưu tiên giảng lại.
- Đảm bảo mọi kết luận kiến thức có thể truy ngược về dữ liệu quiz và nguồn học liệu.

### 1.3 Ngoài phạm vi

- Thay thế LMS, quản lý lớp học, điểm chính thức hoặc xếp hạng học viên.
- Tự động sửa nội dung khóa học hay gửi quiz cho cả lớp mà không có giảng viên duyệt.
- Trả lời mọi câu hỏi ngoài tài liệu được chọn.
- Đánh giá năng lực tổng quát của học viên từ một quiz ngắn.
- Tích hợp đăng nhập, cơ sở dữ liệu, AI API hoặc dữ liệu lớp thật trong prototype hiện tại.

## 2. Người dùng và quyền hạn

| Vai trò | Nhu cầu chính | Quyền |
|---|---|---|
| Học viên | Kiểm tra hiểu bài, biết phần cần ôn | Chọn phạm vi, làm quiz, xem phản hồi và làm lại quiz của mình |
| Giảng viên | Phát hiện chủ đề yếu và quyết định can thiệp | Xem dashboard, AI Brief, chi tiết chủ đề và bằng chứng theo câu hỏi |
| Quản trị/nội dung (mục tiêu) | Quản lý học liệu, chính sách AI | Cấu hình nguồn, ngưỡng chất lượng và quyền truy cập |

## 3. Phạm vi sản phẩm và luồng nghiệp vụ

### 3.1 Lát cắt sản phẩm

**Một học viên, sau khi học một bài trên VLearn, làm một quiz ngắn do AI tạo từ phạm vi slide đã chọn để biết chính xác chủ đề cần ôn và mở lại nguồn liên quan.**

Lát cắt giảng viên dùng cùng dữ liệu: **một giảng viên xem dashboard để quyết định chủ đề nào cần giảng lại dựa trên tỷ lệ sai và bằng chứng truy vết.**

### 3.2 Luồng học viên

1. Học viên đăng nhập và mở bài giảng.
2. Học viên chọn phạm vi ôn tập: toàn bài, chương hoặc điểm kiến thức.
3. Hệ thống phân tích nguồn đã chọn và tạo 5–10 câu hỏi có đáp án, giải thích và trích dẫn nguồn.
4. Học viên trả lời lần lượt các câu hỏi, kiểm tra đáp án và tiếp tục.
5. Hệ thống tính điểm, chỉ ra nội dung làm tốt/cần củng cố, liệt kê câu trả lời và đề xuất trang cần xem lại.
6. Học viên có thể mở nguồn gợi ý hoặc làm lại quiz.

### 3.3 Luồng giảng viên

1. Giảng viên mở dashboard theo lớp, bài học và khoảng thời gian.
2. Hệ thống hiển thị số lượt làm, điểm trung bình, chủ đề yếu, tín hiệu từ quiz/Tutor và xu hướng.
3. Giảng viên yêu cầu AI Brief hoặc mở một chủ đề ưu tiên.
4. Hệ thống trình bày ngộ nhận, mức ảnh hưởng, gợi ý can thiệp và bằng chứng theo từng câu hỏi.
5. Giảng viên quyết định có tạo mini-quiz/can thiệp; hệ thống không tự phát hành nội dung.

## 4. Yêu cầu chức năng

| ID | Yêu cầu |
|---|---|
| FR-01 | Hệ thống phải cho phép học viên chọn toàn bài, chương hoặc điểm kiến thức trước khi tạo quiz. |
| FR-02 | Hệ thống phải chỉ sử dụng học liệu đã được cấp quyền trong phạm vi chọn làm căn cứ tạo câu hỏi và giải thích. |
| FR-03 | Mỗi câu hỏi phải có chủ đề, mức độ, các phương án, một đáp án đúng, lời giải thích và trích dẫn vị trí nguồn. |
| FR-04 | Hệ thống phải hỗ trợ quiz 5–10 câu; prototype hiện tại minh họa 4 câu cố định. |
| FR-05 | Hệ thống phải cho phép chọn một phương án, kiểm tra đáp án và chuyển câu tiếp theo; không cho chuyển tiếp khi chưa chọn đáp án. |
| FR-06 | Sau khi kiểm tra, hệ thống phải hiển thị trạng thái đúng/sai, đáp án đúng và giải thích dựa trên nguồn. |
| FR-07 | Hệ thống phải tính số câu đúng và tỷ lệ phần trăm sau khi hoàn thành quiz. |
| FR-08 | Kết quả phải nêu các chủ đề học viên làm tốt, chủ đề cần củng cố, các trang nguồn cần xem lại và cho phép làm lại quiz. |
| FR-09 | Dashboard giảng viên phải hiển thị số học viên/lượt làm quiz, điểm trung bình, số chủ đề cần giảng lại và số câu hỏi Tutor liên quan. |
| FR-10 | Dashboard phải xếp hạng chủ đề theo tỷ lệ sai và số học viên bị ảnh hưởng; chủ đề ưu tiên phải được nhận diện rõ. |
| FR-11 | Hệ thống phải cho phép mở trang chi tiết chủ đề, gồm ngộ nhận, tỷ lệ ảnh hưởng, khuyến nghị can thiệp, câu hỏi nguồn và mức độ tin cậy. |
| FR-12 | Hệ thống phải cho phép giảng viên bật/tắt AI Brief. AI Brief phải nêu nhận định, căn cứ và hành động gợi ý; chỉ giảng viên quyết định thực hiện. |
| FR-13 | Mọi chỉ số, nhận định và khuyến nghị hiển thị cho giảng viên phải kèm nguồn hoặc mô tả dữ liệu đầu vào có thể kiểm tra. |
| FR-14 | Khi không đủ căn cứ để tạo câu hỏi/kết luận, hệ thống phải thông báo giới hạn, yêu cầu chọn nguồn khác hoặc chuyển cho giảng viên; không được bịa nguồn, đáp án hay số liệu. |

## 5. Quy tắc nghiệp vụ và AI

- Quiz phục vụ tự học; điểm quiz không phải điểm học phần.
- Nguồn trích dẫn phải là trang/đoạn có trong học liệu đã chọn. Nếu không xác định được nguồn, câu hỏi không được phát hành.
- AI chỉ đề xuất nội dung và can thiệp; giảng viên duyệt trước khi nội dung được gửi cho lớp.
- Các chỉ số dashboard phải nêu rõ khoảng thời gian, mẫu số và nguồn tín hiệu (quiz hoặc Tutor).
- Một chủ đề chỉ được gắn nhãn “ưu tiên” khi có tiêu chí định lượng đã cấu hình, ví dụ tỷ lệ sai cao và đủ số lượt làm.
- Hệ thống phải phân biệt dữ liệu quan sát, suy luận của AI và khuyến nghị; không trình bày suy luận như sự thật đã xác minh.

## 6. Kịch bản ngoại lệ và rủi ro

| Nhóm | Tình huống | Hành vi yêu cầu |
|---|---|---|
| Nguồn sự thật | AI không tìm thấy nội dung hỗ trợ câu hỏi/nhận định | Không tạo/phát hành kết quả; báo “không đủ căn cứ” và đề nghị chọn lại phạm vi. |
| Mơ hồ | Học viên chọn phạm vi quá rộng hoặc không rõ | Yêu cầu chọn bài/chương/điểm kiến thức cụ thể; hiển thị phạm vi hiện dùng. |
| Ngoài phạm vi | Học viên yêu cầu giải đáp ngoài slide | Nói rõ giới hạn, gợi ý hỏi Tutor/giảng viên; không suy đoán như tài liệu chính thức. |
| Domain giáo dục | Câu hỏi có nhiều đáp án hợp lý hoặc giải thích mâu thuẫn nguồn | Gắn cờ để giảng viên/nội dung duyệt, không chấm tự động như một đáp án chắc chắn. |
| Dữ liệu ít | Một chủ đề có ít lượt làm | Hiển thị “chưa đủ dữ liệu”, không đưa kết luận mạnh hay ưu tiên giảng lại. |
| Dữ liệu cá nhân | Người không có quyền truy cập dashboard | Từ chối truy cập; chỉ trả dữ liệu theo vai trò và phạm vi lớp được cấp quyền. |
| Kỹ thuật | Tạo quiz hoặc tổng hợp AI lỗi/timeout | Thông báo lỗi có thể hiểu, giữ lựa chọn của người dùng, cho phép thử lại và không tạo kết quả một phần. |
| Phản hồi | Học viên chọn sai do nhầm thao tác | Cho phép làm lại quiz; không ghi đè lịch sử nếu sản phẩm sau này lưu attempt. |

## 7. Yêu cầu dữ liệu

### 7.1 Thực thể chính (sản phẩm mục tiêu)

| Thực thể | Thuộc tính tối thiểu |
|---|---|
| Học liệu | `material_id`, tiêu đề, phiên bản, chương/trang/đoạn, quyền sử dụng |
| Quiz | `quiz_id`, phạm vi nguồn, thời điểm tạo, trạng thái, phiên bản prompt/mô hình |
| Câu hỏi | `question_id`, chủ đề, mức độ, nội dung, phương án, đáp án, giải thích, trích dẫn nguồn |
| Lượt làm | `attempt_id`, học viên, quiz, đáp án, điểm, thời gian hoàn thành |
| Tín hiệu Tutor | chủ đề/intent, thời điểm, nguồn, mức tin cậy; không lưu nội dung nhạy cảm vượt mức cần thiết |
| Tổng hợp chủ đề | lớp, khoảng thời gian, mẫu số, tỷ lệ đúng/sai, mức tin cậy, bằng chứng |

### 7.2 Dữ liệu trong prototype

Prototype ở `prototype/app/page.tsx` dùng câu hỏi và chỉ số minh họa hard-code (4 câu, dashboard mô phỏng); chưa có đăng nhập, API AI, lưu lượt làm hoặc database. Vì vậy các con số trên giao diện không được hiểu là dữ liệu vận hành thật.

## 8. Yêu cầu phi chức năng

| ID | Yêu cầu |
|---|---|
| NFR-01 | Giao diện phải sử dụng được trên trình duyệt hiện đại, hỗ trợ luồng học viên và giảng viên trong tối đa 5 phút demo. |
| NFR-02 | Mọi câu hỏi, giải thích và AI Brief phải hiển thị nguồn/trạng thái căn cứ dễ nhận biết. |
| NFR-03 | Dữ liệu học viên phải được phân quyền theo vai trò; dashboard không được lộ danh tính cá nhân nếu không cần cho mục đích giảng dạy. |
| NFR-04 | Không commit API key hoặc data pack được cung cấp vào repository công khai; chỉ dùng dữ liệu trong phạm vi hackathon hoặc dữ liệu giả lập được phép. |
| NFR-05 | Với sản phẩm triển khai, các yêu cầu AI phải ghi log tối thiểu gồm thời điểm, phạm vi nguồn, phiên bản prompt/mô hình và trạng thái thành công/lỗi để kiểm tra. |
| NFR-06 | Nội dung AI phải dùng tiếng Việt rõ ràng, không tuyên bố chắc chắn khi mức tin cậy thấp, và có lối thoát sang giảng viên/Tutor. |
| NFR-07 | Sản phẩm triển khai cần chịu lỗi: một lỗi AI không được làm mất câu trả lời đang làm hoặc tạo điểm/kết luận sai. |

## 9. Tiêu chí nghiệm thu

| Mã | Điều kiện đạt |
|---|---|
| AC-01 | Học viên chọn được phạm vi, mở quiz, trả lời hết câu và nhận đúng điểm số theo đáp án cấu hình. |
| AC-02 | Với mỗi câu trong quiz, người kiểm thử thấy chủ đề, nguồn, trạng thái đúng/sai và giải thích sau khi kiểm tra. |
| AC-03 | Khi có câu sai, trang kết quả liệt kê được chủ đề/trang cần ôn; nút làm lại khởi tạo lượt quiz mới. |
| AC-04 | Chuyển sang vai trò giảng viên hiển thị dashboard; có thể mở AI Brief và trang chi tiết ReAct Loop. |
| AC-05 | Trang chi tiết chủ đề hiển thị ít nhất một ngộ nhận, tỷ lệ ảnh hưởng, khuyến nghị và bảng bằng chứng theo câu hỏi. |
| AC-06 | Một trường hợp không có nguồn/căn cứ hợp lệ không tạo câu hỏi hay khuyến nghị khẳng định; hệ thống hiển thị thông báo an toàn. |
| AC-07 | Prototype build thành công bằng `npm run build` trong thư mục `prototype`. |

## 10. Truy vết hiện trạng prototype

| Hạng mục | Hiện trạng |
|---|---|
| Luồng học viên | Có UI bài học, quiz 4 câu, chấm đáp án, kết quả và gợi ý ôn tập. |
| Luồng giảng viên | Có dashboard, AI Brief, chi tiết ReAct Loop và bảng bằng chứng minh họa. |
| AI tạo quiz/tổng hợp | Mock trên giao diện; chưa có lời gọi AI thật. |
| Dữ liệu và xác thực | Mock/hard-code; schema database để trống, chưa có persistence hay RBAC. |
| Dẫn nguồn | Có nhãn trang nguồn trên giao diện; chưa liên kết tới kho học liệu thật. |

## 11. Giả định và phụ thuộc

- Có kho slide/học liệu đã được phân đoạn theo bài, chương và trang, đồng thời được cấp quyền sử dụng.
- Có cơ chế đăng nhập và phân quyền để nhận diện học viên, giảng viên và lớp học.
- Có dịch vụ AI hỗ trợ truy xuất theo nguồn (RAG hoặc tương đương) và kiểm soát prompt/version.
- Ngưỡng “đủ dữ liệu”, tiêu chí ưu tiên và chính sách lưu trữ do đội ngũ học thuật xác nhận trước khi vận hành.
- Việc dùng dữ liệu chatlog/transcript phải tuân thủ quy định bảo mật của hackathon: không tái nhận diện, không chia sẻ ra ngoài và không commit data pack.

## 12. Changelog

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| 1.0 | 30/07/2026 | Khởi tạo SRS từ scope và prototype hiện có. |
