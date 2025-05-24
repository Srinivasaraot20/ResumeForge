from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with Resume model
    resumes = db.relationship('Resume', backref='author', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Resume(db.Model):
    __tablename__ = 'resumes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    template_id = db.Column(db.Integer, nullable=False, default=1)
    content = db.Column(db.Text, nullable=False, default="{}")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_content(self):
        return json.loads(self.content)
    
    def set_content(self, content_dict):
        self.content = json.dumps(content_dict)
    
    def __repr__(self):
        return f'<Resume {self.title}>'

# Default resume sections structure
def default_resume_content():
    return {
        "personal_info": {
            "name": "",
            "email": "",
            "phone": "",
            "address": "",
            "linkedin": "",
            "website": "",
            "github": "",
            "twitter": "",
            "professional_title": "",
            "summary": "",
            "profile_image": ""
        },
        "education": [],
        "experience": [],
        "skills": [],
        "projects": [],
        "certifications": [],
        "languages": [],
        "interests": [],
        "awards": [],
        "publications": [],
        "references": [],
        "volunteer_experience": [],
        "custom_sections": []
    }
