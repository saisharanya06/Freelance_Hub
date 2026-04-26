import uvicorn
import sys
import os

# Add the current directory to sys.path so that 'backend' and 'database' packages can be found
sys.path.append(os.getcwd())

if __name__ == "__main__":
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
