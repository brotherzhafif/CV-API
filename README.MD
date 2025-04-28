# Hackaton_CV - Ruang Talenta CV Assessments API Documentation

## Authentication

Semua endpoint membutuhkan **Bearer Token** di header `Authorization`.

Contoh:

```
Authorization: Bearer <token>
```

---

## Auth Routes

### POST `/auth/register`

Register akun baru.

- **Headers:**
  - Authorization: Bearer `<token>`
- **Body (JSON):**
  ```json
  {
    "email": "raja@example.com",
    "password": "woylah1234"
  }
  ```
- **Response:**  
  Berhasil register user baru.

---

### POST `/auth/login`

Login dan mendapatkan token.

- **Headers:**
  - Authorization: Bearer `<token>`
- **Body (JSON):**
  ```json
  {
    "email": "raja@example.com",
    "password": "woylah1234"
  }
  ```
- **Response:**  
  Token untuk akses API selanjutnya.

---

## CV Routes

### POST `/api/submit-cv`

Submit CV lengkap.

- **Headers:**
  - Authorization: Bearer `<token>`
- **Body (JSON) contoh:**
  ```json
  {
    "personal_info": {
      "name": "John Doe",
      "phone": "+628123456789",
      "email": "john.doe@email.com",
      "address": "Jakarta, Indonesia",
      "linkedin": "https://linkedin.com/in/johndoe",
      "github": "https://github.com/johndoe",
      "website": "https://johndoe.dev"
    },
    "professional_summary": "Experienced web developer with 3+ years building scalable apps using React and Laravel.",
    "work_experience": [
      {
        "company": "PT. Maju Terus",
        "position": "Software Engineer",
        "start_date": "2022-01",
        "end_date": "2024-04",
        "description": "Developed and maintained e-commerce websites using Laravel and React. Led a team of 5 junior developers."
      },
      {
        "company": "Startup Keren",
        "position": "Frontend Developer",
        "start_date": "2020-06",
        "end_date": "2021-12",
        "description": "Built responsive web applications and improved page speed by 30%."
      }
    ],
    "education": [
      {
        "institution": "Universitas Teknologi Indonesia",
        "degree": "Bachelor of Information Systems",
        "start_year": 2019,
        "end_year": 2023,
        "gpa": 3.73
      }
    ],
    "skills": ["React", "Laravel", "Tailwind CSS", "MongoDB", "Node.js", "Git"],
    "certifications": [
      {
        "title": "AWS Certified Cloud Practitioner",
        "issuer": "Amazon Web Services",
        "date": "2023-08"
      },
      {
        "title": "Meta Front-End Developer Certificate",
        "issuer": "Coursera",
        "date": "2024-01"
      }
    ],
    "projects": [
      {
        "name": "Cakrawidia",
        "description": "A Q&A and knowledge-sharing platform built with Laravel and React.",
        "tech_stack": ["Laravel", "React", "Tailwind", "Aiven"]
      },
      {
        "name": "GreenGo",
        "description": "Sustainable transport application promoting eco-friendly mobility.",
        "tech_stack": ["Flutter", "Firebase"]
      }
    ],
    "awards": [
      {
        "title": "Best Project Award",
        "organization": "Techcomfest PCC",
        "year": 2025
      }
    ],
    "languages": [
      {
        "language": "English",
        "level": "Professional Working Proficiency"
      },
      {
        "language": "Indonesian",
        "level": "Native"
      }
    ]
  }
  ```
- **Response:**  
  Menyimpan data CV user ke database.

---

### GET `/api/get-cvs`

Mengambil semua CV milik user yang login.

- **Headers:**
  - Authorization: Bearer `<token>`
- **Response:**  
  List data CV user.

---

# Notes

- Semua request harus menggunakan **Authorization Bearer Token**.
- Pastikan mengisi semua field JSON saat submit CV untuk menghindari error validasi.
