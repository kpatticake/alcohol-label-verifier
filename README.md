# Alcohol Label Verification

This project was completed as part of a take-home assessment for the Department of the Treasury. The goal was to create a prototype application capable of comparing user-supplied alcohol label information against text extracted from alcohol label artwork and displaying verification results.

The application is a standalone proof-of-concept. It does not connect to COLA, a government database, or any internal Treasury system.

## Technology Stack

I initially planned to build this project using Java and JavaFX, since those are the technologies I am most experienced with. After reviewing the requirements, I decided a web-based solution would be more appropriate and accessible.

The final technology stack consists of:

* Node.js / npm
* React JS
* Vite
* Material UI (MUI)
* Tesseract.js
* GitHub
* AWS Amplify

I selected React because it supports rapid development of responsive web applications that can be accessed through a modern browser and on mobile devices. Material UI provided a large collection of well-designed components, allowing me to focus on application functionality rather than building UI elements from scratch.

I chose GitHub and AWS Amplify to demonstrate a modern CI/CD workflow. Changes are committed to GitHub and automatically deployed through Amplify, making updated versions of the application available with minimal configuration.

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

Build the application:
To create a production build or verify that the application builds successfully, run:

```bash
npm run build
```

## Sample Test Files

I included a small set of sample files to make the application easier to test.

The folder `public/testLabels` contains eight sample alcohol label images and a corresponding CSV file for the batch verification workflow. The CSV file contains the expected application data for each sample label and uses the image filename to match each CSV row to the correct uploaded image.

To test batch verification:

1. Start the application.
2. Select **Batch CSV** mode.
3. Upload the sample CSV file from `public/testLabels`.
4. Upload the eight corresponding label images from the same folder.
5. Run batch verification.


## Application Features

* Verification mode toggle for switching between single-label verification and batch CSV verification
* Single-label workflow using manually entered application data
* Batch verification workflow using a CSV file and matching uploaded label images
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
* Batch verification results display
* Extracted OCR text review panel

## Single-Label Workflow

In single-label mode, the user manually enters expected application data into the form, uploads or captures one label image, and runs verification. The application performs OCR on the uploaded image and compares the extracted text against the entered values.

This workflow is intended to represent a simplified version of comparing submitted application data against label artwork.

## Batch Verification Workflow

In batch mode, the user uploads a CSV file containing expected application data and then uploads the corresponding label images. The application matches each CSV row to an uploaded image by filename, performs OCR on each image, and displays verification results for each row.

The expected CSV format is:

```csv
brandName,productType,alcoholVolume,netContents,imageFileName
Old Tom,Kentucky Straight Bourbon Whiskey,45%,750 ml,test_label_1.png
Summit,Vodka,40%,750 ml,test_label_2.png
```

The final column uses an image filename, not a full local file path. For example, the CSV should contain:

```text
test_label_1.png
```

instead of:

```text
C:\Users\User\Pictures\test_label_1.png
```

This design is intentional. Web browsers do not allow a web application to directly access arbitrary file paths on a user's computer. To work within that limitation, the user uploads both the CSV file and the matching image files through the browser. The application then matches CSV rows to uploaded images using the `imageFileName` value.

## Project Structure

The application is organized into three main files:

### App.jsx

Contains:

* User interface components
* React state management
* Single-label user interactions
* Batch user interactions
* OCR processing for the single-label workflow
* User notifications and result display

### LabelVerifier.js

Contains:

* Label verification logic
* Text normalization
* Compliance checks
* Field comparison functions

This file is responsible for checking one set of expected application values against OCR-extracted label text.

### BatchVerifier.js

Contains:

* CSV reading
* CSV parsing
* Uploaded image filename matching
* Batch OCR processing
* Batch result creation

This file reuses the same verification logic from `LabelVerifier.js`, which keeps the field comparison behavior consistent between single-label and batch verification.

Separating the verification and batch-processing logic from the UI helps keep the application easier to read, test, and maintain.

## Assumptions

This prototype uses manually entered form fields to represent application data that would normally come from a submitted label application or an internal system such as COLA. Direct integration with an internal system was not implemented because the project instructions described this as a standalone proof-of-concept.

For the batch workflow, the CSV file represents multiple submitted application records. Each row includes expected label information and an `imageFileName` value. The matching label images must also be uploaded by the user.

The current workflow assumes the user either:

* Enters expected data manually and uploads one label image, or
* Uploads a CSV file and the corresponding label images for batch verification

## Limitations

The largest limitation encountered was OCR accuracy on highly stylized labels.

Tesseract performed very well when reading clean, high-contrast text. However, decorative fonts, curved text, artistic branding, and complex label designs often reduced recognition accuracy. Brand names were especially difficult because they are commonly displayed as large, stylized logo text rather than simple printed text. During testing, Tesseract often recognized standardized compliance information such as ABV, net contents, and government warning language more reliably than brand names.

One advantage of the current implementation is that all OCR processing occurs directly within the browser. No external OCR APIs or third-party services are required.

The government warning check is currently a presence check. It looks for key warning language such as `government warning` and `surgeon general`, but it does not fully validate the entire warning statement word-for-word. A production version would need more complete legal text validation.

Batch processing is implemented as a prototype workflow. The current version matches CSV rows to uploaded images by filename. This works well for a standalone browser-based proof-of-concept, but a production workflow would likely need stronger validation, clearer record identifiers, better error reporting, and integration with an actual application data source.

The CSV parser is intentionally simple and designed for the expected project format. A production application would likely use a more complete CSV parsing library and stronger validation for missing columns, malformed rows, duplicate filenames, and unsupported file types.

## Development Process

My process was:

1. Review the stakeholder interviews and requirements.
2. Use AI to help identify key requirements and possible implementation approaches.
3. Select a technology stack.
4. Create a GitHub repository and deployment pipeline using AWS Amplify.
5. Build the single-label user interface.
6. Implement browser-based OCR functionality using Tesseract.js.
7. Develop the verification and comparison logic.
8. Test the application using multiple sample labels.
9. Add mobile camera support, allowing users to capture label images directly from supported devices.
10. Add a batch verification workflow using CSV records and matching uploaded image files.
11. Refactor batch-processing logic into a separate helper file.
12. Add a mode toggle so the user can switch between single-label verification and batch verification.
13. Refine the user experience and project structure.

While the stakeholder interviews primarily suggested a desktop workflow, adding mobile support required minimal effort and demonstrates how the concept could be extended to additional use cases.

## AI-Assisted Development

I used AI heavily throughout this project as a development assistant. I did not use it as a replacement for understanding the application. I used it to help reason through implementation options, generate draft code, troubleshoot issues, and speed up tasks that would normally require a lot of documentation searching.

The batch-processing feature is a good example. When I began working on batch processing, I ran into the browser file-access limitation. A browser-based application cannot simply read a full local file path from a CSV and access that file automatically. After researching the issue, I redesigned the workflow so the CSV contains an image filename rather than a full file path. The user uploads the CSV and the corresponding images, and the application matches the records to images by filename.

This approach was based on the same kind of batch-processing pattern I have used in previous Java work: read a set of records, process each record, track success or failure, and return results for review. AI helped me translate that familiar pattern into React and JavaScript more quickly.

I also spent time reviewing and adjusting the generated code rather than blindly copying it. My previous programming experience helped me understand what the code was doing, where safety checks were needed, and how to keep the user workflow simple. My earlier QA experience also influenced decisions around validation, error messages, missing files, and making the interface as clear as possible for the user.

Using AI significantly reduced the time spent searching documentation and troubleshooting common implementation details. Without that assistance, I could still have built the project, but it would have taken much longer and likely required more trial and error.

## Time Spent

I spent approximately 10 to 12 hours completing this project from start to finish.

I created and tested the application against multiple sample labels. OCR performance varied depending on label design, which provided valuable insight into the strengths and limitations of OCR-based verification systems.

## Closing Thoughts

Thank you for including me in this assessment. I genuinely enjoyed working on it and learned a great deal throughout the process. The project exposed me to technologies and workflows that I had not previously used, particularly OCR processing within a browser environment and automated cloud deployment.

I appreciate your time and consideration and look forward to discussing the project further.
