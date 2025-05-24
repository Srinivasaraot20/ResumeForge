/**
 * Section Reordering for Resume Maker
 * This allows users to customize the order of sections in their resume
 */

let sectionOrderChanged = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize section reordering after the editor is loaded
    const editorContent = document.getElementById('editor-content');
    if (editorContent) {
        initializeSectionReordering();
    }
});

/**
 * Initialize section reordering functionality
 */
function initializeSectionReordering() {
    // Add reorder button to the top of the editor
    const editorContent = document.getElementById('editor-content');
    if (!editorContent) return;
    
    const reorderButton = document.createElement('div');
    reorderButton.className = 'card mb-3';
    reorderButton.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Resume Sections</h5>
                <button type="button" id="toggle-reorder-mode" class="btn btn-outline-primary">
                    <i class="bi bi-arrows-move me-1"></i> Reorder Sections
                </button>
            </div>
        </div>
    `;
    
    // Insert at the beginning of the editor
    if (editorContent.firstChild) {
        editorContent.insertBefore(reorderButton, editorContent.firstChild);
    } else {
        editorContent.appendChild(reorderButton);
    }
    
    // Add event listener for the reorder button
    document.getElementById('toggle-reorder-mode').addEventListener('click', toggleReorderMode);
}

/**
 * Toggle section reordering mode
 */
function toggleReorderMode() {
    const editorContent = document.getElementById('editor-content');
    const isInReorderMode = editorContent.classList.contains('reorder-mode');
    const button = document.getElementById('toggle-reorder-mode');
    
    if (isInReorderMode) {
        // Exit reorder mode
        editorContent.classList.remove('reorder-mode');
        button.innerHTML = '<i class="bi bi-arrows-move me-1"></i> Reorder Sections';
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-primary');
        
        // Remove drag handles and disable drag events
        document.querySelectorAll('.section-drag-handle').forEach(el => el.remove());
        document.querySelectorAll('.card.draggable').forEach(card => {
            card.classList.remove('draggable');
            card.removeAttribute('draggable');
        });
        
        // If sections were reordered, update the preview
        if (sectionOrderChanged) {
            updatePreview();
            sectionOrderChanged = false;
        }
    } else {
        // Enter reorder mode
        editorContent.classList.add('reorder-mode');
        button.innerHTML = '<i class="bi bi-check-circle me-1"></i> Done Reordering';
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-success');
        
        // Make all section cards draggable except the reorder button card
        const sectionCards = Array.from(editorContent.querySelectorAll('.card:not(:first-child)'));
        
        sectionCards.forEach(card => {
            // Add drag handle
            const cardHeader = card.querySelector('.card-header');
            if (cardHeader) {
                const dragHandle = document.createElement('div');
                dragHandle.className = 'section-drag-handle';
                dragHandle.innerHTML = '<i class="bi bi-grip-vertical"></i>';
                cardHeader.insertBefore(dragHandle, cardHeader.firstChild);
                
                // Make the card draggable
                card.classList.add('draggable');
                card.setAttribute('draggable', 'true');
                
                // Add drag event listeners
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragover', handleDragOver);
                card.addEventListener('dragenter', handleDragEnter);
                card.addEventListener('dragleave', handleDragLeave);
                card.addEventListener('drop', handleDrop);
                card.addEventListener('dragend', handleDragEnd);
            }
        });
    }
}

// Drag and drop event handlers
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    
    // Set drag data and effect
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Allow drop
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stop bubbling
    }
    
    // Only process if dropping on a different element
    if (draggedElement !== this) {
        const editorContent = document.getElementById('editor-content');
        const targetElement = this;
        
        // Determine if the target is before or after the dragged element
        const targetRect = targetElement.getBoundingClientRect();
        const targetMiddleY = targetRect.top + (targetRect.height / 2);
        
        if (e.clientY < targetMiddleY) {
            // Insert before target
            editorContent.insertBefore(draggedElement, targetElement);
        } else {
            // Insert after target
            if (targetElement.nextSibling) {
                editorContent.insertBefore(draggedElement, targetElement.nextSibling);
            } else {
                editorContent.appendChild(draggedElement);
            }
        }
        
        sectionOrderChanged = true;
    }
    
    this.classList.remove('drag-over');
    return false;
}

function handleDragEnd(e) {
    // Remove all drag-related classes
    document.querySelectorAll('.draggable').forEach(element => {
        element.classList.remove('dragging', 'drag-over');
    });
    
    draggedElement = null;
}

/**
 * Extract the current section order from the DOM
 * This can be used to save the user's preferred section order
 */
function getSectionOrder() {
    const sectionOrder = [];
    const sectionCards = document.querySelectorAll('#editor-content .card:not(:first-child)');
    
    sectionCards.forEach(card => {
        // Get section identifier from heading or data attribute
        const heading = card.querySelector('.card-header h5');
        if (heading) {
            sectionOrder.push(heading.textContent.trim());
        }
    });
    
    return sectionOrder;
}

/**
 * Apply section order to the resume data
 * This will be used when saving the resume to preserve section order
 */
function applySectionOrderToResumeData() {
    const sectionOrder = getSectionOrder();
    
    // Store the section order in resumeData
    if (window.resumeData) {
        window.resumeData.section_order = sectionOrder;
    }
}

// Add CSS styles for drag and drop
document.addEventListener('DOMContentLoaded', function() {
    // Add styles for section reordering
    const style = document.createElement('style');
    style.textContent = `
        .reorder-mode .card {
            cursor: move;
            transition: box-shadow 0.3s, transform 0.3s;
        }
        
        .reorder-mode .card:hover {
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        
        .section-drag-handle {
            cursor: grab;
            display: inline-block;
            padding: 0 10px;
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .dragging {
            opacity: 0.7;
            transform: scale(1.02);
        }
        
        .drag-over {
            border: 2px dashed #3498db;
        }
    `;
    document.head.appendChild(style);
});