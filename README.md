# Computer Engineering Portfolio

พอร์ตโฟลิโอ React + TypeScript + Vite ในแนว Clean Editorial หน้าแรกเป็น Interactive Editorial Index ที่เปิดหน้าแยก 5 หัวข้อ รองรับภาษาไทยและอังกฤษ

## เปิดดูในเครื่อง

บน Windows ดับเบิลคลิก `start.cmd` เพื่อเริ่มเซิร์ฟเวอร์และเปิดเบราว์เซอร์ที่ `http://localhost:5173` ปิดหน้าต่างเซิร์ฟเวอร์เมื่อต้องการหยุด

หรือใช้คำสั่งมาตรฐานเมื่อมี pnpm:

```sh
pnpm install
pnpm dev
```

โปรเจกต์นี้ติดตั้ง pnpm แบบเฉพาะโฟลเดอร์ไว้ใน `.tools` ด้วย หากเครื่องไม่มีคำสั่ง pnpm สามารถใช้:

```sh
node .tools/node_modules/pnpm/bin/pnpm.mjs dev
```

## หน้าที่มี

- `/` หน้าปกและสารบัญโต้ตอบ About / Skills / Projects / Resume / Contact
- `/about` แนะนำตัว ความสนใจ เป้าหมาย และการศึกษา
- `/skills` ทักษะแบ่งตามหมวด
- `/projects` แสดงโปรเจกต์แบบ Case Study Flip Stack ตามการเลื่อน
- `/projects/:id` รายละเอียดแต่ละโปรเจกต์
- `/resume` ปุ่มดาวน์โหลด Resume PDF ตามภาษาที่เลือก
- `/contact` ช่องทางติดต่อ คัดลอกอีเมล และฟอร์มเปิดร่างในแอปอีเมล

หน้ารายละเอียดมีเมนูหัวข้อ ปุ่มก่อนหน้า/ถัดไป และปุ่มกลับหน้าหลัก ภาษาเลือกได้ทุกหน้าและจำด้วย localStorage รองรับมือถือ คีย์บอร์ด และการตั้งค่าลดแอนิเมชัน สารบัญหน้าแรกเปลี่ยน preview เมื่อ hover หรือ focus และใช้ปุ่มลูกศรเลื่อนระหว่างหัวข้อได้

## ใส่ข้อมูลส่วนตัว

แก้ข้อมูลที่ `src/content/portfolio.json` ข้อความทุกชุดมี `th` และ `en`:

- `name`, `role`, `tagline`, `bio`, `goal`: ชื่อและเรื่องราวของคุณ
- `portrait`: พาธรูป เช่น `/images/portrait.jpg` แล้ววางไฟล์ใน `public/images/`
- `education`: มหาวิทยาลัย สาขา ชั้นปี GPA และวิชาที่เกี่ยวข้อง
- `interests`, `skills`: ความสนใจและทักษะจริง
- `projects`: ผลงานจริง แต่ละโปรเจกต์มี id ไม่ซ้ำกัน บทบาท หน้าที่ เทคโนโลยี และผลลัพธ์
- `projects[].sourceUrl`, `projects[].demoUrl`: URL จริง หรือ `null` เมื่อยังไม่มี
- `email`, `github`, `linkedin`, `otherContacts`: ช่องทางติดต่อจริง
- `resume`: พาธ PDF ภาษาไทยและอังกฤษ
- `isDemo`: เปลี่ยนเป็น `false` เมื่อแทนที่ข้อมูลตัวอย่างด้วยข้อมูลจริงครบแล้ว

โครงสร้างข้อความและทักษะปัจจุบันเป็น **ข้อมูลตัวอย่าง** ไม่มีการอ้างว่าเป็นผลงานหรือประสบการณ์จริงของเจ้าของพอร์ต ฟอนต์และภาพประกอบ UI อยู่ในโปรเจกต์ ไม่ต้องเรียกบริการภาพภายนอก

## Resume

PDF ตัวอย่างทั้งสองภาษามีอยู่แล้วใน `public/resume/` สามารถแทนที่ด้วย Resume จริงในชื่อไฟล์เดิมได้ทันที

หากต้องการสร้างเอกสารจากข้อมูลใน JSON ใหม่:

```sh
pnpm resume
```

ฟอนต์ Noto Sans Thai และใบอนุญาต OFL อยู่ใน `public/fonts/` หากฟอนต์ถูกลบ ให้รัน `node scripts/generate-resumes.mjs --fetch-fonts` เพียงครั้งเดียวเพื่อดาวน์โหลดใหม่

หน้า Resume แสดงเฉพาะปุ่มดาวน์โหลด PDF ไม่มีหน้าพรีวิว สามารถนำ Resume จริงมาแทนไฟล์เดิมได้ทันทีโดยไม่ต้องแก้หน้าเว็บ

## การติดต่อ

ฟอร์มตรวจสอบชื่อ อีเมล หัวข้อ และข้อความ ก่อนเปิดร่าง `mailto:` ในแอปอีเมลของผู้ชม ผู้ชมเป็นผู้กดส่งเอง ไม่มีระบบส่งอีเมลจากเซิร์ฟเวอร์ และไม่เก็บข้อความไว้ภายนอก หาก `email` ยังเป็น `null` จะแสดงข้อความว่ารอเพิ่มผู้รับแทนการอ้างว่าส่งสำเร็จ

## ตรวจสอบและ build

```sh
pnpm check
pnpm build
pnpm test:e2e
```

ชุดทดสอบตรวจการนำทางจริง ภาษาและการจำค่า Flip Stack ดาวน์โหลดไฟล์ PDF ฟอร์ม การใช้คีย์บอร์ด และหน้าจอเล็ก ใช้ Google Chrome ที่ติดตั้งในเครื่อง สามารถกำหนดพาธเบราว์เซอร์อื่นผ่าน `PORTFOLIO_BROWSER`

ไฟล์สำหรับเผยแพร่อยู่ใน `dist/` โปรเจกต์ใช้ BrowserRouter โฮสต์ต้องส่งเส้นทางหน้าเว็บกลับไป `index.html` มี `public/_redirects` สำหรับ Netlify/Cloudflare Pages และ `vercel.json` สำหรับ Vercel เตรียมไว้แล้ว ยังไม่ได้เผยแพร่หรือเชื่อมต่อบัญชีโฮสติ้ง

## คอมโพเนนต์และการออกแบบ

Case Study Flip Stack ติดตั้งจาก [Componentry](https://componentry.dev/docs/components/case-study-flip-stack) แล้วปรับให้การ์ดแต่ละใบเชื่อมไปยังหน้ารายละเอียดโปรเจกต์:

```sh
pnpm dlx shadcn@latest add @componentry/case-study-flip-stack
```

หน้าแรกอยู่ใน `src/pages/Home.tsx` และใช้สารบัญที่เขียนเฉพาะเว็บนี้แทนการ์ดสำเร็จรูป การจัดวางและ motion เพิ่มเติมอยู่ใน `src/editorial.css` ส่วน `src/components/ui/case-study-flip-stack.tsx` ใช้ในหน้า Projects เท่านั้น

ภาพชั่วคราวของโปรเจกต์อยู่ใน `public/project-placeholders/` และสามารถแทนที่ด้วย screenshot จริงได้ สีและระยะหลักของแนว Editorial อยู่ใน `src/editorial.css` ข้อความระบบทั้งสองภาษาอยู่ใน `src/lib/i18n.tsx`
