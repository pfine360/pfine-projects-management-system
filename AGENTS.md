AGENTS.md
Global Codex Limit Conservation Policy
Priority

Always conserve Codex hourly, daily, weekly, and monthly usage limits across all projects. Treat every task as part of a limited budget.

The main goal is to complete the requested task with the smallest safe amount of inspection, editing, testing, and file generation.

Do not perform broad exploration, unnecessary rewrites, unnecessary refactors, speculative improvements, or unrelated upgrades.

Prefer a stable working foundation over a large unfinished platform.

Project Boundary

This project must remain inside this folder only:

D:\kiangure-springs-environment-initiative

Do not inspect, edit, create, delete, move, rename, or scan files outside this project folder.

If a requested action appears to require access outside this folder, stop and explain before proceeding.

Do not touch unrelated projects on the same computer.

Do not reuse assumptions from other projects unless the user explicitly asks for them.

Current Project
Project name

Kiangure Springs Environment Initiative

Product idea

An offline-first desktop installable environmental project data management app for recording, uploading, extracting, saving, organising, searching, reviewing, and reporting community and environmental project data.

The app should support environmental initiatives such as:

Tree planting
Seedling distribution
Biogas installation
Energy-saving cookstove projects
Fish farming
Water projects
Climate action projects
Community training
Environmental restoration
School environmental programmes
Group/community beneficiary projects
Any future environmental or community development project
Main business/organisation goal

Create a practical offline app that can help Kiangure Springs Environment Initiative manage project records, documents, evidence, beneficiaries, reports, and field data in a professional way.

The first version should be useful locally and offline.

Later versions may support:

Desktop installer
Cloud backup
Online hosting
Mobile/PWA access
Donor reports
GPS and map integration
Beneficiary signatures
User roles and permissions
Advanced document extraction
OCR for scanned files/images
Licensing
Multi-organisation support

Do not build the entire long-term platform at once unless explicitly instructed.

Current Development Scope

The current priority is to create a stable offline-first MVP foundation for environmental project data.

The app should support:

Local project records
Manual data entry
Uploaded project documents
Extraction of data from uploaded documents
Independent retrieval of each extracted data piece
User accounts
Project categories
Beneficiary/community records
Search and filtering
Dashboard summaries
Basic reports and exports
Future expansion readiness

Do not add unnecessary online services, payment gateways, cloud APIs, AI APIs, tracking, analytics, or complex frameworks unless explicitly approved.

The app must work without internet.

Technology Rules

Before choosing or changing technology, inspect the current project structure only as much as necessary.

If the project already has a suitable stack, follow it.

If the project is empty or unsuitable, recommend and implement the simplest maintainable offline-first desktop-ready approach.

Acceptable options may include:

HTML, CSS, and JavaScript for a simple local app
Electron if desktop packaging is needed
Tauri if suitable and already practical
SQLite or another local database where appropriate
IndexedDB/local browser storage only if suitable for the scale and file handling needs

Do not add frameworks, dependencies, build tools, or desktop wrappers without a clear reason.

Ask for confirmation before:

Installing dependencies
Adding a framework
Adding Electron/Tauri
Adding server-side code
Adding licence activation
Adding online sync
Adding cloud backup
Running broad tests
Performing large rewrites
Changing architecture
Required First Behaviour Before Work

Before making edits:

Read this AGENTS.md file.
Inspect only the current project directory listing.
If the project is empty, create only the minimum files needed for the first working version.
If files already exist, inspect only the files directly relevant to the requested task.
Briefly state the cheapest safe implementation plan.
Do not scan the whole project unless the requested target files are unknown.
Do not read unrelated files.
Do not rewrite unrelated files.
Do not refactor unrelated logic.
Do not create fake placeholder features.
Expensive Actions Requiring Confirmation

Ask for confirmation before:

Scanning the entire project
Running broad searches
Running full test suites
Installing dependencies
Adding frameworks
Creating many new files
Rewriting large files
Changing architecture
Adding server-side features
Adding online sync
Adding cloud backup
Adding licence activation
Adding payment processing
Adding desktop packaging
Adding mobile packaging
Refactoring unrelated code
Touching files outside the project folder
Work Style

Prefer:

Targeted edits
Minimal diffs
Reading only directly related files
Small safe patches
One feature at a time
One bug fix at a time
Clear manual test steps
Simple, maintainable code
Stable MVP before advanced features
Clear environmental project naming
Expandable database/schema design

Avoid:

Large rewrites
Unrequested redesigns
Unrelated refactors
Unnecessary abstraction
Unnecessary dependencies
Over-engineering
Fake placeholder features
Broken or half-connected UI
Broad “improve everything” changes
Features that look present but do not work
Coding Standards

Use UK English in:

Interface labels
Documentation
Comments
README content
User-facing messages

Keep code:

Readable
Maintainable
Well organised
Descriptive
Safe for non-technical users
Suitable for a practical environmental organisation app
Ready for future expansion

Use clear names for:

Functions
Variables
Form fields
Storage keys
Database tables
CSS classes
Project categories
Document extraction records

Avoid duplicated logic where reasonable.

Do not add lorem ipsum text.

Do not add external tracking.

Do not add unrelated branding.

Security and Data Rules

The app should store data locally for the first version.

Do not transmit user data, project data, documents, or extracted records to external services.

Do not add analytics, remote scripts, hidden tracking, or external calls.

Safely handle user-entered text before rendering it.

Avoid unsafe rendering patterns.

Do not store passwords as plain text.

If user accounts are implemented, use proper password hashing based on the chosen stack.

If the app remains browser-only in the first version, be honest about the security limitations of frontend-only user accounts.

Do not claim frontend-only access control is secure against a technical user.

Uploaded files must remain recoverable.

Extracted raw data must never be destroyed by edits.

Manual edits must be stored separately from raw extracted data.

Do not introduce destructive migrations.

Version 1 Core Features

The first working version should support the following core areas.

1. User Accounts

Support user accounts.

At minimum:

Admin
Staff/user
Viewer role prepared for future expansion
Project officer role prepared for future expansion

User records should include:

Full name
Username or email
Password hash
Role
Status: active or inactive
Created date
Last login where practical

The app should support:

Login
Logout
Session persistence where appropriate
Role-based permissions where practical
Audit trail for key actions

Admin should be able to:

Add users
Edit users
Disable users
Assign roles
View all records
Manage categories
Manage settings

Normal users should only access permitted features.

2. Environmental Project Records

The app must support manual creation and management of environmental project records.

Each project record should support:

Project title
Project category
Description
Location
County
Sub-county
Ward
Village/community
Beneficiary or group name
Contact person
Contact details where applicable
Date started
Date completed
Project status
Budget/cost fields if applicable
Donor/funding source if applicable
Notes
Custom fields
Attachments
Created by user
Last updated by user
Audit history

Project statuses may include:

Draft
Planned
Active
Completed
Follow-up Required
Verified
Archived
3. Project Categories

Support flexible environmental project categories.

Default categories should include:

Tree Planting
Seedling Distribution
Biogas Installation
Energy-saving Cookstoves
Fish Farming
Water Project
Community Training
Environmental Restoration
School Programme
Climate Action
General Environmental Project

The category system must be expandable.

Do not hardcode the app so that only one project type works.

4. Custom Fields

The app must support flexible data formats.

Different environmental projects may need different fields.

Examples:

Tree planting may include:

Tree species
Seedlings supplied
Number planted
Planting date
Survival count
GPS/location
Institution/community name
Follow-up visit notes

Biogas installation may include:

Household/institution name
Digester type
Installation date
Capacity
Livestock count
Technician
Status
Follow-up notes

Cookstove project may include:

Beneficiary name
Stove type
Quantity installed
Location
Training status
Fuel-saving estimate
Follow-up status

Fish farming project may include:

Pond owner/group
Pond size
Fingerlings supplied
Fish species
Stocking date
Feed records
Harvest records
Mortality records

The app should allow future categories and future custom fields without breaking old records.

5. Beneficiary and Community Records

Support beneficiaries, communities, groups, schools, institutions, organisations, or households.

Each beneficiary/community record should support:

Name
Type: person, household, group, school, institution, community, organisation
Location
Contact person
Phone/email if applicable
Notes
Tags
Linked projects
Linked uploaded files
Linked extracted entries
Created by user
Updated by user
6. Document Upload and Local File Storage

The app must allow users to upload and save project documents and evidence files.

Supported minimum file types:

.xls
.xlsx
.pdf
.doc
.docx
.jpg
.jpeg
.png

Ignore previous typing errors such as .xcls and .dox.

The app should be designed so more file extensions can be added later through configuration.

For every uploaded file, store metadata:

Document ID
Original filename
Internal saved filename
File extension
MIME/type if available
File size
Upload date
Uploaded by user
Related project if selected
Related project category if selected
Related beneficiary/community/group/location if selected
Description/notes
Tags
Local storage path
Document status
Extraction status
Number of extracted entries
Last extraction date

Document statuses may include:

Draft
Imported
Extracted
Partially Extracted
Failed
Verified
Archived
Rejected
Pending Review

The app must copy uploaded files into a controlled local app storage folder where the chosen stack allows this.

Do not depend on the original source path after upload.

Prevent duplicate names from overwriting each other by generating safe internal filenames.

Add validation for allowed file types and file size.

7. Document Data Extraction

The app must not only save uploaded files.

It must extract the data contained inside uploaded documents according to document type and save that data in small independently retrievable pieces.

Each extracted item must be stored independently so that one row, one table item, one paragraph, one project entry, one beneficiary record, one location record, or one evidence item can be searched, reviewed, edited, approved, exported, and linked back to its original source document.

The user must be able to open an uploaded document record and see:

Original uploaded file
Extracted entries
Source page/sheet/table/row/paragraph where possible
Extraction status
Data review status
Linked project
Linked beneficiary/community/location
Uploaded by user
Date uploaded
Extracted by app
Any failed extraction warnings
Extraction Rules by Document Type
Excel: .xls and .xlsx

For Excel files, extract:

Workbook name
Sheet names
Header rows where detectable
Each sheet row as an independent extracted entry
Each cell value as structured field data
Row number
Sheet name
Column names or generated column keys
Empty row handling
Merged cell handling where possible
Basic type detection: text, number, date, currency-like value, percentage-like value, boolean

Every meaningful row should be saved as an independent extracted record.

Each extracted Excel row must remain linked to:

Source document
Sheet name
Row number
Original column values
Normalised fields if mapped
Review status

The user should be able to review extracted Excel rows and convert them into project records, beneficiary records, tree planting records, cookstove records, biogas records, fish farming records, or general custom records.

Word: .doc and .docx

For Word documents, extract where possible:

Paragraphs
Headings
Tables
Table rows
Table cells
Lists
Basic sections
Embedded image references where practical

Save each meaningful paragraph, heading, table row, or list item as an independent extracted entry.

Each extracted Word item must be linked to:

Source document
Approximate section/heading where possible
Paragraph index or table index/row index
Raw text
Structured table data where available
Review status

If .doc extraction is not safely supported by the selected local technology, save the file, show a clear warning, and allow manual extraction/manual entry.

Do not pretend unsupported extraction works.

PDF: .pdf

For PDF files, extract where possible:

Page text
Tables if reliable extraction is available
Page numbers
Lines/blocks of text
Basic document sections where detectable

Save extracted PDF content as independent entries such as:

Page text block
Table row
Detected project-like row
Detected beneficiary-like row
General text entry

Each extracted PDF item must be linked to:

Source document
Page number
Table index if applicable
Row index if applicable
Raw extracted text
Structured fields if detected
Review status

If PDF extraction is imperfect, the app must fail gracefully.

It should still save the uploaded file, show a clear warning, and allow manual extraction/manual entry by the user.

Do not require OCR in version 1 unless the current stack already supports it safely.

Prepare the structure so OCR can be added later.

Images: .jpg, .jpeg, .png

For images, save the file as evidence.

Store:

Filename
Description
Related project
Related beneficiary/community/location
Tags
Uploaded by
Date uploaded

Do not force OCR for images in version 1.

Prepare the structure for future OCR/photo tagging.

Extracted Data Review Workflow

Add a document import/review workflow.

The workflow should be:

User uploads a file.
App stores the original file safely.
App extracts data according to file type.
App saves extracted items individually.
User opens an extraction review screen.
User can search, filter, edit, approve, reject, or link extracted entries.
User can convert extracted entries into proper app records.

Each extracted entry should support:

View raw extracted content
Edit cleaned content
Assign project category
Assign target record type
Link to existing project
Create new project from extracted entry
Link to beneficiary/community
Add tags
Mark as reviewed
Mark as rejected
Mark as duplicate
Mark as converted
Add notes

Possible target record types:

Project
Beneficiary/community/group
Tree planting activity
Biogas installation activity
Cookstove installation activity
Fish farming activity
Training activity
Water project activity
General environmental record
Evidence/document note
Custom record

The app must preserve both:

Raw extracted data
User-cleaned/edited data

Never overwrite raw extracted data.

Suggested Data Structure

Use the current project’s stack and storage pattern, but the app should support tables or equivalent collections similar to:

users
roles
projects
project_categories
project_custom_fields
project_custom_values
beneficiaries
documents
document_extractions
extracted_entries
extracted_entry_fields
project_activities
activity_custom_fields
tags
tag_links
audit_logs
settings
import_mapping_profiles

Suggested extracted entry fields:

id
document_id
source_type: excel, word, pdf, image, manual
source_location_type: sheet_row, page_text, pdf_table_row, word_paragraph, word_table_row, image_evidence, manual_entry
source_sheet_name
source_page_number
source_table_index
source_row_number
source_column_name
raw_text
raw_json
cleaned_text
cleaned_json
detected_record_type
assigned_record_type
project_id
beneficiary_id
category_id
status: new, reviewed, rejected, duplicate, converted, needs_manual_review
confidence_score if available
created_by
created_at
updated_at

The exact implementation can differ if the current project stack requires it, but the logic must support independent retrieval of each extracted data piece.

Import Mapping Profiles

Prepare a simple structure for import mapping.

Users should eventually be able to map Excel columns or extracted fields to project fields.

First version should include at least a basic mapping approach:

Detect column headers
Display extracted columns
Allow user to assign a target record type
Allow user to map common columns to fields
Save mapping profile for future reuse where practical

Examples:

Excel column “Name” can map to beneficiary name.
Excel column “Village” can map to village/location.
Excel column “Trees Planted” can map to tree planting quantity.
Excel column “Date” can map to activity date.
Excel column “Stove Type” can map to cookstove type.
Excel column “Biogas Unit” can map to biogas installation type.

Do not overbuild advanced AI mapping.

Use practical local/manual mapping.

Search, Filtering, and Retrieval

Add proper search and filtering for:

Projects
Project category
Location
Date range
Project status
Uploaded files
Extracted entries
Beneficiary/community
User who created/uploaded/extracted
Tags
Document type
Extraction status
Review status
Source sheet/page/table/row where applicable

The user must be able to retrieve each extracted entry independently.

For example:

Retrieve one row extracted from Excel
Retrieve one table row extracted from Word
Retrieve one PDF page block
Retrieve all entries from one file
Retrieve all entries linked to one project
Retrieve all extracted but unreviewed entries
Retrieve all records related to tree planting in a specific location
Retrieve all cookstove beneficiaries from an imported Excel sheet
Dashboard Requirements

Create a simple, professional dashboard showing:

Total projects
Total uploaded documents
Total extracted entries
Unreviewed extracted entries
Converted extracted entries
Failed extractions
Projects by category
Pending/active/completed projects
Recent uploads
Recent extracted records
Recent project records
Records created by current user
Basic environmental impact summary placeholders

Environmental impact summary examples:

Trees planted
Seedlings distributed
Cookstoves installed
Biogas units installed
Fish ponds supported
Training sessions conducted
Beneficiaries reached

Keep the dashboard clean, useful, and expandable.

Reports and Export

Add export-ready structure.

Where practical in the first working version, support:

Export project list to CSV or Excel
Export filtered records
Export extracted entries
Export documents list
Print project summary
Generate simple project report page
Prepare future PDF reports

Do not overbuild if it would require a large rewrite.

Implement the safest useful version first.

Navigation and UI Requirements

The interface should be professional, simple, and suitable for an environmental initiative.

Use clean navigation such as:

Dashboard
Projects
Add Project
Documents
Import Review
Extracted Data
Beneficiaries/Communities
Reports
Users
Settings

The app should not look like a rough demo.

It should have:

Clear forms
Clean tables
Proper empty states
Helpful labels
Validation messages
Confirmation before deleting
Search boxes
Filters
View details pages
Edit pages
Status badges
Responsive layout where possible
Professional environmental styling using green, white, earthy tones, and clean neutral colours

Avoid:

Clutter
Broken layouts
Tiny unreadable text
Decorative features that harm usability
Placeholder content
Excessive animations
Fake buttons that do nothing
Hidden broken features
README Requirements

README.md should explain:

What the app does
Who it is for
How to run it locally
How to create a project
How to add beneficiaries/communities
How to upload documents
Supported document types
How document extraction works
How extracted entries are stored
How to review extracted data
How to convert extracted entries into project records
How to create manual records
How to search/filter records
How to export reports
How local storage/database works
Basic limitations of version 1
Future roadmap

Future roadmap may mention:

Desktop installer
Online sync
Cloud backup
Mobile/PWA support
GPS/map integration
OCR for scanned PDFs/images
Donor report templates
Beneficiary signatures
Advanced analytics
Multi-organisation support
Server-side licence activation

Keep the README practical and user-friendly.

Testing Policy

Do not run expensive or broad test suites unless requested.

Prefer targeted checks and manual test instructions.

After changes, provide manual test steps such as:

Open or run the app.
Log in as admin.
Create a user.
Create a project category.
Add a manual tree planting project.
Add a beneficiary/community.
Upload an Excel file.
Confirm rows are extracted as independent entries.
Upload a PDF file.
Confirm available text is extracted or a clear warning is shown.
Upload a Word document.
Confirm paragraphs/tables are extracted where supported.
Upload an image as evidence.
Review extracted entries.
Link an extracted entry to a project.
Convert an extracted entry into a project or beneficiary record.
Search for one extracted row independently.
Filter by category, location, document type, and review status.
Check dashboard totals.
Export records where implemented.
Confirm uploaded files and raw extracted data remain available.
Output After Each Task

After editing, always summarise:

Files created
Files changed
What was completed
What was intentionally excluded
How extracted data is stored
How uploaded files are stored
How to run the app
Manual test steps
Any limitations or risks
Recommended next steps

Be honest about unfinished work.

Do not claim a feature is complete if it is not working.

Current Priority

The current priority is to create a stable offline-first environmental project records MVP.

The first useful version should be:

Simple
Offline
Professional
Easy to use
Able to upload documents
Able to extract retrievable data pieces where supported
Able to create manual records
Able to manage users
Able to manage projects and beneficiaries
Able to search and review data
Easy to package later
Safe to expand later

Do not build the whole long-term platform now.

Do not add complexity before the basic product works.

Do not copy rules from unrelated projects.

This project is Kiangure Springs Environment Initiative, not PFine Business Invoice & Quote Maker.