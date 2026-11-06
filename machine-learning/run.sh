#!/bin/bash

# Navigate to script directory
cd "$(dirname "$0")"

# Check if virtualenv exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment (venv)..."
    python3 -m venv venv
fi

# Activate virtualenv
source venv/bin/activate

# Install / update dependencies
echo "Checking dependencies..."
pip install -r requirements.txt

# Start FastAPI server on port 8001
echo "Starting Machine Learning Service on http://127.0.0.1:8001..."
echo "Swagger Docs available at: http://127.0.0.1:8001/docs"
uvicorn main:app --host 127.0.0.1 --port 8001 --reload

