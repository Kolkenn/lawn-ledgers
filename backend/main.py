from fastapi import FastAPI
from fastapi.responses import FileResponse

app = FastAPI()
favicon_path = 'favicon.ico'

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(favicon_path)