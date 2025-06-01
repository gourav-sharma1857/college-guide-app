# college-guide-app
This is a React-based web application designed to help students manage their academic courses, assignments, skills, extracurricular activities, internships, job applications, contacts, and personal to-do lists. The application features a comprehensive GPA calculator that can factor in assignment weightages. All data is persistently stored in the browser's local storage.

Features Class Management: Add, edit, and delete classes with details such as class name, code, professor, credit hours, schedule (days, time, location), office hours, and syllabus URL.

Assignment Tracking: Add, edit, and delete assignments associated with specific classes, including due dates, status, scores, maximum scores, and weightage types (Major, Minor, Quiz, Homework).

GPA Calculation: Automatically calculates GPA based on current schedule classes and assignment scores with customizable weightages for different assignment categories. It can also fall back to a manually entered class grade if no weighted assignments are present.

Skill Management: Keep track of your skills with proficiency levels (Beginner, Intermediate, Advanced, Expert) and categories.

To-Do List: Manage personal tasks with descriptions and optional due dates.

References Management: Store contact information for professional references.

Extracurricular Activities: Log and manage your extracurricular engagements.

Internship Tracking: Record details of your internships.

Skills to Gain: List skills you aim to acquire.

Job Application Tracker: Monitor your job applications.

Contacts Management: Maintain a list of important contacts.

Local Storage Persistence: All entered data is saved in your browser's local storage, ensuring data is not lost when you close the application.

User-Friendly Forms: Interactive forms for adding and editing all data types with validation and clear messages.

Technologies Used React: A JavaScript library for building user interfaces. HTML/CSS: For structuring and styling the web application. (Assumes App.css is present for styling) Installation Clone the repository (or save the App.js and App.css files): If this code is part of a larger project, ensure you have the complete project structure. For a standalone App.js and App.css, place them in a standard React application setup.

Navigate to the project directory:

Bash

cd your-project-name Install dependencies: If you haven't already, ensure you have Node.js and npm (or yarn) installed. Then, typically for a React app, you'd install:

Bash

npm install

or
yarn install Usage Start the development server:

Bash

npm start

or
yarn start This will usually open the application in your web browser at http://localhost:3000/.

Navigate the Application: The application likely has a navigation system (tabs or a sidebar) to switch between different sections like 'classes', 'assignments', 'skills', 'todo', etc.

Add/Edit Data:

Click on "Add New [Item]" buttons (e.g., "Add New Class", "Add New Assignment") to open forms.

Fill in the details and submit the form.

To edit an existing item, locate it in its respective list and click the "Edit" button (not explicitly shown in snippets but implied by editingClass, editingAssignment states).

GPA Calculation:

Ensure your classes are marked as "Is this part of current schedule?" to be included in the GPA calculation.

Input assignment scores and their corresponding maximum scores and weightage types within each class to influence the GPA calculation.

GPA Calculation Details The GPA is calculated for classes marked as "current schedule". For each class, the overall percentage is determined based on the scores of assignments weighted by their categories (Major, Minor, Quiz, Homework).

If a class has no weighted assignments with scores, the application falls back to a manually entered grade for that class to estimate its percentage.

The final class percentage is then converted into a letter grade and GPA points using a standard UTD (University of Texas at Dallas) GPA scale. The overall GPA is the sum of (GPA points * credit hours) divided by the total credit hours for current schedule classes.
