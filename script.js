const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const analyzeBtn = document.getElementById('analyze-btn');
const statusText = document.getElementById('status-text');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const diagnosticReport = document.getElementById('diagnostic-report');
const rawJson = document.getElementById('raw-json');
const previewImg = document.getElementById('preview');
const fileNameDisplay = document.getElementById('file-name');
const previewContainer = document.getElementById('file-preview-container');

// UI Elements for report
const reportDiagnosis = document.getElementById('report-diagnosis');
const reportUrgency = document.getElementById('report-urgency-badge');
const reportFindings = document.getElementById('report-findings');
const reportRecommendations = document.getElementById('report-recommendations');

let selectedFile = null;

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#00d2ff';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'rgba(0, 210, 255, 0.3)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        selectedFile = files[0];
        fileNameDisplay.textContent = selectedFile.name;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
            dropZone.style.display = 'none';
        }
        reader.readAsDataURL(selectedFile);
        
        analyzeBtn.disabled = false;
        statusText.textContent = 'Image Loaded. Ready for analysis.';
    }
}

analyzeBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    analyzeBtn.disabled = true;
    statusText.textContent = 'Optimizing Image for AI Neural Network...';
    progressContainer.style.display = 'block';
    diagnosticReport.style.display = 'none';
    rawJson.style.display = 'none';

    // Simulation of a "5-minute" analysis compacted for demo (approx 10 seconds)
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        progressBar.style.width = `${progress}%`;
        
        if (progress === 30) statusText.textContent = 'Segmenting Lung Regions...';
        if (progress === 60) statusText.textContent = 'Running Pathological Recognition...';
        if (progress === 90) statusText.textContent = 'Cross-referencing Diagnostic Patterns...';

        if (progress >= 100) {
            clearInterval(interval);
            fetchAnalysis();
        }
    }, 200);
});

async function fetchAnalysis() {
    statusText.textContent = 'Generating Final Report...';
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('http://127.0.0.1:8000/analyze', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        statusText.textContent = 'Error communicating with AI Server.';
        console.error(error);
    }
}

function displayResults(data) {
    statusText.textContent = 'Analysis Complete';
    progressContainer.style.display = 'none';
    
    const report = data.report;
    
    // UI Report Display
    reportDiagnosis.textContent = `Diagnosis: ${report.diagnosis}`;
    reportUrgency.textContent = report.urgency;
    reportUrgency.className = `badge badge-${report.urgency.toLowerCase() === 'low' ? 'low' : 'high'}`;
    reportFindings.textContent = report.findings;
    
    reportRecommendations.innerHTML = '';
    report.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        reportRecommendations.appendChild(li);
    });

    diagnosticReport.style.display = 'block';
    
    // Show raw JSON as requested
    rawJson.textContent = JSON.stringify(data, null, 4);
    rawJson.style.display = 'block';
}
