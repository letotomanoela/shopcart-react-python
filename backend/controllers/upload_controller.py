from fastapi import UploadFile, File
import string
import random
import shutil
from fastapi.responses import JSONResponse

def upload_image(image: UploadFile = File(...)):
    try:
        letter = string.ascii_letters
        rand_str = ''.join(random.choice(letter) for i in range(26))
        new = f'_{rand_str}.'
        filename = new.join(image.filename.rsplit('.',1))
        path = f'uploads/{filename}'
        
        with open(path, "w+b") as file:
            file.write(image.file.read())
            
        return {'filename':path}
    except Exception as exc:
        return JSONResponse(content={"success": False,"error":str(exc), },status_code=400)