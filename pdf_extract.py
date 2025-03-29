import PyPDF2
import re
import sys

# Extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                text += reader.pages[page_num].extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error extracting text: {str(e)}"

# Look for skills in the extracted text
def find_skills(text):
    # Define common skills to look for
    common_skills = [
        "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", 
        "React", "Angular", "Vue", "Node.js", "Django", "Flask", "Laravel", "Spring", 
        "Bootstrap", "MongoDB", "MySQL", "PostgreSQL", "HTML", "CSS", "Sass", "LESS",
        "TypeScript", "jQuery", "Firebase", "AWS", "Azure", "Google Cloud", "Docker",
        "Kubernetes", "Git", "GitHub", "GitLab", "Bitbucket", "Jenkins", "Travis", "CircleCI",
        "Express", "Redux", "GraphQL", "REST", "API", "Heroku", "Netlify", "Vercel",
        "Webpack", "Babel", "ESLint", "Prettier", "Jest", "Mocha", "Chai", "Cypress", 
        "Selenium", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy", 
        "SciPy", "Matplotlib", "Data Analysis", "Machine Learning", "Deep Learning", 
        "Natural Language Processing", "Computer Vision"
    ]
    
    found_skills = []
    for skill in common_skills:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)
    
    return found_skills

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pdf_extract.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    # Extract text
    text = extract_text_from_pdf(pdf_path)
    print("====== EXTRACTED TEXT (First 1000 chars) ======")
    print(text[:1000])
    print("==============================================")
    
    # Try a different method for binary text extraction
    try:
        print("\n====== ATTEMPTING BINARY TEXT EXTRACTION ======")
        with open(pdf_path, 'rb') as file:
            raw_bytes = file.read()
            binary_text = raw_bytes.decode('utf-8', errors='ignore')
            print(binary_text[:1000])
            print("==============================================")
    except Exception as e:
        print(f"Binary extraction error: {str(e)}")
    
    # Look for skill-related sections
    print("\n====== LOOKING FOR SKILL SECTIONS ======")
    skill_related_terms = ["skill", "technical", "computer", "programming", "language", "framework", "technology"]
    lines = text.split('\n')
    for i, line in enumerate(lines):
        for term in skill_related_terms:
            if term.lower() in line.lower():
                print(f"Found potential skill section at line {i}: {line}")
                # Print the next few lines for context
                for j in range(1, 6):
                    if i + j < len(lines):
                        print(f"  Context line {i+j}: {lines[i+j]}")
    
    # Find skills in the extracted text
    skills = find_skills(text)
    print("\n====== FOUND SKILLS ======")
    print(skills)
    print("=========================")