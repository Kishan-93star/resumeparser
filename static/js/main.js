document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.navbar-menu-btn');
    const mobileMenu = document.querySelector('.navbar-mobile');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show-mobile-menu');
        });
    }
    
    // File upload preview with multiple file support
    const fileInput = document.getElementById('file-input');
    const fileNames = document.querySelector('.file-names');
    
    if (fileInput && fileNames) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                let namesHTML = '<ul class="file-list">';
                for (let i = 0; i < fileInput.files.length; i++) {
                    namesHTML += `<li><i class="fas fa-file-pdf"></i> ${fileInput.files[i].name}</li>`;
                }
                namesHTML += '</ul>';
                fileNames.innerHTML = namesHTML;
                fileNames.style.display = 'block';
            } else {
                fileNames.style.display = 'none';
            }
        });
    }
    
    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        });
    });
    
    // Auto dismiss alerts
    const alerts = document.querySelectorAll('.alert-dismissible');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => {
                alert.remove();
            }, 500);
        }, 5000);
    });
    
    // File upload form with loader and multiple file support
    const uploadForm = document.getElementById('uploadForm');
    const loadingOverlay = document.getElementById('loading-overlay');
    const resultContainer = document.getElementById('result');
    
    if (uploadForm && loadingOverlay) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!fileInput.files.length) {
                showMessage('Please select at least one file to upload', 'danger');
                return;
            }
            
            // Set up processing progress tracking
            const totalFiles = fileInput.files.length;
            let processedFiles = 0;
            let successfulUploads = 0;
            let failedUploads = 0;
            let lastProcessedData = null;
            
            // Show loading overlay
            loadingOverlay.style.display = 'flex';
            
            // Clear previous results
            if (resultContainer) {
                resultContainer.innerHTML = '';
            }
            
            // Process each file sequentially to avoid overwhelming the server
            function processNextFile(index) {
                if (index >= totalFiles) {
                    // All files processed
                    loadingOverlay.style.display = 'none';
                    
                    const summaryMessage = `Processed ${totalFiles} files: ${successfulUploads} successful, ${failedUploads} failed.`;
                    showMessage(summaryMessage, failedUploads > 0 ? 'warning' : 'success');
                    
                    // If we have results, add a View Rankings button
                    if (resultContainer && successfulUploads > 0) {
                        const viewRankingsBtn = document.createElement('div');
                        viewRankingsBtn.className = 'text-center mt-4';
                        viewRankingsBtn.innerHTML = '<a href="/ranking" class="btn btn-primary btn-lg">View All Rankings</a>';
                        resultContainer.appendChild(viewRankingsBtn);
                    }
                    
                    return;
                }
                
                const file = fileInput.files[index];
                const formData = new FormData();
                formData.append('resume', file);
                
                // Update loading message
                if (loadingOverlay) {
                    const loadingMsg = loadingOverlay.querySelector('.loading-message');
                    if (loadingMsg) {
                        loadingMsg.textContent = `Processing file ${index + 1} of ${totalFiles}: ${file.name}`;
                    }
                }
                
                fetch('/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    processedFiles++;
                    successfulUploads++;
                    lastProcessedData = data;
                    
                    // Display extracted skills for each successful file
                    if (resultContainer) {
                        const resultCard = document.createElement('div');
                        resultCard.className = 'card fade-in mb-4';
                        resultCard.innerHTML = `
                            <div class="card-body">
                                <h3 class="card-title">Extracted Information (${index + 1}/${totalFiles})</h3>
                                <p><strong>File:</strong> ${file.name}</p>
                                <p><strong>Name:</strong> ${data.name}</p>
                                <p><strong>Rank Score:</strong> ${data.rank}</p>
                                <div>
                                    <strong>Skills:</strong>
                                    <div class="skills-container">
                                        ${data.skills.map(skill => `<span class="badge badge-primary">${skill}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                        `;
                        resultContainer.appendChild(resultCard);
                    }
                    
                    // Process the next file
                    processNextFile(index + 1);
                })
                .catch(error => {
                    processedFiles++;
                    failedUploads++;
                    
                    // Display error for this specific file
                    if (resultContainer) {
                        const errorCard = document.createElement('div');
                        errorCard.className = 'card fade-in mb-4 border-danger';
                        errorCard.innerHTML = `
                            <div class="card-body text-danger">
                                <h3 class="card-title">Error Processing File (${index + 1}/${totalFiles})</h3>
                                <p><strong>File:</strong> ${file.name}</p>
                                <p><strong>Error:</strong> ${error.message}</p>
                            </div>
                        `;
                        resultContainer.appendChild(errorCard);
                    }
                    
                    // Continue with next file despite error
                    processNextFile(index + 1);
                });
            }
            
            // Start processing the first file
            processNextFile(0);
        });
    }
    
    // Function to show messages
    function showMessage(message, type) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} alert-dismissible fade-in`;
            alert.innerHTML = `
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            `;
            
            alertContainer.appendChild(alert);
            
            // Auto dismiss after 5 seconds
            setTimeout(() => {
                alert.classList.add('fade-out');
                setTimeout(() => {
                    alert.remove();
                }, 500);
            }, 5000);
            
            // Manual dismiss
            const closeBtn = alert.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    alert.classList.add('fade-out');
                    setTimeout(() => {
                        alert.remove();
                    }, 500);
                });
            }
        }
    }
    
    // Tooltip initialization
    const tooltips = document.querySelectorAll('[data-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseover', function() {
            const tooltipText = document.createElement('div');
            tooltipText.className = 'tooltip-text';
            tooltipText.textContent = tooltip.getAttribute('data-title');
            tooltip.appendChild(tooltipText);
        });
        
        tooltip.addEventListener('mouseout', function() {
            const tooltipText = tooltip.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.remove();
            }
        });
    });
    
    // Initialize skill tags input (for the filter form)
    const skillInput = document.getElementById('skill-input');
    const skillsContainer = document.getElementById('selected-skills');
    const skillsHiddenInput = document.getElementById('skills-hidden');
    
    if (skillInput && skillsContainer && skillsHiddenInput) {
        const availableSkills = JSON.parse(skillInput.getAttribute('data-available-skills') || '[]');
        const selectedSkills = [];
        
        // Initialize autocomplete
        let currentFocus;
        
        skillInput.addEventListener('input', function() {
            closeAllLists();
            if (!this.value) return false;
            currentFocus = -1;
            
            const autocompleteList = document.createElement('div');
            autocompleteList.setAttribute('id', 'autocomplete-list');
            autocompleteList.setAttribute('class', 'autocomplete-items');
            this.parentNode.appendChild(autocompleteList);
            
            const val = this.value.toLowerCase();
            
            for (let i = 0; i < availableSkills.length; i++) {
                if (availableSkills[i].toLowerCase().indexOf(val) !== -1) {
                    const item = document.createElement('div');
                    item.innerHTML = availableSkills[i].replace(new RegExp(val, 'gi'), match => `<strong>${match}</strong>`);
                    item.innerHTML += `<input type="hidden" value="${availableSkills[i]}">`;
                    
                    item.addEventListener('click', function() {
                        const value = this.getElementsByTagName('input')[0].value;
                        addSkill(value);
                        closeAllLists();
                    });
                    
                    autocompleteList.appendChild(item);
                }
            }
        });
        
        skillInput.addEventListener('keydown', function(e) {
            let x = document.getElementById('autocomplete-list');
            if (x) x = x.getElementsByTagName('div');
            
            if (e.key === 'ArrowDown') {
                currentFocus++;
                addActive(x);
            } else if (e.key === 'ArrowUp') {
                currentFocus--;
                addActive(x);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentFocus > -1 && x) {
                    x[currentFocus].click();
                } else if (this.value.trim()) {
                    addSkill(this.value.trim());
                }
            }
        });
        
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = x.length - 1;
            x[currentFocus].classList.add('autocomplete-active');
        }
        
        function removeActive(x) {
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove('autocomplete-active');
            }
        }
        
        function closeAllLists(elmnt) {
            const x = document.getElementsByClassName('autocomplete-items');
            for (let i = 0; i < x.length; i++) {
                if (elmnt !== x[i] && elmnt !== skillInput) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        
        document.addEventListener('click', function(e) {
            closeAllLists(e.target);
        });
        
        function addSkill(skill) {
            if (!skill || selectedSkills.includes(skill)) return;
            
            selectedSkills.push(skill);
            updateSkillsContainer();
            skillInput.value = '';
            updateHiddenInput();
        }
        
        function removeSkill(skill) {
            const index = selectedSkills.indexOf(skill);
            if (index !== -1) {
                selectedSkills.splice(index, 1);
                updateSkillsContainer();
                updateHiddenInput();
            }
        }
        
        function updateSkillsContainer() {
            skillsContainer.innerHTML = '';
            
            selectedSkills.forEach(skill => {
                const badge = document.createElement('span');
                badge.className = 'badge badge-primary';
                badge.innerHTML = `${skill} <i class="fas fa-times"></i>`;
                badge.querySelector('i').addEventListener('click', function() {
                    removeSkill(skill);
                });
                
                skillsContainer.appendChild(badge);
            });
        }
        
        function updateHiddenInput() {
            skillsHiddenInput.value = JSON.stringify(selectedSkills);
        }
        
        // Initialize with any existing selected skills
        const existingSkills = JSON.parse(skillsHiddenInput.value || '[]');
        existingSkills.forEach(skill => addSkill(skill));
    }
    
    // Initialize comparison checkboxes
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    const compareBtn = document.getElementById('compare-btn');
    
    if (compareCheckboxes.length > 0 && compareBtn) {
        compareCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checkedBoxes = document.querySelectorAll('.compare-checkbox:checked');
                compareBtn.disabled = checkedBoxes.length < 2;
            });
        });
    }
});
