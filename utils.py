import os
import tempfile
from flask import render_template, url_for
import weasyprint
from models import default_resume_content

def create_pdf(resume, template_path):
    """Generate a PDF from a resume and template"""
    html_content = render_template(template_path, resume=resume, content=resume.get_content(), pdf_mode=True)
    
    # Create a temporary file to store the PDF
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
        temp_path = temp.name
    
    # Generate PDF from HTML content
    pdf = weasyprint.HTML(string=html_content).write_pdf()
    
    # Write PDF to the temporary file
    with open(temp_path, 'wb') as f:
        f.write(pdf)
    
    return temp_path

def get_template_path(template_id):
    """Get the path to a resume template based on its ID"""
    templates = {
        1: 'resume_templates/template1.html',
        2: 'resume_templates/template2.html',
        3: 'resume_templates/template3.html',
        4: 'resume_templates/template4.html'
    }
    return templates.get(template_id, templates[1])

def get_template_preview_image(template_id):
    """Get the URL to a template preview image"""
    return url_for('static', filename=f'svg/template{template_id}.svg')

def get_template_name(template_id):
    """Get the display name of a resume template"""
    templates = {
        1: 'Professional',
        2: 'Modern',
        3: 'Creative',
        4: 'Minimal'
    }
    return templates.get(template_id, templates[1])

def create_new_resume_content():
    """Create a new resume with default content structure"""
    return default_resume_content()
