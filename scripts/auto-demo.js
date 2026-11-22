/**
 * Kịch bản tự động hóa ghi hình Demo VKU StudyHub bằng Playwright
 * Tự động chạy toàn bộ luồng tính năng và xuất file video demo
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Cấu hình URL demo Vercel
const TARGET_URL = process.env.DEMO_URL || 'https://vkustudyhub-frontend-1jup-8ixqm2y4y-qhoang05-techs-projects.vercel.app';
const VIDEO_DIR = path.join(__dirname, '..', 'demo-recordings');

// Tạo thư mục chứa video demo nếu chưa có
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

// Hàm hỗ trợ dừng đợi (delay)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAutoDemo() {
  console.log('🚀 Bắt đầu kịch bản tự động hóa quay Demo VKU StudyHub...');
  console.log(`🌐 Đang mở: ${TARGET_URL}`);

  // Khởi động Chromium với kích thước chuẩn màn hình điện thoại và ghi hình
  const browser = await chromium.launch({
    headless: false, // Mở giao diện thật để bạn vừa nhìn vừa theo dõi
    slowMo: 100,     // Làm chậm thao tác một chút để nhìn tự nhiên
  });

  const context = await browser.newContext({
    viewport: { width: 412, height: 892 }, // Kích thước chuẩn Mobile
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 412, height: 892 },
    },
  });

  const page = await context.newPage();

  try {
    // -------------------------------------------------------------
    // BƯỚC 1: TRANG ONBOARDING & GIỚI THIỆU TỔNG QUAN (0:00 - 0:30)
    // -------------------------------------------------------------
    console.log('📍 Bước 1: Mở màn hình Onboarding...');
    await page.goto(`${TARGET_URL}/onboarding`, { waitUntil: 'networkidle' });
    await sleep(2500);

    // Lướt qua các slide Onboarding
    console.log('👉 Chuyển Slide 2 (Kho học liệu số)...');
    const nextBtn = page.getByRole('button', { name: /tiếp tục|bắt đầu/i }).first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await sleep(2000);
      console.log('👉 Chuyển Slide 3 (Pomodoro)...');
      await page.getByRole('button', { name: /tiếp tục|bắt đầu/i }).first().click();
      await sleep(2000);
      console.log('👉 Bấm Bắt đầu ngay...');
      await page.getByRole('button', { name: /tiếp tục|bắt đầu/i }).first().click();
    } else {
      await sleep(2000);
    }

    // -------------------------------------------------------------
    // BƯỚC 2: MÀN HÌNH ĐĂNG NHẬP (0:30 - 0:55)
    // -------------------------------------------------------------
    console.log('📍 Bước 2: Trình diễn đăng nhập sinh viên VKU...');
    await page.goto(`${TARGET_URL}/login`, { waitUntil: 'networkidle' });
    await sleep(2000);

    // Điền tài khoản sinh viên mẫu
    const inputAcc = page.locator('input[placeholder*="Mã sinh viên"], input[placeholder*="email"]').first();
    const inputPwd = page.locator('input[type="password"], input[placeholder*="Mật khẩu"]').first();
    
    if (await inputAcc.isVisible()) {
      await inputAcc.fill('23ITB001');
      await sleep(1000);
      await inputPwd.fill('123456');
      await sleep(1500);
    }

    // Chuyển vào Trang chủ
    console.log('👉 Vào trang chủ...');
    await page.goto(`${TARGET_URL}/home`, { waitUntil: 'networkidle' });
    await sleep(3000);

    // Cuộn nhẹ xem các thông tin trên trang chủ
    await page.mouse.wheel(0, 300);
    await sleep(2000);
    await page.mouse.wheel(0, -300);
    await sleep(1500);

    // -------------------------------------------------------------
    // BƯỚC 3: GHÉP BÀN HỌC - STUDY RADAR (0:55 - 1:40)
    // -------------------------------------------------------------
    console.log('📍 Bước 3: Trình diễn Study Radar 2.0...');
    await page.goto(`${TARGET_URL}/radar`, { waitUntil: 'networkidle' });
    await sleep(3000);

    // Cuộn xem danh sách bạn học xung quanh
    await page.mouse.wheel(0, 350);
    await sleep(2500);
    await page.mouse.wheel(0, -350);
    await sleep(1500);

    // -------------------------------------------------------------
    // BƯỚC 4: KHO HỌC LIỆU SỐ & XEM TÀI LIỆU (1:40 - 2:30)
    // -------------------------------------------------------------
    console.log('📍 Bước 4: Mở Kho học liệu số...');
    await page.goto(`${TARGET_URL}/documents`, { waitUntil: 'networkidle' });
    await sleep(3000);

    // Click mở tài liệu đầu tiên để xem PDF viewer
    const firstDoc = page.locator('text=Hurry up').or(page.locator('text=Tài liệu')).first();
    if (await firstDoc.isVisible()) {
      console.log('👉 Mở xem chi tiết tài liệu PDF...');
      await firstDoc.click();
      await sleep(4000); // Đợi hiển thị trình đọc tài liệu

      // Đóng modal xem tài liệu (nút back)
      const closeBtn = page.getByRole('button', { name: /quay lại/i }).or(page.locator('svg')).first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await sleep(1500);
      }
    }

    // -------------------------------------------------------------
    // BƯỚC 5: PHÒNG HỌC POMODORO TRỰC TUYẾN (2:30 - 3:20)
    // -------------------------------------------------------------
    console.log('📍 Bước 5: Mở tính năng Tập trung Pomodoro...');
    await page.goto(`${TARGET_URL}/focus`, { waitUntil: 'networkidle' });
    await sleep(3000);

    // Bấm Tạo phòng học mới
    const createRoomBtn = page.locator('text=Tạo phòng').first();
    if (await createRoomBtn.isVisible()) {
      console.log('👉 Bấm Tạo phòng...');
      await createRoomBtn.click();
      await sleep(2500);

      // Nhập tên phòng
      const roomInput = page.locator('input').first();
      if (await roomInput.isVisible()) {
        await roomInput.fill('Sprint Đồ án VKU - Kỷ luật cao');
        await sleep(1500);
      }

      // Bấm nút bắt đầu mở phòng
      const startOpenBtn = page.locator('text=Bắt đầu mở phòng').first();
      if (await startOpenBtn.isVisible()) {
        await startOpenBtn.click();
        await sleep(3000);
      }
    }

    // Vào phòng Pomodoro session (Đồng hồ đếm ngược)
    console.log('👉 Vào giao diện đồng hồ Pomodoro...');
    const enterRoomBtn = page.locator('text=Tham gia phòng').or(page.locator('text=Vào phòng')).first();
    if (await enterRoomBtn.isVisible()) {
      await enterRoomBtn.click();
      await sleep(3000);
    }

    // Quay lại màn hình hồ sơ tổng kết
    console.log('📍 Bước 6: Mở màn hình Hồ sơ sinh viên...');
    await page.goto(`${TARGET_URL}/profile`, { waitUntil: 'networkidle' });
    await sleep(3000);

    console.log('✅ Hoàn thành toàn bộ kịch bản tự động demo!');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình chạy script:', error);
  } finally {
    // Đóng context để hoàn tất ghi video
    await page.close();
    await context.close();
    await browser.close();

    console.log(`🎉 Video demo đã được xuất tự động vào thư mục: ${VIDEO_DIR}`);
  }
}

runAutoDemo();
