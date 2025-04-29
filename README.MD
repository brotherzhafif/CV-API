# **CV API Documentation**

## **Base URL**

- **Local**: `http://localhost:5000`
- **Production**: `https://cv-api-six.vercel.app`

---

## **Authentication**

Semua endpoint yang membutuhkan autentikasi harus menyertakan **Bearer Token** di header `Authorization`.

**Contoh Header**:

```
Authorization: Bearer <token>
```

---

## **Auth Routes**

### **1. POST `/auth/register`**

Mendaftarkan pengguna baru.

- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123",
    "username": "user123"
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
      "success": true,
      "message": "Registrasi berhasil",
      "user": {
        "id": "firebase-user-id",
        "email": "user@example.com",
        "username": "user123"
      }
    }
    ```
  - **Error**:
    ```json
    {
      "success": false,
      "message": "Terjadi kesalahan saat registrasi",
      "error": "Error message"
    }
    ```

---

### **2. POST `/auth/login`**

Login pengguna dan mendapatkan token autentikasi.

- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  - **Login dengan Email**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
  - **Login dengan Username**:
    ```json
    {
      "username": "user123",
      "password": "securepassword123"
    }
    ```
- **Response**:
  - **Success**:
    ```json
    {
      "success": true,
      "message": "Login berhasil",
      "token": "firebase-token",
      "user": {
        "id": "firebase-user-id",
        "email": "user@example.com",
        "username": "user123"
      }
    }
    ```
  - **Error**:
    ```json
    {
      "success": false,
      "message": "Email, username, atau password salah",
      "error": "Error message"
    }
    ```

---

### **3. POST `/auth/google-login`**

Login pengguna menggunakan Google.

- **Headers**:
  - `Content-Type: application/json`
- **Response**:
  - **Success**:
    ```json
    {
      "success": true,
      "message": "Login dengan Google berhasil",
      "token": "firebase-token",
      "user": {
        "id": "firebase-user-id",
        "email": "user@example.com",
        "displayName": "User Name"
      }
    }
    ```
  - **Error**:
    ```json
    {
      "success": false,
      "message": "Gagal login dengan Google",
      "error": "Error message"
    }
    ```

---

## **CV Routes**

### **1. POST `/api/submit-cv`**

Mengunggah CV dalam format PDF dan melakukan penilaian otomatis.

- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Body**:
  - Field file: `cvFile` (PDF file)
- **Response**:
  - **Success**:
    ```json
    {
      "success": true,
      "message": "CV berhasil diupload dan dinilai",
      "cv": {
        "userId": "firebase-user-id",
        "cvId": "unique-cv-id",
        "pdfUrl": "https://storage.googleapis.com/cv-generator-maxy.appspot.com/cvs/user-id/timestamp-filename.pdf",
        "fileName": "filename.pdf",
        "scoring": {
          "scores": {
            "profileSummary": 20,
            "cvLength": 20,
            "skills": 15,
            "format": 15,
            "keywords": 20,
            "professionalContacts": 10
          },
          "totalScore": 100,
          "details": {
            "pageCount": 3,
            "wordCount": 500
          }
        },
        "createdAt": "2025-04-29T12:00:00.000Z"
      }
    }
    ```
  - **Error**:
    ```json
    {
      "success": false,
      "message": "Error dalam memproses CV",
      "error": "Error message"
    }
    ```

---

### **2. GET `/api/get-cvs`**

Mengambil semua CV yang diunggah oleh pengguna yang sedang login.

- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**:
    ```json
    {
      "success": true,
      "cvs": [
        {
          "userId": "firebase-user-id",
          "cvId": "unique-cv-id",
          "pdfUrl": "https://storage.googleapis.com/cv-generator-maxy.appspot.com/cvs/user-id/timestamp-filename.pdf",
          "fileName": "filename.pdf",
          "scoring": {
            "scores": {
              "profileSummary": 20,
              "cvLength": 20,
              "skills": 15,
              "format": 15,
              "keywords": 20,
              "professionalContacts": 10
            },
            "totalScore": 100,
            "details": {
              "pageCount": 3,
              "wordCount": 500
            }
          },
          "createdAt": "2025-04-29T12:00:00.000Z"
        }
      ]
    }
    ```
  - **Error**:
    ```json
    {
      "success": false,
      "message": "Error fetching CVs",
      "error": "Error message"
    }
    ```

---

## **Error Handling**

### **1. Error: Token Tidak Valid**

- **Status**: `401 Unauthorized`
- **Response**:
  ```json
  {
    "success": false,
    "message": "Token tidak valid.",
    "error": "Error message"
  }
  ```

### **2. Error: File Tidak Ditemukan**

- **Status**: `400 Bad Request`
- **Response**:
  ```json
  {
    "success": false,
    "message": "File PDF CV diperlukan"
  }
  ```

### **3. Error: Bucket Tidak Ada**

- **Status**: `500 Internal Server Error`
- **Response**:
  ```json
  {
    "success": false,
    "message": "Error dalam memproses CV",
    "error": "The specified bucket does not exist."
  }
  ```

---

## **Environment Variables**

Pastikan file .env Anda memiliki variabel berikut:

```env
FIREBASE_PROJECT_ID=cv-generator-maxy
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key
```

---

## **Dependencies**

- **Express**: Framework untuk membuat server.
- **Firebase Admin SDK**: Untuk autentikasi dan penyimpanan file.
- **Multer**: Untuk menangani unggahan file.
- **PDF-Parse**: Untuk membaca dan menganalisis file PDF.
