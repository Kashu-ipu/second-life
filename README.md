# ♻️ Second Life

### AI-Powered Circular Economy & Sustainable Item Pathways

Second Life is a smart circular economy platform that helps users discover the best possible **second life for their unwanted items**.

Instead of simply throwing an item away, users can assess its condition and receive transparent recommendations for sustainable pathways such as **Reuse/Donate, Repair, Resell, and Recycle**.

The platform combines item assessment, intelligent pathway scoring, image-based verification, location-aware opportunities, and action management to make sustainable decisions easier and more accessible.

🌐 **Live Demo:** https://second-life-ivory-ten.vercel.app

## 🌍 Problem Statement

Millions of usable products are discarded every day even when they still have the potential to be reused, repaired, resold, donated, or responsibly recycled.

The challenge is that users often do not know:

- Whether an item is still usable
- Which sustainable pathway is most suitable
- Why a particular pathway is recommended
- Where they can take action locally
- How to connect with relevant opportunities

As a result, potentially valuable items often end up as waste.

## 💡 Our Solution

**Second Life** helps users make informed and sustainable decisions about unwanted items.

Users can provide item details and assess the item's condition. The platform evaluates the information and compares multiple circular economy pathways using a transparent recommendation engine.

The system recommends the most suitable pathway and explains the reasoning behind the recommendation.

Users can then explore relevant opportunities, connect and take action, and manage their submitted requests.

## ✨ Key Features

### 📦 Item Assessment

Users can assess an unwanted item by:

- Uploading an image
- Selecting a sample item
- Providing item details manually
- Selecting the item's category and condition
- Providing relevant characteristics for better assessment

### 🖼️ Image Verification

Second Life includes an image verification flow that helps validate uploaded item images as part of the assessment process.

This improves the reliability of the assessment flow by ensuring that the uploaded image can be meaningfully used for item evaluation.

### 🧠 Transparent Recommendation Engine

The platform evaluates an item across four circular economy pathways:

1. **Reuse / Donate**
2. **Repair**
3. **Resell**
4. **Recycle**

Each pathway is evaluated based on the item's details, category, condition, and characteristics.

The pathways are scored and ranked to identify the most suitable recommendation.

### 📊 Explainable Recommendations

Instead of providing a recommendation without context, Second Life presents the reasoning behind the suggested pathway.

This helps users understand:

- Why a pathway is recommended
- How the item's condition affects the result
- Which sustainable options are available
- How different pathways compare

### 📍 Location-Aware Opportunities

Users can explore relevant opportunities based on their location.

The platform supports:

- Location permission
- Manual location input
- Dynamic opportunity suggestions

This helps connect users with possible pathways for taking action.

### 🤝 Connect & Act

After receiving a recommendation, users can take the next step by connecting with relevant opportunities.

The platform provides a flow for users to:

- Explore opportunities
- Initiate a connection
- Submit an action request

### 📋 My Requests

Users can manage their submitted connection and action requests through the **My Requests** section.

Request information is maintained using browser storage to support the prototype workflow.

## 🔄 How It Works

Item Upload / Item Details
            ↓
     Item Assessment
            ↓
     Image Verification
            ↓
Recommendation Scoring Engine
            ↓
 ┌──────────┼──────────┐
 ↓          ↓          ↓
Reuse     Repair     Resell
            ↓
         Recycle
            ↓
   Pathway Scoring & Ranking
            ↓
  Best Recommended Pathway
            ↓
   Explanation & Opportunities
            ↓
       Connect & Act
            ↓
        My Requests

🧠 Recommendation Engine

The recommendation engine evaluates the item using multiple inputs.

Input Factors

The assessment considers information such as:

Item category
Item condition
Item characteristics
Usability
Potential for repair
Potential resale value
Reuse potential
Recycling suitability

Recommendation Flow

Item Information
      +
Category
      +
Condition
      +
Characteristics
      ↓
Pathway Scoring Engine
      ↓
Score All Circular Pathways
      ↓
Rank Pathways
      ↓
Select Best Recommendation
      ↓
Explain Recommendation

The goal is to make the recommendation process transparent and understandable rather than presenting users with an unexplained result

🛣️ Circular Economy Pathways
♻️ Reuse / Donate

Suitable for items that are still functional and can continue to be used by another person or organization.

🔧 Repair

Suitable for items that have recoverable issues and can potentially regain functionality through repair.

💰 Resell

Suitable for items that are functional and retain potential market value.

🌱 Recycle

Suitable for items that have reached the end of their usable life but can still be processed responsibly.

🏗️ Project Architecture

React Frontend
     │
     ▼
Item Assessment Interface
     │
     ├── Image Upload
     ├── Manual Item Details
     └── Sample Item Selection
              │
              ▼
      Image Verification
              │
              ▼
   Recommendation Engine
              │
              ▼
   Pathway Scoring & Ranking
              │
              ▼
 Recommendation & Explanation
              │
              ▼
 Location-Based Opportunities
              │
              ▼
       Connect & Act
              │
              ▼
        My Requests

🛠️ Tech Stack

-React
-Vite
-JavaScript
-HTML5
-CSS3
-Local Storage
-Git & GitHub
-Vercel

📂 Project Features Overview
Feature	                     Description
Home	                       Introduction to the Second Life platform
Item Assessment              Collects information about unwanted items
Image Upload	               Allows users to upload item images
Image Verification	         Supports validation within the item assessment flow
Sample Items	               Enables users to quickly test the prototype
Recommendation Engine	       Scores and ranks circular pathways
Pathway Analysis	           Shows multiple sustainable options
Explainable Results	         Explains why a pathway is recommended
Location Flow	               Supports location permission and manual input
Opportunities	               Displays relevant opportunities
Connect & Act	               Allows users to initiate action
My Requests	                 Manages submitted requests
Local Storage	               Maintains prototype data in the browser

🚀 Getting Started

Prerequisites
Make sure you have the following installed:
-Node.js
-npm
-Git

Installation

Clone the repository:
git clone https://github.com/Kashu-ipu/second-life

Navigate to the project directory:
cd second-life

Install dependencies:
npm install

Start the development server:
npm run dev

Open the local development URL shown in your terminal.

🧪 Testing the Prototype

The following flows can be tested:

Navigate through the platform.
Open the Item Assessment page.
Upload an item image or select a sample item.
Provide item information and condition details.
Complete the image verification flow.
Generate the item analysis.
Review the four circular economy pathways.
Check the recommended pathway and explanation.
Explore available opportunities.
Connect and submit an action request.
Open My Requests to view submitted requests.
Refresh the application to test browser storage persistence.

🌱 Sustainability Impact

Second Life encourages users to think beyond disposal.

By helping users evaluate alternative pathways such as reuse, repair, resale, donation, and recycling, the platform aims to support:

-Reduced waste generation
-Extended product life cycles
-Responsible disposal
-Circular economy practices
-More informed consumer decisions

🔮 Future Scope

Future versions of Second Life could include:

-Advanced AI-based image analysis
-Machine learning-powered recommendation models
-Real-time integration with recycling and donation organizations
-Maps and live location-based opportunities
-Verified partner organizations
-User accounts and authentication
-Real-time request tracking
-Impact analytics
-Carbon and waste reduction estimates
-Marketplace integration for resale opportunities

🎯 Project Vision

  **Every item deserves a second life before becoming waste**.
Second Life aims to make sustainable decision-making easier by helping users understand the potential of the items they already own and guiding them towards the most suitable circular pathway.

👩‍💻 Team

Second Life Team
-Kashvi Mittal
-Aayushi Chaudhary
-Prachi Tyagi

📄 License

This project was developed as a prototype for a hackathon project.

♻️ Give Every Item a Second Life.
