print("Starting Flask application...")
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import io
from PIL import Image
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
    print("Tesseract is available")
except ImportError:
    TESSERACT_AVAILABLE = False
    print("Tesseract is NOT available")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
print("Flask app initialized with CORS")

# ... rest of your code ...

if __name__ == '__main__':
    print(f"Starting Flask server on port 5000...")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)