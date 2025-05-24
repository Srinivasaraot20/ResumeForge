/**
 * AI Resume Content Generator
 * This file contains functions for generating AI-powered resume content
 */

/**
 * Show a loading indicator
 */
function showLoading(message = 'Loading...') {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-info alert-dismissible fade show loading-alert';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div>${message}</div>
        </div>
    `;
    
    // Remove any existing loading alerts
    document.querySelectorAll('.loading-alert').forEach(el => el.remove());
    
    // Add the alert to the page
    const alertContainer = document.createElement('div');
    alertContainer.className = 'position-fixed top-0 start-50 translate-middle-x mt-3';
    alertContainer.style.zIndex = '9999';
    alertContainer.appendChild(alertDiv);
    document.body.appendChild(alertContainer);
}

/**
 * Hide the loading indicator
 */
function hideLoading() {
    // Close any existing loading alerts
    document.querySelectorAll('.loading-alert').forEach(el => {
        el.classList.remove('show');
        setTimeout(() => {
            el.remove();
        }, 300);
    });
}

/**
 * Show an alert message
 */
function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const alertContainer = document.createElement('div');
    alertContainer.className = 'position-fixed top-0 start-50 translate-middle-x mt-3';
    alertContainer.style.zIndex = '9999';
    alertContainer.appendChild(alertDiv);
    document.body.appendChild(alertContainer);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            alertContainer.remove();
        }, 300);
    }, 5000);
}

/**
 * Generate AI content for a specific resume section
 * @param {string} sectionType - The type of section to generate content for
 * @param {object} profileData - Data about the user's profile
 * @returns {Promise} - Promise resolving to the generated content
 */
async function generateAIContent(sectionType, profileData) {
    showLoading('Generating content...');
    
    try {
        const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                section_type: sectionType,
                profile_data: profileData
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate content');
        }
        
        const data = await response.json();
        hideLoading();
        return data.content;
    } catch (error) {
        hideLoading();
        showAlert('Error generating content: ' + error.message);
        console.error('Error generating content:', error);
        return null;
    }
}

/**
 * Generate a professional summary
 * @param {string} role - Professional role/title
 * @param {number} yearsExperience - Years of experience
 * @param {string} industry - Industry (optional)
 */
async function generateSummary(role, yearsExperience, industry = '') {
    if (!role) {
        showAlert('Please enter a professional role to generate a summary');
        return;
    }
    
    const profileData = {
        role: role,
        years_experience: parseInt(yearsExperience) || 3,
        industry: industry
    };
    
    const summary = await generateAIContent('summary', profileData);
    if (summary) {
        document.getElementById('summary').value = summary;
        updateField(document.getElementById('summary'));
        showAlert('Professional summary generated!', 'success');
    }
}

/**
 * Generate experience bullet points
 * @param {string} role - Professional role/title
 * @param {number} count - Number of bullet points to generate
 */
async function generateExperienceBullets(role, count = 3) {
    if (!role) {
        showAlert('Please enter a job title to generate experience bullet points');
        return;
    }
    
    const profileData = {
        role: role,
        count: count
    };
    
    const bullets = await generateAIContent('experience', profileData);
    if (bullets && bullets.length) {
        // Find the active experience item's description field and update it
        const activeItem = document.querySelector('.experience-item.active');
        if (activeItem) {
            const descriptionField = activeItem.querySelector('textarea[id^="experience_"]');
            if (descriptionField) {
                descriptionField.value = bullets.join('\n\n');
                updateField(descriptionField);
                showAlert('Experience bullet points generated!', 'success');
            }
        } else {
            showAlert('Please select or add an experience item first');
        }
    }
}

/**
 * Generate skill suggestions
 * @param {string} role - Professional role/title
 * @param {number} count - Number of skills to generate
 */
async function generateSkills(role, count = 5) {
    if (!role) {
        showAlert('Please enter a professional role to generate skill suggestions');
        return;
    }
    
    const profileData = {
        role: role,
        count: count
    };
    
    const skills = await generateAIContent('skills', profileData);
    if (skills && skills.length) {
        // Add each skill to the skills section
        skills.forEach(skill => {
            const skillsCount = document.querySelectorAll('.skill-item').length;
            const newSkillId = `skill_${Date.now()}_${skillsCount}`;
            
            // Create a new skill item
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item mb-2';
            skillItem.dataset.id = newSkillId;
            skillItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-5 mb-2">
                                <input type="text" class="form-control" name="name" 
                                       value="${skill}" onchange="updateField(this)">
                            </div>
                            <div class="col-md-5 mb-2">
                                <select class="form-select" name="level" onchange="updateField(this)">
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate" selected>Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div class="col-md-2 text-end">
                                <button type="button" class="btn btn-sm btn-danger" 
                                        onclick="removeItem('skills', '${newSkillId}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add the skill to resumeData
            if (!resumeData.skills) {
                resumeData.skills = [];
            }
            
            resumeData.skills.push({
                id: newSkillId,
                name: skill,
                level: 'Intermediate'
            });
            
            // Add the skill to the DOM
            const skillsContainer = document.querySelector('#skills-container');
            if (skillsContainer) {
                skillsContainer.appendChild(skillItem);
            }
        });
        
        updatePreview();
        showAlert('Skills generated and added!', 'success');
    }
}

/**
 * Generate education suggestion
 * @param {string} field - Field of study
 */
async function generateEducation(field = '') {
    const profileData = {
        field: field
    };
    
    const education = await generateAIContent('education', profileData);
    if (education) {
        // Create a new education item
        const educationCount = document.querySelectorAll('.education-item').length;
        const newEducationId = `education_${Date.now()}_${educationCount}`;
        
        // Create a new education item
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item mb-3';
        educationItem.dataset.id = newEducationId;
        educationItem.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="row mb-2">
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Institution</label>
                            <input type="text" class="form-control" name="institution" 
                                   value="${education.institution}" onchange="updateField(this)">
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Degree</label>
                            <input type="text" class="form-control" name="degree" 
                                   value="${education.degree}" onchange="updateField(this)">
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Field of Study</label>
                            <input type="text" class="form-control" name="field_of_study" 
                                   value="${education.field_of_study}" onchange="updateField(this)">
                        </div>
                        <div class="col-md-3 mb-2">
                            <label class="form-label">Start Date</label>
                            <input type="date" class="form-control" name="start_date" 
                                   value="" onchange="updateField(this)">
                        </div>
                        <div class="col-md-3 mb-2">
                            <label class="form-label">End Date</label>
                            <input type="date" class="form-control" name="end_date" 
                                   value="" onchange="updateField(this)">
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" name="description" rows="2" 
                                      onchange="updateField(this)"></textarea>
                        </div>
                    </div>
                    <div class="text-end">
                        <button type="button" class="btn btn-sm btn-danger" 
                                onclick="removeItem('education', '${newEducationId}')">
                            <i class="bi bi-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add the education to resumeData
        if (!resumeData.education) {
            resumeData.education = [];
        }
        
        resumeData.education.push({
            id: newEducationId,
            institution: education.institution,
            degree: education.degree,
            field_of_study: education.field_of_study,
            start_date: '',
            end_date: '',
            description: ''
        });
        
        // Add the education to the DOM
        const educationContainer = document.querySelector('#education-container');
        if (educationContainer) {
            educationContainer.appendChild(educationItem);
        }
        
        updatePreview();
        showAlert('Education generated and added!', 'success');
    }
}

/**
 * Generate certification suggestions
 * @param {string} role - Professional role/title
 * @param {number} count - Number of certifications to generate
 */
async function generateCertifications(role, count = 2) {
    if (!role) {
        showAlert('Please enter a professional role to generate certification suggestions');
        return;
    }
    
    const profileData = {
        role: role,
        count: count
    };
    
    const certifications = await generateAIContent('certifications', profileData);
    if (certifications && certifications.length) {
        // Add each certification to the certifications section
        certifications.forEach(certification => {
            const certCount = document.querySelectorAll('.certification-item').length;
            const newCertId = `certification_${Date.now()}_${certCount}`;
            
            // Create a new certification item
            const certItem = document.createElement('div');
            certItem.className = 'certification-item mb-3';
            certItem.dataset.id = newCertId;
            certItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="row mb-2">
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Title</label>
                                <input type="text" class="form-control" name="title" 
                                       value="${certification}" onchange="updateField(this)">
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Issuing Organization</label>
                                <input type="text" class="form-control" name="issuer" 
                                       value="" onchange="updateField(this)">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Date</label>
                                <input type="date" class="form-control" name="date" 
                                       value="" onchange="updateField(this)">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" name="description" rows="2" 
                                          onchange="updateField(this)"></textarea>
                            </div>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-sm btn-danger" 
                                    onclick="removeItem('certifications', '${newCertId}')">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add the certification to resumeData
            if (!resumeData.certifications) {
                resumeData.certifications = [];
            }
            
            resumeData.certifications.push({
                id: newCertId,
                title: certification,
                issuer: '',
                date: '',
                description: ''
            });
            
            // Add the certification to the DOM
            const certContainer = document.querySelector('#certifications-container');
            if (certContainer) {
                certContainer.appendChild(certItem);
            }
        });
        
        updatePreview();
        showAlert('Certifications generated and added!', 'success');
    }
}

/**
 * Generate project ideas
 * @param {string} role - Professional role/title
 * @param {number} count - Number of projects to generate
 */
async function generateProjects(role, count = 2) {
    if (!role) {
        showAlert('Please enter a professional role to generate project ideas');
        return;
    }
    
    const profileData = {
        role: role,
        count: count
    };
    
    const projects = await generateAIContent('projects', profileData);
    if (projects && projects.length) {
        // Add each project to the projects section
        projects.forEach(project => {
            const projectCount = document.querySelectorAll('.project-item').length;
            const newProjectId = `project_${Date.now()}_${projectCount}`;
            
            // Create a new project item
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item mb-3';
            projectItem.dataset.id = newProjectId;
            projectItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="row mb-2">
                            <div class="col-md-8 mb-2">
                                <label class="form-label">Title</label>
                                <input type="text" class="form-control" name="title" 
                                       value="${project.title}" onchange="updateField(this)">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">URL</label>
                                <input type="url" class="form-control" name="url" 
                                       value="" onchange="updateField(this)">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Start Date</label>
                                <input type="date" class="form-control" name="start_date" 
                                       value="" onchange="updateField(this)">
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label">End Date</label>
                                <input type="date" class="form-control" name="end_date" 
                                       value="" onchange="updateField(this)">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" name="description" rows="3" 
                                          onchange="updateField(this)">${project.description}</textarea>
                            </div>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-sm btn-danger" 
                                    onclick="removeItem('projects', '${newProjectId}')">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add the project to resumeData
            if (!resumeData.projects) {
                resumeData.projects = [];
            }
            
            resumeData.projects.push({
                id: newProjectId,
                title: project.title,
                url: '',
                start_date: '',
                end_date: '',
                description: project.description
            });
            
            // Add the project to the DOM
            const projectContainer = document.querySelector('#projects-container');
            if (projectContainer) {
                projectContainer.appendChild(projectItem);
            }
        });
        
        updatePreview();
        showAlert('Projects generated and added!', 'success');
    }
}

/**
 * Generate content for an entire resume
 * @param {string} role - Professional role/title
 * @param {number} yearsExperience - Years of experience
 * @param {string} industry - Industry
 */
async function generateFullResume(role, yearsExperience, industry = '') {
    if (!role) {
        showAlert('Please enter a professional role to generate a resume');
        return;
    }
    
    const profileData = {
        role: role,
        years_experience: parseInt(yearsExperience) || 3,
        industry: industry
    };
    
    const content = await generateAIContent('full_resume', profileData);
    if (content) {
        // Update the summary
        if (content.summary) {
            document.getElementById('summary').value = content.summary;
            updateField(document.getElementById('summary'));
        }
        
        // Add skills
        if (content.skills && content.skills.length) {
            // Clear existing skills
            resumeData.skills = [];
            const skillsContainer = document.querySelector('#skills-container');
            if (skillsContainer) {
                skillsContainer.innerHTML = '';
            }
            
            // Add new skills
            content.skills.forEach(skill => {
                const skillsCount = resumeData.skills ? resumeData.skills.length : 0;
                const newSkillId = `skill_${Date.now()}_${skillsCount}`;
                
                // Create a new skill item
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item mb-2';
                skillItem.dataset.id = newSkillId;
                skillItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-5 mb-2">
                                    <input type="text" class="form-control" name="name" 
                                           value="${skill}" onchange="updateField(this)">
                                </div>
                                <div class="col-md-5 mb-2">
                                    <select class="form-select" name="level" onchange="updateField(this)">
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate" selected>Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                                <div class="col-md-2 text-end">
                                    <button type="button" class="btn btn-sm btn-danger" 
                                            onclick="removeItem('skills', '${newSkillId}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add the skill to resumeData
                if (!resumeData.skills) {
                    resumeData.skills = [];
                }
                
                resumeData.skills.push({
                    id: newSkillId,
                    name: skill,
                    level: 'Intermediate'
                });
                
                // Add the skill to the DOM
                if (skillsContainer) {
                    skillsContainer.appendChild(skillItem);
                }
            });
        }
        
        // Add experience
        if (content.experience_bullets && content.experience_bullets.length) {
            // Create a new experience item if none exists
            if (!resumeData.experience || resumeData.experience.length === 0) {
                const newExperienceId = `experience_${Date.now()}_0`;
                
                // Create new experience in resumeData
                if (!resumeData.experience) {
                    resumeData.experience = [];
                }
                
                resumeData.experience.push({
                    id: newExperienceId,
                    company: 'Company Name',
                    position: role,
                    location: 'City, State',
                    start_date: '',
                    end_date: '',
                    description: content.experience_bullets.join('\n\n')
                });
                
                // Re-render the experience section
                const experienceContainer = document.querySelector('#experience-container');
                if (experienceContainer) {
                    experienceContainer.innerHTML = '';
                    
                    // Add the new experience item
                    const experienceItem = document.createElement('div');
                    experienceItem.className = 'experience-item mb-3';
                    experienceItem.dataset.id = newExperienceId;
                    experienceItem.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <div class="row mb-2">
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label">Company</label>
                                        <input type="text" class="form-control" name="company" 
                                               value="Company Name" onchange="updateField(this)">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label">Position</label>
                                        <input type="text" class="form-control" name="position" 
                                               value="${role}" onchange="updateField(this)">
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 mb-2">
                                        <label class="form-label">Location</label>
                                        <input type="text" class="form-control" name="location" 
                                               value="City, State" onchange="updateField(this)">
                                    </div>
                                    <div class="col-md-4 mb-2">
                                        <label class="form-label">Start Date</label>
                                        <input type="date" class="form-control" name="start_date" 
                                               value="" onchange="updateField(this)">
                                    </div>
                                    <div class="col-md-4 mb-2">
                                        <label class="form-label">End Date</label>
                                        <input type="date" class="form-control" name="end_date" 
                                               value="" onchange="updateField(this)">
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-12">
                                        <label class="form-label">Description</label>
                                        <textarea class="form-control" name="description" rows="4" 
                                                  onchange="updateField(this)">${content.experience_bullets.join('\n\n')}</textarea>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <button type="button" class="btn btn-sm btn-danger" 
                                            onclick="removeItem('experience', '${newExperienceId}')">
                                        <i class="bi bi-trash"></i> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    experienceContainer.appendChild(experienceItem);
                }
            } else {
                // Update the first experience item's description
                const firstExperienceId = resumeData.experience[0].id;
                resumeData.experience[0].description = content.experience_bullets.join('\n\n');
                
                // Update the DOM
                const experienceTextarea = document.querySelector(`[data-id="${firstExperienceId}"] textarea[name="description"]`);
                if (experienceTextarea) {
                    experienceTextarea.value = content.experience_bullets.join('\n\n');
                }
            }
        }
        
        // Add education
        if (content.education) {
            // Clear existing education
            resumeData.education = [];
            const educationContainer = document.querySelector('#education-container');
            if (educationContainer) {
                educationContainer.innerHTML = '';
            }
            
            // Create a new education item
            const newEducationId = `education_${Date.now()}_0`;
            
            // Create a new education item
            const educationItem = document.createElement('div');
            educationItem.className = 'education-item mb-3';
            educationItem.dataset.id = newEducationId;
            educationItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="row mb-2">
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Institution</label>
                                <input type="text" class="form-control" name="institution" 
                                       value="${content.education.institution}" onchange="updateField(this)">
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Degree</label>
                                <input type="text" class="form-control" name="degree" 
                                       value="${content.education.degree}" onchange="updateField(this)">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Field of Study</label>
                                <input type="text" class="form-control" name="field_of_study" 
                                       value="${content.education.field_of_study}" onchange="updateField(this)">
                            </div>
                            <div class="col-md-3 mb-2">
                                <label class="form-label">Start Date</label>
                                <input type="date" class="form-control" name="start_date" 
                                       value="" onchange="updateField(this)">
                            </div>
                            <div class="col-md-3 mb-2">
                                <label class="form-label">End Date</label>
                                <input type="date" class="form-control" name="end_date" 
                                       value="" onchange="updateField(this)">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" name="description" rows="2" 
                                          onchange="updateField(this)"></textarea>
                            </div>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-sm btn-danger" 
                                    onclick="removeItem('education', '${newEducationId}')">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add the education to resumeData
            if (!resumeData.education) {
                resumeData.education = [];
            }
            
            resumeData.education.push({
                id: newEducationId,
                institution: content.education.institution,
                degree: content.education.degree,
                field_of_study: content.education.field_of_study,
                start_date: '',
                end_date: '',
                description: ''
            });
            
            // Add the education to the DOM
            if (educationContainer) {
                educationContainer.appendChild(educationItem);
            }
        }
        
        // Add certifications
        if (content.certifications && content.certifications.length) {
            // Clear existing certifications
            resumeData.certifications = [];
            const certContainer = document.querySelector('#certifications-container');
            if (certContainer) {
                certContainer.innerHTML = '';
            }
            
            // Add new certifications
            content.certifications.forEach((certification, index) => {
                const newCertId = `certification_${Date.now()}_${index}`;
                
                // Create a new certification item
                const certItem = document.createElement('div');
                certItem.className = 'certification-item mb-3';
                certItem.dataset.id = newCertId;
                certItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Title</label>
                                    <input type="text" class="form-control" name="title" 
                                           value="${certification}" onchange="updateField(this)">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Issuing Organization</label>
                                    <input type="text" class="form-control" name="issuer" 
                                           value="" onchange="updateField(this)">
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Date</label>
                                    <input type="date" class="form-control" name="date" 
                                           value="" onchange="updateField(this)">
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-12">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" name="description" rows="2" 
                                              onchange="updateField(this)"></textarea>
                                </div>
                            </div>
                            <div class="text-end">
                                <button type="button" class="btn btn-sm btn-danger" 
                                        onclick="removeItem('certifications', '${newCertId}')">
                                    <i class="bi bi-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add the certification to resumeData
                if (!resumeData.certifications) {
                    resumeData.certifications = [];
                }
                
                resumeData.certifications.push({
                    id: newCertId,
                    title: certification,
                    issuer: '',
                    date: '',
                    description: ''
                });
                
                // Add the certification to the DOM
                if (certContainer) {
                    certContainer.appendChild(certItem);
                }
            });
        }
        
        // Add projects
        if (content.projects && content.projects.length) {
            // Clear existing projects
            resumeData.projects = [];
            const projectContainer = document.querySelector('#projects-container');
            if (projectContainer) {
                projectContainer.innerHTML = '';
            }
            
            // Add new projects
            content.projects.forEach((project, index) => {
                const newProjectId = `project_${Date.now()}_${index}`;
                
                // Create a new project item
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item mb-3';
                projectItem.dataset.id = newProjectId;
                projectItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-md-8 mb-2">
                                    <label class="form-label">Title</label>
                                    <input type="text" class="form-control" name="title" 
                                           value="${project.title}" onchange="updateField(this)">
                                </div>
                                <div class="col-md-4 mb-2">
                                    <label class="form-label">URL</label>
                                    <input type="url" class="form-control" name="url" 
                                           value="" onchange="updateField(this)">
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Start Date</label>
                                    <input type="date" class="form-control" name="start_date" 
                                           value="" onchange="updateField(this)">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">End Date</label>
                                    <input type="date" class="form-control" name="end_date" 
                                           value="" onchange="updateField(this)">
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-12">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" name="description" rows="3" 
                                              onchange="updateField(this)">${project.description}</textarea>
                                </div>
                            </div>
                            <div class="text-end">
                                <button type="button" class="btn btn-sm btn-danger" 
                                        onclick="removeItem('projects', '${newProjectId}')">
                                    <i class="bi bi-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add the project to resumeData
                if (!resumeData.projects) {
                    resumeData.projects = [];
                }
                
                resumeData.projects.push({
                    id: newProjectId,
                    title: project.title,
                    url: '',
                    start_date: '',
                    end_date: '',
                    description: project.description
                });
                
                // Add the project to the DOM
                if (projectContainer) {
                    projectContainer.appendChild(projectItem);
                }
            });
        }
        
        updatePreview();
        showAlert('Full resume content generated!', 'success');
    }
}