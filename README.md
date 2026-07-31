# Audio Speech to Sign Language Converter

A modern full-stack web application that converts spoken words into text and maps them to Indian Sign Language visuals for better accessibility and communication. The project combines speech recognition, natural language processing, and animated sign-language output into a simple and interactive experience.

## 🌟 Overview

This project aims to bridge the communication gap for people who rely on sign language by transforming live speech input into meaningful sign-language representations. It is designed as both a practical accessibility tool and a strong portfolio project showcasing full-stack development, NLP, and UI/UX implementation.

## 🌐 Live Deployment

| Service | Live URL | Hosting |
|---------|----------|---------|
| 🚀 **Web App (Frontend)** | [suvidha-ai-nine.vercel.app](https://suvidha-ai-nine.vercel.app) | Vercel |
| 📷 **Camera Sign Recognizer** | [suvidha-ai-nine.vercel.app/recognize](https://suvidha-ai-nine.vercel.app/recognize) | Vercel |
| ⚙️ **Backend REST API** | [suvidha-ai-tool-for-isl.onrender.com](https://suvidha-ai-tool-for-isl.onrender.com) | Render |
| 👑 **Django Admin Portal** | [suvidha-ai-tool-for-isl.onrender.com/admin/](https://suvidha-ai-tool-for-isl.onrender.com/admin/) | Render |

## ✨ Features

- Live speech-to-text conversion using the browser Web Speech API
- Text preprocessing and linguistic transformation with NLTK
- Real-time camera-based Sign Language Recognition using MediaPipe + fingerpose
- Conversion of processed text into sign-related outputs for animation rendering
- User authentication and session-based access
- Modern React-based frontend with a clean interface
- Django REST API backend for handling auth and conversion requests


## 🛠️ Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- NLTK

### Frontend
- React
- Vite
- Axios
- React Router


## � Project Owner

- Name: Ujjwal Pathak
- LinkedIn: https://www.linkedin.com/in/ujjwal-pathak0001

## �📁 Project Structure

```text
A2SL/                 # Django project files
backend/              # Backend-related project files
frontend/             # React + Vite frontend
assets/               # Static assets and media resources
templates/            # Django HTML templates
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js and npm
- A modern browser with microphone support

### 1. Clone the repository

```bash
git clone https://github.com/ujjwal-pathak0001/Suvidha-AI.git
cd Suvidha-AI
```

### 2. Set up the backend

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m nltk.downloader punkt stopwords averaged_perceptron_tagger wordnet
python manage.py migrate
python manage.py runserver 8000
```

The backend will be available at:
```text
http://127.0.0.1:8000/
```

### 3. Set up the frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:
```text
http://127.0.0.1:5173/
```

## ▶️ How to Use

1. Create an account or log in.
2. Open the converter page.
3. Click the microphone button and speak clearly.
4. The app will process your speech and display the corresponding sign-language outputs.
5. You can also enter text manually if needed.

## 🔧 Notes

- The speech recognition feature depends on browser support for the Web Speech API.
- Some NLP resources are downloaded via NLTK the first time you run the project.
- For production deployment, you may want to configure a proper environment and hosting setup for both backend and frontend.

## 🤝 Contributing

Contributions are welcome. If you would like to improve the project, feel free to fork the repository and submit a pull request.

## 📜 License

This project is open-source and available under the terms of the repository license.
