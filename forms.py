from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, SelectField, FieldList, FormField, DateField, HiddenField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError, Optional
from models import User

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username already taken. Please choose a different one.')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email already registered. Please use a different one.')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class ResumeForm(FlaskForm):
    title = StringField('Resume Title', validators=[DataRequired(), Length(max=100)])
    template_id = SelectField('Template', choices=[(1, 'Professional'), (2, 'Modern'), (3, 'Creative'), (4, 'Minimal')], coerce=int)
    submit = SubmitField('Save Resume')

class PersonalInfoForm(FlaskForm):
    name = StringField('Full Name', validators=[DataRequired(), Length(max=100)])
    professional_title = StringField('Professional Title', validators=[Length(max=100)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    phone = StringField('Phone', validators=[Length(max=20)])
    address = StringField('Address', validators=[Length(max=200)])
    linkedin = StringField('LinkedIn URL', validators=[Length(max=200)])
    github = StringField('GitHub URL', validators=[Length(max=200)])
    twitter = StringField('Twitter/X URL', validators=[Length(max=200)])
    website = StringField('Personal Website', validators=[Length(max=200)])
    profile_image = StringField('Profile Image URL', validators=[Length(max=500)])
    summary = TextAreaField('Professional Summary', validators=[Length(max=1500)])

class EducationItemForm(FlaskForm):
    institution = StringField('Institution', validators=[DataRequired(), Length(max=100)])
    degree = StringField('Degree', validators=[DataRequired(), Length(max=100)])
    field_of_study = StringField('Field of Study', validators=[Length(max=100)])
    start_date = DateField('Start Date', format='%Y-%m-%d', validators=[Optional()])
    end_date = DateField('End Date', format='%Y-%m-%d', validators=[Optional()])
    description = TextAreaField('Description', validators=[Length(max=500)])
    
class ExperienceItemForm(FlaskForm):
    company = StringField('Company', validators=[DataRequired(), Length(max=100)])
    position = StringField('Position', validators=[DataRequired(), Length(max=100)])
    location = StringField('Location', validators=[Length(max=100)])
    start_date = DateField('Start Date', format='%Y-%m-%d', validators=[Optional()])
    end_date = DateField('End Date', format='%Y-%m-%d', validators=[Optional()])
    description = TextAreaField('Description', validators=[Length(max=1000)])

class SkillItemForm(FlaskForm):
    name = StringField('Skill Name', validators=[DataRequired(), Length(max=50)])
    level = SelectField('Skill Level', choices=[
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
        ('Expert', 'Expert')
    ])

class ProjectItemForm(FlaskForm):
    title = StringField('Project Title', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[Length(max=500)])
    url = StringField('Project URL', validators=[Length(max=200)])
    start_date = DateField('Start Date', format='%Y-%m-%d', validators=[Optional()])
    end_date = DateField('End Date', format='%Y-%m-%d', validators=[Optional()])

class CertificationItemForm(FlaskForm):
    title = StringField('Certification Title', validators=[DataRequired(), Length(max=100)])
    issuer = StringField('Issuing Organization', validators=[Length(max=100)])
    date = DateField('Date Earned', format='%Y-%m-%d', validators=[Optional()])
    description = TextAreaField('Description', validators=[Length(max=300)])

class LanguageItemForm(FlaskForm):
    language = StringField('Language', validators=[DataRequired(), Length(max=50)])
    proficiency = SelectField('Proficiency', choices=[
        ('Elementary', 'Elementary'),
        ('Limited Working', 'Limited Working'),
        ('Professional Working', 'Professional Working'),
        ('Full Professional', 'Full Professional'),
        ('Native/Bilingual', 'Native/Bilingual')
    ])

class InterestItemForm(FlaskForm):
    name = StringField('Interest', validators=[DataRequired(), Length(max=50)])
    
class AwardItemForm(FlaskForm):
    title = StringField('Award Title', validators=[DataRequired(), Length(max=100)])
    issuer = StringField('Issuing Organization', validators=[Length(max=100)])
    date = DateField('Date Received', format='%Y-%m-%d', validators=[Optional()])
    description = TextAreaField('Description', validators=[Length(max=300)])

class PublicationItemForm(FlaskForm):
    title = StringField('Publication Title', validators=[DataRequired(), Length(max=150)])
    publisher = StringField('Publisher', validators=[Length(max=100)])
    date = DateField('Publication Date', format='%Y-%m-%d', validators=[Optional()])
    url = StringField('URL', validators=[Length(max=200)])
    description = TextAreaField('Description', validators=[Length(max=500)])

class ReferenceItemForm(FlaskForm):
    name = StringField('Reference Name', validators=[DataRequired(), Length(max=100)])
    company = StringField('Company', validators=[Length(max=100)])
    position = StringField('Position', validators=[Length(max=100)])
    email = StringField('Email', validators=[Email(), Length(max=100)])
    phone = StringField('Phone', validators=[Length(max=20)])
    reference_text = TextAreaField('Reference Text', validators=[Length(max=500)])

class VolunteerExperienceItemForm(FlaskForm):
    organization = StringField('Organization', validators=[DataRequired(), Length(max=100)])
    role = StringField('Role', validators=[DataRequired(), Length(max=100)])
    start_date = DateField('Start Date', format='%Y-%m-%d', validators=[Optional()])
    end_date = DateField('End Date', format='%Y-%m-%d', validators=[Optional()])
    description = TextAreaField('Description', validators=[Length(max=500)])

class CustomSectionForm(FlaskForm):
    title = StringField('Section Title', validators=[DataRequired(), Length(max=50)])
    content = TextAreaField('Content', validators=[Length(max=1000)])
