# Alcohol Label Verification

This project was completed as part of a take-home assessment for the Department of the Treasury. The goal was to create a prototype application capable of comparing user-supplied alcohol label information against text extracted from a label image and displaying the verification results.

## Technology Stack

I initially planned to build this project using Java and JavaFX, as those are the technologies I am most experienced with. After reviewing the requirements, I decided a web-based solution would be more appropriate and accessible.

The final technology stack consists of:
* Node.js / npm
* React JS
* Vite
* Material UI (MUI)
* Tesseract.js
* GitHub
* AWS Amplify


I selected React because it allows rapid development of responsive web applications that can be accessed through any modern browser and on a mobile device. Material UI provided a large collection of well-designed components, allowing me to focus on application functionality rather than building UI elements from scratch.

I chose GitHub and AWS Amplify to demonstrate a modern CI/CD workflow. Changes are committed to GitHub and automatically deployed through Amplify, making updated versions of the application immediately available with minimal configuration.

## Running the Application

Clone the repository:

```bash
git clone https://github.com/kpatticake/alcohol-label-verifier.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Application Features

* Upload alcohol label images from desktop devices
* Capture and process label images directly from a mobile device camera
* OCR text extraction using Tesseract.js
* Verification of:
    * Brand Name
    * Product Type
    * Alcohol By Volume (ABV)
    * Net Contents
    * Government Warning presence
* Strict Compliance Mode
* Loose Matching Mode
* Verification results display
* Extracted OCR text review panel

## Project Structure

The application is intentionally organized into two primary files:

## Assumptions

This prototype uses manually entered form fields to represent application data that would normally come from a submitted label application or an internal system such as COLA. Direct integration with an internal system was not implemented because the project instructions described this as a standalone proof-of-concept.

The current workflow assumes a user enters the expected label information, uploads or captures a label image, and then runs verification against the OCR-extracted text.


### App.jsx

Contains:

* User interface components
* State management
* OCR processing workflow
* User interactions and notifications

### LabelVerifier.js

Contains:

* Label verification logic
* Text normalization
* Compliance checks
* Field comparison functions

Separating the verification logic from the UI helps keep the application easier to read and maintain.

## Limitations

The largest limitation encountered was OCR accuracy on highly stylized labels.

Tesseract performed very well when reading clean, high-contrast text. However, decorative fonts, curved text, artistic branding, and complex label designs often reduced recognition accuracy. Brand names were especially difficult because they are commonly displayed as large, stylized logo text rather than simple printed text. During testing, Tesseract often recognized standardized compliance information such as ABV, net contents, and government warning language more reliably than brand names.

One advantage of the current implementation is that all OCR processing occurs directly within the browser. No external OCR APIs or third-party services are required.

Batch processing is not currently implemented. I chose to focus on building a working single-label verification workflow first, including OCR extraction, field comparison, result display, and mobile image capture support. Batch upload support would be a logical future enhancement.



## Development Process

I used AI heavily throughout this project as a development assistant. Rather than generating large portions of the application automatically, I used AI in small, incremental steps to accelerate development and learning.

My process was:

1. Review the stakeholder interviews and requirements.
2. Use AI to help identify key requirements and potential implementation approaches.
3. Select a technology stack.
4. Create a GitHub repository and deployment pipeline using AWS Amplify.
5. Build the user interface.
6. Implement OCR functionality.
7. Develop verification and comparison logic.
8. Test the application using multiple sample labels.
9. Add mobile camera support, allowing users to capture label images directly from supported devices.
10. Refine the user experience and project structure.

While the stakeholder interviews primarily suggested a desktop workflow, adding mobile support required minimal effort and demonstrates how the concept could be extended to additional use cases.

Using AI significantly reduced the amount of time spent searching documentation and troubleshooting common implementation issues, allowing me to focus on understanding the problem and building the solution.


## Time Spent

I spent approximately 10 hours completing this project from start to finish.

I created and tested the application against multiple sample labels. OCR performance varied depending on label design, which provided valuable insight into the strengths and limitations of OCR-based verification systems.

## Closing Thoughts

Thank you for including me in this assessment. I genuinely enjoyed working on it and learned a great deal throughout the process. The project exposed me to technologies and workflows that I had not previously used, particularly OCR processing within a browser environment and automated cloud deployment.

I appreciate your time and consideration and look forward to discussing the project further.
