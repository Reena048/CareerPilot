"""
CareerPilot - Backend REST API
FastAPI Application providing endpoints for resume extraction, job matching analysis,
health checks, skill dictionary inspection, and curated job templates.
"""

from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from analyzer import (
    extract_text_from_pdf,
    extract_skills_from_text,
    analyze_job_match,
    ResumeExtractionResult,
    MatchAnalysisResult,
    ExtractedSkill
)
from skills import SKILL_DICTIONARY, TARGET_ROLES_FOCUS

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

app = FastAPI(
    title="CareerPilot API",
    description="Deterministic AI Resume & Job Matcher API with local keyword extraction and skill gap analysis.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Extracted resume text")
    job_description: str = Field(..., min_length=10, description="Job or internship description")
    target_role: Optional[str] = Field(None, description="Selected target role")


class ExampleJobResponse(BaseModel):
    role: str
    title: str
    description: str


EXAMPLE_JOBS: Dict[str, ExampleJobResponse] = {
    "Frontend Developer": ExampleJobResponse(
        role="Frontend Developer",
        title="Frontend React Developer - Modern Web Applications",
        description="""We are seeking a talented Frontend Developer to build dynamic, responsive user interfaces. 

Requirements:
- 2+ years of experience with React, JavaScript (ES6+), and TypeScript.
- Strong proficiency in HTML, CSS, and Tailwind CSS or Bootstrap.
- Solid experience consuming REST APIs and handling state management.
- Familiarity with modern developer tools such as Git, GitHub, and VS Code.
- Understanding of computer science fundamentals including Data Structures and Algorithms.

Nice to have:
- Experience with Next.js or Vue.
- Knowledge of automated testing and CI/CD pipelines.
"""
    ),
    "Backend Developer": ExampleJobResponse(
        role="Backend Developer",
        title="Backend Engineer - Scalable APIs & Microservices",
        description="""Join our core engineering team to design, build, and maintain mission-critical backend services and APIs.

Key Responsibilities:
- Build high-throughput REST APIs using Python with FastAPI or Django, or Node.js with Express.js.
- Design relational schemas and optimize database queries using PostgreSQL or MySQL.
- Containerize services with Docker and deploy to Linux cloud servers.
- Implement secure caching layers using Redis.
- Collaborate using Git and GitHub with code reviews and automated CI/CD workflows.

Qualifications:
- Solid background in Computer Science: Data Structures, Algorithms, OOP, and DBMS.
- Experience with Operating Systems and Computer Networks.
"""
    ),
    "Full-Stack Developer": ExampleJobResponse(
        role="Full-Stack Developer",
        title="Full-Stack Software Engineer - Web Applications",
        description="""We are looking for a versatile Full-Stack Software Developer to create end-to-end features.

Required Skills:
- Frontend: Strong hands-on experience with React, TypeScript, JavaScript, HTML, and CSS.
- Backend: Solid proficiency in Node.js, Express.js, or Python (FastAPI / Flask).
- Database: Experience with relational (PostgreSQL, MySQL) and document stores (MongoDB).
- Architecture: REST API design, OOP design principles, and Git version control.
- Environment: Containerization with Docker, deploying to Linux instances, and GitHub workflows.
- Education/Theory: Solid grasp of Data Structures, Algorithms, and Software Engineering methodologies.
"""
    ),
    "Python Developer": ExampleJobResponse(
        role="Python Developer",
        title="Python Software Engineer - Backend & Data Automation",
        description="""We are hiring a Python Developer to develop high-performance web backends and data automation pipelines.

Requirements:
- Strong core Python skills (asyncio, OOP, data structures).
- Experience building REST APIs using FastAPI, Django, or Flask.
- Relational database management using SQL, PostgreSQL, and SQLite.
- Working knowledge of Docker, Linux environments, Git, and VS Code.
- Understanding of Computer Science fundamentals: Algorithms, DBMS, and Operating Systems.
- Exposure to Pandas or NumPy for data parsing is a strong plus.
"""
    ),
    "Software Development Intern": ExampleJobResponse(
        role="Software Development Intern",
        title="Software Engineering Intern - Summer Cohort",
        description="""We are excited to welcome Software Engineering Interns eager to learn and contribute to production code.

Requirements:
- Pursuing or completed degree in Computer Science, Software Engineering, or related technical field.
- Proficiency in at least one core language: Python, Java, C++, or JavaScript.
- Strong theoretical foundation in Data Structures, Algorithms, OOP, DBMS, and Computer Networks.
- Experience with version control tools: Git and GitHub.
- Basic familiarity with web development (HTML, CSS, REST APIs) or relational databases (SQL, MySQL).
- Curiosity and passion for solving algorithmic problems and learning modern frameworks.
"""
    ),
    "Data Analyst": ExampleJobResponse(
        role="Data Analyst",
        title="Data Analyst - Business Intelligence & Insights",
        description="""Seeking a Data Analyst to transform raw business data into actionable dashboards and strategic insights.

Requirements:
- Advanced SQL proficiency (window functions, subqueries, complex multi-table joins).
- Strong Python programming skills for data manipulation.
- Experience with data science libraries: Pandas, NumPy, and Matplotlib.
- Working knowledge of DBMS and relational databases like PostgreSQL or MySQL.
- Familiarity with Git, Linux command line, and VS Code.
- Understanding of fundamental Machine Learning concepts and statistical modeling is a plus.
"""
    )
}


@app.get("/api/health", summary="Health Check")
async def health_check():
    """Returns the operational status of the CareerPilot backend."""
    return {
        "status": "healthy",
        "service": "CareerPilot API",
        "version": "1.0.0",
        "total_catalog_skills": len(SKILL_DICTIONARY)
    }


@app.get("/api/roles", summary="Get Target Roles")
async def get_target_roles() -> List[str]:
    """Returns the supported target role options for tailored recommendations."""
    return list(TARGET_ROLES_FOCUS.keys())


@app.get("/api/example-jobs", summary="Get Example Job Descriptions")
async def get_example_jobs() -> Dict[str, ExampleJobResponse]:
    """Returns realistic sample job descriptions for quick testing."""
    return EXAMPLE_JOBS


@app.get("/api/skills-catalog", summary="Get Skills Catalog")
async def get_skills_catalog() -> Dict[str, List[str]]:
    """Returns all available skills grouped by category."""
    catalog: Dict[str, List[str]] = {}
    for skill_def in SKILL_DICTIONARY:
        if skill_def.category not in catalog:
            catalog[skill_def.category] = []
        if skill_def.name not in catalog[skill_def.category]:
            catalog[skill_def.category].append(skill_def.name)
    return catalog


@app.post("/api/extract-resume", response_model=ResumeExtractionResult, summary="Extract Resume Text & Skills")
async def extract_resume(file: UploadFile = File(...)):
    """
    Accepts an uploaded PDF resume, extracts its text in-memory via PyMuPDF,
    and returns text preview, character count, and detected skills.
    Does NOT store the file permanently or expose it statically.
    """
    # 1. Validate file format
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing."
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF (.pdf) document."
        )

    # 2. Read in-memory bytes and validate size
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}"
        )

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded PDF file is empty (0 bytes)."
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of 5 MB ({round(len(content)/(1024*1024), 2)} MB provided)."
        )

    # 3. Extract text via PyMuPDF
    try:
        extracted_text = extract_text_from_pdf(content, filename=file.filename)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while processing the PDF: {str(e)}"
        )

    # 4. Detect skills in resume
    detected_skills = extract_skills_from_text(extracted_text)

    # 5. Build preview and metrics
    char_count = len(extracted_text)
    word_count = len(extracted_text.split())
    preview_limit = 1200
    text_preview = (
        extracted_text[:preview_limit] + "..."
        if len(extracted_text) > preview_limit
        else extracted_text
    )

    return ResumeExtractionResult(
        filename=file.filename,
        character_count=char_count,
        word_count=word_count,
        text_preview=text_preview,
        detected_skills=detected_skills,
        full_text=extracted_text
    )


@app.post("/api/analyze", response_model=MatchAnalysisResult, summary="Analyze Resume Against Job Description")
async def analyze_match(payload: AnalyzeRequest):
    """
    Executes keyword-based skill extraction and match gap analysis between
    resume text and job description.
    """
    resume_clean = payload.resume_text.strip()
    job_clean = payload.job_description.strip()

    if len(resume_clean) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is too short. Please provide a complete resume."
        )

    if len(job_clean) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description is too short. Please provide a complete job or internship description."
        )

    try:
        analysis_result = analyze_job_match(
            resume_text=resume_clean,
            job_description=job_clean,
            target_role=payload.target_role
        )
        return analysis_result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform job match analysis: {str(e)}"
        )
