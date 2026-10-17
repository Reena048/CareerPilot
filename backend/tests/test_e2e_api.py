import urllib.request
import json

# 1. Test /api/extract-resume with sample_resume.pdf
with open('sample_resume.pdf', 'rb') as f:
    pdf_bytes = f.read()

boundary = '----CareerPilotBoundaryXYZ'
header = (
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="file"; filename="sample_resume.pdf"\r\n'
    f'Content-Type: application/pdf\r\n\r\n'
).encode('utf-8')
footer = f'\r\n--{boundary}--\r\n'.encode('utf-8')
body = header + pdf_bytes + footer

req = urllib.request.Request(
    'http://127.0.0.1:8001/api/extract-resume',
    data=body,
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode())
    print('Extract response status: 200 OK')
    print('Filename:', res['filename'])
    print('Words:', res['word_count'], 'Chars:', res['character_count'])
    skills = [s['name'] for s in res['detected_skills']]
    print('Detected skills count:', len(skills))
    print('Extracted skills:', skills)

# 2. Test /api/analyze
analyze_payload = json.dumps({
    'resume_text': res['full_text'],
    'job_description': 'Seeking a Python Developer skilled in FastAPI, PostgreSQL, Docker, Git, and React. Redis experience preferred.',
    'target_role': 'Python Developer'
}).encode('utf-8')

analyze_req = urllib.request.Request(
    'http://127.0.0.1:8001/api/analyze',
    data=analyze_payload,
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(analyze_req) as resp:
    analysis = json.loads(resp.read().decode())
    print('\nAnalyze response status: 200 OK')
    print('Match score:', analysis['match_score'], '%')
    print('Score status:', analysis['score_status'])
    print('Matching skills:', [s['name'] for s in analysis['matching_skills']])
    print('Missing skills:', [s['name'] for s in analysis['missing_skills']])
    print('Additional resume skills:', [s['name'] for s in analysis['additional_skills']])
    print('Recommendations count:', len(analysis['recommendations']))
    print('First recommendation topic:', analysis['recommendations'][0]['topic'])
