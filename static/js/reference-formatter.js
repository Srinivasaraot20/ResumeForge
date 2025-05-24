/**
 * Reference Formatting for Resume Maker
 * This script provides enhanced formatting for reference letters and testimonials
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the resume editor page
    if (document.getElementById('editor-content')) {
        initializeReferenceFormatting();
    }
});

/**
 * Initialize reference formatting functionality
 */
function initializeReferenceFormatting() {
    // Listen for changes to the references section
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                Array.from(mutation.addedNodes).forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('references-item')) {
                        setupReferenceFormatting(node);
                    }
                });
            }
        });
    });
    
    // Start observing the editor content
    observer.observe(document.getElementById('editor-content'), { 
        childList: true, 
        subtree: true 
    });
}

/**
 * Set up formatting controls for reference items
 */
function setupReferenceFormatting(referenceItem) {
    // Find the reference text area
    const textarea = referenceItem.querySelector('textarea[name="reference_text"]');
    if (!textarea) return;
    
    // Create formatting toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'reference-formatting-toolbar mb-2';
    toolbar.innerHTML = `
        <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-outline-secondary format-quote" title="Format as Quote">
                <i class="bi bi-quote"></i>
            </button>
            <button type="button" class="btn btn-outline-secondary format-testimonial" title="Format as Testimonial">
                <i class="bi bi-chat-square-quote"></i>
            </button>
            <button type="button" class="btn btn-outline-secondary format-recommendation" title="Format as Recommendation Letter">
                <i class="bi bi-file-earmark-text"></i>
            </button>
        </div>
    `;
    
    // Insert toolbar before textarea
    const textareaParent = textarea.parentNode;
    textareaParent.insertBefore(toolbar, textarea);
    
    // Add event listeners to the formatting buttons
    toolbar.querySelector('.format-quote').addEventListener('click', function() {
        formatAsQuote(textarea);
    });
    
    toolbar.querySelector('.format-testimonial').addEventListener('click', function() {
        formatAsTestimonial(textarea);
    });
    
    toolbar.querySelector('.format-recommendation').addEventListener('click', function() {
        formatAsRecommendation(textarea, referenceItem);
    });
}

/**
 * Format reference text as a simple quote
 */
function formatAsQuote(textarea) {
    const text = textarea.value.trim();
    if (!text) return;
    
    textarea.value = `"${text}"`;
    triggerChange(textarea);
}

/**
 * Format reference text as a testimonial
 */
function formatAsTestimonial(textarea) {
    const text = textarea.value.trim();
    if (!text) return;
    
    textarea.value = `"${text}"\n\nThis testimonial reflects my professional capabilities and work ethic.`;
    triggerChange(textarea);
}

/**
 * Format reference text as a formal recommendation letter
 */
function formatAsRecommendation(textarea, referenceItem) {
    // Get reference information
    const nameInput = referenceItem.querySelector('input[name="name"]');
    const positionInput = referenceItem.querySelector('input[name="position"]');
    const companyInput = referenceItem.querySelector('input[name="company"]');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const position = positionInput ? positionInput.value.trim() : '';
    const company = companyInput ? companyInput.value.trim() : '';
    
    const text = textarea.value.trim();
    if (!text) return;
    
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    let formattedText = `Letter of Recommendation\n\n`;
    formattedText += `${date}\n\n`;
    formattedText += `To Whom It May Concern,\n\n`;
    formattedText += `${text}\n\n`;
    formattedText += `Sincerely,\n\n`;
    
    if (name) {
        formattedText += `${name}\n`;
    }
    
    if (position && company) {
        formattedText += `${position}, ${company}`;
    } else if (position) {
        formattedText += position;
    } else if (company) {
        formattedText += company;
    }
    
    textarea.value = formattedText;
    triggerChange(textarea);
}

/**
 * Trigger change event on an input element
 */
function triggerChange(element) {
    const event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);
}