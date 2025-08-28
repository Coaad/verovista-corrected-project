[README.md](https://github.com/user-attachments/files/22034712/README.md)
# 🛒 VeroVista - My Price Comparison Web App

![VeroVista Homepage](https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/bbc24e60-bb70-4fd7-a3d6-c782ae413d4b.png)

Hey there! 👋 Welcome to VeroVista - a project I've been working on that I'm pretty excited about. It's a price comparison website that helps people find the best deals when shopping online. I built this because I was tired of manually checking Amazon, Flipkart, and other sites every time I wanted to buy something. So I thought, "Why not build something that does this automatically?"

## 🚀 What I Built

This is a full-stack web application built with Flask (Python) that lets users search for products and compare prices across different e-commerce platforms. I focused a lot on security and user experience because, well, nobody likes slow or unsafe websites!

**Live Demo:** [Coming Soon - Still working on deployment!]  
**GitHub:** https://github.com/Coaad/verovista-corrected-project

## 📱 How It Actually Works

Let me walk you through what users see when they use VeroVista:

### The Homepage - Clean and Simple
![VeroVista Homepage](https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/bbc24e60-bb70-4fd7-a3d6-c782ae413d4b.png)
I kept the design minimal with a dark theme (because let's be honest, dark mode is just better). The search bar is front and center - no confusing navigation or unnecessary clutter.

### Search Results - Everything at a Glance  
![VeroVista Search Results](https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/0293ee65-a746-493f-be79-2299e9749a06.png)
When someone searches for "Sony headphones" or whatever they're looking for, they get a clean grid showing all the options with prices from different stores. No need to open 10 different tabs!

### Product Details - The Good Stuff
![VeroVista Product Detail](https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/8be245bb-5a1e-487b-8314-6670d1b9e3f8.png)
Click on any product and boom - you see prices from Amazon, Flipkart, and other retailers side by side. I also included ratings so people can make informed decisions.

### User Profiles - Because Personalization Matters
![VeroVista User Profile](https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/429bf607-ff6b-4961-b638-9bc2860083cb.png)
I integrated Google OAuth so users can sign in and keep track of their search history. It's pretty neat - you can see what you've been looking at and even export your data.

## ✨ Cool Features I Implemented

### 🔍 Search That Actually Works
- **Real-time Search:** Built with AJAX so it's super responsive
- **Smart Categories:** Electronics, Clothing, Footwear (might add more later)
- **Flexible Matching:** Searches through product names, brands, descriptions - the works

### 🛡️ Security (This Was Important to Me)
- **XSS Protection:** Used Bleach library to sanitize all inputs
- **Rate Limiting:** Because nobody likes spam or abuse
- **Secure Headers:** HSTS, CSP, all that good stuff
- **OAuth Integration:** Google sign-in that's actually secure

### 👤 User Experience
- **Google Login:** Easy sign-up with Google accounts
- **Search History:** Keeps track of what you've looked at
- **Dark Theme:** Much easier on the eyes
- **Mobile Responsive:** Works on phones too (tested it myself)

### 📊 Price Comparison Magic
- **Multi-Platform:** Currently supports Amazon and Flipkart data
- **Live Ratings:** Shows user ratings from different platforms
- **Direct Links:** Click and go straight to the product page

## 🛠️ What I Used to Build This

### Backend Stuff
- **Flask 2.3+** - Love working with Flask, it's so flexible
- **Python 3.8+** - My go-to language for web development
- **Authlib** - For the Google OAuth integration
- **Flask-Talisman** - Security headers made easy
- **Flask-Limiter** - Rate limiting without the headache

### Frontend
- **HTML5 & CSS3** - Good old reliable, with some modern CSS Grid
- **Vanilla JavaScript** - Kept it simple, no frameworks needed
- **Font Awesome** - For those nice icons
- **Google Fonts** - Poppins font because it looks clean

### Security & Deployment
- **Gunicorn** - For production serving
- **Environment Variables** - Keeping secrets safe
- **Docker Ready** - Made a Dockerfile for easy deployment

## 🚀 Want to Run This Yourself?

### You'll Need
- Python 3.8 or newer
- A Google Cloud account (for the OAuth stuff)
- Basic command line knowledge

### Getting Started
```bash
# Grab the code
git clone https://github.com/Coaad/verovista-corrected-project.git
cd verovista-corrected-project/verovista-app

# Set up a virtual environment (always a good idea)
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install everything
pip install -r requirements.txt
```

### Configuration
Copy `.env.example` to `.env` and fill in your details:

```bash
# You'll need to generate this
FLASK_SECRET_KEY='your-secret-key-here'

# Set to True for development
FLASK_DEBUG=True

# Get these from Google Cloud Console
GOOGLE_CLIENT_ID='your-google-client-id'
GOOGLE_CLIENT_SECRET='your-google-client-secret'
```

### Google OAuth Setup (The Tricky Part)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable Google+ API and Google Drive API
4. Create OAuth 2.0 credentials
5. Add `http://127.0.0.1:5000/login/authorized` as a redirect URI
6. Copy the Client ID and Secret to your `.env` file

### Run It!
```bash
python app.py
```

Then open `http://127.0.0.1:5000` in your browser. Should work like a charm!

## 📁 How I Organized Everything

```
verovista-app/
├── static/                # CSS, JS, images
├── templates/             # HTML templates
├── app.py                # Main Flask application
├── sample_data.json      # Demo product data
├── requirements.txt      # Dependencies
└── .env.example          # Config template
```

I tried to keep it simple and logical. Everything has its place.

## 🔧 API Endpoints (For the Nerds)

### Search
- `GET /search` - Regular search page
- `GET /search-ajax` - AJAX search for dynamic results

### User Stuff  
- `POST /api/add-to-history` - Add products to user history
- `GET /api/health` - Check if everything's running

The AJAX search returns JSON like this:
```json
{
  "products": [...],
  "query": "what-you-searched-for",
  "count": 42
}
```

## 🛡️ Security Features (I Take This Seriously)

- **Input Sanitization** - Everything gets cleaned with Bleach
- **Rate Limiting** - No spam allowed
- **Secure Headers** - All the standard security headers
- **HTTPS Ready** - Works with SSL certificates
- **Session Security** - Proper cookie handling

## 🌐 Deployment Options

I've tested a few different ways to deploy this:

### Traditional Server
Works great on DigitalOcean, Linode, or AWS. Just need Python and Nginx.

### Platform as a Service
Heroku works perfectly (though it's not free anymore). Railway and Render are good alternatives.

### Docker
I included a Dockerfile if you're into containers:
```bash
docker build -t verovista .
docker run -p 5000:5000 verovista
```

## 🐛 Common Issues (And How I Fixed Them)

**App won't start?** - Check your Python version and virtual environment  
**Google login not working?** - Double-check your OAuth setup and redirect URIs  
**No search results?** - Make sure `sample_data.json` is in the right place  
**Styling looks weird?** - Clear your browser cache

## 🔮 What's Next?

I've got some ideas for future versions:
- **Real API Integration** - Connect to actual e-commerce APIs instead of sample data
- **Price Alerts** - Email notifications when prices drop
- **More Retailers** - Add eBay, Walmart, etc.
- **Mobile App** - Maybe build a React Native version
- **Machine Learning** - Predict price trends

## 🤝 Want to Contribute?

I'd love some help! If you find bugs or have ideas, feel free to:
1. Fork the repo
2. Make your changes
3. Send me a pull request

Just try to keep the code clean and add comments where things get complex.

## 📝 A Few Notes

- This project uses sample data for demonstration (I'm working on real API integrations)
- The Google Drive integration is mostly for show right now
- I built this as a portfolio project, but I think it could actually be useful
- If you use this code, just give me a shout out somewhere!

## 📞 Get in Touch

Found a bug? Got a question? Want to chat about web development?

- **GitHub Issues** - Best place for bug reports
- **Email** - [Your email here]
- **LinkedIn** - [Your LinkedIn here]

## 🙏 Thanks

Shoutout to:
- The Flask team for making such a great framework
- Google for their OAuth documentation (even though it took me forever to figure out)
- Stack Overflow for... well, everything
- Coffee, for keeping me awake during late coding sessions

---

**Built with lots of coffee ☕ and occasional frustration 😅**

*Making online shopping less of a hassle, one comparison at a time.*

P.S. - If you're reading this and you're a recruiter, hi! 👋 I'm always open to new opportunities.
