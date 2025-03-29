document.addEventListener('DOMContentLoaded', function() {
    // Export functionality
    const exportCSVBtn = document.getElementById('export-csv');
    const exportPDFBtn = document.getElementById('export-pdf');
    
    // CSV Export
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', function(e) {
            // Get the selected resume IDs if any
            const checkedResumes = document.querySelectorAll('input[name="resume_ids"]:checked');
            const selectedIDs = Array.from(checkedResumes).map(cb => cb.value);
            
            // Create a form to submit the selection
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/export_csv';
            
            // Add the selected IDs as input fields
            selectedIDs.forEach(id => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'resume_ids';
                input.value = id;
                form.appendChild(input);
            });
            
            // Submit the form
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        });
    }
    
    // PDF Export
    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', function() {
            // Get the content to export
            const content = document.getElementById('export-content');
            
            if (!content) return;
            
            // Show loading overlay
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }
            
            // Clone the content to avoid modifying the original
            const contentClone = content.cloneNode(true);
            
            // Remove any buttons or action elements that shouldn't be in the PDF
            const actionsToRemove = contentClone.querySelectorAll('.action-buttons, .compare-checkbox, .export-buttons');
            actionsToRemove.forEach(el => el.remove());
            
            // Generate PDF
            html2pdf()
                .from(contentClone)
                .set({
                    margin: 10,
                    filename: 'candidate_ranking.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                })
                .save()
                .then(() => {
                    // Hide loading overlay when done
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error generating PDF:', error);
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                    
                    // Show error message
                    const alertContainer = document.getElementById('alert-container');
                    if (alertContainer) {
                        const alert = document.createElement('div');
                        alert.className = 'alert alert-danger';
                        alert.textContent = 'Error generating PDF. Please try again.';
                        alertContainer.appendChild(alert);
                        
                        // Auto dismiss after 5 seconds
                        setTimeout(() => {
                            alert.remove();
                        }, 5000);
                    }
                });
        });
    }
    
    // Select/Deselect All functionality
    const selectAllBtn = document.getElementById('select-all-resumes');
    const deselectAllBtn = document.getElementById('deselect-all-resumes');
    
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('input[name="resume_ids"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
                // Trigger change event to update any dependent UI
                const event = new Event('change');
                checkbox.dispatchEvent(event);
            });
        });
    }
    
    if (deselectAllBtn) {
        deselectAllBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('input[name="resume_ids"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                // Trigger change event to update any dependent UI
                const event = new Event('change');
                checkbox.dispatchEvent(event);
            });
        });
    }
    
    // Batch action buttons
    const deleteSelectedBtn = document.getElementById('delete-selected');
    
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', function() {
            const checkedResumes = document.querySelectorAll('input[name="resume_ids"]:checked');
            
            if (checkedResumes.length === 0) {
                alert('Please select at least one resume to delete.');
                return;
            }
            
            if (confirm(`Are you sure you want to delete ${checkedResumes.length} selected resume(s)?`)) {
                // Create a form to submit the deletion request
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/delete_selected';
                
                // Add the selected IDs as input fields
                checkedResumes.forEach(checkbox => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'resume_ids';
                    input.value = checkbox.value;
                    form.appendChild(input);
                });
                
                // Add CSRF token if needed
                const csrfToken = document.querySelector('meta[name="csrf-token"]');
                if (csrfToken) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'csrf_token';
                    input.value = csrfToken.getAttribute('content');
                    form.appendChild(input);
                }
                
                // Submit the form
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
            }
        });
    }
});
