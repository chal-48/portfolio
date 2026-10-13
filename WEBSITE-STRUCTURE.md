# โครงสร้างเว็บ Portfolio

เอกสารนี้สรุปโครงสร้างและแนวทางออกแบบจากไฟล์จริง เพื่อใช้แก้เนื้อหา รูปภาพ และฟังก์ชันต่อไป

## แนวคิดหลัก

- Portfolio ของนักศึกษาวิศวกรรมคอมพิวเตอร์ที่สนใจสาย Full Stack
- รูปแบบ Clean Editorial: เรียบ 70% และมี interaction 30%
- บุคลิกจริงจัง เป็นระเบียบ และพร้อมเรียนรู้สิ่งใหม่
- ใช้ข้อมูลส่วนตัวเท่าที่จำเป็นสำหรับนำเสนอผลงาน
- รองรับภาษาไทยและอังกฤษ มือถือ คีย์บอร์ด และ `prefers-reduced-motion`
- สีหลัก: พื้นครีมอ่อน ตัวอักษรดำ และสีส้มเป็นจุดเน้น

## แผนผังหน้า

```text
Home (/)
├── About (/about) — รวมข้อมูลการศึกษา
├── Skills (/skills)
├── Projects (/projects)
│   └── Project detail (/projects/:id)
├── Resume (/resume)
└── Contact (/contact)

เส้นทางหรือ project id ที่ไม่มี → Not Found
```

## หน้าแรก: Interactive Editorial Index

หน้าแรกออกแบบเป็นหน้าปกและสารบัญในจอเดียว ไม่มี Bento grid และไม่มี Orbit Card Stack

- แสดงชื่อ สถานะนักศึกษา สาย Full Stack และข้อความพร้อมเรียนรู้สิ่งใหม่
- มีหัวข้อหลัก 5 แถว: About, Skills, Projects, Resume และ Contact
- Hover, focus หรือปุ่มลูกศรจะเปลี่ยน preview ด้านขวา
- กดแต่ละแถวเพื่อเปิดหน้าแยก
- Preview แต่ละหัวข้อมีรูปแบบเฉพาะ:
  - About: ช่องรอรูปถ่าย
  - Skills: รายการเทคโนโลยีแบบ technical index
  - Projects: ภาพตัวอย่างสามแผ่นที่ตอบสนองกับตำแหน่งเมาส์
  - Resume: เอกสารจำลองและสัญลักษณ์ดาวน์โหลด
  - Contact: ข้อความเชิญให้เริ่มการสนทนา
- บนมือถือ preview อยู่เหนือสารบัญและปรับขนาดให้แตะใช้งานได้

ข้อความเฉพาะหน้าแรกอยู่ใน `src/pages/Home.tsx` ส่วนชื่อและข้อมูลหลักอ่านจาก `src/content/portfolio.json`

## Header และการนำทาง

- Header ติดด้านบน มีชื่อ `PORTFOLIO / 2026`
- สลับภาษา TH / EN และจำค่าไว้ใน `localStorage`
- เมนูรวม Home และหน้าเนื้อหาทั้ง 5
- หน้ารายละเอียดมีแถบสารบัญพร้อมหมายเลข `01–05`
- ทุกหน้ามีปุ่มย้อนกลับ หน้าก่อนหน้า และหน้าถัดไป
- หน้าเว็บจำตำแหน่งเลื่อนสำหรับการย้อนกลับด้วย `sessionStorage`

## About

- ชื่อ สถานะนักศึกษา และช่องรอรูปถ่าย
- ข้อความแนะนำตัวและเป้าหมาย
- มหาวิทยาลัย สาขา ช่วงเวลาศึกษา ชั้นปี GPA และวิชาที่เกี่ยวข้อง
- ความสนใจหลัก
- Education รวมอยู่ในหน้านี้

## Skills

แบ่งข้อมูลเป็น 4 หมวด:

1. Languages
2. Frameworks & Libraries
3. Databases
4. Tools & Workflow

แต่ละหมวดแสดงเป็นแถว Editorial พร้อมคำอธิบายและรายการเทคโนโลยี

## Projects

- ใช้ `CaseStudyFlipStack` จาก Componentry
- การ์ดโปรเจกต์พับขึ้นตามการเลื่อนเพื่อเปิดเรื่องถัดไป
- คลิกการ์ดเพื่อเปิด `/projects/:id`
- รองรับ 2–4 โปรเจกต์ และอ่านรายการจาก `portfolio.json`
- ภาพชั่วคราวอยู่ใน `public/project-placeholders/`
- เมื่อมีภาพจริง สามารถแทนไฟล์ placeholder หรือแก้ตัวแปร `covers` ใน `src/pages/Projects.tsx`

หน้ารายละเอียดโปรเจกต์ประกอบด้วยภาพ ชื่อ คำอธิบาย บทบาท หน้าที่ ผลลัพธ์ เทคโนโลยี และลิงก์ source/demo เมื่อมี URL จริง

## Resume

- มีหัวข้อ คำอธิบาย และปุ่มดาวน์โหลดเท่านั้น
- ไม่มีหน้าตัวอย่าง Resume
- เลือก `/resume/resume-th.pdf` หรือ `/resume/resume-en.pdf` ตามภาษาปัจจุบัน
- แทน Resume จริงใน `public/resume/` ด้วยชื่อไฟล์เดิมได้ทันที

## Contact

- รองรับ Email, GitHub, LinkedIn และ `otherContacts`
- มีปุ่มคัดลอกอีเมล
- ฟอร์มตรวจชื่อ อีเมล หัวข้อ และข้อความก่อนเปิดร่าง `mailto:`
- ไม่มี backend และไม่เก็บข้อความผู้ชม
- ช่องทางที่ยังไม่มีข้อมูลจะแสดงสถานะรอเพิ่ม

## จุดแก้ข้อมูล

ไฟล์หลักคือ `src/content/portfolio.json`

- `name`, `role`, `tagline`, `bio`, `goal`
- `portrait`
- `education`
- `interests`, `skills`
- `projects`
- `email`, `github`, `linkedin`, `otherContacts`
- `resume`
- ตั้ง `isDemo` เป็น `false` เมื่อแทนข้อมูลตัวอย่างครบแล้ว

โปรเจกต์ปัจจุบันเป็นข้อมูลตัวอย่าง Campus Companion, RoomSense และ Tiny CPU ไม่ได้อ้างว่าเป็นผลงานจริง

## ไฟล์สำคัญ

| ไฟล์/โฟลเดอร์ | หน้าที่ |
|---|---|
| `src/App.tsx` | Routes และ page transition |
| `src/pages/Home.tsx` | Interactive Editorial Index และ preview ทั้ง 5 แบบ |
| `src/pages/Projects.tsx` | Flip Stack และหน้ารายละเอียดโปรเจกต์ |
| `src/components/ui/case-study-flip-stack.tsx` | Scroll-driven project stack |
| `src/components/Layout.tsx` | Header เมนู Section tabs Footer และ scroll restoration |
| `src/content/portfolio.json` | ข้อมูลที่เจ้าของพอร์ตแก้ภายหลัง |
| `src/lib/i18n.tsx` | คำแปล UI ไทยและอังกฤษ |
| `src/editorial.css` | ดีไซน์ใหม่ หน้าแรก และ override รูปแบบหน้ารายละเอียด |
| `src/styles.css` | CSS พื้นฐานและองค์ประกอบเดิมที่หน้ารายละเอียดยังใช้ |
| `public/project-placeholders/` | ภาพตัวอย่างสำหรับรอภาพโปรเจกต์จริง |
| `public/resume/` | Resume ภาษาไทยและอังกฤษ |
| `tests/portfolio.spec.ts` | ชุดทดสอบการใช้งานจริงด้วย Playwright |

## เทคโนโลยีและ motion

- React, TypeScript และ Vite
- React Router
- Tailwind CSS และ CSS ของโปรเจกต์
- Framer Motion สำหรับ preview, page transition และ Flip Stack
- Componentry Case Study Flip Stack ซึ่งนำ source มาปรับให้เข้ากับเว็บ
- Lucide React
- Playwright

Motion มีหน้าที่ช่วยสื่อการเปลี่ยนหัวข้อและลำดับโปรเจกต์ ทุกส่วนยังใช้งานได้เมื่อผู้ชมเปิดโหมดลดการเคลื่อนไหว

## คำสั่ง

```powershell
# เปิดเว็บ
node .tools/node_modules/pnpm/bin/pnpm.mjs dev

# ตรวจ TypeScript
node .tools/node_modules/pnpm/bin/pnpm.mjs check

# Production build
node .tools/node_modules/pnpm/bin/pnpm.mjs build

# ทดสอบเดสก์ท็อปและมือถือ
node .tools/node_modules/pnpm/bin/pnpm.mjs test:e2e
```

หากติดตั้ง pnpm ในเครื่องแล้ว ใช้ `pnpm dev`, `pnpm check`, `pnpm build` และ `pnpm test:e2e` ได้โดยตรง
