"""
CareerPilot - Analysis Engine
Handles PDF text extraction via PyMuPDF, robust regex skill extraction,
keyword-based job matching calculation, and deterministic improvement plans.
"""

import io
import re
from typing import Dict, List, Set, Tuple, Optional, Any
try:
    import pymupdf as fitz
except ImportError:
    import fitz
from pydantic import BaseModel, Field

from skills import SKILL_DICTIONARY, SKILL_RECOMMENDATIONS, TARGET_ROLES_FOCUS, SkillDefinition


class ExtractedSkill(BaseModel):
    name: str
    category: str
    matched_term: str


class ImprovementItem(BaseModel):
    skill: str
    category: str
    topic: str
    task: str
    rationale: str
    is_role_suggestion: bool = False


class SkillCategoryStats(BaseModel):
    category: str
    resume_count: int
    job_count: int
    matched_count: int
    missing_count: int


class MatchAnalysisResult(BaseModel):
    match_score: float
    score_status: str  # "Excellent", "Strong", "Moderate", "Developing", "No Job Skills Detected"
    calculation_explanation: str
    disclaimer: str
    total_resume_skills: int
    total_job_skills: int
    matching_skills_count: int
    missing_skills_count: int
    additional_skills_count: int
    matching_skills: List[ExtractedSkill]
    missing_skills: List[ExtractedSkill]
    additional_skills: List[ExtractedSkill]
    category_breakdown: List[SkillCategoryStats]
    recommendations: List[ImprovementItem]
    target_role: Optional[str] = None


class ResumeExtractionResult(BaseModel):
    filename: str
    character_count: int
    word_count: int
    text_preview: str
    detected_skills: List[ExtractedSkill]
    full_text: str


def extract_text_from_pdf(pdf_bytes: bytes, filename: str = "resume.pdf") -> str:
    """
    Extracts text from PDF bytes in-memory using PyMuPDF (fitz).
    Raises ValueError with specific message on empty text, corruption, or format error.
    """
    if not pdf_bytes:
        raise ValueError("Uploaded file is empty.")

    try:
        # Open in-memory document from bytes stream
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            if doc.page_count == 0:
                raise ValueError("The uploaded PDF document contains no pages.")

            extracted_pages: List[str] = []
            for page_num in range(doc.page_count):
                page = doc.load_page(page_num)
                page_text = page.get_text("text")
                if page_text:
                    extracted_pages.append(page_text.strip())

            full_text = "\n\n".join(extracted_pages).strip()

            if not full_text:
                raise ValueError(
                    "The PDF contains no extractable text. It may be a scanned image-only PDF. "
                    "Scanned image PDFs require Optical Character Recognition (OCR), which is not supported in this version. "
                    "Please upload a text-based PDF or copy-paste text directly."
                )

            return full_text

    except fitz.FileDataError as e:
        raise ValueError("The uploaded file is not a valid or readable PDF document.") from e
    except Exception as e:
        if isinstance(e, ValueError):
            raise e
        raise ValueError(f"Unable to parse PDF document: {str(e)}") from e


def extract_skills_from_text(text: str) -> List[ExtractedSkill]:
    """
    Extracts detected skills from given text based on local regex dictionary.
    Guarantees:
    - Complete phrase matching with word boundaries.
    - Prevents false partial matches (e.g. C vs CSS, Java vs JavaScript).
    - Deduplicates skills per document.
    - Captures the exact matched term.
    - Sorts output consistently by category and skill name.
    """
    if not text or not text.strip():
        return []

    detected_skills: Dict[str, ExtractedSkill] = {}

    # Sort dictionary by priority descending so specialized patterns match first
    sorted_dict = sorted(SKILL_DICTIONARY, key=lambda s: s.priority, reverse=True)

    for skill_def in sorted_dict:
        for pattern_str in skill_def.patterns:
            flags = 0 if skill_def.case_sensitive else re.IGNORECASE
            pattern = re.compile(pattern_str, flags)
            match = pattern.search(text)
            if match:
                matched_term = match.group(0).strip()
                # Store if not already detected
                if skill_def.name not in detected_skills:
                    detected_skills[skill_def.name] = ExtractedSkill(
                        name=skill_def.name,
                        category=skill_def.category,
                        matched_term=matched_term
                    )
                break  # Skill already detected, proceed to next skill

    # Return list sorted alphabetically by name
    return sorted(list(detected_skills.values()), key=lambda s: (s.category, s.name))


def analyze_job_match(
    resume_text: str,
    job_description: str,
    target_role: Optional[str] = None
) -> MatchAnalysisResult:
    """
    Performs full keyword-based skill match and gap analysis between resume and job description.
    """
    # 1. Detect skills in resume and job description
    resume_skills = extract_skills_from_text(resume_text)
    job_skills = extract_skills_from_text(job_description)

    resume_skill_map = {s.name: s for s in resume_skills}
    job_skill_map = {s.name: s for s in job_skills}

    resume_skill_names = set(resume_skill_map.keys())
    job_skill_names = set(job_skill_map.keys())

    # 2. Matching skills (detected in both)
    matching_names = sorted(list(resume_skill_names.intersection(job_skill_names)))
    matching_skills = [job_skill_map[name] for name in matching_names]

    # 3. Missing skills (detected in job description but not in resume)
    missing_names = sorted(list(job_skill_names.difference(resume_skill_names)))
    missing_skills = [job_skill_map[name] for name in missing_names]

    # 4. Additional skills (detected in resume but not in job description)
    additional_names = sorted(list(resume_skill_names.difference(job_skill_names)))
    additional_skills = [resume_skill_map[name] for name in additional_names]

    # 5. Calculate transparent match score
    total_job = len(job_skills)
    total_matching = len(matching_skills)

    if total_job > 0:
        match_score = round((total_matching / total_job) * 100, 1)
        if match_score >= 80:
            score_status = "Excellent"
        elif match_score >= 60:
            score_status = "Strong"
        elif match_score >= 40:
            score_status = "Moderate"
        else:
            score_status = "Developing"

        calculation_explanation = (
            f"Calculated as ({total_matching} matched skills ÷ {total_job} required job skills) × 100% = {match_score}%."
        )
    else:
        match_score = 0.0
        score_status = "No Job Skills Detected"
        calculation_explanation = (
            "No recognized technical skills were detected in the provided job description. "
            "Please ensure the job description includes relevant technical skill keywords."
        )

    disclaimer = (
        "This score is a transparent, deterministic keyword-based skill match calculation. "
        "It reflects detected skill overlap and should not be interpreted as a hiring prediction or interview guarantee."
    )

    # 6. Category breakdown
    all_categories = sorted(list({s.category for s in SKILL_DICTIONARY}))
    category_breakdown: List[SkillCategoryStats] = []

    for cat in all_categories:
        res_cat_count = sum(1 for s in resume_skills if s.category == cat)
        job_cat_count = sum(1 for s in job_skills if s.category == cat)
        matched_cat_count = sum(1 for s in matching_skills if s.category == cat)
        missing_cat_count = sum(1 for s in missing_skills if s.category == cat)

        if res_cat_count > 0 or job_cat_count > 0:
            category_breakdown.append(SkillCategoryStats(
                category=cat,
                resume_count=res_cat_count,
                job_count=job_cat_count,
                matched_count=matched_cat_count,
                missing_count=missing_cat_count
            ))

    # 7. Generate prioritized improvement recommendations (up to 5)
    recommendations: List[ImprovementItem] = []

    # Priority 1: Missing skills detected in job description
    for skill in missing_skills:
        rec_data = SKILL_RECOMMENDATIONS.get(skill.name, {
            "topic": f"{skill.name} Core Fundamentals",
            "task": f"Build a practical demonstration project showcasing hands-on proficiency in {skill.name}.",
            "rationale": f"{skill.name} was required in the job description but not detected in your resume."
        })
        recommendations.append(ImprovementItem(
            skill=skill.name,
            category=skill.category,
            topic=rec_data["topic"],
            task=rec_data["task"],
            rationale=rec_data.get("rationale", f"Required in target job description."),
            is_role_suggestion=False
        ))
        if len(recommendations) >= 5:
            break

    # Priority 2: If under 5 recommendations and target role is provided, add role-specific recommendations
    if len(recommendations) < 5 and target_role and target_role in TARGET_ROLES_FOCUS:
        role_skills = TARGET_ROLES_FOCUS[target_role]
        for role_skill_name in role_skills:
            if role_skill_name not in resume_skill_names and role_skill_name not in [r.skill for r in recommendations]:
                rec_data = SKILL_RECOMMENDATIONS.get(role_skill_name, {
                    "topic": f"{role_skill_name} Mastery",
                    "task": f"Practice real-world tasks using {role_skill_name} suited for a {target_role}.",
                    "rationale": f"Frequently expected standard for {target_role} roles."
                })
                # find category
                def_cat = next((s.category for s in SKILL_DICTIONARY if s.name == role_skill_name), "General")
                recommendations.append(ImprovementItem(
                    skill=role_skill_name,
                    category=def_cat,
                    topic=rec_data["topic"],
                    task=rec_data["task"],
                    rationale=f"Recommended for {target_role} candidates.",
                    is_role_suggestion=True
                ))
                if len(recommendations) >= 5:
                    break

    return MatchAnalysisResult(
        match_score=match_score,
        score_status=score_status,
        calculation_explanation=calculation_explanation,
        disclaimer=disclaimer,
        total_resume_skills=len(resume_skills),
        total_job_skills=len(job_skills),
        matching_skills_count=len(matching_skills),
        missing_skills_count=len(missing_skills),
        additional_skills_count=len(additional_skills),
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        additional_skills=additional_skills,
        category_breakdown=category_breakdown,
        recommendations=recommendations,
        target_role=target_role
    )
