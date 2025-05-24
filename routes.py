from flask import render_template, url_for, flash, redirect, request, jsonify, send_file, abort
from flask_login import login_user, current_user, logout_user, login_required
from app import app, db
from models import User, Resume, default_resume_content
from forms import (
    RegistrationForm, LoginForm, ResumeForm, PersonalInfoForm,
    EducationItemForm, ExperienceItemForm, SkillItemForm,
    ProjectItemForm, CertificationItemForm, LanguageItemForm, InterestItemForm,
    AwardItemForm, PublicationItemForm, ReferenceItemForm, VolunteerExperienceItemForm, CustomSectionForm
)
from utils import create_pdf, get_template_path, get_template_preview_image, get_template_name
import ai_generator
import json
import os

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        
        db.session.add(user)
        db.session.commit()
        
        flash('Your account has been created! You can now log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('auth/register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        
        if user and user.check_password(form.password.data):
            login_user(user)
            next_page = request.args.get('next')
            flash('You have successfully logged in!', 'success')
            return redirect(next_page or url_for('dashboard'))
        else:
            flash('Login failed. Please check your email and password.', 'danger')
    
    return render_template('auth/login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    resumes = Resume.query.filter_by(user_id=current_user.id).order_by(Resume.updated_at.desc()).all()
    return render_template('dashboard.html', resumes=resumes, get_template_name=get_template_name)

@app.route('/resume/new', methods=['GET', 'POST'])
@login_required
def new_resume():
    form = ResumeForm()
    
    if form.validate_on_submit():
        resume = Resume(
            title=form.title.data,
            template_id=form.template_id.data,
            user_id=current_user.id
        )
        resume.set_content(default_resume_content())
        
        db.session.add(resume)
        db.session.commit()
        
        flash('Your new resume has been created!', 'success')
        return redirect(url_for('edit_resume', resume_id=resume.id))
    
    return render_template('editor.html', form=form, mode='new')

@app.route('/resume/<int:resume_id>')
@login_required
def view_resume(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    
    # Check if the resume belongs to the current user
    if resume.user_id != current_user.id:
        abort(403)
    
    template_path = get_template_path(resume.template_id)
    content = resume.get_content()
    return render_template('preview.html', resume=resume, content=content, template_path=template_path)

@app.route('/resume/<int:resume_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_resume(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    
    # Check if the resume belongs to the current user
    if resume.user_id != current_user.id:
        abort(403)
    
    form = ResumeForm(obj=resume)
    
    if form.validate_on_submit():
        resume.title = form.title.data
        resume.template_id = form.template_id.data
        
        db.session.commit()
        flash('Resume information updated!', 'success')
        return redirect(url_for('edit_resume', resume_id=resume.id))
    
    template_path = get_template_path(resume.template_id)
    return render_template('editor.html', form=form, resume=resume, mode='edit', template_path=template_path)

@app.route('/resume/<int:resume_id>/content', methods=['GET', 'PUT'])
@login_required
def resume_content(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    
    # Check if the resume belongs to the current user
    if resume.user_id != current_user.id:
        abort(403)
    
    if request.method == 'GET':
        return jsonify(resume.get_content())
    
    elif request.method == 'PUT':
        content = request.json
        resume.set_content(content)
        db.session.commit()
        return jsonify({'status': 'success'})

@app.route('/resume/<int:resume_id>/delete', methods=['POST'])
@login_required
def delete_resume(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    
    # Check if the resume belongs to the current user
    if resume.user_id != current_user.id:
        abort(403)
    
    db.session.delete(resume)
    db.session.commit()
    
    flash('Resume deleted successfully!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/resume/<int:resume_id>/pdf')
@login_required
def download_pdf(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    
    # Check if the resume belongs to the current user
    if resume.user_id != current_user.id:
        abort(403)
    
    template_path = get_template_path(resume.template_id)
    pdf_path = create_pdf(resume, template_path)
    
    return send_file(
        pdf_path,
        as_attachment=True,
        download_name=f"{resume.title.replace(' ', '_')}.pdf",
        mimetype='application/pdf'
    )

@app.route('/templates')
def get_templates():
    """Get all available resume templates"""
    templates = [
        {
            'id': 1,
            'name': 'Professional',
            'preview': get_template_preview_image(1)
        },
        {
            'id': 2,
            'name': 'Modern',
            'preview': get_template_preview_image(2)
        },
        {
            'id': 3,
            'name': 'Creative',
            'preview': get_template_preview_image(3)
        },
        {
            'id': 4,
            'name': 'Minimal',
            'preview': get_template_preview_image(4)
        }
    ]
    
    return jsonify(templates)

@app.route('/resume/<int:resume_id>/duplicate', methods=['POST'])
@login_required
def duplicate_resume(resume_id):
    original = Resume.query.get_or_404(resume_id)
    
    # Check if the resume belongs to the current user
    if original.user_id != current_user.id:
        abort(403)
    
    # Create a duplicate resume
    duplicate = Resume(
        title=f"{original.title} (Copy)",
        template_id=original.template_id,
        content=original.content,
        user_id=current_user.id
    )
    
    db.session.add(duplicate)
    db.session.commit()
    
    flash('Resume duplicated successfully!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/api/ai/generate', methods=['POST'])
@login_required
def generate_ai_content():
    """Generate AI-powered content for a resume section"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    section_type = data.get('section_type')
    profile_data = data.get('profile_data', {})
    
    if not section_type:
        return jsonify({"error": "No section type specified"}), 400
    
    # Process different section types
    if section_type == 'summary':
        role = profile_data.get('role', '')
        years_experience = int(profile_data.get('years_experience', 3))
        industry = profile_data.get('industry', '')
        summary = ai_generator.generate_summary(role, years_experience, industry)
        return jsonify({"content": summary})
        
    elif section_type == 'experience':
        role = profile_data.get('role', '')
        count = int(profile_data.get('count', 3))
        bullets = ai_generator.generate_experience_bullets(role, count)
        return jsonify({"content": bullets})
        
    elif section_type == 'skills':
        role = profile_data.get('role', '')
        count = int(profile_data.get('count', 5))
        skills = ai_generator.suggest_skills(role, count)
        return jsonify({"content": skills})
        
    elif section_type == 'education':
        field = profile_data.get('field', '')
        education = ai_generator.suggest_education(field)
        return jsonify({"content": education})
        
    elif section_type == 'certifications':
        role = profile_data.get('role', '')
        count = int(profile_data.get('count', 2))
        certifications = ai_generator.suggest_certifications(role, count)
        return jsonify({"content": certifications})
        
    elif section_type == 'projects':
        role = profile_data.get('role', '')
        count = int(profile_data.get('count', 3))
        projects = ai_generator.generate_project_ideas(role, count)
        return jsonify({"content": projects})
        
    elif section_type == 'full_resume':
        # Generate content for multiple resume sections
        content = ai_generator.generate_ai_resume_content(profile_data)
        return jsonify({"content": content})
        
    else:
        return jsonify({"error": "Invalid section type"}), 400
