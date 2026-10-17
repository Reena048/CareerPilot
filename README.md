# CAREERPILOT — AI Resume & Job Matcher

> **"Understand your strengths. Discover your skill gaps. Prepare smarter for your next opportunity."**

CareerPilot is a full-stack, local-first web application designed to evaluate software developer resumes against job and internship postings. It provides transparent keyword-based skill match calculations, gap breakdowns, responsive visualizations, deterministic improvement roadmaps, and downloadable HTML reports without requiring paid third-party AI APIs or cloud subscriptions.

---

## 🌟 Key Features

1. **In-Memory PDF Resume Extraction**:
   - Parses text-based PDFs directly in RAM using PyMuPDF (`fitz`).
   - Strictly enforces file-type validation and a 5 MB maximum file-size limit.
   - Resumes are never permanently stored on disk, never logged, and never exposed publicly.
   - Previews extracted resume text, character count, word count, and detected skills.

2. **Extensible Skill Dictionary & Smart Regex Extraction**:
   - Covers 46+ competencies across 7 core categories:
     - **Programming**: Python, Java, C, C++, JavaScript, TypeScript, SQL.
     - **Frontend**: HTML, CSS, React, Angular, Vue, Bootstrap, Tailwind CSS.
     - **Backend**: Node.js, Express.js, FastAPI, Django, Flask, REST API.
     - **Databases**: MySQL, PostgreSQL, MongoDB, SQLite, Redis.
     - **Tools**: Git, GitHub, Docker, Linux, VS Code, CI/CD, AWS.
     - **Computer Science**: Data Structures, Algorithms, OOP, DBMS, Operating Systems, Computer Networks, Software Engineering.
     - **Data & AI**: NumPy, Pandas, Matplotlib, Machine Learning, Deep Learning, Natural Language Processing.
   - Prevents false partial matches using strict boundary checks (e.g., distinguishing `C` vs `CSS` or `C++`, `Java` vs `JavaScript`, `Git` vs `GitHub`).
   - Normalizes case variations and deduplicates skills per document.
   - Displays the exact matched keyword for every detected skill.

3. **Transparent Match Score Engine**:
   - Calculated strictly as:
     $$\text{Match Score} = \left(\frac{\text{Required Job Skills Detected in Resume}}{\text{Total Detected Required Job Skills}}\right) \times 100$$
   - Handles edge cases cleanly (e.g., zero job skills detected safely avoids division-by-zero).
   - Clearly disclaims that the score is a keyword coverage metric, not a prediction of interview outcomes.

4. **Interactive Dashboard & Recharts Visualizations**:
   - Doughnut chart for **Matching vs. Missing Job Skills**.
   - Bar chart showing **Category Distribution** (Resume presence vs. Job requirements).
   - Color-coded badges: Green for Matching Skills, Rose/Red for Missing Skills, and Blue for Additional Resume Skills.

5. **Personalized Skill Roadmap & Progress Tracking**:
   - Dynamically generated from the missing skills detected during resume & job description analysis.
   - For every missing skill:
     - Clear explanation of why the skill is relevant to the target role/internship.
     - Ordered topics to learn (numbered 1 to 5).
     - Hands-on practice project.
     - Estimated learning time (e.g., 7–10 days).
     - Interactive progress tracker: `Not Started`, `Learning`, `Completed`.
   - Visual progress bar showing completion percentage.
   - Filter by status (`All`, `Not Started`, `Learning`, `Completed`) and search by skill.
   - Progress is automatically saved in browser `localStorage` and preserved across subsequent analyses.
   - Reset progress option with confirmation prompt.

6. **Browser LocalStorage History**:
   - Automatically records recent analyses (Timestamp, Target Role, Match Score, Skill Counts).
   - Does **not** store full resume texts in storage for user privacy.
   - Allows users to restore previous analyses, delete individual entries, or clear all history.

7. **Downloadable Standalone HTML Report**:
   - Generates a styled, print-friendly HTML report with one click.
   - Includes summary metrics, matching/missing/additional skill badges, and the improvement roadmap.

8. **Six Fully Functional Navigation Views**:
   - **Dashboard**: Central analysis workstation with resume upload, job description input, and live results.
   - **Resume Analysis**: In-depth inspection of uploaded resume text and categorized skill inventory.
   - **Job Matcher**: Focused side-by-side job matching engine with example preset loaders.
   - **Skill Roadmap**: Personalized learning trajectory with progress tracking, ordered topics, and projects.
   - **Skills Report**: Interactive industry skills catalog and personal resume benchmark explorer.
   - **About**: Architectural principles, transparent score methodology, and privacy guarantees.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19
  - Vite
  - Recharts (visualizations)
  - Lucide React (icons)
  - Custom Responsive SaaS CSS Design System
- **Backend**:
  - Python 3.10+
  - FastAPI (asynchronous REST API)
  - Uvicorn (ASGI server)
  - PyMuPDF (`pymupdf` / `fitz` for PDF parsing)
  - Pydantic v2 (data validation)
  - Pytest (automated test suite)

---

## 📂 Project Structure

```
CareerPilot/
├── backend/
│   ├── main.py              # FastAPI application, CORS, and REST endpoints
│   ├── analyzer.py          # PDF parser, skill matcher, and score calculator
│   ├── skills.py            # Local skill dictionary & recommendation catalog
│   ├── requirements.txt     # Python backend dependencies
│   └── tests/
│       ├── test_analyzer.py # 10 unit tests for skill matching and edge cases
│       └── test_e2e_api.py  # End-to-end API integration test script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChartsSection.jsx    # Recharts Doughnut and Bar charts
│   │   │   ├── HistoryModal.jsx     # LocalStorage history manager
│   │   │   ├── JobInput.jsx         # Role picker, textarea, example loader
│   │   │   ├── Navbar.jsx           # Top header with health status
│   │   │   ├── ResultsView.jsx      # Match score cards, badges, and action plan
│   │   │   ├── ResumeUploader.jsx   # PDF upload & in-memory text preview
│   │   │   └── Sidebar.jsx          # Desktop & mobile responsive sidebar
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx        # Project info & methodology
│   │   │   ├── Dashboard.jsx        # Main landing & analysis workstation
│   │   │   ├── JobMatcherPage.jsx   # Dedicated comparison workstation
│   │   │   ├── ResumeAnalysisPage.jsx # Extracted text & skill explorer
│   │   │   └── SkillsReportPage.jsx # Skills catalog & practice exercises
│   │   ├── services/
│   │   │   ├── api.js               # Backend API client
│   │   │   ├── report.js            # Standalone HTML report generator
│   │   │   └── storage.js           # LocalStorage privacy-preserving manager
│   │   ├── App.jsx                  # Root component & navigation controller
│   │   ├── main.jsx                 # React root DOM entry
│   │   └── index.css                # SaaS design system and responsive tokens
│   ├── index.html                   # HTML entry point with metadata
│   ├── package.json                 # Frontend dependencies and scripts
│   └── vite.config.js               # Vite config with /api dev proxy
├── sample_resume.pdf                # Included sample PDF resume for testing
└── README.md                        # Documentation
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Python 3.10+** (Python 3.13 tested)
- **Node.js 18+** & **npm**

---

### 2. Backend Setup & Run

1. Open a terminal in the project root:
   ```powershell
   cd CareerPilot
   ```

2. Install Python dependencies:
   ```powershell
   python -m pip install -r backend/requirements.txt
   ```

3. Run the automated backend tests:
   ```powershell
   python -m pytest backend/tests/test_analyzer.py -v
   ```

4. Start the FastAPI backend server:
   ```powershell
   python -m uvicorn main:app --app-dir backend --port 8001 --host 127.0.0.1
   ```
   - **Backend API**: [http://127.0.0.1:8001](http://127.0.0.1:8001)
   - **Interactive Swagger Docs**: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)
   - **ReDoc Documentation**: [http://127.0.0.1:8001/redoc](http://127.0.0.1:8001/redoc)

---

### 3. Frontend Setup & Run

1. Open a second terminal window in the `frontend` directory:
   ```powershell
   cd CareerPilot/frontend
   ```

2. Install frontend dependencies:
   ```powershell
   npm install
   ```

3. Launch the Vite development server:
   ```powershell
   npm run dev
   ```
   - The Vite development server will start at:
     **[http://localhost:5173/](http://localhost:5173/)** (or next available port, e.g. **http://localhost:5174/**).

---

## 🧪 Testing with the Sample Resume

A pre-generated test resume `sample_resume.pdf` is provided in the root directory:

1. Open the CareerPilot dashboard in your browser.
2. In the **1. Resume Upload** card, drag and drop `sample_resume.pdf` (or click to browse).
3. In the **2. Target Job Description** card, select a target role (e.g., **Python Developer** or **Frontend Developer**) and click **"Load Example Job"**.
4. Click **"Analyze Resume"**.
5. Inspect your:
   - Match Score and explanation.
   - Matching skills, missing skills, and additional resume skills.
   - Doughnut and Bar charts.
   - Actionable improvement plan.
   - Click **"Download Report"** to save your customized report!

---

## 🔒 Privacy & Limitations

- **100% In-Memory Processing**: Resumes are parsed in RAM and released immediately after keyword extraction.
- **No Third-Party AI API Keys**: All calculations and recommendations are deterministic and processed locally.
- **Scanned Image PDFs**: Scanned image-only PDFs require Optical Character Recognition (OCR), which is omitted from this build to keep dependencies lightweight and free of native C-binary burdens. Users with image-based resumes can copy and paste their text directly.
