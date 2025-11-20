#!/bin/bash
# Quick start script for backend setup

echo "🚀 Setting up QKD Backend..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

echo "✨ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload --port 8000"
echo ""
echo "API will be available at: http://localhost:8000"
echo "Interactive docs at: http://localhost:8000/docs"
