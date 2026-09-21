<div align="center">

<h1 align="center">
  <img src="https://github.com/user-attachments/assets/630d9dde-8b0a-427b-b3a7-5818138acf99" width="70" align="absmiddle" />
  Care Companion
</h1>

### แพลตฟอร์มเชื่อมโยง **ผู้ที่ต้องการผู้ช่วยร่วมเดินทาง** กับ **ผู้ให้บริการร่วมเดินทาง**
*ไปหาหมอ ไปธนาคาร ติดต่อราชการ ซื้อของ หรือทำธุระนอกบ้าน  ไม่ต้องไปคนเดียว*

<br/>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

### 🌐 [**เข้าใช้งานเว็บไซต์ (Live Demo)**](https://carecompanion-ecru.vercel.app/)

<br/>

<img width="100%" alt="Care Companion Landing Page" src="https://github.com/user-attachments/assets/68c2c4d4-1549-4da3-882b-de1a1966fd3b" />

</div>
---

## ✨ เกี่ยวกับโปรเจกต์

ปัจจุบัน **ผู้สูงอายุ ผู้ที่เดินทางคนเดียวไม่สะดวก หรือผู้ที่ต้องการความช่วยเหลือ** อาจประสบปัญหาเมื่อสมาชิกในครอบครัวไม่สามารถเดินทางไปด้วยได้ เช่น การไปพบแพทย์ตามนัด ไปโรงพยาบาล ไปธนาคาร ติดต่อหน่วยงานราชการ หรือซื้อสินค้า

**Care Companion** คือ Web Application ที่เป็น *แพลตฟอร์มกลาง* เชื่อมโยงระหว่าง

| | |
|---|---|
| 🧓 **Customer** | ผู้ที่ต้องการผู้ช่วยร่วมเดินทาง |
| 🚶 **Companion** | ผู้ให้บริการที่ช่วยเหลือและอำนวยความสะดวกในการเดินทางและการทำธุระ |

> ⚠️ **หมายเหตุสำคัญ:** Companion มีหน้าที่ *ช่วยเหลือและอำนวยความสะดวกในการเดินทางและทำธุระเท่านั้น* **ไม่ใช่** ผู้ให้บริการทางการแพทย์หรือผู้ดูแลรักษาผู้ป่วย

---

## 👥 บทบาทผู้ใช้งาน (Roles)

<table>
  <tr>
    <td align="center" width="33%">
      <h3>🧓 Customer</h3>
      <p>ผู้ต้องการผู้ช่วยร่วมเดินทาง<br/>สร้างคำขอ เลือก Companion ติดตามสถานะ และรีวิว</p>
    </td>
    <td align="center" width="33%">
      <h3>🚶 Companion</h3>
      <p>ผู้ให้บริการร่วมเดินทาง<br/>นำเสนอโปรไฟล์ รับงาน จัดการตารางเวลา และดูรีวิว</p>
    </td>
    <td align="center" width="33%">
      <h3>🛡️ Admin</h3>
      <p>ผู้ดูแลระบบ<br/>บริหารจัดการผู้ใช้ ประเภทบริการ การจอง และภาพรวมแพลตฟอร์ม</p>
    </td>
  </tr>
</table>

---

## 🚀 ฟีเจอร์หลัก

### 🌍 สำหรับทุกคน (Public)
- 🏠 **Landing Page** แนะนำแพลตฟอร์มและข้อมูลที่เหมาะสมต่อการเผยแพร่
- 🔑 **Login ด้วย Google Account** ผ่าน Supabase Authentication

### 🧓 Customer
- 📝 **สร้างคำขอใช้บริการ** ระบุประเภทธุระ วัน เวลา สถานที่ต้นทาง จุดหมาย ระยะเวลา และรายละเอียดเพิ่มเติม
- 🔍 **ค้นหาและเลือก Companion** ที่เหมาะสมกับความต้องการ
- 📋 **จัดการการจอง** ดูรายการ ติดตามสถานะ และประวัติการใช้บริการ
- 🔔 **การแจ้งเตือน** เมื่อมีการตอบรับหรืออัปเดตสถานะ
- ⭐ **รีวิว Companion** หลังสิ้นสุดบริการ
- ⚙️ **ตั้งค่าโปรไฟล์**

### 🚶 Companion
- 👤 **โปรไฟล์ผู้ให้บริการ** แสดงข้อมูลส่วนตัว ประสบการณ์ ความสามารถ พื้นที่ให้บริการ
- 💼 **รายการงาน (Jobs)** ดูคำขอ ตอบรับ หรือปฏิเสธงาน
- 📅 **ตารางเวลา (Schedule)** จัดการช่วงเวลาที่สะดวก
- ⭐ **รีวิวและคะแนน** จาก Customer
- 🔔 **การแจ้งเตือน** เมื่อมีงานใหม่หรืออัปเดต
- ⚙️ **ตั้งค่าโปรไฟล์**

### 🛡️ Admin
- 📊 **Dashboard ภาพรวม** ของแพลตฟอร์ม
- 🚶 **จัดการ Companion** ตรวจสอบและบริหารข้อมูลผู้ให้บริการ
- 🧓 **จัดการ Customer** บริหารข้อมูลผู้ใช้บริการ
- 🏷️ **จัดการประเภทบริการ (Service Types)**
- 📋 **จัดการการจอง (Bookings)** ดูภาพรวมทุกรายการ
- 🔔 **การแจ้งเตือน** และ ⚙️ **ตั้งค่าระบบ**

---

## 🔄 ขั้นตอนการใช้บริการ (User Flow)

```mermaid
flowchart LR
    A([🧓 Customer<br/>Login ด้วย Google]) --> B[📝 สร้างคำขอ<br/>ใช้บริการ]
    B --> C{🚶 Companion<br/>ตอบรับ?}
    C -- ตอบรับ --> D[✅ ยืนยันการจอง]
    C -- ปฏิเสธ --> B
    D --> E[🚗 เริ่มให้บริการ]
    E --> F[🏁 สิ้นสุดบริการ]
    F --> G[⭐ Customer รีวิว]
    G --> H([📊 Admin ติดตามภาพรวม])

    style A fill:#e0f2fe,stroke:#0284c7
    style H fill:#fef3c7,stroke:#d97706
    style D fill:#dcfce7,stroke:#16a34a
```

> ระบบรองรับกระบวนการตั้งแต่ **ค้นหา/ร้องขอบริการ → ตอบรับ → ให้บริการ → สิ้นสุดบริการ** พร้อมการจัดการสิทธิ์ของผู้ใช้แต่ละประเภท

---

## 📸 Screenshots

### 🏠 Landing Page & Login

<table>
  <tr>
    <td width="50%" align="center">
      <b>Landing Page</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/68c2c4d4-1549-4da3-882b-de1a1966fd3b" alt="Landing Page" width="100%"/>
    </td>
    <td width="50%" align="center">
      <b>Login ด้วย Google</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/173b56c9-9240-4dd1-9ac1-ddc3aeb11160" alt="Login Page" width="100%"/>
    </td>
  </tr>
</table>

---

### 🧓 Customer

<details open>
<summary><b>📌 Dashboard</b></summary>
<br/>
<div align="center">
  <img src="https://github.com/user-attachments/assets/e4c6df13-c94f-4c5d-b9e7-936b289c382f" alt="Customer Dashboard" width="70%"/>
</div>
</details>

<details open>
<summary><b>📝 สร้างการจองใหม่ &amp; 📋 รายการจอง</b></summary>
<br/>
<table>
  <tr>
    <td width="50%" align="center">
      <b>สร้างคำขอใช้บริการ</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/a2f9284c-5750-4f87-82c0-175de6074bce" alt="Customer New Booking" width="100%"/>
    </td>
    <td width="50%" align="center">
      <b>รายการจองของฉัน</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/bc1c2d84-c34c-46bc-bc5b-5fac2cd7b1e4" alt="Customer Bookings" width="100%"/>
    </td>
  </tr>
</table>
</details>

<details open>
<summary><b>🔔 การแจ้งเตือน &amp; ⚙️ ตั้งค่า</b></summary>
<br/>
<table>
  <tr>
    <td width="50%" align="center">
      <b>การแจ้งเตือน</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/f66b711f-1ec9-4f0d-ada6-6a1df4d61627" alt="Customer Notifications" width="100%"/>
    </td>
    <td width="50%" align="center">
      <b>ตั้งค่าโปรไฟล์</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/08bc0114-97f0-4a45-b4f6-97ba05e09795" alt="Customer Settings" width="100%"/>
    </td>
  </tr>
</table>
</details>

---

### 🚶 Companion

<details open>
<summary><b>📌 Dashboard</b></summary>
<br/>
<div align="center">
  <img src="https://github.com/user-attachments/assets/f013f374-c2ab-417a-a9e5-6908b8a63415" alt="Companion Dashboard" width="90%"/>
</div>
</details>

<details open>
<summary><b>💼 รายการงาน &amp; ⭐ รีวิว</b></summary>
<br/>
<table>
  <tr>
    <td width="50%" align="center">
      <b>รายการงาน (Jobs)</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/e92d3481-70ee-457e-93ae-fba30b38fab7" alt="Companion Jobs" width="100%"/>
    </td>
    <td width="50%" align="center">
      <b>รีวิวจากลูกค้า</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/8cf1ca4a-d4ee-47e1-9e62-ea790264f4e2" alt="Companion Reviews" width="100%"/>
    </td>
  </tr>
</table>
</details>

<details open>
<summary><b>📅 ตารางเวลา · 🔔 แจ้งเตือน · ⚙️ ตั้งค่า</b></summary>
<br/>
<table>
  <tr>
    <td width="100%" align="center">
      <b>ตารางเวลา (Schedule)</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/a3a4202d-8219-4169-b116-79a3206188a4" alt="Companion Schedule" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="100%" align="center">
      <b>การแจ้งเตือน</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/2e7bad26-b6e4-48d4-ba4a-e22fed0b3b88" alt="Companion Notifications" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="100%" align="center">
      <b>ตั้งค่าโปรไฟล์</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/5e46e840-6320-4cac-a3cb-4e18938c99d2" alt="Companion Settings" width="100%"/>
    </td>
  </tr>
</table>
</details>

---

### 🛡️ Admin

<details open>
<summary><b>📊 Dashboard</b></summary>
<br/>
<div align="center">
  <img src="https://github.com/user-attachments/assets/05a7299e-0b08-4dc0-be99-e9ce62abea24" alt="Admin Dashboard" width="100%"/>
</div>
</details>

<details open>
<summary><b>👥 จัดการผู้ใช้งาน (Companions &amp; Customers)</b></summary>
<br/>
<table>
  <tr>
    <td width="50%" align="center">
      <b>จัดการ Companion</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/794166a5-3d04-4048-b212-d37950a2c99b" alt="Admin Companions" width="100%"/>
    </td>
    <td width="50%" align="center">
      <b>จัดการ Customer</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/67550e78-8407-455d-b86d-f4a6df650499" alt="Admin Customers" width="100%"/>
    </td>
  </tr>
</table>
</details>

<details open>
<summary><b>🏷️ ประเภทบริการ &amp; 📋 การจอง</b></summary>
<br/>
<table>
  <tr>
    <td width="50%" align="center">
      <b>จัดการประเภทบริการ</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/ecd50cd5-b4b4-49ff-9981-9cfaaf6eb2e7" alt="Admin Service Types" width="100%"/>
    </td>
    <td width="50%" align="center">
      <b>จัดการการจองทั้งหมด</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/eb5c3ad0-1146-4d57-a1ae-4a6342e5cb3e" alt="Admin Bookings" width="100%"/>
    </td>
  </tr>
</table>
</details>

<details open>
<summary><b>🔔 การแจ้งเตือน &amp; ⚙️ ตั้งค่าระบบ</b></summary>
<br/>
<table>
  <tr>
    <td width="50%" align="center">
      <b>การแจ้งเตือน</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/02233c04-1b75-4671-bc75-3e0cdb6018e7" alt="Admin Notifications" width="100%"/>
    </td>
    <td width="50%" align="center">
      <b>ตั้งค่าระบบ</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/10006170-fa82-42b1-a9f0-6de696419799" alt="Admin Settings" width="100%"/>
    </td>
  </tr>
</table>
</details>

---

## 🛠 Tech Stack

| หมวด | เทคโนโลยี |
|:---|:---|
| **Frontend / Full Stack** | [Next.js](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/) |
| **Authentication** | Google Account ผ่าน [Supabase Authentication](https://supabase.com/auth) |
| **Database** | [Supabase PostgreSQL](https://supabase.com/database) |
| **File Storage** | [Supabase Storage](https://supabase.com/storage) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🔐 Security & Business Rules

- 🔑 **Authentication**  ต้อง Login ด้วย Google Account ทั้ง Customer และ Companion
- 🛂 **Role-Based Access Control**  แยกสิทธิ์การเข้าถึงหน้าและข้อมูลตาม Role (`customer` / `companion` / `admin`)
- 🗄️ **Row Level Security (RLS)**  ป้องกันข้อมูลในระดับฐานข้อมูลของ Supabase ผู้ใช้เห็นและแก้ไขได้เฉพาะข้อมูลที่ตนมีสิทธิ์
- 🛡️ **Admin**  จัดการข้อมูลของ Customer และ Companion ได้ทั้งหมด
- 🩺 **ขอบเขตบริการ**  Companion ให้บริการช่วยเหลือการเดินทางและทำธุระเท่านั้น ไม่ใช่บริการทางการแพทย์
- 🔒 **Environment Variables**  เก็บ Key ลับไว้ใน `.env.local` และไม่ commit ขึ้น Git

---

## 👨‍💻 ผู้พัฒนา

<div align="center">

**ชื่อ-นามสกุล:** นางสาว รัตนากร สุระ
**รหัสนักศึกษา:** 6752410029

[![GitHub](https://img.shields.io/badge/GitHub-PAKGAD2234-181717?style=for-the-badge&logo=github)](https://github.com/PAKGAD2234)

<br/>

⭐ *ขอบคุณค่ะ* ⭐

**Made with ❤️ for those who need a companion**

</div>
