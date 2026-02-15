import fitz  # PyMuPDF
from fastapi import UploadFile
from fastapi.concurrency import run_in_threadpool
import os
import shutil

class PDFService:
    def __init__(self, upload_dir: str = "backend/templates"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_and_extract(self, file: UploadFile) -> str:
        file_path = os.path.join(self.upload_dir, file.filename)
        
        # Run CPU-bound/Blocking I/O in threadpool
        return await run_in_threadpool(self._process_file, file, file_path)

    def _process_file(self, file: UploadFile, file_path: str) -> str:
        # standard sync write
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Extract Text
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text() + "\n"
            return text
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")

pdf_service = PDFService()
