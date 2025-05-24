// Main JavaScript file for Resume Maker application

document.addEventListener('DOMContentLoaded', function() {
    // Global state for resume data
    window.resumeData = null;
    const resumeId = document.getElementById('resume-id')?.value;
    
    // Initialize editor if we're on the editor page
    const editorContainer = document.getElementById('editor-container');
    if (editorContainer && resumeId) {
        initializeEditor();
    }
    
    // Initialize template selector if it exists
    const templateSelector = document.getElementById('template-selector');
    if (templateSelector) {
        initializeTemplateSelector();
    }
    
    /**
     * Initialize the resume editor
     */
    function initializeEditor() {
        // Fetch resume data
        fetch(`/resume/${resumeId}/content`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch resume data');
                }
                return response.json();
            })
            .then(data => {
                window.resumeData = data;
                renderResumeEditor();
                updatePreview();
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error loading resume data. Please try again.');
            });
        
        // Set up event listeners
        document.getElementById('save-resume-btn').addEventListener('click', saveResume);
        document.getElementById('download-pdf-btn').addEventListener('click', downloadPdf);
        
        // Listen for template changes
        const templateSelect = document.getElementById('template_id');
        if (templateSelect) {
            templateSelect.addEventListener('change', function() {
                updatePreview();
            });
        }
    }
    
    /**
     * Initialize the template selector for new resumes
     */
    function initializeTemplateSelector() {
        fetch('/templates')
            .then(response => response.json())
            .then(templates => {
                const container = document.getElementById('template-selector');
                container.innerHTML = '';
                
                templates.forEach(template => {
                    const card = document.createElement('div');
                    card.className = 'col-md-6 col-lg-3 mb-4';
                    card.innerHTML = `
                        <div class="card template-card h-100" data-template-id="${template.id}">
                            <div class="template-preview" style="background-image: url('${template.preview}')"></div>
                            <div class="card-body">
                                <h5 class="card-title">${template.name}</h5>
                            </div>
                        </div>
                    `;
                    
                    card.querySelector('.template-card').addEventListener('click', function() {
                        // Remove selected class from all templates
                        document.querySelectorAll('.template-card').forEach(el => {
                            el.classList.remove('selected');
                        });
                        
                        // Add selected class to clicked template
                        this.classList.add('selected');
                        
                        // Update hidden input with selected template ID
                        document.getElementById('template_id').value = template.id;
                    });
                    
                    container.appendChild(card);
                });
                
                // Select the first template by default
                if (templates.length > 0) {
                    document.querySelector('.template-card').classList.add('selected');
                    document.getElementById('template_id').value = templates[0].id;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error loading templates. Please try again.');
            });
    }
    
    /**
     * Render the resume editor with all sections
     */
    function renderResumeEditor() {
        const editorContent = document.getElementById('editor-content');
        if (!editorContent || !resumeData) return;
        
        // Clear existing content
        editorContent.innerHTML = '';
        
        // Render personal info section
        renderPersonalInfoSection(editorContent);
        
        // Render education section
        renderListSection(editorContent, 'education', 'Education', [
            { name: 'institution', label: 'Institution', type: 'text', required: true },
            { name: 'degree', label: 'Degree', type: 'text', required: true },
            { name: 'field_of_study', label: 'Field of Study', type: 'text' },
            { name: 'start_date', label: 'Start Date', type: 'date' },
            { name: 'end_date', label: 'End Date', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]);
        
        // Render experience section
        renderListSection(editorContent, 'experience', 'Work Experience', [
            { name: 'company', label: 'Company', type: 'text', required: true },
            { name: 'position', label: 'Position', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'start_date', label: 'Start Date', type: 'date' },
            { name: 'end_date', label: 'End Date', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]);
        
        // Render skills section
        renderListSection(editorContent, 'skills', 'Skills', [
            { name: 'name', label: 'Skill Name', type: 'text', required: true },
            { name: 'level', label: 'Skill Level', type: 'select', options: [
                'Beginner', 'Intermediate', 'Advanced', 'Expert'
            ]}
        ]);
        
        // Render projects section
        renderListSection(editorContent, 'projects', 'Projects', [
            { name: 'title', label: 'Project Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'url', label: 'Project URL', type: 'text' },
            { name: 'start_date', label: 'Start Date', type: 'date' },
            { name: 'end_date', label: 'End Date', type: 'date' }
        ]);
        
        // Render certifications section
        renderListSection(editorContent, 'certifications', 'Certifications', [
            { name: 'title', label: 'Certification Title', type: 'text', required: true },
            { name: 'issuer', label: 'Issuing Organization', type: 'text' },
            { name: 'date', label: 'Date Earned', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]);
        
        // Render languages section
        renderListSection(editorContent, 'languages', 'Languages', [
            { name: 'language', label: 'Language', type: 'text', required: true },
            { name: 'proficiency', label: 'Proficiency', type: 'select', options: [
                'Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native/Bilingual'
            ]}
        ]);
        
        // Render interests section
        renderListSection(editorContent, 'interests', 'Interests', [
            { name: 'name', label: 'Interest', type: 'text', required: true }
        ]);
        
        // Render awards section
        renderListSection(editorContent, 'awards', 'Awards & Honors', [
            { name: 'title', label: 'Award Title', type: 'text', required: true },
            { name: 'issuer', label: 'Issuing Organization', type: 'text' },
            { name: 'date', label: 'Date Received', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]);
        
        // Render publications section
        renderListSection(editorContent, 'publications', 'Publications', [
            { name: 'title', label: 'Publication Title', type: 'text', required: true },
            { name: 'publisher', label: 'Publisher', type: 'text' },
            { name: 'date', label: 'Publication Date', type: 'date' },
            { name: 'url', label: 'URL', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]);
        
        // Render references section
        renderListSection(editorContent, 'references', 'References', [
            { name: 'name', label: 'Reference Name', type: 'text', required: true },
            { name: 'company', label: 'Company', type: 'text' },
            { name: 'position', label: 'Position', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'reference_text', label: 'Reference Text', type: 'textarea' }
        ]);
        
        // Render volunteer experience section
        renderListSection(editorContent, 'volunteer_experience', 'Volunteer Experience', [
            { name: 'organization', label: 'Organization', type: 'text', required: true },
            { name: 'role', label: 'Role', type: 'text', required: true },
            { name: 'start_date', label: 'Start Date', type: 'date' },
            { name: 'end_date', label: 'End Date', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]);
        
        // Render custom sections
        if (resumeData.custom_sections && resumeData.custom_sections.length > 0) {
            resumeData.custom_sections.forEach((section, index) => {
                renderCustomSection(editorContent, section, index);
            });
        }
        
        // Add custom section button
        const addCustomSectionBtn = document.createElement('button');
        addCustomSectionBtn.type = 'button';
        addCustomSectionBtn.className = 'btn btn-outline-secondary mb-4';
        addCustomSectionBtn.innerHTML = '<i class="bi bi-plus-circle"></i> Add Custom Section';
        addCustomSectionBtn.addEventListener('click', function() {
            // Create a new custom section
            if (!resumeData.custom_sections) {
                resumeData.custom_sections = [];
            }
            
            const newSection = {
                title: 'Custom Section',
                content: ''
            };
            
            resumeData.custom_sections.push(newSection);
            renderCustomSection(editorContent, newSection, resumeData.custom_sections.length - 1);
            updatePreview();
            
            // Insert the button at the end
            editorContent.appendChild(addCustomSectionBtn);
        });
        
        editorContent.appendChild(addCustomSectionBtn);
        
        // Add event listeners for all inputs to update the preview
        editorContent.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function() {
                updateField(this);
                updatePreview();
            });
        });
    }
    
    /**
     * Render a custom section
     */
    function renderCustomSection(container, section, index) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'card mb-3 custom-section';
        sectionDiv.dataset.index = index;
        
        sectionDiv.innerHTML = `
            <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Custom Section</h5>
                <button type="button" class="btn btn-sm btn-outline-light remove-section-btn">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="custom-section-title-${index}" class="form-label">Section Title</label>
                    <input type="text" class="form-control" id="custom-section-title-${index}" 
                           name="title" value="${section.title || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="custom-section-content-${index}" class="form-label">Content</label>
                    <textarea class="form-control" id="custom-section-content-${index}" 
                              name="content" rows="4">${section.content || ''}</textarea>
                </div>
            </div>
        `;
        
        // Add event listener for removing the section
        sectionDiv.querySelector('.remove-section-btn').addEventListener('click', function() {
            resumeData.custom_sections.splice(index, 1);
            sectionDiv.remove();
            updatePreview();
        });
        
        // Add event listeners for the inputs
        sectionDiv.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                resumeData.custom_sections[index][input.name] = input.value;
                updatePreview();
            });
        });
        
        container.appendChild(sectionDiv);
    }
    
    /**
     * Render the personal info section of the resume editor
     */
    function renderPersonalInfoSection(container) {
        const section = document.createElement('div');
        section.className = 'card mb-3';
        section.innerHTML = `
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Personal Information</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">Full Name *</label>
                        <input type="text" class="form-control" id="name" name="name" 
                               value="${resumeData.personal_info.name || ''}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="professional_title" class="form-label">Professional Title</label>
                        <input type="text" class="form-control" id="professional_title" name="professional_title" 
                               value="${resumeData.personal_info.professional_title || ''}">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email *</label>
                        <input type="email" class="form-control" id="email" name="email" 
                               value="${resumeData.personal_info.email || ''}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" id="phone" name="phone" 
                               value="${resumeData.personal_info.phone || ''}">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <label for="address" class="form-label">Address</label>
                        <input type="text" class="form-control" id="address" name="address" 
                               value="${resumeData.personal_info.address || ''}">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="linkedin" class="form-label">LinkedIn URL</label>
                        <input type="url" class="form-control" id="linkedin" name="linkedin" 
                               value="${resumeData.personal_info.linkedin || ''}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="github" class="form-label">GitHub URL</label>
                        <input type="url" class="form-control" id="github" name="github" 
                               value="${resumeData.personal_info.github || ''}">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="twitter" class="form-label">Twitter/X URL</label>
                        <input type="url" class="form-control" id="twitter" name="twitter" 
                               value="${resumeData.personal_info.twitter || ''}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="website" class="form-label">Personal Website</label>
                        <input type="url" class="form-control" id="website" name="website" 
                               value="${resumeData.personal_info.website || ''}">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="profile_image" class="form-label">Profile Image URL</label>
                    <input type="url" class="form-control" id="profile_image" name="profile_image" 
                           value="${resumeData.personal_info.profile_image || ''}">
                    <div class="form-text">Provide a URL to your professional profile photo (optional)</div>
                </div>
                <div class="mb-3">
                    <label for="summary" class="form-label">Professional Summary</label>
                    <textarea class="form-control" id="summary" name="summary" rows="4">${resumeData.personal_info.summary || ''}</textarea>
                </div>
            </div>
        `;
        
        container.appendChild(section);
        
        // Add event listeners
        section.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                resumeData.personal_info[this.name] = this.value;
                updatePreview();
            });
        });
    }
    
    /**
     * Render a list section (education, experience, skills, etc.)
     */
    function renderListSection(container, sectionName, sectionTitle, fields) {
        const section = document.createElement('div');
        section.className = 'card mb-3';
        
        // Create the section header
        const header = document.createElement('div');
        header.className = 'card-header bg-primary text-white d-flex justify-content-between align-items-center';
        header.innerHTML = `
            <h5 class="mb-0">${sectionTitle}</h5>
        `;
        
        // Create the section body
        const body = document.createElement('div');
        body.className = 'card-body';
        
        // Create a container for the items
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'items-container';
        itemsContainer.id = `${sectionName}-items`;
        
        // Add existing items
        if (resumeData[sectionName] && resumeData[sectionName].length > 0) {
            resumeData[sectionName].forEach((item, index) => {
                const itemCard = createItemCard(sectionName, item, index, fields);
                itemsContainer.appendChild(itemCard);
            });
        }
        
        // Create the "Add Item" button
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'btn btn-outline-primary add-item-btn';
        addButton.innerHTML = `<i class="bi bi-plus-circle"></i> Add ${sectionTitle.slice(0, -1)}`;
        addButton.addEventListener('click', function() {
            // Create a new empty item
            const newItem = {};
            fields.forEach(field => {
                newItem[field.name] = '';
            });
            
            // Add the new item to the resume data
            if (!resumeData[sectionName]) {
                resumeData[sectionName] = [];
            }
            
            resumeData[sectionName].push(newItem);
            
            // Add the new item to the UI
            const newIndex = resumeData[sectionName].length - 1;
            const itemCard = createItemCard(sectionName, newItem, newIndex, fields);
            itemsContainer.appendChild(itemCard);
            
            // Update the preview
            updatePreview();
        });
        
        // Assemble the section
        body.appendChild(itemsContainer);
        body.appendChild(addButton);
        section.appendChild(header);
        section.appendChild(body);
        
        // Add the section to the container
        container.appendChild(section);
    }
    
    /**
     * Create a card for an item in a list section
     */
    function createItemCard(sectionName, item, index, fields) {
        const card = document.createElement('div');
        card.className = 'card item-card mb-3';
        card.dataset.index = index;
        
        // Create the card header
        const header = document.createElement('div');
        header.className = 'card-header d-flex justify-content-between align-items-center';
        
        // Set the header title based on the item content
        let headerTitle = '';
        if (sectionName === 'education' && item.institution) {
            headerTitle = item.institution;
        } else if (sectionName === 'experience' && item.company) {
            headerTitle = `${item.position} at ${item.company}`;
        } else if (sectionName === 'skills' && item.name) {
            headerTitle = item.name;
        } else if (sectionName === 'projects' && item.title) {
            headerTitle = item.title;
        } else if (sectionName === 'certifications' && item.title) {
            headerTitle = item.title;
        } else if (sectionName === 'languages' && item.language) {
            headerTitle = item.language;
        } else if (sectionName === 'interests' && item.name) {
            headerTitle = item.name;
        } else {
            headerTitle = `Item ${index + 1}`;
        }
        
        header.innerHTML = `
            <h6 class="mb-0">${headerTitle}</h6>
            <div class="item-actions">
                <button type="button" class="btn btn-outline-danger btn-sm remove-item-btn" title="Remove">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        
        // Create the card body with form fields
        const body = document.createElement('div');
        body.className = 'card-body';
        
        // Add form fields based on the field definitions
        fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'mb-3';
            
            // Create label
            const label = document.createElement('label');
            label.className = 'form-label';
            label.htmlFor = `${sectionName}-${index}-${field.name}`;
            label.textContent = `${field.label}${field.required ? ' *' : ''}`;
            
            // Create input element based on field type
            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.className = 'form-control';
                input.rows = 3;
                input.value = item[field.name] || '';
            } else if (field.type === 'select' && field.options) {
                input = document.createElement('select');
                input.className = 'form-control';
                
                // Add options
                field.options.forEach(option => {
                    const optionEl = document.createElement('option');
                    optionEl.value = option;
                    optionEl.textContent = option;
                    if (item[field.name] === option) {
                        optionEl.selected = true;
                    }
                    input.appendChild(optionEl);
                });
            } else {
                input = document.createElement('input');
                input.className = 'form-control';
                input.type = field.type;
                input.value = item[field.name] || '';
            }
            
            // Set common attributes
            input.id = `${sectionName}-${index}-${field.name}`;
            input.name = `${sectionName}-${index}-${field.name}`;
            if (field.required) {
                input.required = true;
            }
            
            // Add event listener to update the resume data
            input.addEventListener('input', function() {
                resumeData[sectionName][index][field.name] = this.value;
                
                // Update the header title if this is a title field
                if ((field.name === 'institution' && sectionName === 'education') ||
                    (field.name === 'company' && sectionName === 'experience') ||
                    (field.name === 'name' && (sectionName === 'skills' || sectionName === 'interests')) ||
                    (field.name === 'title' && (sectionName === 'projects' || sectionName === 'certifications')) ||
                    (field.name === 'language' && sectionName === 'languages')) {
                    
                    const titleElement = card.querySelector('.card-header h6');
                    if (titleElement) {
                        if (sectionName === 'experience' && this.name.includes('position')) {
                            const company = resumeData[sectionName][index]['company'] || '';
                            titleElement.textContent = `${this.value} at ${company}`;
                        } else if (sectionName === 'experience' && this.name.includes('company')) {
                            const position = resumeData[sectionName][index]['position'] || '';
                            titleElement.textContent = `${position} at ${this.value}`;
                        } else {
                            titleElement.textContent = this.value || `Item ${index + 1}`;
                        }
                    }
                }
                
                updatePreview();
            });
            
            // Assemble the form group
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            body.appendChild(formGroup);
        });
        
        // Assemble the card
        card.appendChild(header);
        card.appendChild(body);
        
        // Add event listener to remove button
        card.querySelector('.remove-item-btn').addEventListener('click', function() {
            // Remove the item from the resume data
            resumeData[sectionName].splice(index, 1);
            
            // Remove the card from the UI
            card.remove();
            
            // Update the indices of the remaining cards
            const itemsContainer = document.getElementById(`${sectionName}-items`);
            const itemCards = itemsContainer.querySelectorAll('.item-card');
            itemCards.forEach((card, newIndex) => {
                card.dataset.index = newIndex;
                
                // Update IDs and names of all inputs
                card.querySelectorAll('input, textarea, select').forEach(input => {
                    const oldId = input.id;
                    const fieldName = oldId.split('-')[2];
                    const newId = `${sectionName}-${newIndex}-${fieldName}`;
                    
                    input.id = newId;
                    input.name = newId;
                    
                    // Update the corresponding label
                    const label = card.querySelector(`label[for="${oldId}"]`);
                    if (label) {
                        label.htmlFor = newId;
                    }
                });
            });
            
            // Update the preview
            updatePreview();
        });
        
        return card;
    }
    
    /**
     * Update a field in the resume data
     */
    function updateField(input) {
        const nameParts = input.name.split('-');
        
        if (nameParts.length === 1) {
            // Personal info field
            resumeData.personal_info[input.name] = input.value;
        } else if (nameParts.length === 3) {
            // List item field
            const [sectionName, index, fieldName] = nameParts;
            resumeData[sectionName][index][fieldName] = input.value;
        }
    }
    
    /**
     * Update the resume preview
     */
    function updatePreview() {
        const previewFrame = document.getElementById('preview-frame');
        if (!previewFrame) return;
        
        // Get the selected template ID
        const templateId = document.getElementById('template_id').value;
        
        // Send the resume data to the server for rendering
        const data = {
            template_id: templateId,
            content: resumeData
        };
        
        // Update the preview frame's src with the new content
        previewFrame.contentWindow.postMessage({
            type: 'updatePreview',
            data: resumeData
        }, '*');
    }
    
    /**
     * Save the resume data
     */
    function saveResume() {
        // Show loading indicator
        showLoading('Saving resume...');
        
        // Send the resume data to the server
        fetch(`/resume/${resumeId}/content`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resumeData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save resume');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            hideLoading();
            
            // Show success message
            showAlert('Resume saved successfully!', 'success');
            
            // Submit the form to update other fields
            document.getElementById('resume-form').submit();
        })
        .catch(error => {
            // Hide loading indicator
            hideLoading();
            
            // Show error message
            console.error('Error:', error);
            showAlert('Error saving resume. Please try again.', 'danger');
        });
    }
    
    /**
     * Download the resume as a PDF
     */
    function downloadPdf() {
        // Save the resume first
        saveResume();
        
        // Show loading indicator
        showLoading('Generating PDF...');
        
        // Create a form to submit the resume for PDF generation
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = `/resume/${resumeId}/pdf`;
        document.body.appendChild(form);
        
        // Submit the form
        form.submit();
        
        // Remove the form
        document.body.removeChild(form);
        
        // Hide loading indicator after a delay
        setTimeout(hideLoading, 2000);
    }
    
    /**
     * Show a loading indicator
     */
    function showLoading(message = 'Loading...') {
        const overlay = document.createElement('div');
        overlay.className = 'spinner-overlay';
        overlay.id = 'spinner-overlay';
        
        overlay.innerHTML = `
            <div class="spinner-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="mt-3">${message}</div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    /**
     * Hide the loading indicator
     */
    function hideLoading() {
        const overlay = document.getElementById('spinner-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    /**
     * Show an alert message
     */
    function showAlert(message, type = 'danger') {
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);
        
        // Automatically dismiss the alert after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alertContainer.innerHTML = '';
            }, 300);
        }, 5000);
    }
});
