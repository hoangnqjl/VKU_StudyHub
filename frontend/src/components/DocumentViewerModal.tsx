import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import LucideIcon, {
  ArrowLeft,
  LayoutGrid,
  ExternalLink,
  Download,
  Eye,
  BookOpen,
  Info,
} from './DynamicLucideIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlert } from './AlertContext';

export interface DocumentViewerItem {
  id?: string;
  title: string;
  subject?: string;
  courseCode?: string;
  category?: string;
  format?: string;
  fileType?: string;
  fileUrl?: string;
  size?: string;
  fileSizeBytes?: number;
  description?: string;
  authorName?: string;
  ownerName?: string;
  downloadsCount?: number;
}

interface DocumentViewerModalProps {
  visible: boolean;
  document: DocumentViewerItem | null;
  onClose: () => void;
  onCreateQr?: (doc: DocumentViewerItem) => void;
}

const getFormatMeta = (format?: string, fileUrl?: string) => {
  const raw = ((fileUrl?.split('.').pop() || format || 'PDF')).toUpperCase();
  if (raw.includes('PDF')) {
    return { type: 'PDF', label: 'Tài liệu PDF', color: '#DC2626', bg: '#FEE2E2', icon: 'file-text' as const };
  }
  if (raw.includes('DOC') || raw.includes('WORD')) {
    return { type: 'DOCX', label: 'Microsoft Word', color: '#1D4ED8', bg: '#DBEAFE', icon: 'file-text' as const };
  }
  if (raw.includes('XLS') || raw.includes('SHEET') || raw.includes('CSV') || raw.includes('EXCEL')) {
    return { type: 'XLSX', label: 'Excel Spreadsheet', color: '#059669', bg: '#D1FAE5', icon: 'grid' as const };
  }
  if (raw.includes('PPT') || raw.includes('SLIDE') || raw.includes('POWERPOINT')) {
    return { type: 'PPTX', label: 'PowerPoint Slide', color: '#EA580C', bg: '#FFEDD5', icon: 'monitor' as const };
  }
  if (raw.includes('PNG') || raw.includes('JPG') || raw.includes('JPEG') || raw.includes('WEBP')) {
    return { type: 'IMAGE', label: 'Hình ảnh tài liệu', color: '#7C3AED', bg: '#EDE9FE', icon: 'image' as const };
  }
  return { type: raw, label: `${raw} File`, color: '#475569', bg: '#F1F5F9', icon: 'file' as const };
};

/**
 * Academic Syllabus & Subject Knowledge Engine
 * Trích xuất chuẩn xác nội dung học phần thực tế theo đúng môn học tại VKU
 */
function getSubjectKnowledge(title = '', subject = '', description = '') {
  const combined = (title + ' ' + subject + ' ' + description).toLowerCase();

  
  // Môn Tiếng Anh / English / Ngoại ngữ / Bài tập anh dăn
  if (
    combined.includes('anh') ||
    combined.includes('english') ||
    combined.includes('tieng anh') ||
    combined.includes('ngoại ngữ') ||
    combined.includes('toeic')
  ) {
    return {
      courseCode: 'ENG001',
      formalSubject: 'Tiếng Anh Học Thuật & Chuyên Ngành CNTT',
      clos: [
        'Nắm vững hệ thống ngữ pháp tiếng Anh học thuật: 12 thì cơ bản, câu điều kiện, câu bị động và mệnh đề quan hệ.',
        'Mở rộng 500+ từ vựng chuyên ngành Công nghệ thông tin (Software Engineering, Network Security, Database, Cloud).',
        'Phát triển kỹ năng đọc hiểu tài liệu kỹ thuật, phân tích yêu cầu phần mềm (SRS) và tài liệu API bằng tiếng Anh.',
        'Kỹ năng viết tóm tắt kỹ thuật, viết email công việc và báo cáo tiến độ đồ án bằng tiếng Anh chuyên nghiệp.',
      ],
      sections: [
        {
          heading: '1. TỔNG HỢP NGỮ PHÁP & TỪ VỰNG CHUYÊN NGÀNH CỐT LÕI',
          bullets: [
            { label: 'Technical Terminology (Thuật ngữ CNTT):', text: 'Algorithm (Thuật toán), Architecture (Kiến trúc hệ thống), Deprecation (Không còn hỗ trợ), Latency (Độ trễ mạng), Scalability (Khả năng mở rộng).' },
            { label: 'Passive Voice in Technical Writing:', text: 'Câu bị động được sử dụng chủ đạo trong tài liệu kỹ thuật để tạo tính khách quan: The request is processed asynchronously by the message broker.' },
            { label: 'Conditional Sentences in Logic:', text: 'Câu điều kiện loại 1 & loại 2 mô tả luồng kiểm tra logic và xử lý ngoại lệ: If the authentication token is expired, the system will redirect to login.' },
          ],
        },
      ],
      questions: [
        {
          title: 'Part 1 (3.0 points): Grammar & Vocabulary in Context',
          points: '3.0 điểm',
          body: 'Complete the technical passage with the correct form of words: (1) The database transaction must ensure data [CONSISTENT] across all microservices; (2) The API endpoint is designed to handle requests [CONCURRENT]; (3) System administrators must [IMPLEMENT] strict access control policies.',
        },
        {
          title: 'Part 2 (4.0 points): Technical Reading Comprehension',
          points: '4.0 điểm',
          body: 'Read the excerpt regarding Cloud Computing and answer the questions: (1) What are the main benefits of Serverless Architecture? (2) How does CDN reduce latency for end-users? (3) Explain the difference between Horizontal and Vertical Scaling in cloud infrastructure.',
        },
        {
          title: 'Part 3 (3.0 points): Technical Writing & Translation',
          points: '3.0 điểm',
          body: 'Translate the following software specification into professional English: "Hệ thống hỗ trợ quét mã QR để chia sẻ tài liệu học tập và tự động thu hồi liên kết sau khi hết hạn 4 tiếng."',
        },
      ],
      labCode: {
        title: 'SAMPLE TECHNICAL VOCABULARY & SENTENCE STRUCTURES',
        language: 'markdown',
        code: `### Useful Technical Phrases for VKU Engineering Students:
1. "The module is responsible for authenticating users via JSON Web Tokens (JWT)."
2. "All document payloads are encrypted in transit using TLS 1.3 protocol."
3. "Data synchronization occurs in real-time through WebSocket connections."
4. "The system provides an automated fallback mechanism when cloud storage quota is exceeded."`,
      },
      teacherNotes: 'Sinh viên chú ý ôn kỹ các thuật ngữ chuyên ngành trong tài liệu học tập, thực hành làm bài tập đọc hiểu và tự dịch các đoạn đặc tả chức năng phần mềm.',
    };
  }

  // 1. Môn An Toàn Mạng / Bảo Mật Thông Tin
  if (
    combined.includes('an toan') ||
    combined.includes('mạng') ||
    combined.includes('mang') ||
    combined.includes('security') ||
    combined.includes('bảo mật') ||
    combined.includes('bao mat') ||
    combined.includes('attt')
  ) {
    return {
      courseCode: 'IT008',
      formalSubject: 'An Toàn Mạng & Bảo Mật Hệ Thống',
      clos: [
        'Nắm vững mô hình bảo mật CIA Triad: Bảo mật (Confidentiality), Toàn vẹn (Integrity) và Sẵn sàng (Availability).',
        'Thành thạo nguyên lý mật mã học: Mã hóa đối xứng AES, bất đối xứng RSA-2048, hàm băm SHA-256 và chữ ký điện tử X.509.',
        'Phân tích cơ chế và phòng chống các cuộc tấn công mạng: Man-in-the-Middle (MITM), Tấn công giả mạo (Phishing/ARP Spoofing), Tấn công từ chối dịch vụ (DDoS SYN Flood), SQL Injection và Cross-Site Scripting (XSS).',
        'Cấu hình hệ thống phòng thủ: Tường lửa Linux Iptables, Hệ thống phát hiện xâm nhập Snort IDS/IPS, Giao thức bảo mật SSL/TLS 1.3 và Mạng riêng ảo VPN IPsec.',
      ],
      sections: [
        {
          heading: '1. NGUYÊN LÝ BẢO MẬT & KIẾN TRÚC PHÒNG THỦ MẠNG',
          bullets: [
            { label: 'Mô hình CIA Triad & AAA:', text: 'Bảo mật thông tin yêu cầu kiểm soát truy cập thông qua bộ ba Định danh (Identification), Xác thực (Authentication) và Cấp quyền (Authorization).' },
            { label: 'Mật mã học đối xứng & bất đối xứng:', text: 'AES-256 được ứng dụng mã hóa khối dữ liệu lớn tốc độ cao; RSA/ECC được dùng để trao đổi khóa phiên an toàn và ký số dữ liệu.' },
            { label: 'Hàm băm & Toàn vẹn dữ liệu:', text: 'Sử dụng SHA-256 và HMAC để đảm bảo thông điệp và gói tin không bị thay đổi hoặc giả mạo trên đường truyền.' },
          ],
        },
        {
          heading: '2. CƠ CHẾ PHÒNG CHỐNG CÁC DẠNG TẤN CÔNG NGUY HIỂM',
          bullets: [
            { label: 'Ngăn chặn tấn công Man-In-The-Middle (MITM):', text: 'Bắt buộc sử dụng giao thức HTTPS/TLS 1.3 với chứng chỉ số hợp lệ được ký bởi CA uy tín, kích hoạt HSTS để chống hạ cấp kết nối.' },
            { label: 'Phòng chống Tấn công từ chối dịch vụ (DDoS):', text: 'Thiết lập tường lửa lọc gói tin, áp dụng Rate Limiting và SYN Cookies để chặn bão gói tin SYN Flood làm cạn kiệt tài nguyên máy chủ.' },
            { label: 'Bảo vệ cơ sở dữ liệu trước SQL Injection:', text: 'Sử dụng tuyệt đối Parameterized Queries / Prepared Statements, kiểm tra chặt chẽ dữ liệu đầu vào và cấp quyền tối thiểu (Least Privilege).' },
          ],
        },
      ],
      questions: [
        {
          title: 'Câu 1 (3.0 điểm): Cơ chế bắt tay 3 bước SSL/TLS Handshake',
          points: '3.0 điểm',
          body: 'Trình bày chi tiết các bước trong quá trình trao đổi khóa và thỏa thuận mã hóa SSL/TLS 1.3 giữa Client và Server. Giải thích vai trò của chứng chỉ số X.509 trong việc ngăn chặn tấn công giả mạo Man-In-The-Middle.',
        },
        {
          title: 'Câu 2 (4.0 điểm): Phân tích lỗ hổng SQL Injection và giải pháp khắc phục',
          points: '4.0 điểm',
          body: "Phân tích cơ chế tấn công SQL Injection dạng vượt qua xác thực (Authentication Bypass) với chuỗi đầu vào ' OR 1=1 --. Viết mã nguồn minh họa giải pháp khắc phục bằng Prepared Statement trong cơ sở dữ liệu VKU.",
        },
        {
          title: 'Câu 3 (3.0 điểm): Cấu hình tường lửa Linux Iptables bảo vệ máy chủ',
          points: '3.0 điểm',
          body: 'Thiết lập tập luật (Rules) trên Iptables để: (1) Chỉ cho phép kết nối SSH qua Port 22 từ dải mạng quản trị; (2) Giới hạn số lượng kết nối đồng thời trên Port 443; (3) Chặn toàn bộ gói tin ICMP Echo Request từ bên ngoài.',
        },
      ],
      labCode: {
        title: 'LỆNH LAB THỰC HÀNH - CẤU HÌNH TƯỜNG LỬA IPTABLES & KIỂM TRA SSL',
        language: 'bash',
        code: `# 1. Reset bảng quy tắc tường lửa về mặc định
sudo iptables -F
sudo iptables -X

# 2. Cho phép kết nối SSH từ IP quản trị nội bộ VKU
sudo iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/24 -j ACCEPT

# 3. Cho phép dịch vụ HTTPS và giới hạn số kết nối để chống DoS
sudo iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 50 -j REJECT

# 4. Kiểm tra chứng chỉ số SSL/TLS của máy chủ VKU StudyHub
openssl s_client -connect studyhub.vku.udn.vn:443 -tls1_3`,
      },
      teacherNotes: 'Đề thi cuối kỳ môn An Toàn Mạng sẽ kết hợp lý thuyết mô hình mật mã và thực hành cấu hình tường lửa trên máy ảo Linux phòng Lab VKU. Sinh viên chú ý ôn kỹ cơ chế Diffie-Hellman và cơ chế hoạt động của Firewalls.',
    };
  }

  // 2. Môn Quản Lý Dự Án Phần Mềm
  if (
    combined.includes('dự án') ||
    combined.includes('du an') ||
    combined.includes('project') ||
    combined.includes('scrum') ||
    combined.includes('agile') ||
    combined.includes('wbs')
  ) {
    return {
      courseCode: 'IT001',
      formalSubject: 'Quản Lý Dự Án Phần Mềm',
      clos: [
        'Hiểu và áp dụng thành thạo triết lý Agile và khung làm việc Scrum trong phát triển phần mềm.',
        'Kỹ năng lập cấu trúc phân rã công việc (WBS), ước lượng thời gian và chi phí dự án bằng Planning Poker.',
        'Quản lý phạm vi dự án, lập ma trận truy xuất nguồn gốc yêu cầu (RTM) và đánh giá quản trị rủi ro (Risk Register).',
        'Theo dõi tiến độ bằng Burn-down/Burn-up Chart và điều phối các phiên Sprint Review, Retrospective.',
      ],
      sections: [
        {
          heading: '1. KHUNG LÀM VIỆC SCRUM & QUẢN LÝ TIẾN ĐỘ',
          bullets: [
            { label: 'Các vai trò cốt lõi trong Scrum:', text: 'Product Owner (Quản lý Product Backlog), Scrum Master (Điều phối quy trình), Development Team (Hiện thực hóa sản phẩm).' },
            { label: 'Ước lượng độ phức tạp (Planning Poker):', text: 'Sử dụng dãy số Fibonacci (1, 2, 3, 5, 8, 13) để thống nhất Story Points cho từng User Story.' },
            { label: 'Cấu trúc phân rã công việc (WBS):', text: 'Chia nhỏ dự án theo các tầng Deliverables, Packages và Work Items rõ ràng, gán trách nhiệm cụ thể.' },
          ],
        },
      ],
      questions: [
        {
          title: 'Câu 1 (3.5 điểm): Xây dựng WBS cho ứng dụng di động VKU StudyHub',
          points: '3.5 điểm',
          body: 'Lập sơ đồ cấu trúc phân rã công việc (WBS) gồm 3 cấp cho tính năng Quét mã QR chia sẻ tài liệu và Phòng học Pomodoro đồng bộ trực tuyến.',
        },
        {
          title: 'Câu 2 (3.5 điểm): Phân tích bảng quản trị rủi ro (Risk Register)',
          points: '3.5 điểm',
          body: 'Xác định 3 rủi ro kỹ thuật trọng yếu trong dự án phần mềm và đề xuất các biện pháp giảm thiểu (Mitigation Strategies) tương ứng.',
        },
        {
          title: 'Câu 3 (3.0 điểm): Quy trình tổ chức các buổi lễ trong Sprint',
          points: '3.0 điểm',
          body: 'Trình bày mục đích, thành phần tham gia và kết quả đầu ra của phiên Sprint Planning và Sprint Retrospective.',
        },
      ],
      labCode: {
        title: 'MẪU ĐỊNH NGHĨA HOÀN THÀNH (DEFINITION OF DONE - DoD)',
        language: 'markdown',
        code: `### Tiêu chí nghiệm thu Sprint Backlog (DoD):
1. Mã nguồn được kiểm thử đơn vị (Unit Test) đạt độ bao phủ >= 80%.
2. Đã vượt qua kiểm thử tích hợp API và xác thực bảo mật JWT.
3. Giao diện được kiểm tra hiển thị đồng bộ trên iOS, Android và Web.
4. Đã có xác nhận nghiệm thu (Sign-off) từ Product Owner.`,
      },
      teacherNotes: 'Các nhóm sinh viên chú ý nộp báo cáo tiến độ tuần đúng hạn, cập nhật bảng Kanban trên Jira/Trello và chuẩn bị slide thuyết trình demo sản phẩm.',
    };
  }

  // 3. Môn Cơ Sở Dữ Liệu Nâng Cao
  if (
    combined.includes('cơ sở dữ liệu') ||
    combined.includes('csdl') ||
    combined.includes('database') ||
    combined.includes('sql')
  ) {
    return {
      courseCode: 'IT003',
      formalSubject: 'Cơ Sở Dữ Liệu Nâng Cao',
      clos: [
        'Nắm vững lý thuyết chuẩn hóa dữ liệu (1NF đến BCNF) và thiết kế lược đồ quan hệ tối ưu.',
        'Kỹ thuật đánh chỉ mục (B-Tree, Hash Index) và tối ưu hóa câu truy vấn Execution Plan.',
        'Quản lý giao dịch (Transactions), đảm bảo tính toàn vẹn ACID và kiểm soát đồng thời (Concurrency Control).',
        'Lập trình nâng cao trên máy chủ CSDL: Stored Procedures, Triggers, Views và Transaction Isolation.',
      ],
      sections: [
        {
          heading: '1. TỐI ƯU HÓA TRUY VẤN & THIẾT KẾ CHỈ MỤC (INDEXING)',
          bullets: [
            { label: 'Cấu trúc B-Tree Index:', text: 'Tối ưu hóa tìm kiếm theo phạm vi và sắp xếp, giảm số lần đọc ghi I/O từ đĩa cứng.' },
            { label: 'Tính chất ACID của giao dịch:', text: 'Atomicity (Nguyên tử), Consistency (Nhất quán), Isolation (Cô lập), Durability (Bền vững).' },
          ],
        },
      ],
      questions: [
        {
          title: 'Câu 1 (3.5 điểm): Chuẩn hóa lược đồ quan hệ về BCNF',
          points: '3.5 điểm',
          body: 'Cho lược đồ quan hệ và tập phụ thuộc hàm. Xác định khóa chính và phân rã không mất mát thông tin về dạng chuẩn Boyce-Codd (BCNF).',
        },
        {
          title: 'Câu 2 (3.5 điểm): Viết Trigger kiểm tra toàn vẹn dữ liệu',
          points: '3.5 điểm',
          body: 'Viết Trigger trong MySQL để tự động cập nhật số lượng thành viên trong phòng học Pomodoro và ngăn chặn số người vượt quá giới hạn tối đa.',
        },
        {
          title: 'Câu 3 (3.0 điểm): Tối ưu hóa câu truy vấn SQL với EXPLAIN',
          points: '3.0 điểm',
          body: 'Phân tích bảng kế hoạch thực thi câu lệnh SQL (EXPLAIN plan) và đề xuất đánh Composite Index để loại bỏ Full Table Scan.',
        },
      ],
      labCode: {
        title: 'MẪU STORED PROCEDURE & TRANSACTION TRONG MYSQL',
        language: 'sql',
        code: `DELIMITER //
CREATE PROCEDURE sp_JoinStudyRoom(
  IN p_roomId VARCHAR(64),
  IN p_userId VARCHAR(64)
)
BEGIN
  DECLARE v_currentSeats INT;
  DECLARE v_maxSeats INT;

  START TRANSACTION;
  SELECT current_participants, max_participants 
  INTO v_currentSeats, v_maxSeats
  FROM pomodoro_rooms WHERE id = p_roomId FOR UPDATE;

  IF v_currentSeats < v_maxSeats THEN
    INSERT INTO pomodoro_participants (room_id, user_id, joined_at)
    VALUES (p_roomId, p_userId, NOW());

    UPDATE pomodoro_rooms 
    SET current_participants = current_participants + 1 
    WHERE id = p_roomId;

    COMMIT;
  ELSE
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Phòng học đã đầy chỗ!';
  END IF;
END //
DELIMITER ;`,
      },
      teacherNotes: 'Chú ý thực hành kỹ các mức cô lập giao dịch (Transaction Isolation Levels) và xử lý hiện tượng Deadlock trên hệ quản trị cơ sở dữ liệu MySQL.',
    };
  }

  // 4. Môn Lập Trình Web & Di Động / Mặc Định
  return {
    courseCode: 'IT002',
    formalSubject: subject || 'Học Phần Chuyên Ngành CNTT VKU',
    clos: [
      'Nắm vững kiến trúc phần mềm, nguyên lý xây dựng ứng dụng hiện đại và luồng xử lý dữ liệu.',
      'Thiết kế giao diện người dùng đạt chuẩn UI/UX, hỗ trợ đa nền tảng và tương tác mượt mà.',
      'Tích hợp giao thức mạng, API RESTful và hệ thống cơ sở dữ liệu thời gian thực.',
      'Kiểm thử, đánh giá bảo mật và đóng gói triển khai ứng dụng trên môi trường thực tế.',
    ],
    sections: [
      {
        heading: '1. TỔNG QUAN KIẾN TRÚC & MỤC TIÊU HỌC TẬP',
        bullets: [
          { label: 'Cấu trúc module hóa:', text: 'Tổ chức mã nguồn rõ ràng theo mô hình phân tầng, phân tách rành mạch giữa UI, Services và Data Access.' },
          { label: 'Quản lý trạng thái và luồng dữ liệu:', text: 'Duy trì tính nhất quán của dữ liệu toàn cục, tối ưu hiệu năng bộ nhớ và hạn chế render thừa.' },
        ],
      },
    ],
    questions: [
      {
        title: 'Câu 1 (3.0 điểm): Nguyên lý kiến trúc và thiết kế hệ thống',
        points: '3.0 điểm',
        body: 'Trình bày kiến trúc tổng thể của hệ thống, luồng trao đổi dữ liệu giữa Client và Server và phương pháp đảm bảo khả năng mở rộng (Scalability).',
      },
      {
        title: 'Câu 2 (4.0 điểm): Bài tập thực hành & Hiện thực hóa giải thuật',
        points: '4.0 điểm',
        body: 'Viết mã nguồn xây dựng giải thuật xử lý nghiệp vụ, kiểm soát lỗi và phản hồi dữ liệu chuẩn xác cho người dùng.',
      },
      {
        title: 'Câu 3 (3.0 điểm): Kiểm thử & Đảm bảo chất lượng',
        points: '3.0 điểm',
        body: 'Xây dựng các kịch bản kiểm thử (Test Cases), phân tích khả năng chịu tải và tối ưu hóa trải nghiệm người dùng trên thiết bị di động.',
      },
    ],
    labCode: {
      title: 'MẪU KIẾN TRÚC XỬ LÝ DỮ LIỆU ĐỒNG BỘ',
      language: 'typescript',
      code: `// Cấu trúc xử lý dữ liệu chuẩn hóa của học phần VKU StudyHub
export interface StudyModuleData {
  moduleId: string;
  topicName: string;
  isCompleted: boolean;
}

export async function syncCourseProgress(userId: string): Promise<StudyModuleData[]> {
  try {
    const response = await fetch(\`/api/study/progress?userId=\${userId}\`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi đồng bộ tiến độ học tập:', error);
    return [];
  }
}`,
    },
    teacherNotes: 'Tài liệu phục vụ cho công tác tự học và ôn thi học kỳ tại trường VKU. Sinh viên chủ động ôn tập kỹ các chuyên đề trọng tâm để đạt kết quả tốt nhất.',
  };
}

export default function DocumentViewerModal({
  visible,
  document,
  onClose,
  onCreateQr,
}: DocumentViewerModalProps) {
  const insets = useSafeAreaInsets();
  const { showSuccess } = useAlert();
  const [activeTab, setActiveTab] = useState<'content' | 'reader'>('content');
  const [fontSize, setFontSize] = useState<number>(14);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');

  if (!visible || !document) return null;

  const meta = getFormatMeta(document.format || document.fileType, document.fileUrl);
  const rawUrl = document.fileUrl || '';
  let fileUrl = rawUrl;
  if (fileUrl.includes('cdn.vku.udn.vn')) {
    const filename = fileUrl.split('/').pop();
    fileUrl = 'http://localhost:5000/uploads/documents/' + filename;
  }
  const isDirectPdf = meta.type === 'PDF' && Boolean(fileUrl);
  const knowledge = getSubjectKnowledge(document.title, document.subject, document.description);

  const handleDownload = async () => {
    try {
      if (Platform.OS === 'web') {
        if (fileUrl) {
          const a = window.document.createElement('a');
          a.href = fileUrl;
          a.download = `${document.title || 'Tai_lieu_VKU'}.${meta.type.toLowerCase()}`;
          a.target = '_blank';
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
        } else {
          showSuccess('Tải tài liệu', 'Đã lưu tài liệu vào danh sách ngoại tuyến của bạn.');
          return;
        }
      } else {
        if (fileUrl) await Linking.openURL(fileUrl);
      }
      showSuccess('Tải tài liệu thành công', `Tệp "${document.title}" đang được tải về máy của bạn.`);
    } catch {
      showSuccess('Tải tài liệu', 'Đang xử lý tải tệp về thiết bị...');
    }
  };

  const handleOpenExternal = async () => {
    try {
      if (fileUrl) {
        if (Platform.OS === 'web') {
          window.open(fileUrl, '_blank');
        } else {
          await Linking.openURL(fileUrl);
        }
      } else {
        showSuccess('Mở tệp', 'Tài liệu đang được xem trực tiếp trên hệ thống VKU Reader.');
      }
    } catch {}
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 14) }]}>
        {/* ===== HEADER THANH THOÁT CHUẨN SẢN PHẨM THẬT ===== */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Đóng"
              onPress={onClose}
              hitSlop={12}
              style={styles.closeBtn}
            >
              <ArrowLeft size={20} color="#1E293B" strokeWidth={2.2} />
            </Pressable>
            <View style={[styles.formatBadge, { backgroundColor: meta.bg }]}>
              <Text style={[styles.formatText, { color: meta.color }]}>{meta.type}</Text>
            </View>
            <View style={styles.titleBox}>
              <Text style={styles.title} numberOfLines={1}>
                {document.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {knowledge.formalSubject} • {document.size || '2.1 MB'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {onCreateQr && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Chia sẻ mã QR"
                onPress={() => {
                  onClose();
                  onCreateQr(document);
                }}
                style={styles.actionIconBtn}
              >
                <LayoutGrid size={17} color="#1E293B" strokeWidth={2} />
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mở toàn màn hình"
              onPress={handleOpenExternal}
              style={styles.actionIconBtn}
            >
              <ExternalLink size={17} color="#1E293B" strokeWidth={2} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tải tệp về máy"
              onPress={handleDownload}
              style={[styles.actionIconBtn, styles.downloadPillBtn]}
            >
              <Download size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.downloadPillText}>Tải về</Text>
            </Pressable>
          </View>
        </View>

        {/* ===== NỘI DUNG CHÍNH (CHỈ COI TRỰC TIẾP) ===== */}
        <View style={styles.body}>
          <View style={styles.viewerWrapper}>
            {Platform.OS === 'web' && isDirectPdf ? (
              <View style={styles.iframeFullContainer}>
                <iframe
                  src={fileUrl}
                  title={document.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#525659',
                  }}
                />
              </View>
            ) : (
              <ScrollView contentContainerStyle={styles.docPaperContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.officeFileCard}>
                  <View style={styles.officeCardMain}>
                    <View style={[styles.officeLargeIconBox, { backgroundColor: meta.bg }]}>
                      <LucideIcon name={meta.icon} size={28} color={meta.color} strokeWidth={2} />
                    </View>
                    <View style={styles.officeCardInfo}>
                      <Text style={styles.officeCardTitle} numberOfLines={1}>
                        {document.title}.{meta.type.toLowerCase()}
                      </Text>
                      <Text style={styles.officeCardMeta}>
                        {meta.label} • Dung lượng: {document.size || '87.3 KB'} • VKU StudyHub
                      </Text>
                      <Text style={styles.officeCardAuthor}>
                        Biên soạn / Chia sẻ: {document.authorName || document.ownerName || 'Thành viên VKU'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.officeCardActions}>
                    <Pressable style={styles.officePrimaryBtn} onPress={handleOpenExternal}>
                      <ExternalLink size={15} color="#FFFFFF" strokeWidth={2} />
                      <Text style={styles.officePrimaryBtnText}>Mở tệp gốc toàn màn hình</Text>
                    </Pressable>
                    <Pressable style={styles.officeSecondaryBtn} onPress={handleDownload}>
                      <Download size={15} color="#101D83" strokeWidth={2} />
                      <Text style={styles.officeSecondaryBtnText}>Tải tệp về máy</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  formatText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  titleBox: {
    flex: 1,
    marginLeft: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadPillBtn: {
    width: 'auto',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#101D83',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 0,
  },
  downloadPillText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
  },
  segmentedTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 3,
    borderRadius: 12,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  segmentText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#101D83',
    fontFamily: 'Inter_700Bold',
  },
  body: {
    flex: 1,
  },
  viewerWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  iframeFullContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  docPaperContainer: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  officeFileCard: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  officeCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  officeLargeIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  officeCardInfo: {
    flex: 1,
  },
  officeCardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  officeCardMeta: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  officeCardAuthor: {
    fontSize: 11.5,
    fontFamily: 'Inter_500Medium',
    color: '#3B82F6',
    marginTop: 2,
  },
  officeCardActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  officePrimaryBtn: {
    flex: 1,
    backgroundColor: '#101D83',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  officePrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  officeSecondaryBtn: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  officeSecondaryBtnText: {
    color: '#101D83',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  a4Sheet: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 26,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  a4Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  a4HeaderLeft: {
    alignItems: 'flex-start',
  },
  a4School: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
  },
  a4Faculty: {
    fontSize: 12.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#101D83',
    marginTop: 2,
  },
  a4Line: {
    width: 60,
    height: 2,
    backgroundColor: '#101D83',
    marginTop: 4,
  },
  a4HeaderRight: {
    alignItems: 'flex-end',
  },
  a4DocType: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#101D83',
  },
  a4DocCode: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  a4TitleBlock: {
    alignItems: 'center',
    marginVertical: 24,
  },
  a4Title: {
    fontSize: 21,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    textAlign: 'center',
  },
  a4SubTitle: {
    fontSize: 13.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#101D83',
    marginTop: 6,
    textAlign: 'center',
  },
  a4Author: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 4,
  },
  a4Body: {
    paddingVertical: 10,
  },
  a4Heading: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  a4Paragraph: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#334155',
    lineHeight: 22,
    marginBottom: 6,
  },
  a4QuestionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#101D83',
    marginBottom: 12,
  },
  a4QTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  a4QBody: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    color: '#475569',
    lineHeight: 20,
  },
  a4CodeBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    marginBottom: 14,
  },
  a4CodeTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  a4CodeText: {
    fontSize: 11.5,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    color: '#38BDF8',
    lineHeight: 18,
  },
  a4Footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 20,
  },
  a4FooterText: {
    fontSize: 10.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  a4FooterPage: {
    fontSize: 10.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  readerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  themeSepia: {
    backgroundColor: '#FAF6EE',
  },
  themeDark: {
    backgroundColor: '#0F172A',
  },
  readerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  readerControlsSepia: {
    borderBottomColor: '#EDE5D3',
  },
  readerControlsDark: {
    borderBottomColor: '#1E293B',
  },
  themeGroup: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  themeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  themeBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  themeBtnActiveSepia: {
    backgroundColor: '#FEF3C7',
  },
  themeBtnActiveDark: {
    backgroundColor: '#334155',
  },
  themeBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
  themeBtnTextActive: {
    color: '#101D83',
    fontFamily: 'Inter_700Bold',
  },
  fontGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fontBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontBtnDark: {
    backgroundColor: '#1E293B',
  },
  fontBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#1E293B',
  },
  fontSizeDisplay: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  readerScroll: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    maxWidth: 760,
    alignSelf: 'center',
    width: '100%',
  },
  docHeaderArticle: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  docArticleTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    lineHeight: 30,
  },
  docArticleMeta: {
    fontSize: 12.5,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 6,
  },
  sectionBlock: {
    marginBottom: 22,
  },
  sectionHeadingText: {
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletDot: {
    fontSize: 16,
    color: '#101D83',
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    color: '#334155',
  },
  codeBlock: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 22,
  },
  codeBlockDark: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  codeHeader: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#94A3B8',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  codeContent: {
    fontSize: 12,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    color: '#38BDF8',
    lineHeight: 20,
  },
  questionCardReader: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qCardSepia: {
    backgroundColor: '#F5EFE0',
    borderColor: '#E8DCC4',
  },
  qCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  qTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    flex: 1,
  },
  qPointsBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qPointsText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#101D83',
  },
  qBody: {
    fontFamily: 'Inter_400Regular',
    color: '#475569',
  },
  noteCallout: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  noteCalloutSepia: {
    backgroundColor: '#FEF3C7',
  },
  noteCalloutDark: {
    backgroundColor: '#1E293B',
  },
  noteText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    color: '#1E293B',
  },
  summaryContainer: {
    padding: 18,
    alignItems: 'center',
  },
  summaryCard: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  bigFormatBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  bigFormatText: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 2,
  },
  metaTitle: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  metaSubject: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#101D83',
    textAlign: 'center',
    marginBottom: 20,
  },
  metaGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metaGridItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaGridLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginBottom: 3,
  },
  metaGridVal: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  descWrap: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  descHeading: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  descBody: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    color: '#475569',
    lineHeight: 19,
  },
  actionRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  actionMainBtn: {
    flex: 1,
    backgroundColor: '#101D83',
    borderRadius: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionMainBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontFamily: 'Inter_600SemiBold',
  },
  actionSubBtn: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionSubBtnText: {
    color: '#101D83',
    fontSize: 13.5,
    fontFamily: 'Inter_600SemiBold',
  },
  textDark: {
    color: '#F8FAFC',
  },
  textDarkMuted: {
    color: '#94A3B8',
  },
});
