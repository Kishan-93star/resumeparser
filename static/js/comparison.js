document.addEventListener('DOMContentLoaded', function() {
    // Handle the comparison view
    const compareTable = document.getElementById('compare-table');
    if (compareTable) {
        // Highlight the common and unique skills
        const rows = compareTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td:not(:first-child)');
            let trueCount = 0;
            
            cells.forEach(cell => {
                if (cell.textContent.trim() === '✓') {
                    trueCount++;
                    cell.classList.add('has-skill');
                } else {
                    cell.classList.add('no-skill');
                }
            });
            
            // Color-code the row based on how common the skill is
            if (trueCount === cells.length) {
                // All candidates have this skill
                row.classList.add('common-skill');
            } else if (trueCount === 1) {
                // Only one candidate has this skill
                row.classList.add('unique-skill');
            } else if (trueCount > 0) {
                // Some candidates have this skill
                row.classList.add('partial-skill');
            }
        });
        
        // Create a filter for the comparison table
        const filterInput = document.getElementById('skill-filter');
        if (filterInput) {
            filterInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                rows.forEach(row => {
                    const skillName = row.querySelector('td:first-child').textContent.toLowerCase();
                    if (skillName.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
    }
    
    // Filter options for the comparison table
    const filterCommon = document.getElementById('filter-common');
    const filterUnique = document.getElementById('filter-unique');
    const filterAll = document.getElementById('filter-all');
    
    if (filterCommon && filterUnique && filterAll) {
        filterCommon.addEventListener('click', function() {
            const rows = compareTable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                if (row.classList.contains('common-skill')) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
        
        filterUnique.addEventListener('click', function() {
            const rows = compareTable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                if (row.classList.contains('unique-skill')) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
        
        filterAll.addEventListener('click', function() {
            const rows = compareTable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                row.style.display = '';
            });
        });
    }
    
    // Candidate comparison checkboxes logic
    const compareForm = document.getElementById('compare-form');
    if (compareForm) {
        const checkboxes = compareForm.querySelectorAll('input[type="checkbox"]');
        const maxSelections = 4; // Maximum number of candidates to compare
        const submitBtn = compareForm.querySelector('button[type="submit"]');
        
        let checkedCount = 0;
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                checkedCount = compareForm.querySelectorAll('input[type="checkbox"]:checked').length;
                
                // Disable checkboxes if max selections reached
                if (checkedCount >= maxSelections) {
                    checkboxes.forEach(cb => {
                        if (!cb.checked) {
                            cb.disabled = true;
                        }
                    });
                } else {
                    // Enable all checkboxes
                    checkboxes.forEach(cb => {
                        cb.disabled = false;
                    });
                }
                
                // Enable/disable submit button
                if (checkedCount >= 2) {
                    submitBtn.disabled = false;
                } else {
                    submitBtn.disabled = true;
                }
                
                // Update counter
                const counter = document.getElementById('selection-counter');
                if (counter) {
                    counter.textContent = `${checkedCount}/${maxSelections} selected`;
                }
            });
        });
    }
    
    // Skill comparison visualization
    const skillVisualization = document.getElementById('skill-visualization');
    if (skillVisualization) {
        const candidates = JSON.parse(skillVisualization.getAttribute('data-candidates') || '[]');
        
        if (candidates.length > 0) {
            // Get all unique skills
            const allSkills = new Set();
            candidates.forEach(candidate => {
                candidate.skills.forEach(skill => {
                    allSkills.add(skill);
                });
            });
            
            // Calculate the score for each candidate by skill category
            const categories = {
                'Programming': ['Python', 'Java', 'JavaScript', 'C++', 'HTML', 'CSS'],
                'Data Science': ['Machine Learning', 'Data Science', 'Deep Learning', 'SQL', 'NLP', 'TensorFlow', 'PyTorch'],
                'Soft Skills': ['Communication', 'Leadership', 'Teamwork', 'Problem Solving'],
                'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'Git', 'AWS']
            };
            
            const scores = [];
            
            candidates.forEach(candidate => {
                const candidateScores = {};
                
                for (const [category, skills] of Object.entries(categories)) {
                    const categorySkills = candidate.skills.filter(skill => skills.includes(skill));
                    candidateScores[category] = categorySkills.length / skills.length * 10;
                }
                
                scores.push({
                    name: candidate.name,
                    scores: candidateScores
                });
            });
            
            // Create visualization
            const container = document.createElement('div');
            container.className = 'row';
            
            scores.forEach(score => {
                const candidateCard = document.createElement('div');
                candidateCard.className = 'col-md-3 col-sm-6 mb-4';
                
                const cardHtml = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${score.name}</h5>
                            <div class="category-scores">
                                ${Object.entries(score.scores).map(([category, value]) => `
                                    <div class="category-score">
                                        <div class="category-name">${category}</div>
                                        <div class="progress">
                                            <div class="progress-bar bg-primary" role="progressbar" 
                                                style="width: ${value * 10}%" 
                                                aria-valuenow="${value}" 
                                                aria-valuemin="0" 
                                                aria-valuemax="10"></div>
                                        </div>
                                        <div class="score-value">${value.toFixed(1)}/10</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
                
                candidateCard.innerHTML = cardHtml;
                container.appendChild(candidateCard);
            });
            
            skillVisualization.appendChild(container);
        }
    }
});
