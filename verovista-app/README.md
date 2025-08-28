# 🛒 VeroVista - Price & Review Comparison Engine

[![Flask](https://img.shields.io/badge/Flask-2.3+-blue.svg)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://python.org)
[![Security](https://img.shields.io/badge/Security-First-red.svg)](https://github.com/yourusername/verovista-app)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

VeroVista is a modern, security-first price and review comparison engine designed to bring transparency and efficiency to online shopping. This full-stack application focuses on electronics, clothing, and footwear, aggregating product data from major e-commerce platforms to help users find the best deals and most authentic reviews.

## 🚀 Live Demo

- **Application:** [Your Deployment URL Here]
- **GitHub:** [https://github.com/yourusername/verovista-app](https://github.com/yourusername/verovista-app)

## ✨ Features

### 🔍 Smart Product Search
- **Instant Search:** Real-time AJAX-powered product search with autocomplete suggestions
- **Category Filtering:** Browse by Electronics, Clothing, and Footwear categories
- **Smart Matching:** Advanced search algorithm matches products across multiple attributes

### 🛡️ Security-First Architecture
- **Content Security Policy (CSP):** Strict CSP headers via Flask-Talisman
- **Rate Limiting:** API endpoints protected with configurable rate limits
- **Input Sanitization:** All user inputs sanitized with Bleach to prevent XSS attacks
- **Secure Headers:** HSTS, X-Content-Type-Options, X-Frame-Options automatically applied
- **Session Security:** HttpOnly, Secure, and SameSite cookie configurations

### 👤 User Management
- **Google OAuth 2.0:** Secure authentication with Google accounts
- **Search History:** Automatic tracking of viewed products for logged-in users
- **Profile Management:** User dashboard with statistics and account controls
- **Data Export:** Save profile information to Google Drive (demonstration feature)

### 🎨 Modern User Experience
- **Dark Theme:** Professional dark UI with smooth animations
- **Responsive Design:** Perfect experience across desktop, tablet, and mobile
- **Progressive Enhancement:** Works with JavaScript disabled
- **Accessibility:** WCAG 2.1 compliant design with screen reader support

### 📊 Product Comparison
- **Multi-Platform Pricing:** Compare prices across Amazon, Flipkart, and other major retailers
- **Review Insights:** Aggregate ratings and review counts from multiple sources
- **Availability Status:** Real-time stock information from partner platforms
- **Price Trends:** Historical pricing data and deal recommendations

## 🛠️ Technology Stack

### Backend
- **Flask 2.3+** - Modern Python web framework
- **Python 3.8+** - Latest Python features and performance improvements
- **Authlib** - Secure OAuth 2.0 implementation
- **Flask-Talisman** - Security headers and CSP enforcement
- **Flask-Limiter** - Rate limiting and abuse prevention
- **Bleach** - HTML sanitization and XSS prevention
- **Google APIs** - Drive integration and OAuth services

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript ES6+** - Vanilla JavaScript with modern features
- **Font Awesome 6** - Comprehensive icon library
- **Google Fonts** - Poppins font family for modern typography

### Security & DevOps
- **Gunicorn** - Production WSGI server
- **Environment Variables** - Secure configuration management
- **HTTPS Ready** - SSL/TLS certificate integration
- **Docker Support** - Containerization for consistent deployments

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Git
- Google Cloud Console account (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/verovista-app.git
cd verovista-app
```

### 2. Set Up Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
# Copy environment template
cp .env.example .env
```

Edit the `.env` file with your configuration:

#### Required Variables:
```env
# Generate with: python -c 'import secrets; print(secrets.token_hex(24))'
FLASK_SECRET_KEY='your-super-secret-key-here'

# Set to False for production
FLASK_DEBUG=True

# Get from Google Cloud Console
GOOGLE_CLIENT_ID='your-google-client-id'
GOOGLE_CLIENT_SECRET='your-google-client-secret'
```

#### Optional Variables:
```env
# Production settings
FLASK_ENV=production
SESSION_COOKIE_SECURE=True
SESSION_TIMEOUT=3600

# Logging
LOG_LEVEL=INFO
```

### 5. Google OAuth Setup
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google Drive API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://127.0.0.1:5000/login/authorized` (for local development)
   - `https://yourdomain.com/login/authorized` (for production)
7. Copy Client ID and Client Secret to your `.env` file

### 6. Run the Application
```bash
# Development server
flask run

# Or with Python directly
python app.py
```

The application will be available at `http://127.0.0.1:5000`

## 📁 Project Structure

```
verovista-app/
├── static/                    # Static assets
│   ├── css/
│   │   └── style.css         # Main stylesheet with dark theme
│   └── js/
│       └── script.js         # Interactive JavaScript
├── templates/                # Jinja2 templates
│   ├── base.html            # Base template with header/footer
│   ├── index.html           # Homepage with search
│   ├── results.html         # Search results page
│   ├── product_detail.html  # Individual product page
│   ├── profile.html         # User profile dashboard
│   ├── history.html         # Search history page
│   ├── 404.html            # 404 error page
│   └── 500.html            # 500 error page
├── app.py                   # Main Flask application
├── sample_data.json         # Product data for demonstration
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🌐 Deployment

### Production Checklist
- [ ] Set `FLASK_DEBUG=False` in production
- [ ] Use strong `FLASK_SECRET_KEY` (64+ characters)
- [ ] Configure `SESSION_COOKIE_SECURE=True` for HTTPS
- [ ] Set up proper logging with `LOG_LEVEL=INFO`
- [ ] Configure reverse proxy (Nginx recommended)
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting

### Deployment Options

#### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)
```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv nginx

# Clone and setup application
git clone https://github.com/yourusername/verovista-app.git
cd verovista-app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
nano .env

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

#### Option 2: Platform as a Service (Heroku, Railway, Render)
```bash
# For Heroku
echo "web: gunicorn app:app" > Procfile
heroku create your-app-name
heroku config:set FLASK_SECRET_KEY='your-secret-key'
heroku config:set GOOGLE_CLIENT_ID='your-client-id'
heroku config:set GOOGLE_CLIENT_SECRET='your-client-secret'
git push heroku main
```

#### Option 3: Docker Deployment
```dockerfile
# Dockerfile (create this file)
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

```bash
# Build and run
docker build -t verovista .
docker run -p 5000:5000 --env-file .env verovista
```

## 🔧 API Documentation

### Search Endpoints

#### `GET /search`
Search for products with query parameter.
- **Parameters:** `query` (string, required)
- **Response:** HTML page with results

#### `GET /search-ajax`
AJAX endpoint for dynamic search results.
- **Parameters:** `query` (string, required)
- **Response:** JSON object with products array

```json
{
  "products": [
    {
      "product_id": "sony-wh1000xm5",
      "name": "Sony WH-1000XM5 Wireless Headphones",
      "brand": "Sony",
      "category": "Electronics",
      "image_url": "https://example.com/image.jpg",
      "offers": [
        {
          "platform": "Amazon",
          "price": 24990.00,
          "rating": 4.5,
          "url": "https://amazon.in/product"
        }
      ]
    }
  ],
  "query": "headphones",
  "count": 1
}
```

### User Endpoints

#### `POST /api/add-to-history`
Add product to user's search history (requires authentication).
- **Body:** `{"product_id": "string"}`
- **Response:** `{"success": true, "message": "Added to history"}`

#### `GET /api/health`
Application health check endpoint.
- **Response:** 
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "products_loaded": 10,
  "google_auth": true
}
```

## 🛡️ Security Features

### Input Validation & Sanitization
- All user inputs sanitized with Bleach library
- Query parameters validated and escaped
- SQL injection prevention (when using databases)
- XSS attack mitigation

### Authentication & Authorization
- Secure OAuth 2.0 implementation with Google
- Session-based authentication with secure cookies
- CSRF protection on all forms
- Rate limiting on authentication endpoints

### HTTP Security Headers
- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` with strict rules

### Rate Limiting
- Global rate limits: 200 requests/day, 50 requests/hour per IP
- Search endpoints: 10 requests/minute
- API endpoints: 15-30 requests/minute
- Authentication: 5 attempts/minute

## 🎨 Customization

### Styling
The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-bg: #0f0f23;
  --accent-yellow: #ffc107;
  --link-color: #5cadff;
  /* Modify these values in static/css/style.css */
}
```

### Adding New Product Categories
1. Update `sample_data.json` with new category products
2. Add category icon in `templates/index.html`
3. Update category colors in CSS if desired

### Integrating Real Data Sources
Replace the sample data system with real API integrations:
1. Create API client classes for each platform
2. Update `find_products_in_sample()` function in `app.py`
3. Implement caching for better performance
4. Add error handling for API failures

## 🐛 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Verify virtual environment is activated
which python  # Should point to venv/bin/python

# Check dependencies
pip list | grep Flask  # Should show Flask 2.3+

# Verify environment variables
python -c "import os; print(os.environ.get('FLASK_SECRET_KEY'))"
```

#### Google OAuth Not Working
- Verify Client ID and Secret in `.env`
- Check authorized redirect URIs in Google Console
- Ensure correct domain/port in redirect URI
- Clear browser cookies and try again

#### Search Not Returning Results
- Check `sample_data.json` exists and is valid JSON
- Verify search query matches product names/brands
- Check browser console for JavaScript errors
- Test with simple queries like "iphone" or "nike"

#### Styling Issues
- Verify CSS file is loading (check browser dev tools)
- Clear browser cache
- Check for JavaScript errors that might affect styling
- Ensure Font Awesome CDN is accessible

### Development Tips
```bash
# Enable debug mode for detailed error messages
export FLASK_DEBUG=True
flask run

# Test API endpoints with curl
curl -X GET "http://127.0.0.1:5000/search-ajax?query=laptop"

# Monitor application logs
tail -f app.log  # If logging to file is configured

# Performance testing
ab -n 100 -c 10 http://127.0.0.1:5000/
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow PEP 8 style guide for Python code
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure security best practices are followed

### Code Review Process
- All PRs require at least one review
- Security-related changes require additional review
- CI/CD checks must pass
- Documentation updates must accompany feature changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Flask Team** - For the excellent web framework
- **Google** - For OAuth 2.0 and APIs
- **Font Awesome** - For the comprehensive icon library
- **Unsplash** - For high-quality product images
- **Contributors** - Everyone who helps improve VeroVista

## 📞 Support

- **Documentation:** [GitHub Wiki](https://github.com/yourusername/verovista-app/wiki)
- **Issues:** [GitHub Issues](https://github.com/yourusername/verovista-app/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/verovista-app/discussions)
- **Email:** [support@verovista.com](mailto:support@verovista.com)

## 🗺️ Roadmap

### Version 2.0 (Upcoming)
- [ ] Real-time price tracking and alerts
- [ ] Advanced filtering and sorting options
- [ ] User reviews and ratings system
- [ ] Wishlist functionality
- [ ] Mobile app (React Native)

### Version 2.1 (Future)
- [ ] Machine learning price predictions
- [ ] Browser extension
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

<div align="center">

**Built with ❤️ and ☕ by the VeroVista Team**

*Making online shopping smarter, one comparison at a time.*

[⬆ Back to Top](#-verovista---price--review-comparison-engine)

</div>