"""
AI-like resume content generator
This module provides functionality to generate professional resume content
without requiring external API dependencies.
"""

import random
from typing import Dict, List, Any, Optional

# Templates for various resume sections
SUMMARY_TEMPLATES = [
    "Experienced {role} with {years} years of expertise in {skills}. Proven track record of {achievement} and {achievement2}. Seeking to leverage my skills in {target_area} to drive success for {target_company_type} organizations.",
    "Detail-oriented {role} with a passion for {passion}. {years} years of experience in {industry}, specializing in {specialization}. Demonstrated ability to {achievement} while maintaining {quality}.",
    "Results-driven {role} with extensive background in {skills}. Adept at {strength} and {strength2}, with a proven history of {achievement}. Looking to contribute my expertise to {target_area} initiatives.",
    "Innovative {role} with strong {skills} skills. Experienced in {experience_area} with a focus on {focus_area}. Successfully {achievement} resulting in {result}. Eager to apply my knowledge to new challenges in {target_area}.",
    "Strategic and analytical {role} with {years} years in {industry}. Expertise includes {skills} and {skills2}. Known for {strength} and delivering {deliverable} that {result}."
]

EXPERIENCE_BULLET_TEMPLATES = [
    "Led a team of {team_size} professionals, resulting in {improvement} improvement in {metric}",
    "Developed and implemented {strategy} strategies that increased {metric} by {percentage}%",
    "Managed {project_type} projects with budgets exceeding ${budget_size}, delivering {result}",
    "Created {product} that {benefit}, leading to {improvement} in {metric}",
    "Streamlined {process} processes, reducing {negative_metric} by {percentage}% and improving {positive_metric}",
    "Collaborated with cross-functional teams to {action} and {action2}, resulting in {result}",
    "Spearheaded the implementation of {technology}, which {benefit}",
    "Conducted {analysis_type} analysis to identify {issue} and developed solutions that {solution_result}",
    "Negotiated {negotiation_item} with {stakeholders}, saving the company ${savings} annually",
    "Trained and mentored {trainee_count} team members in {skill_area}, improving team performance by {percentage}%"
]

SKILL_SUGGESTIONS = {
    "Software Developer": ["JavaScript", "Python", "React", "Node.js", "API Development", "Git", "Agile Methodologies", "SQL", "Problem Solving", "Unit Testing"],
    "Data Scientist": ["Python", "R", "Machine Learning", "Data Visualization", "Statistical Analysis", "SQL", "Data Cleaning", "Predictive Modeling", "NumPy", "Pandas"],
    "Marketing Manager": ["Campaign Management", "Social Media Marketing", "SEO/SEM", "Content Strategy", "Market Research", "Google Analytics", "Email Marketing", "Brand Development", "A/B Testing", "CRM Software"],
    "Project Manager": ["Project Planning", "Team Leadership", "Stakeholder Management", "Agile", "Scrum", "Budget Management", "Risk Assessment", "Microsoft Project", "Jira", "Change Management"],
    "Financial Analyst": ["Financial Modeling", "Forecasting", "Budgeting", "Excel", "Data Analysis", "Financial Reporting", "Accounting Principles", "Trend Analysis", "Variance Analysis", "Bloomberg Terminal"],
    "Graphic Designer": ["Adobe Creative Suite", "Illustrator", "Photoshop", "InDesign", "Typography", "Color Theory", "UI/UX Design", "Wireframing", "Brand Identity", "Print Design"],
    "Human Resources": ["Recruitment", "Employee Relations", "Performance Management", "Benefit Administration", "Onboarding", "HRIS Systems", "Conflict Resolution", "Labor Laws", "Training & Development", "Succession Planning"],
    "Sales Representative": ["Negotiation", "CRM Software", "Client Relationship Management", "Lead Generation", "Sales Presentations", "Cold Calling", "Territory Management", "Consultative Selling", "Closing Techniques", "Market Analysis"]
}

EDUCATION_DEGREE_SUGGESTIONS = [
    "Bachelor of Science in {field}",
    "Bachelor of Arts in {field}",
    "Master of Science in {field}",
    "Master of Business Administration",
    "Master of Arts in {field}",
    "Doctor of Philosophy in {field}",
    "Associate Degree in {field}",
    "Bachelor of Engineering in {field}",
    "Bachelor of Business Administration",
    "Master of Engineering in {field}"
]

EDUCATION_FIELDS = [
    "Computer Science", "Business Administration", "Marketing", 
    "Finance", "Engineering", "Psychology", "Economics", 
    "Communications", "Information Technology", "Data Science",
    "Graphic Design", "Human Resources Management", "Biology",
    "Chemistry", "Physics", "Mathematics", "English Literature",
    "Political Science", "International Relations", "History"
]

CERTIFICATION_SUGGESTIONS = {
    "Software Developer": ["AWS Certified Developer", "Microsoft Certified: Azure Developer", "Oracle Certified Professional, Java SE Programmer", "Certified Kubernetes Administrator", "Google Professional Cloud Developer", "Certified Scrum Developer"],
    "Data Scientist": ["Google Professional Data Engineer", "Microsoft Certified: Azure Data Scientist", "IBM Data Science Professional", "Cloudera Certified Professional: Data Scientist", "SAS Certified Data Scientist", "TensorFlow Developer Certificate"],
    "Marketing Manager": ["Google Ads Certification", "HubSpot Content Marketing Certification", "Facebook Blueprint Certification", "SEMrush SEO Certification", "Hootsuite Social Marketing Certification", "Google Analytics Individual Qualification"],
    "Project Manager": ["Project Management Professional (PMP)", "Certified Scrum Master (CSM)", "PRINCE2 Certification", "Agile Certified Practitioner (PMI-ACP)", "Certified Associate in Project Management (CAPM)", "Professional Scrum Product Owner"],
    "Financial Analyst": ["Chartered Financial Analyst (CFA)", "Financial Risk Manager (FRM)", "Certified Financial Planner (CFP)", "Chartered Alternative Investment Analyst (CAIA)", "Certified Management Accountant (CMA)", "Bloomberg Market Concepts"],
    "Graphic Designer": ["Adobe Certified Expert (ACE)", "Certified Web Designer Apprentice", "Graphic Design Certification (GDC)", "UI/UX Design Certification", "Autodesk Certified Professional", "Sketch Certified"],
    "Human Resources": ["Professional in Human Resources (PHR)", "Senior Professional in Human Resources (SPHR)", "SHRM Certified Professional (SHRM-CP)", "SHRM Senior Certified Professional (SHRM-SCP)", "Certified Compensation Professional (CCP)", "Certified Benefits Professional (CBP)"],
    "Sales Representative": ["Certified Professional Sales Person (CPSP)", "Certified Inside Sales Professional (CISP)", "Challenger Development Program", "SPIN Selling Certification", "Certified Sales Leadership Professional (CSLP)", "Certified Professional Sales Coach (CPSC)"]
}

def generate_summary(role: str, years_experience: int, industry: str = "") -> str:
    """Generate a professional summary based on role and experience."""
    template = random.choice(SUMMARY_TEMPLATES)
    
    # Default values
    skills = "various technical areas"
    achievement = "delivering high-quality results"
    achievement2 = "meeting objectives"
    target_area = "relevant domains"
    target_company_type = "forward-thinking"
    passion = "excellence"
    specialization = "key areas"
    strength = "problem solving"
    strength2 = "effective communication"
    experience_area = "multiple projects"
    focus_area = "continuous improvement"
    result = "positive outcomes"
    deliverable = "solutions"
    skills2 = "relevant competencies"
    
    # Get skills based on role if available
    if role.lower() in [r.lower() for r in SKILL_SUGGESTIONS.keys()]:
        role_key = next(r for r in SKILL_SUGGESTIONS.keys() if r.lower() == role.lower())
        skills_list = SKILL_SUGGESTIONS[role_key]
        skills = ", ".join(random.sample(skills_list, min(3, len(skills_list))))
        skills2 = ", ".join(random.sample(skills_list, min(2, len(skills_list))))
    
    # Set industry string
    industry_str = industry if industry else "the industry"
    
    # Format template with available information
    return template.format(
        role=role,
        years=years_experience,
        skills=skills,
        achievement=achievement,
        achievement2=achievement2,
        target_area=target_area,
        target_company_type=target_company_type,
        passion=passion,
        industry=industry_str,
        specialization=specialization,
        strength=strength,
        strength2=strength2,
        experience_area=experience_area,
        focus_area=focus_area,
        result=result,
        deliverable=deliverable,
        skills2=skills2
    )

def generate_experience_bullets(role: str, num_bullets: int = 3) -> List[str]:
    """Generate professional experience bullet points based on role."""
    bullets = []
    templates = random.sample(EXPERIENCE_BULLET_TEMPLATES, min(num_bullets, len(EXPERIENCE_BULLET_TEMPLATES)))
    
    for template in templates:
        # Default values for placeholders
        team_size = random.randint(3, 15)
        improvement = f"{random.randint(10, 50)}%"
        metric = random.choice(["productivity", "efficiency", "customer satisfaction", "sales", "revenue", "user engagement"])
        strategy = random.choice(["marketing", "sales", "operational", "business development", "customer retention"])
        percentage = random.randint(10, 50)
        project_type = random.choice(["development", "implementation", "integration", "migration", "optimization"])
        budget_size = random.choice(["100K", "250K", "500K", "1M", "2M"])
        result = random.choice(["on time and under budget", "exceeding expectations", "with exceptional results", "leading to significant ROI"])
        product = random.choice(["solutions", "applications", "systems", "frameworks", "tools", "platforms"])
        benefit = random.choice(["enhanced user experience", "streamlined operations", "reduced costs", "increased revenue", "improved productivity"])
        process = random.choice(["operational", "administrative", "development", "production", "customer service", "sales"])
        negative_metric = random.choice(["costs", "downtime", "errors", "processing time", "manual effort"])
        positive_metric = random.choice(["efficiency", "accuracy", "throughput", "customer satisfaction", "employee morale"])
        action = random.choice(["develop innovative solutions", "implement new strategies", "optimize existing processes", "create comprehensive documentation", "design scalable systems"])
        action2 = random.choice(["achieve project goals", "exceed performance metrics", "meet strict deadlines", "satisfy client requirements", "reduce operational costs"])
        technology = random.choice(["new technologies", "enterprise software", "automation tools", "data analytics platform", "customer relationship management system"])
        analysis_type = random.choice(["in-depth", "competitive", "market", "financial", "operational", "performance"])
        issue = random.choice(["inefficiencies", "bottlenecks", "revenue leakage", "quality issues", "customer pain points"])
        solution_result = random.choice(["increased profitability", "enhanced customer experience", "streamlined operations", "reduced costs", "improved team productivity"])
        negotiation_item = random.choice(["contracts", "vendor agreements", "partnerships", "service level agreements", "licensing terms"])
        stakeholders = random.choice(["key vendors", "strategic partners", "service providers", "suppliers", "contractors"])
        savings = random.choice(["50K", "100K", "250K", "500K", "1M"])
        trainee_count = random.randint(3, 20)
        skill_area = random.choice(["technical skills", "customer service", "sales techniques", "operational procedures", "quality management"])
        
        # Format template with placeholders
        bullet = template.format(
            team_size=team_size,
            improvement=improvement,
            metric=metric,
            strategy=strategy,
            percentage=percentage,
            project_type=project_type,
            budget_size=budget_size,
            result=result,
            product=product,
            benefit=benefit,
            process=process,
            negative_metric=negative_metric,
            positive_metric=positive_metric,
            action=action,
            action2=action2,
            technology=technology,
            analysis_type=analysis_type,
            issue=issue,
            solution_result=solution_result,
            negotiation_item=negotiation_item,
            stakeholders=stakeholders,
            savings=savings,
            trainee_count=trainee_count,
            skill_area=skill_area
        )
        bullets.append(bullet)
    
    return bullets

def suggest_skills(role: str, count: int = 5) -> List[str]:
    """Suggest relevant skills based on role."""
    # Look for exact or similar role match
    matching_role = None
    for known_role in SKILL_SUGGESTIONS.keys():
        if role.lower() in known_role.lower() or known_role.lower() in role.lower():
            matching_role = known_role
            break
    
    # If no match found, return generic skills
    if not matching_role:
        generic_skills = [
            "Communication", "Problem Solving", "Teamwork", "Adaptability", 
            "Time Management", "Critical Thinking", "Organization", 
            "Leadership", "Attention to Detail", "Project Management"
        ]
        return random.sample(generic_skills, min(count, len(generic_skills)))
    
    # Return skills for the matching role
    skills = SKILL_SUGGESTIONS[matching_role]
    return random.sample(skills, min(count, len(skills)))

def suggest_education(field: Optional[str] = None) -> Dict[str, str]:
    """Generate education suggestion."""
    if not field:
        field = random.choice(EDUCATION_FIELDS)
    
    degree_template = random.choice(EDUCATION_DEGREE_SUGGESTIONS)
    degree = degree_template.format(field=field)
    
    # Generate a realistic institution name
    institutions = [
        "University of {state}", "{city} State University", "{state} Technical Institute",
        "Northern {state} University", "{city} College", "{city} Institute of Technology"
    ]
    states = ["California", "New York", "Texas", "Illinois", "Florida", "Washington", "Michigan", "Pennsylvania"]
    cities = ["San Francisco", "Boston", "Chicago", "Austin", "Seattle", "Atlanta", "Denver", "Portland"]
    
    institution_template = random.choice(institutions)
    location = random.choice(states if "{state}" in institution_template else cities)
    institution = institution_template.format(state=location, city=location)
    
    return {
        "institution": institution,
        "degree": degree,
        "field_of_study": field
    }

def suggest_certifications(role: str, count: int = 2) -> List[str]:
    """Suggest relevant certifications based on role."""
    # Look for exact or similar role match
    matching_role = None
    for known_role in CERTIFICATION_SUGGESTIONS.keys():
        if role.lower() in known_role.lower() or known_role.lower() in role.lower():
            matching_role = known_role
            break
    
    # If no match found, return generic certifications
    if not matching_role:
        generic_certs = [
            "Professional Certification in Business Management",
            "Leadership Development Certificate",
            "Project Management Fundamentals",
            "Digital Marketing Certificate",
            "Professional Communication Skills Certificate",
            "Data Analysis Fundamentals"
        ]
        return random.sample(generic_certs, min(count, len(generic_certs)))
    
    # Return certifications for the matching role
    certs = CERTIFICATION_SUGGESTIONS[matching_role]
    return random.sample(certs, min(count, len(certs)))

def generate_job_title_suggestions(industry: Optional[str] = None) -> List[str]:
    """Generate job title suggestions, optionally filtered by industry."""
    titles = {
        "Technology": [
            "Software Engineer", "Full Stack Developer", "DevOps Engineer", 
            "Data Scientist", "Product Manager", "UX/UI Designer",
            "Cloud Solutions Architect", "Systems Administrator", "IT Project Manager"
        ],
        "Marketing": [
            "Marketing Manager", "Digital Marketing Specialist", "Brand Strategist",
            "Content Marketing Manager", "SEO Specialist", "Social Media Manager",
            "Marketing Analyst", "Public Relations Specialist", "Growth Marketer"
        ],
        "Finance": [
            "Financial Analyst", "Accountant", "Investment Banker",
            "Financial Advisor", "Risk Manager", "Budget Analyst",
            "Tax Specialist", "Financial Controller", "Wealth Manager"
        ],
        "Healthcare": [
            "Clinical Research Associate", "Healthcare Administrator", "Medical Director",
            "Nurse Practitioner", "Physician Assistant", "Health Informatics Specialist",
            "Healthcare Consultant", "Clinical Manager", "Medical Science Liaison"
        ],
        "Education": [
            "Curriculum Developer", "Educational Consultant", "Academic Advisor",
            "E-Learning Specialist", "Education Program Manager", "Instructional Designer",
            "School Administrator", "Education Technology Specialist", "Academic Coordinator"
        ]
    }
    
    if industry and industry in titles:
        return titles[industry]
    
    # If no industry specified or not found, return a mix
    all_titles = []
    for ind_titles in titles.values():
        all_titles.extend(ind_titles)
    
    return random.sample(all_titles, min(10, len(all_titles)))

def generate_project_ideas(role: str, count: int = 3) -> List[Dict[str, str]]:
    """Generate project ideas based on role."""
    project_templates = {
        "Software Developer": [
            {"title": "E-commerce Platform Redesign", "description": "Led the modernization of the company's e-commerce platform, implementing responsive design and optimizing the checkout process, resulting in a 30% increase in mobile conversion rates."},
            {"title": "API Integration System", "description": "Designed and developed a centralized API integration system that connects with 15+ third-party services, reducing development time for new integrations by 60%."},
            {"title": "Automated Testing Framework", "description": "Created a comprehensive automated testing framework that reduced QA time by 70% and improved code quality by catching 95% of bugs before production deployment."}
        ],
        "Data Scientist": [
            {"title": "Customer Segmentation Model", "description": "Developed a machine learning model that identified 5 distinct customer segments, enabling targeted marketing campaigns that increased customer engagement by 45%."},
            {"title": "Predictive Maintenance System", "description": "Built a predictive maintenance system using IoT data that reduced equipment downtime by 35% and maintenance costs by $500K annually."},
            {"title": "Demand Forecasting Algorithm", "description": "Created an advanced forecasting algorithm that improved inventory management accuracy by 40%, reducing excess inventory costs by $2M per year."}
        ],
        "Marketing": [
            {"title": "Omnichannel Marketing Campaign", "description": "Designed and executed an omnichannel marketing strategy across digital and traditional channels, resulting in a 50% increase in qualified leads and 28% growth in conversion rates."},
            {"title": "Content Marketing Initiative", "description": "Spearheaded a content marketing initiative that increased organic traffic by 85% and improved domain authority from 35 to 65 within 12 months."},
            {"title": "Customer Loyalty Program", "description": "Developed and launched a customer loyalty program that improved retention rates by 40% and increased average customer lifetime value by $1,200."}
        ],
        "Project Manager": [
            {"title": "Enterprise Software Implementation", "description": "Managed the implementation of an enterprise-wide ERP system for 500+ users across 5 departments, completing the project 2 weeks ahead of schedule and 15% under budget."},
            {"title": "Cross-functional Process Optimization", "description": "Led a cross-functional team to optimize core business processes, resulting in 35% reduction in processing time and $1.2M in annual cost savings."},
            {"title": "Agile Transformation Initiative", "description": "Directed the company's agile transformation initiative, transitioning 12 teams to Scrum methodology, which improved delivery predictability by 60% and reduced time-to-market by 40%."}
        ]
    }
    
    # Look for exact or similar role match
    matching_role = None
    for known_role in project_templates.keys():
        if role.lower() in known_role.lower() or known_role.lower() in role.lower():
            matching_role = known_role
            break
    
    # If no match found, create generic projects
    if not matching_role:
        generic_projects = [
            {"title": "Process Improvement Initiative", "description": "Led a team to optimize core business processes, resulting in 25% efficiency improvement and significant cost savings."},
            {"title": "Strategic Planning Project", "description": "Developed and implemented a comprehensive strategic plan that aligned department goals with organizational objectives, improving overall performance metrics."},
            {"title": "Team Development Program", "description": "Created and facilitated a professional development program for team members, resulting in improved skills and 30% reduction in turnover."}
        ]
        return generic_projects[:count]
    
    # Return projects for the matching role
    return project_templates[matching_role][:count]

def generate_ai_resume_content(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate AI-powered content for a resume based on provided profile data."""
    
    # Extract basic profile information
    role = profile_data.get('role', 'Professional')
    years_experience = profile_data.get('years_experience', 5)
    industry = profile_data.get('industry', "")
    
    # Generate content for different resume sections
    generated_content = {
        "summary": generate_summary(role, years_experience, industry),
        "skills": suggest_skills(role),
        "experience_bullets": generate_experience_bullets(role),
    }
    
    # Add education suggestion if not provided
    if 'education' not in profile_data or not profile_data['education']:
        field = profile_data.get('field')
        generated_content["education"] = suggest_education(field)
    
    # Add certification suggestions
    generated_content["certifications"] = suggest_certifications(role)
    
    # Add project suggestions
    generated_content["projects"] = generate_project_ideas(role)
    
    return generated_content