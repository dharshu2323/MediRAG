# 🩺 Medical Diagnosis Support System using RAG (MediRAG)

This project is a **Medical Diagnosis Support System** that leverages **Retrieval-Augmented Generation (RAG)** to help patients and doctors understand and analyze medical prescriptions and reports. It includes a role-based system where admins can upload documents into a knowledge base (Pinecone), and users can upload prescriptions to get summaries and ask health-related questions based on them.

---

## ✨ Features

- 🔐 **Role-based Login**: Admins and Users have different dashboards and permissions.
- 📄 **File Upload Support**: Upload JPG, JPEG, PNG, PDF files.
- 🧠 **OCR Integration**: Extract text from medical prescriptions and reports.
- 📊 **Summarization**: Medical-aware summarization of extracted content using Hugging Face models.
- 🔎 **RAG-based Q&A**: Answer queries based on extracted text + Pinecone + fallback to PubMed.
- 📬 **Email Support**: Users receive email notifications for results (optional via nodemailer).

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Bootstrap
- Axios

**Backend:**
- Node.js
- Express.js
- Multer (file upload)
- Tesseract.js (OCR)
- Hugging Face Transformers / Xenova (Summarization)
- Pinecone (Vector DB)
- PubMed API (fallback search)
- Nodemailer

**Database:**
- MongoDB (User & Role management)

