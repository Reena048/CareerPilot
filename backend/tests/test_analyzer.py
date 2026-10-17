"""
Unit and integration tests for CareerPilot Analysis Engine.
Tests skill extraction, edge cases, partial match prevention,
score calculation, and PDF in-memory parsing.
"""

import io
import os
import sys
import pytest

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    import pymupdf as fitz
except ImportError:
    import fitz

from analyzer import (
    extract_skills_from_text,
    analyze_job_match,
    extract_text_from_pdf,
    MatchAnalysisResult
)


def test_programming_skill_extraction():
    text = "Proficient in Python, Java, C++, TypeScript, and SQL. Also worked with C programming."
    skills = extract_skills_from_text(text)
    names = {s.name for s in skills}

    assert "Python" in names
    assert "Java" in names
    assert "C++" in names
    assert "C" in names
    assert "TypeScript" in names
    assert "SQL" in names
    # Ensure JavaScript was not falsely matched when only Java was present
    assert "JavaScript" not in names


def test_avoid_false_partial_matches():
    # 'cat', 'cloud', 'classification' should NOT match 'C'
    # 'github' should match 'GitHub', and Git pattern should NOT match 'GitHub' as 'Git'
    text = "We have a cat in our cloud datacenter. Working on classification algorithms using GitHub."
    skills = extract_skills_from_text(text)
    names = {s.name for s in skills}

    assert "C" not in names
    assert "GitHub" in names
    assert "Git" not in names  # Should match GitHub, but not Git from the word GitHub
    assert "Algorithms" in names


def test_frontend_and_backend_skills():
    text = "Built a responsive web dashboard using React, Tailwind CSS, and HTML5. Backend powered by FastAPI and PostgreSQL."
    skills = extract_skills_from_text(text)
    names = {s.name for s in skills}

    assert "React" in names
    assert "Tailwind CSS" in names
    assert "HTML" in names
    assert "FastAPI" in names
    assert "PostgreSQL" in names


def test_cs_and_ai_skills():
    text = "Strong grasp of Data Structures, Algorithms, OOP, DBMS, and Operating Systems. Experience with Pandas, NumPy, and Machine Learning."
    skills = extract_skills_from_text(text)
    names = {s.name for s in skills}

    assert "Data Structures" in names
    assert "Algorithms" in names
    assert "OOP" in names
    assert "DBMS" in names
    assert "Operating Systems" in names
    assert "Pandas" in names
    assert "NumPy" in names
    assert "Machine Learning" in names


def test_match_score_calculation():
    resume_text = "Proficient in Python, Docker, Git, and PostgreSQL. Experienced in REST API development."
    # Job requires Python, Docker, Git, PostgreSQL, and React (5 skills)
    job_description = "We require Python, Docker, Git, PostgreSQL, and React for this fullstack position."

    result = analyze_job_match(resume_text, job_description)

    # 4 matched out of 5 required job skills -> 4/5 * 100 = 80.0%
    assert result.match_score == 80.0
    assert result.total_job_skills == 5
    assert result.matching_skills_count == 4
    assert result.missing_skills_count == 1
    assert result.missing_skills[0].name == "React"

    # Additional skill in resume: REST API
    additional_names = {s.name for s in result.additional_skills}
    assert "REST API" in additional_names


def test_zero_job_skills_edge_case():
    resume_text = "Experienced Python and React developer with 5 years experience."
    job_description = "Looking for a friendly person with great communication and leadership qualities."

    result = analyze_job_match(resume_text, job_description)

    # No job skills -> score 0.0, no division by zero error
    assert result.match_score == 0.0
    assert result.total_job_skills == 0
    assert result.score_status == "No Job Skills Detected"
    assert "No recognized technical skills were detected" in result.calculation_explanation


def test_recommendations_generation():
    resume_text = "Python developer with experience in Flask and SQLite."
    job_description = "Looking for a developer with Python, React, Docker, and PostgreSQL."

    result = analyze_job_match(resume_text, job_description, target_role="Backend Developer")

    assert len(result.recommendations) > 0
    rec_skills = [r.skill for r in result.recommendations]
    # Missing skills React, Docker, PostgreSQL should be in recommendations
    assert "React" in rec_skills or "Docker" in rec_skills or "PostgreSQL" in rec_skills
    for rec in result.recommendations:
        assert rec.topic
        assert rec.task
        assert rec.rationale


def test_pdf_extraction_in_memory():
    # Create an in-memory PDF using PyMuPDF fitz
    doc = fitz.open()
    page = doc.new_page()
    sample_text = "Alex Mercer\nSoftware Engineer\nSkills: Python, React, Docker, SQL, Git."
    page.insert_text((50, 72), sample_text, fontsize=12)
    pdf_bytes = doc.tobytes()
    doc.close()

    # Extract text using our function
    extracted = extract_text_from_pdf(pdf_bytes, filename="test_resume.pdf")
    assert "Alex Mercer" in extracted
    assert "Python" in extracted
    assert "Docker" in extracted

    # Test detected skills
    skills = extract_skills_from_text(extracted)
    names = {s.name for s in skills}
    assert "Python" in names
    assert "React" in names
    assert "Docker" in names
    assert "SQL" in names
    assert "Git" in names


def test_skill_deduplication_and_normalization():
    text = "We use React, react.js, REACT, and ReactJS in our project alongside Python, python, and PYTHON3."
    skills = extract_skills_from_text(text)
    names = [s.name for s in skills]

    # React should only appear once
    assert names.count("React") == 1
    # Python should only appear once
    assert names.count("Python") == 1


def test_pdf_empty_and_corrupt_error_handling():
    with pytest.raises(ValueError, match="empty"):
        extract_text_from_pdf(b"", "empty.pdf")

    with pytest.raises(ValueError, match="not a valid or readable PDF"):
        extract_text_from_pdf(b"Not a real pdf at all", "corrupt.pdf")

