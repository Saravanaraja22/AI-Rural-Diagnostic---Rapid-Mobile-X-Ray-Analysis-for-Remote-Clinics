from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import time
import random

app = FastAPI(title="Rural X-Ray Diagnostic System Demo API")

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_xray(file: UploadFile = File(...)):
    # Simulating a processing delay for the demo
    # In a real scenario, this would involve the AI model inference
    # For the demo, we'll return a structured JSON report immediately
    # but the frontend will handle the "5-minute" simulation visual.
    
    diagnoses = [
        {
            "diagnosis": "Pneumonia",
            "confidence": "94.2%",
            "urgency": "High",
            "findings": "Opacification in the lower right lobe consistent with bacterial pneumonia.",
            "recommendations": [
                "Immediate consultation with a respiratory specialist.",
                "Administer broad-spectrum antibiotics as per local guidelines.",
                "Monitor oxygen saturation levels."
            ]
        },
        {
            "diagnosis": "Tuberculosis (TB)",
            "confidence": "89.5%",
            "urgency": "Critical",
            "findings": "Cavitary lesions in the upper left lung apex, suggestive of active TB.",
            "recommendations": [
                "Isolate patient immediately to prevent spread.",
                "Initiate standard DOTS (Directly Observed Treatment, Short-course).",
                "Screen close contacts."
            ]
        },
        {
            "diagnosis": "No Significant Abnormality",
            "confidence": "98.1%",
            "urgency": "Low",
            "findings": "Clear lung fields, normal cardiac silhouette, and intact bony thorax.",
            "recommendations": [
                "Routine follow-up in 12 months.",
                "Continue standard health monitoring."
            ]
        }
    ]
    
    # Pick a random diagnosis for the demo variety
    result = random.choice(diagnoses)
    
    return {
        "status": "success",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "filename": file.filename,
        "report": result
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
