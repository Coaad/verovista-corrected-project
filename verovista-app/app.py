import os
import json
import io
import logging
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path

# Security & Third-Party
import bleach
from dotenv import load_dotenv
from flask import (Flask, render_template, redirect, url_for, session, request, 
                   jsonify, flash, abort)
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from authlib.integrations.flask_client import OAuth

# Only import Google services if credentials are available
GOOGLE_SERVICES_AVAILABLE = False
try:
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    from googleapiclient.http import MediaIoBaseUpload
    GOOGLE_SERVICES_AVAILABLE = True
except ImportError:
    pass

# --- Initial Setup ---
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY")
if not app.secret_key:
    raise ValueError("No FLASK_SECRET_KEY set in .env file.")

# Configure session cookies for security
app.config.update(
    SESSION_COOKIE_SECURE=os.environ.get("FLASK_ENV") == "production",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=3600  # 1 hour
)

# --- Security Setup ---
csp = {
    'default-src': ''self'',
    'script-src': [
        ''self'',
        'https://cdnjs.cloudflare.com'  # For Font Awesome
    ],
    'style-src': [
        ''self'',
        'https://cdnjs.cloudflare.com',
        'https://fonts.googleapis.com',
        ''unsafe-inline''  # For inline styles from animations
    ],
    'font-src': [
        ''self'',
        'https://cdnjs.cloudflare.com',
        'https://fonts.gstatic.com'
    ],
    'img-src': ['*', 'data:'],  # Allow images from any source for product images
    'connect-src': [''self''],
}

Talisman(app, content_security_policy=csp)
limiter = Limiter(key_func=get_remote_address, app=app, 
                  default_limits=["200 per day", "50 per hour"])

# --- OAuth Setup ---
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
oauth = OAuth(app)

if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:
    try:
        oauth.register(
            name='google',
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
            client_kwargs={
                'scope': 'openid email profile https://www.googleapis.com/auth/drive.file'
            },
        )
    except Exception as e:
        logging.error(f"OAuth setup failed: {e}")

# --- Sample Data Loading ---
SAMPLE_DATA = []
try:
    sample_data_path = Path(__file__).parent / "sample_data.json"
    if sample_data_path.exists():
        with open(sample_data_path, 'r', encoding='utf-8') as f:
            SAMPLE_DATA = json.load(f)
    else:
        logging.warning("sample_data.json not found, using empty data")
except (FileNotFoundError, json.JSONDecodeError) as e:
    logging.error(f"Could not load sample_data.json: {e}")

# --- Helper Functions & Decorators ---
def find_products_in_sample(query):
    """Search for products matching the query in sample data"""
    if not query or not SAMPLE_DATA:
        return []

    query_lower = query.lower()
    matching_products = []

    for product in SAMPLE_DATA:
        # Search in name, brand, category, and description
        searchable_text = ' '.join([
            product.get("name", ""),
            product.get("brand", ""),
            product.get("category", ""),
            product.get("description", ""),
            ' '.join(product.get("query_terms", []))
        ]).lower()

        if query_lower in searchable_text:
            matching_products.append(product)

    return matching_products

def get_product_by_id(product_id):
    """Get a specific product by ID"""
    return next((p for p in SAMPLE_DATA if p.get("product_id") == product_id), None)

def login_required(f):
    """Decorator to require login for certain routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def sanitize_input(text):
    """Sanitize user input to prevent XSS"""
    if not text:
        return ""
    return bleach.clean(str(text).strip(), tags=[], attributes={}, strip=True)

# --- Context Processors ---
@app.context_processor
def inject_global_vars():
    """Inject global variables into all templates"""
    return {
        'now': datetime.now(timezone.utc),
        'user': session.get('user'),
        'GOOGLE_LOGIN_ENABLED': bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)
    }

# --- Main Routes ---
@app.route('/')
def index():
    """Home page with trending products"""
    trending_products = [p for p in SAMPLE_DATA if "trending" in p.get("query_terms", [])]

    # Add URL for each product
    for product in trending_products:
        product['url_for_detail'] = url_for('product_detail', product_id=product['product_id'])

    return render_template('index.html', trending_products=trending_products)

@app.route('/search')
@limiter.limit("10 per minute")
def search():
    """Search page with results"""
    query = sanitize_input(request.args.get('query', ''))

    if not query:
        flash('Please enter a product to search.', 'warning')
        return redirect(url_for('index'))

    products = find_products_in_sample(query)
    return render_template('results.html', products=products, query=query)

@app.route('/search-ajax')
@limiter.limit("15 per minute")
def search_ajax():
    """AJAX search endpoint for dynamic results"""
    query = sanitize_input(request.args.get('query', ''))

    if not query:
        return jsonify({'products': [], 'query': query, 'error': 'No query provided'})

    try:
        products = find_products_in_sample(query)
        return jsonify({'products': products, 'query': query, 'count': len(products)})
    except Exception as e:
        logging.error(f"Search AJAX error: {e}")
        return jsonify({'products': [], 'query': query, 'error': 'Search failed'}), 500

@app.route('/product/<product_id>')
def product_detail(product_id):
    """Product detail page"""
    product_id = sanitize_input(product_id)
    product = get_product_by_id(product_id)

    if not product:
        abort(404)

    return render_template('product_detail.html', product=product)

# --- Auth Routes ---
@app.route('/login')
def login():
    """Initiate Google OAuth login"""
    if not (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET):
        flash("Google Login is not configured.", "error")
        return redirect(url_for('index'))

    try:
        redirect_uri = url_for('authorized', _external=True)
        return oauth.google.authorize_redirect(redirect_uri)
    except Exception as e:
        logging.error(f"Login error: {e}")
        flash("Login service temporarily unavailable.", "error")
        return redirect(url_for('index'))

@app.route('/logout')
def logout():
    """Logout user and clear session"""
    session.clear()
    flash('You have been successfully logged out.', 'success')
    return redirect(url_for('index'))

@app.route('/login/authorized')
def authorized():
    """Handle OAuth callback"""
    try:
        token = oauth.google.authorize_access_token()
        user_info = oauth.google.parse_id_token(token)

        # Store user info in session
        session['user'] = {
            'email': user_info.get('email'),
            'name': user_info.get('name'),
            'given_name': user_info.get('given_name'),
            'picture': user_info.get('picture'),
            'email_verified': user_info.get('email_verified', False)
        }

        # Initialize user history
        if 'history' not in session:
            session['history'] = []

        flash(f"Welcome, {user_info.get('given_name', 'User')}!", 'success')
        return redirect(url_for('profile'))

    except Exception as e:
        logging.error(f"Error during Google authorization: {e}")
        flash('Authentication failed. Please try again.', 'error')
        return redirect(url_for('index'))

# --- User Routes ---
@app.route('/profile')
@login_required
def profile():
    """User profile page"""
    return render_template('profile.html')

@app.route('/history')
@login_required
def history():
    """User search history page"""
    history_ids = session.get('history', [])
    products = []

    for product_id in history_ids:
        product = get_product_by_id(product_id)
        if product:
            products.append(product)

    return render_template('history.html', products=products)

@app.route('/store_data')
@login_required
def store_data():
    """Store user data to Google Drive (demonstration)"""
    if not GOOGLE_SERVICES_AVAILABLE:
        flash("Google Drive integration is not available.", "warning")
        return redirect(url_for('profile'))

    flash("Data export feature is for demonstration purposes.", "info")
    return redirect(url_for('profile'))

# --- API Routes ---
@app.route('/api/add-to-history', methods=['POST'])
@limiter.limit("30 per minute")
@login_required
def add_to_history_api():
    """Add product to user's search history"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        product_id = sanitize_input(data.get('product_id'))
        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400

        # Verify product exists
        if not get_product_by_id(product_id):
            return jsonify({"error": "Product not found"}), 404

        history = session.get('history', [])

        # Remove if already in history (to move to front)
        if product_id in history:
            history.remove(product_id)

        # Add to front of history
        history.insert(0, product_id)

        # Limit history to 30 items
        session['history'] = history[:30]
        session.modified = True

        return jsonify({"success": True, "message": "Added to history"})

    except Exception as e:
        logging.error(f"Add to history error: {e}")
        return jsonify({"error": "Server error"}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "products_loaded": len(SAMPLE_DATA),
        "google_auth": bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)
    })

# --- Error Handlers ---
@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    """Handle 500 errors"""
    logging.error(f"Server error: {e}")
    return render_template('500.html'), 500

@app.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limiting errors"""
    return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429

# --- Development Server ---
if __name__ == '__main__':
    # Set up logging
    logging.basicConfig(level=logging.INFO)

    # Run development server
    debug_mode = os.environ.get("FLASK_DEBUG", "False").lower() in ['true', '1']
    app.run(debug=debug_mode, host='127.0.0.1', port=5000)
