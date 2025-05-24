// Handle communication between the editor and preview iframe

// Listen for messages from the parent window
window.addEventListener('message', function(event) {
    // Check if this is an update preview message
    if (event.data && event.data.type === 'updatePreview') {
        updateResumeContent(event.data.data);
    }
});

/**
 * Update the resume content in the preview
 */
function updateResumeContent(data) {
    // Update personal info
    updatePersonalInfo(data.personal_info);
    
    // Update education section
    updateSection('education', data.education);
    
    // Update experience section
    updateSection('experience', data.experience);
    
    // Update skills section
    updateSection('skills', data.skills);
    
    // Update projects section
    updateSection('projects', data.projects);
    
    // Update certifications section
    updateSection('certifications', data.certifications);
    
    // Update languages section
    updateSection('languages', data.languages);
    
    // Update interests section
    updateSection('interests', data.interests);
}

/**
 * Update the personal info section
 */
function updatePersonalInfo(personalInfo) {
    if (!personalInfo) return;
    
    // Update name
    const nameElements = document.querySelectorAll('[data-field="name"]');
    nameElements.forEach(el => {
        el.textContent = personalInfo.name || '';
    });
    
    // Update email
    const emailElements = document.querySelectorAll('[data-field="email"]');
    emailElements.forEach(el => {
        el.textContent = personalInfo.email || '';
        // Update href for links
        if (el.tagName === 'A') {
            el.href = `mailto:${personalInfo.email || ''}`;
        }
    });
    
    // Update phone
    const phoneElements = document.querySelectorAll('[data-field="phone"]');
    phoneElements.forEach(el => {
        el.textContent = personalInfo.phone || '';
        // Update href for links
        if (el.tagName === 'A') {
            el.href = `tel:${personalInfo.phone || ''}`;
        }
    });
    
    // Update address
    const addressElements = document.querySelectorAll('[data-field="address"]');
    addressElements.forEach(el => {
        el.textContent = personalInfo.address || '';
    });
    
    // Update LinkedIn
    const linkedinElements = document.querySelectorAll('[data-field="linkedin"]');
    linkedinElements.forEach(el => {
        el.textContent = personalInfo.linkedin || '';
        // Update href for links
        if (el.tagName === 'A') {
            el.href = personalInfo.linkedin || '#';
        }
    });
    
    // Update website
    const websiteElements = document.querySelectorAll('[data-field="website"]');
    websiteElements.forEach(el => {
        el.textContent = personalInfo.website || '';
        // Update href for links
        if (el.tagName === 'A') {
            el.href = personalInfo.website || '#';
        }
    });
    
    // Update summary
    const summaryElements = document.querySelectorAll('[data-field="summary"]');
    summaryElements.forEach(el => {
        el.textContent = personalInfo.summary || '';
    });
}

/**
 * Update a section with list items
 */
function updateSection(sectionName, items) {
    // Get the container for this section
    const container = document.querySelector(`[data-section="${sectionName}"]`);
    if (!container) return;
    
    // Clear the container
    container.innerHTML = '';
    
    // If there are no items, hide the section
    if (!items || items.length === 0) {
        const sectionEl = document.querySelector(`[data-section-container="${sectionName}"]`);
        if (sectionEl) {
            sectionEl.style.display = 'none';
        }
        return;
    }
    
    // Show the section
    const sectionEl = document.querySelector(`[data-section-container="${sectionName}"]`);
    if (sectionEl) {
        sectionEl.style.display = '';
    }
    
    // Create elements for each item
    items.forEach(item => {
        // Create the item element based on the section type
        let itemEl;
        
        if (sectionName === 'education') {
            itemEl = createEducationItem(item);
        } else if (sectionName === 'experience') {
            itemEl = createExperienceItem(item);
        } else if (sectionName === 'skills') {
            itemEl = createSkillItem(item);
        } else if (sectionName === 'projects') {
            itemEl = createProjectItem(item);
        } else if (sectionName === 'certifications') {
            itemEl = createCertificationItem(item);
        } else if (sectionName === 'languages') {
            itemEl = createLanguageItem(item);
        } else if (sectionName === 'interests') {
            itemEl = createInterestItem(item);
        }
        
        // Add the item to the container
        if (itemEl) {
            container.appendChild(itemEl);
        }
    });
}

/**
 * Create an education item element
 */
function createEducationItem(item) {
    const el = document.createElement('div');
    el.className = 'resume-item';
    
    // Format dates
    let dateText = '';
    if (item.start_date || item.end_date) {
        if (item.start_date && item.end_date) {
            dateText = `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`;
        } else if (item.start_date) {
            dateText = `${formatDate(item.start_date)} - Present`;
        } else if (item.end_date) {
            dateText = `Until ${formatDate(item.end_date)}`;
        }
    }
    
    el.innerHTML = `
        <h4>${item.institution || ''}</h4>
        <h5>${item.degree || ''}${item.field_of_study ? ` in ${item.field_of_study}` : ''}</h5>
        <p class="date">${dateText}</p>
        <p>${item.description || ''}</p>
    `;
    
    return el;
}

/**
 * Create an experience item element
 */
function createExperienceItem(item) {
    const el = document.createElement('div');
    el.className = 'resume-item';
    
    // Format dates
    let dateText = '';
    if (item.start_date || item.end_date) {
        if (item.start_date && item.end_date) {
            dateText = `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`;
        } else if (item.start_date) {
            dateText = `${formatDate(item.start_date)} - Present`;
        } else if (item.end_date) {
            dateText = `Until ${formatDate(item.end_date)}`;
        }
    }
    
    el.innerHTML = `
        <h4>${item.position || ''}</h4>
        <h5>${item.company || ''}${item.location ? `, ${item.location}` : ''}</h5>
        <p class="date">${dateText}</p>
        <p>${item.description || ''}</p>
    `;
    
    return el;
}

/**
 * Create a skill item element
 */
function createSkillItem(item) {
    const el = document.createElement('div');
    el.className = 'resume-skill';
    
    // Calculate progress percentage based on skill level
    let progressPercentage = 25;
    if (item.level === 'Intermediate') {
        progressPercentage = 50;
    } else if (item.level === 'Advanced') {
        progressPercentage = 75;
    } else if (item.level === 'Expert') {
        progressPercentage = 100;
    }
    
    el.innerHTML = `
        <div class="skill-header">
            <span class="skill-name">${item.name || ''}</span>
            <span class="skill-level">${item.level || ''}</span>
        </div>
        <div class="skill-progress">
            <div class="skill-progress-bar" style="width: ${progressPercentage}%"></div>
        </div>
    `;
    
    return el;
}

/**
 * Create a project item element
 */
function createProjectItem(item) {
    const el = document.createElement('div');
    el.className = 'resume-item';
    
    // Format dates
    let dateText = '';
    if (item.start_date || item.end_date) {
        if (item.start_date && item.end_date) {
            dateText = `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`;
        } else if (item.start_date) {
            dateText = `${formatDate(item.start_date)} - Present`;
        } else if (item.end_date) {
            dateText = `Until ${formatDate(item.end_date)}`;
        }
    }
    
    el.innerHTML = `
        <h4>${item.title || ''}</h4>
        <p class="date">${dateText}</p>
        <p>${item.description || ''}</p>
        ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
    `;
    
    return el;
}

/**
 * Create a certification item element
 */
function createCertificationItem(item) {
    const el = document.createElement('div');
    el.className = 'resume-item';
    
    el.innerHTML = `
        <h4>${item.title || ''}</h4>
        <h5>${item.issuer || ''}</h5>
        <p class="date">${item.date ? formatDate(item.date) : ''}</p>
        <p>${item.description || ''}</p>
    `;
    
    return el;
}

/**
 * Create a language item element
 */
function createLanguageItem(item) {
    const el = document.createElement('div');
    el.className = 'resume-language';
    
    // Generate proficiency dots based on language level
    let proficiencyDots = '';
    let dotCount = 1; // Default for Elementary
    
    if (item.proficiency === 'Limited Working') {
        dotCount = 2;
    } else if (item.proficiency === 'Professional Working') {
        dotCount = 3;
    } else if (item.proficiency === 'Full Professional') {
        dotCount = 4;
    } else if (item.proficiency === 'Native/Bilingual') {
        dotCount = 5;
    }
    
    for (let i = 0; i < 5; i++) {
        const dotClass = i < dotCount ? 'proficiency-dot-filled' : 'proficiency-dot-empty';
        proficiencyDots += `<span class="${dotClass}"></span>`;
    }
    
    el.innerHTML = `
        <div class="language-header">
            <span class="language-name">${item.language || ''}</span>
            <span class="language-level">${item.proficiency || ''}</span>
        </div>
        <div class="language-proficiency-dots">
            ${proficiencyDots}
        </div>
    `;
    
    return el;
}

/**
 * Create an interest item element
 */
function createInterestItem(item) {
    const el = document.createElement('div');
    el.className = 'resume-interest';
    
    el.innerHTML = `
        <span>${item.name || ''}</span>
    `;
    
    return el;
}

/**
 * Format a date string (YYYY-MM-DD) to a more readable format
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
}
