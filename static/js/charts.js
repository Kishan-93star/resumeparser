document.addEventListener('DOMContentLoaded', function() {
    // Chart.js initialization
    Chart.defaults.font.family = "'Product Sans', 'Roboto', sans-serif";
    Chart.defaults.color = '#6c757d';
    
    // Skills distribution chart on ranking page
    const skillsChartEl = document.getElementById('skills-chart');
    if (skillsChartEl) {
        const labels = JSON.parse(skillsChartEl.getAttribute('data-labels') || '[]');
        const data = JSON.parse(skillsChartEl.getAttribute('data-values') || '[]');
        
        if (labels.length > 0 && data.length > 0) {
            new Chart(skillsChartEl, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Candidates',
                        data: data,
                        backgroundColor: [
                            '#4285f4', '#ea4335', '#fbbc05', '#34a853',
                            '#4285f4', '#ea4335', '#fbbc05', '#34a853',
                            '#4285f4', '#ea4335'
                        ],
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                drawBorder: false
                            },
                            ticks: {
                                precision: 0
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Top Skills Distribution',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: {
                                bottom: 20
                            },
                            color: '#4285f4'
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 14
                            },
                            padding: 10,
                            cornerRadius: 6,
                            displayColors: false
                        }
                    }
                }
            });
        } else {
            skillsChartEl.innerHTML = '<div class="text-center p-4 text-muted">No data available to display chart</div>';
        }
    }
    
    // Dashboard charts
    const trendChartEl = document.getElementById('trend-chart');
    if (trendChartEl) {
        const months = JSON.parse(trendChartEl.getAttribute('data-months') || '[]');
        const counts = JSON.parse(trendChartEl.getAttribute('data-counts') || '[]');
        const avgRanks = JSON.parse(trendChartEl.getAttribute('data-avg-ranks') || '[]');
        
        if (months.length > 0 && counts.length > 0) {
            new Chart(trendChartEl, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Resumes Added',
                            data: counts,
                            borderColor: '#4285f4',
                            backgroundColor: 'rgba(66, 133, 244, 0.1)',
                            tension: 0.3,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Average Rank',
                            data: avgRanks,
                            borderColor: '#34a853',
                            backgroundColor: 'transparent',
                            borderDash: [5, 5],
                            tension: 0.3,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Resumes Count'
                            },
                            grid: {
                                drawBorder: false
                            },
                            ticks: {
                                precision: 0
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Average Rank'
                            },
                            grid: {
                                drawBorder: false,
                                drawOnChartArea: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Resume Upload Trends',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: {
                                bottom: 20
                            },
                            color: '#4285f4'
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 14
                            },
                            padding: 10,
                            cornerRadius: 6
                        }
                    }
                }
            });
        } else {
            trendChartEl.innerHTML = '<div class="text-center p-4 text-muted">No data available to display chart</div>';
        }
    }
    
    // Skills distribution pie chart
    const skillsPieChartEl = document.getElementById('skills-pie-chart');
    if (skillsPieChartEl) {
        const labels = JSON.parse(skillsPieChartEl.getAttribute('data-labels') || '[]');
        const data = JSON.parse(skillsPieChartEl.getAttribute('data-values') || '[]');
        
        if (labels.length > 0 && data.length > 0) {
            new Chart(skillsPieChartEl, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            '#4285f4', '#ea4335', '#fbbc05', '#34a853',
                            '#4285f4', '#ea4335', '#fbbc05', '#34a853',
                            '#4285f4', '#ea4335'
                        ],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        title: {
                            display: true,
                            text: 'Skills Distribution',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: {
                                bottom: 20
                            },
                            color: '#4285f4'
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 14
                            },
                            padding: 10,
                            cornerRadius: 6
                        }
                    }
                }
            });
        } else {
            skillsPieChartEl.innerHTML = '<div class="text-center p-4 text-muted">No data available to display chart</div>';
        }
    }
    
    // Candidate score comparison chart on comparison page
    const comparisonChartEl = document.getElementById('comparison-chart');
    if (comparisonChartEl) {
        const names = JSON.parse(comparisonChartEl.getAttribute('data-names') || '[]');
        const scores = JSON.parse(comparisonChartEl.getAttribute('data-scores') || '[]');
        
        if (names.length > 0 && scores.length > 0) {
            new Chart(comparisonChartEl, {
                type: 'radar',
                data: {
                    labels: ['Python', 'Java', 'Machine Learning', 'Communication', 'Data Science', 'SQL'],
                    datasets: names.map((name, index) => {
                        const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];
                        return {
                            label: name,
                            data: scores[index],
                            backgroundColor: `${colors[index % colors.length]}33`,
                            borderColor: colors[index % colors.length],
                            borderWidth: 2,
                            pointBackgroundColor: colors[index % colors.length],
                            pointRadius: 4,
                            pointHoverRadius: 6
                        };
                    })
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            ticks: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Candidate Skill Comparison',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: {
                                bottom: 20
                            },
                            color: '#4285f4'
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 14
                            },
                            padding: 10,
                            cornerRadius: 6
                        }
                    }
                }
            });
        } else {
            comparisonChartEl.innerHTML = '<div class="text-center p-4 text-muted">No data available to display chart</div>';
        }
    }
    
    // Rank distribution histogram
    const rankHistogramEl = document.getElementById('rank-histogram');
    if (rankHistogramEl) {
        const ranks = JSON.parse(rankHistogramEl.getAttribute('data-ranks') || '[]');
        
        if (ranks.length > 0) {
            // Create bins for the histogram
            const binSize = 10; // Each bin represents 10 points
            const maxRank = Math.max(...ranks);
            const bins = Math.ceil(maxRank / binSize);
            
            const binCounts = Array(bins).fill(0);
            ranks.forEach(rank => {
                const binIndex = Math.floor(rank / binSize);
                binCounts[binIndex]++;
            });
            
            const binLabels = Array(bins).fill(0).map((_, i) => `${i * binSize}-${(i + 1) * binSize - 1}`);
            
            new Chart(rankHistogramEl, {
                type: 'bar',
                data: {
                    labels: binLabels,
                    datasets: [{
                        label: 'Number of Candidates',
                        data: binCounts,
                        backgroundColor: '#4285f4',
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                drawBorder: false
                            },
                            ticks: {
                                precision: 0
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Rank Score Range'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Candidate Score Distribution',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: {
                                bottom: 20
                            },
                            color: '#4285f4'
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 14
                            },
                            padding: 10,
                            cornerRadius: 6,
                            displayColors: false
                        }
                    }
                }
            });
        } else {
            rankHistogramEl.innerHTML = '<div class="text-center p-4 text-muted">No data available to display chart</div>';
        }
    }
});
