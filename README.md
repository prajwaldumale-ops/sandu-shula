# sandu-sula 🌿

> **A calmer way to begin understanding joint health.**
> An educational risk-screening web application for osteoarthritis (OA), built with plain language, empathetic aesthetics, and actionable care guidance.

---

## 📁 Project Structure

```text
sandusula/
├── index.html          # Landing page with hero, context cards, and care CTAs
├── signin.html         # User sign-in with email/password and Google OAuth
├── signup.html         # User registration with password strength meter
├── onboarding.html     # Patient onboarding (Name, Age, Weight, Gender, Location)
├── screening.html      # Interactive 14-question clinical osteoarthritis screening
├── css/
│   ├── style.css       # Core design system tokens, typography, and base styles
│   └── auth.css        # Authentication cards, form controls, and strength meter
├── js/
│   └── auth.js         # Google Identity Services integration & session persistence
├── images/
│   ├── logo.jpeg       # Primary joint knot brand icon
│   └── logo_with_name.jpeg # Full horizontal/stacked brand logo
├── server.ps1          # Built-in PowerShell HTTP server for local testing (port 5500)
├── .gitignore          # Excludes client secrets and OS cache files
└── README.md           # Project documentation and deployment guide
```

---

## ✨ Key Features

1. **Brand Identity**: Custom typography (`DM Serif Display` and `Inter`) paired with warm earthy tones (`#FAF6EF`, `#226E70`).
2. **Google OAuth Integration**: Built with the modern **Google Identity Services (GIS)** SDK for secure popup authentication and session management.
3. **Step-by-Step Onboarding**: Collects patient background (Age, Weight, Gender, Location) and saves data to `sessionStorage` for personalized results.
4. **14-Question Clinical OA Screening**:
   - Covers joint pain frequency, morning stiffness duration, crepitus/clicking, activity limitations, weather sensitivity, and family history.
   - Live question tracker (`Question X of 14`) with a visual progress bar.
   - Automated scoring engine calculating **Mild**, **Moderate**, or **Elevated Risk Signal**.
   - Personalized results screen showing customized local care recommendations.

---

## 🚀 Running Locally

### Option 1: Using the Included PowerShell Server (Port 5500)
Open PowerShell in the project directory:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Then visit:
- **Homepage**: [http://localhost:5500/index.html](http://localhost:5500/index.html)
- **Sign In**: [http://localhost:5500/signin.html](http://localhost:5500/signin.html)
- **Onboarding**: [http://localhost:5500/onboarding.html](http://localhost:5500/onboarding.html)
- **Screening**: [http://localhost:5500/screening.html](http://localhost:5500/screening.html)

### Option 2: Using VS Code Live Server
1. Open the folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

---

## 🌐 Deploying & Hosting

This project is fully static and ready to host anywhere:

### 1. GitHub Pages
1. Push this repository to GitHub.
2. In your repository on GitHub, go to **Settings** &rarr; **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be published at `https://<username>.github.io/<repo-name>/`.

### 2. Vercel or Netlify
- Drag and drop this folder onto **Netlify Drop**, or import the GitHub repository into **Vercel**.
- No build command is needed (Root directory, Publish directory: `./`).

---

## 🔒 Security Note
- The Google Client ID is configured for `http://localhost:5500`.
- When deploying to production, add your production domain (e.g. `https://your-domain.com`) to **Authorised JavaScript origins** and **Authorised redirect URIs** in your [Google Cloud Console](https://console.cloud.google.com/).
