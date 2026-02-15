from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.app.services.pdf_service import pdf_service

router = APIRouter()

@router.post("/upload")
async def upload_template(file: UploadFile = File(...)):
    """
    Upload a PDF template and extract its content structure.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        extracted_text = await pdf_service.save_and_extract(file)
        return {
            "filename": file.filename,
            "content": extracted_text,
            "message": "Template processed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
