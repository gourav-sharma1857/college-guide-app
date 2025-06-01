import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'; // Assuming your CSS is in App.css

// --- Local Storage Helper Functions ---
const getFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error parsing data from localStorage for key "${key}":`, error);
        return [];
    }
};

const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving data to localStorage for key "${key}":`, error);
    }
};

// --- Main App Component ---
function App() {
    // --- UTD Grade Points (Standard GPA scale) ---
    const UTD_GRADE_POINTS = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.67,
        'B+': 3.33, 'B': 3.0, 'B-': 2.67,
        'C+': 2.33, 'C': 2.0, 'C-': 1.67,
        'D+': 1.33, 'D': 1.0, 'D-': 0.67,
        'F': 0.0
    };

    // --- Day Abbreviations and Full Names ---
    const dayMapping = {
        'M': 'Monday', 'T': 'Tuesday', 'W': 'Wednesday', 'Th': 'Thursday', 'F': 'Friday', 'S': 'Saturday',
        'Su': 'Sunday'
    };

    const daysOfWeekOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // --- State Variables ---
    const [currentPage, setCurrentPage] = useState('classes'); // New state for managing pages
    const [activeTab, setActiveTab] = useState('classes'); // Still used for sub-tabs within sections
    const [classes, setClasses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [skills, setSkills] = useState([]);
    const [todoItems, setTodoItems] = useState([]); // Consistent naming: todoItems
    const [references, setReferences] = useState([]);
    const [additionalResources, setAdditionalResources] = useState([]); // Added from final
    const [extracurriculars, setExtracurriculars] = useState([]);
    const [internships, setInternships] = useState([]);
    const [skillsToGain, setSkillsToGain] = useState([]);
    const [applications, setApplications] = useState([]);
    const [contacts, setContacts] = useState([]);

    const [gpa, setGpa] = useState('N/A');
    const [classGrades, setClassGrades] = useState({}); // To store calculated grades for each class

    const [message, setMessage] = useState("");
    const messageTimeoutRef = useRef(null);

    const [showAddClassForm, setShowAddClassForm] = useState(false);
    const [showAddAssignmentForm, setShowAddAssignmentForm] = useState(false);
    const [showAddSkillForm, setShowAddSkillForm] = useState(false);
    const [showAddTodoForm, setShowAddTodoForm] = useState(false);
    const [showAddReferenceForm, setShowAddReferenceForm] = useState(false);
    const [showAddResourceForm, setShowAddResourceForm] = useState(false); // Added from final
    const [showAddExtracurricularForm, setShowAddExtracurricularForm] = useState(false);
    const [showAddInternshipForm, setShowAddInternshipForm] = useState(false);
    const [showAddSkillToGainForm, setShowAddSkillToGainForm] = useState(false);
    const [showAddApplicationForm, setShowAddApplicationForm] = useState(false);
    const [showAddContactForm, setShowAddContactForm] = useState(false);

    const [editingClass, setEditingClass] = useState(null);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [editingSkill, setEditingSkill] = useState(null);
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingReference, setEditingReference] = useState(null);
    const [editingResource, setEditingResource] = useState(null); // Added from final
    const [editingExtracurricular, setEditingExtracurricular] = useState(null);
    const [editingInternship, setEditingInternship] = useState(null);
    const [editingSkillToGain, setEditingSkillToGain] = useState(null);
    const [editingApplication, setEditingApplication] = useState(null);
    const [editingContact, setEditingContact] = useState(null);

    // --- Local Storage Helper Functions for Specific Data Types ---

    // CLASSES
    const loadClassesFromLocalStorage = useCallback(() => {
        const loadedClasses = getFromLocalStorage("classes");
        setClasses(loadedClasses);
    }, []);

    const addClassToLocalStorage = useCallback((classData) => {
        const currentClasses = getFromLocalStorage("classes");
        const newClass = {
            id: Date.now().toString(),
            ...classData,
            isCurrentSchedule: classData.isCurrentSchedule === 'on' ? true : false // Handle checkbox value
        };
        const updatedClasses = [...currentClasses, newClass];
        saveToLocalStorage("classes", updatedClasses);
        setClasses(updatedClasses);
    }, []);

    const updateClassInLocalStorage = useCallback((id, classData) => {
        const currentClasses = getFromLocalStorage("classes");
        const updatedClasses = currentClasses.map(cls =>
            cls.id === id ? { ...cls, ...classData, isCurrentSchedule: classData.isCurrentSchedule === 'on' ? true : false } : cls
        );
        saveToLocalStorage("classes", updatedClasses);
        setClasses(updatedClasses);
    }, []);

    const deleteClassFromLocalStorage = useCallback((id) => {
        const currentClasses = getFromLocalStorage("classes");
        const updatedClasses = currentClasses.filter(cls => cls.id !== id);
        saveToLocalStorage("classes", updatedClasses);
        setClasses(updatedClasses);

        // Also delete associated assignments
        const currentAssignments = getFromLocalStorage("assignments");
        const updatedAssignments = currentAssignments.filter(assign => assign.classId !== id);
        saveToLocalStorage("assignments", updatedAssignments);
        setAssignments(updatedAssignments);
    }, []);

    // Toggle current schedule status for a class
    const toggleCurrentSchedule = useCallback((id) => {
        const currentClasses = getFromLocalStorage("classes");
        const updatedClasses = currentClasses.map(cls =>
            cls.id === id ? { ...cls, isCurrentSchedule: !cls.isCurrentSchedule } : cls
        );
        saveToLocalStorage("classes", updatedClasses);
        setClasses(updatedClasses);
    }, []);

    // ASSIGNMENTS
    const loadAssignmentsFromLocalStorage = useCallback(() => {
        const loadedAssignments = getFromLocalStorage("assignments");
        setAssignments(loadedAssignments);
    }, []);

    const addAssignmentToLocalStorage = useCallback((assignmentData) => {
        const currentAssignments = getFromLocalStorage("assignments");
        const newAssignment = { id: Date.now().toString(), ...assignmentData };
        const updatedAssignments = [...currentAssignments, newAssignment];
        saveToLocalStorage("assignments", updatedAssignments);
        setAssignments(updatedAssignments);
    }, []);

    const updateAssignmentInLocalStorage = useCallback((id, assignmentData) => {
        const currentAssignments = getFromLocalStorage("assignments");
        const updatedAssignments = currentAssignments.map(assign =>
            assign.id === id ? { ...assign, ...assignmentData } : assign
        );
        saveToLocalStorage("assignments", updatedAssignments);
        setAssignments(updatedAssignments);
    }, []);

    const deleteAssignmentFromLocalStorage = useCallback((id) => {
        const currentAssignments = getFromLocalStorage("assignments");
        const updatedAssignments = currentAssignments.filter(assign => assign.id !== id);
        saveToLocalStorage("assignments", updatedAssignments);
        setAssignments(updatedAssignments);
    }, []);

    // SKILLS
    const loadSkillsFromLocalStorage = useCallback(() => {
        const loadedSkills = getFromLocalStorage("skills");
        setSkills(loadedSkills);
    }, []);

    const addSkillToLocalStorage = useCallback((skillData) => {
        const currentSkills = getFromLocalStorage("skills");
        const newSkill = { id: Date.now().toString(), ...skillData };
        const updatedSkills = [...currentSkills, newSkill];
        saveToLocalStorage("skills", updatedSkills);
        setSkills(updatedSkills);
    }, []);

    const updateSkillInLocalStorage = useCallback((id, skillData) => {
        const currentSkills = getFromLocalStorage("skills");
        const updatedSkills = currentSkills.map(skill =>
            skill.id === id ? { ...skill, ...skillData } : skill
        );
        saveToLocalStorage("skills", updatedSkills);
        setSkills(updatedSkills);
    }, []);

    const deleteSkillFromLocalStorage = useCallback((id) => {
        const currentSkills = getFromLocalStorage("skills");
        const updatedSkills = currentSkills.filter(skill => skill.id !== id);
        saveToLocalStorage("skills", updatedSkills);
        setSkills(updatedSkills);
    }, []);

    // TODO ITEMS
    const loadTodoItemsFromLocalStorage = useCallback(() => {
        const loadedTodoItems = getFromLocalStorage("todoItems"); // Consistent naming
        setTodoItems(loadedTodoItems);
    }, []);

    const addTodoItemToLocalStorage = useCallback((todoData) => {
        const currentTodoItems = getFromLocalStorage("todoItems"); // Consistent naming
        const newTodoItem = { id: Date.now().toString(), ...todoData };
        const updatedTodoItems = [...currentTodoItems, newTodoItem];
        saveToLocalStorage("todoItems", updatedTodoItems); // Consistent naming
        setTodoItems(updatedTodoItems);
    }, []);

    const updateTodoItemInLocalStorage = useCallback((id, todoData) => {
        const currentTodoItems = getFromLocalStorage("todoItems"); // Consistent naming
        const updatedTodoItems = currentTodoItems.map(item =>
            item.id === id ? { ...item, ...todoData } : item
        );
        saveToLocalStorage("todoItems", updatedTodoItems); // Consistent naming
        setTodoItems(updatedTodoItems);
    }, []);

    const deleteTodoItemFromLocalStorage = useCallback((id) => {
        const currentTodoItems = getFromLocalStorage("todoItems"); // Consistent naming
        const updatedTodoItems = currentTodoItems.filter(item => item.id !== id);
        saveToLocalStorage("todoItems", updatedTodoItems); // Consistent naming
        setTodoItems(updatedTodoItems);
    }, []);

    // REFERENCES (from initial)
    const loadReferencesFromLocalStorage = useCallback(() => {
        const loadedReferences = getFromLocalStorage("references");
        setReferences(loadedReferences);
    }, []);

    const addReferenceToLocalStorage = useCallback((refData) => {
        const currentReferences = getFromLocalStorage("references");
        const newReference = { id: Date.now().toString(), ...refData };
        const updatedReferences = [...currentReferences, newReference];
        saveToLocalStorage("references", updatedReferences);
        setReferences(updatedReferences);
    }, []);

    const updateReferenceInLocalStorage = useCallback((id, refData) => {
        const currentReferences = getFromLocalStorage("references");
        const updatedReferences = currentReferences.map(ref =>
            ref.id === id ? { ...ref, ...refData } : ref
        );
        saveToLocalStorage("references", updatedReferences);
        setReferences(updatedReferences);
    }, []);

    const deleteReferenceFromLocalStorage = useCallback((id) => {
        const currentReferences = getFromLocalStorage("references");
        const updatedReferences = currentReferences.filter(ref => ref.id !== id);
        saveToLocalStorage("references", updatedReferences);
        setReferences(updatedReferences);
    }, []);

    // ADDITIONAL RESOURCES (from final)
    const loadAdditionalResourcesFromLocalStorage = useCallback(() => {
        const loadedResources = getFromLocalStorage("additionalResources");
        setAdditionalResources(loadedResources);
    }, []);

    const addResourceToLocalStorage = useCallback((resourceData) => {
        const currentResources = getFromLocalStorage("additionalResources");
        const newResource = { id: Date.now().toString(), ...resourceData };
        const updatedResources = [...currentResources, newResource];
        saveToLocalStorage("additionalResources", updatedResources);
        setAdditionalResources(updatedResources);
    }, []);

    const updateResourceInLocalStorage = useCallback((id, resourceData) => {
        const currentResources = getFromLocalStorage("additionalResources");
        const updatedResources = currentResources.map(resource =>
            resource.id === id ? { ...resource, ...resourceData } : resource
        );
        saveToLocalStorage("additionalResources", updatedResources);
        setAdditionalResources(updatedResources);
    }, []);

    const deleteResourceFromLocalStorage = useCallback((id) => {
        const currentResources = getFromLocalStorage("additionalResources");
        const updatedResources = currentResources.filter(resource => resource.id !== id);
        saveToLocalStorage("additionalResources", updatedResources);
        setAdditionalResources(updatedResources);
    }, []);

    // EXTRACURRICULARS
    const loadExtracurricularsFromLocalStorage = useCallback(() => {
        const loadedExtracurriculars = getFromLocalStorage("extracurriculars");
        setExtracurriculars(loadedExtracurriculars);
    }, []);

    const addExtracurricularToLocalStorage = useCallback((ecData) => {
        const currentExtracurriculars = getFromLocalStorage("extracurriculars");
        const newExtracurricular = { id: Date.now().toString(), ...ecData };
        const updatedExtracurriculars = [...currentExtracurriculars, newExtracurricular];
        saveToLocalStorage("extracurriculars", updatedExtracurriculars);
        setExtracurriculars(updatedExtracurriculars);
    }, []);

    const updateExtracurricularInLocalStorage = useCallback((id, ecData) => {
        const currentExtracurriculars = getFromLocalStorage("extracurriculars");
        const updatedExtracurriculars = currentExtracurriculars.map(ec =>
            ec.id === id ? { ...ec, ...ecData } : ec
        );
        saveToLocalStorage("extracurriculars", updatedExtracurriculars);
        setExtracurriculars(updatedExtracurriculars);
    }, []);

    const deleteExtracurricularFromLocalStorage = useCallback((id) => {
        const currentExtracurriculars = getFromLocalStorage("extracurriculars");
        const updatedExtracurriculars = currentExtracurriculars.filter(ec => ec.id !== id);
        saveToLocalStorage("extracurriculars", updatedExtracurriculars);
        setExtracurriculars(updatedExtracurriculars);
    }, []);

    // INTERNSHIPS
    const loadInternshipsFromLocalStorage = useCallback(() => {
        const loadedInternships = getFromLocalStorage("internships");
        setInternships(loadedInternships);
    }, []);

    const addInternshipToLocalStorage = useCallback((internshipData) => {
        const currentInternships = getFromLocalStorage("internships");
        const newInternship = { id: Date.now().toString(), ...internshipData };
        const updatedInternships = [...currentInternships, newInternship];
        saveToLocalStorage("internships", updatedInternships);
        setInternships(updatedInternships);
    }, []);

    const updateInternshipInLocalStorage = useCallback((id, internshipData) => {
        const currentInternships = getFromLocalStorage("internships");
        const updatedInternships = currentInternships.map(internship =>
            internship.id === id ? { ...internship, ...internshipData } : internship
        );
        saveToLocalStorage("internships", updatedInternships);
        setInternships(updatedInternships);
    }, []);

    const deleteInternshipFromLocalStorage = useCallback((id) => {
        const currentInternships = getFromLocalStorage("internships");
        const updatedInternships = currentInternships.filter(internship => internship.id !== id);
        saveToLocalStorage("internships", updatedInternships);
        setInternships(updatedInternships);
    }, []);

    // SKILLS TO GAIN
    const loadSkillsToGainFromLocalStorage = useCallback(() => {
        const loadedSkillsToGain = getFromLocalStorage("skillsToGain");
        setSkillsToGain(loadedSkillsToGain);
    }, []);

    const addSkillToGainToLocalStorage = useCallback((skillData) => {
        const currentSkillsToGain = getFromLocalStorage("skillsToGain");
        const newSkillToGain = { id: Date.now().toString(), ...skillData };
        const updatedSkillsToGain = [...currentSkillsToGain, newSkillToGain];
        saveToLocalStorage("skillsToGain", updatedSkillsToGain);
        setSkillsToGain(updatedSkillsToGain);
    }, []);

    const updateSkillToGainInLocalStorage = useCallback((id, skillData) => {
        const currentSkillsToGain = getFromLocalStorage("skillsToGain");
        const updatedSkillsToGain = currentSkillsToGain.map(skill =>
            skill.id === id ? { ...skill, ...skillData } : skill
        );
        saveToLocalStorage("skillsToGain", updatedSkillsToGain);
        setSkillsToGain(updatedSkillsToGain);
    }, []);

    const deleteSkillToGainFromLocalStorage = useCallback((id) => {
        const currentSkillsToGain = getFromLocalStorage("skillsToGain");
        const updatedSkillsToGain = currentSkillsToGain.filter(skill => skill.id !== id);
        saveToLocalStorage("skillsToGain", updatedSkillsToGain);
        setSkillsToGain(updatedSkillsToGain);
    }, []);

    // APPLICATIONS
    const loadApplicationsFromLocalStorage = useCallback(() => {
        const loadedApplications = getFromLocalStorage("applications");
        setApplications(loadedApplications);
    }, []);

    const addApplicationToLocalStorage = useCallback((appData) => {
        const currentApplications = getFromLocalStorage("applications");
        const newApplication = { id: Date.now().toString(), ...appData };
        const updatedApplications = [...currentApplications, newApplication];
        saveToLocalStorage("applications", updatedApplications);
        setApplications(updatedApplications);
    }, []);

    const updateApplicationInLocalStorage = useCallback((id, appData) => {
        const currentApplications = getFromLocalStorage("applications");
        const updatedApplications = currentApplications.map(app =>
            app.id === id ? { ...app, ...appData } : app
        );
        saveToLocalStorage("applications", updatedApplications);
        setApplications(updatedApplications);
    }, []);

    const deleteApplicationFromLocalStorage = useCallback((id) => {
        const currentApplications = getFromLocalStorage("applications");
        const updatedApplications = currentApplications.filter(app => app.id !== id);
        saveToLocalStorage("applications", updatedApplications);
        setApplications(updatedApplications);
    }, []);

    // CONTACTS
    const loadContactsFromLocalStorage = useCallback(() => {
        const loadedContacts = getFromLocalStorage("contacts");
        setContacts(loadedContacts);
    }, []);

    const addContactToLocalStorage = useCallback((contactData) => {
        const currentContacts = getFromLocalStorage("contacts");
        const newContact = { id: Date.now().toString(), ...contactData };
        const updatedContacts = [...currentContacts, newContact];
        saveToLocalStorage("contacts", updatedContacts);
        setContacts(updatedContacts);
    }, []);

    const updateContactInLocalStorage = useCallback((id, contactData) => {
        const currentContacts = getFromLocalStorage("contacts");
        const updatedContacts = currentContacts.map(contact =>
            contact.id === id ? { ...contact, ...contactData } : contact
        );
        saveToLocalStorage("contacts", updatedContacts);
        setContacts(updatedContacts);
    }, []);

    const deleteContactFromLocalStorage = useCallback((id) => {
        const currentContacts = getFromLocalStorage("contacts");
        const updatedContacts = currentContacts.filter(contact => contact.id !== id);
        saveToLocalStorage("contacts", updatedContacts);
        setContacts(updatedContacts);
    }, []);

    // --- GPA Calculation (Now considers assignment weightages) ---
    const calculateGPA = useCallback(() => {
        const currentScheduleClasses = classes.filter(cls => cls.isCurrentSchedule);
        const newClassGrades = {}; // To store calculated grades for each class

        if (currentScheduleClasses.length === 0) {
            setGpa('N/A');
            setClassGrades({});
            return;
        }

        let totalGradePoints = 0;
        let totalCreditHours = 0;

        currentScheduleClasses.forEach(cls => {
            const classCreditHours = parseFloat(cls.creditHours);
            if (isNaN(classCreditHours) || classCreditHours <= 0) {
                console.warn(`Class ${cls.className} has invalid credit hours.`);
                newClassGrades[cls.id] = { finalScore: 'N/A', letterGrade: 'N/A', gpaPoints: 0 };
                return;
            }

            let classOverallPercentage = 0;
            let totalWeightProvided = 0; // Sum of weights for categories that actually have scored assignments

            // Get weights for this specific class, defaulting to 0 if not set
            const classWeights = {
                Major: parseFloat(cls.majorWeight || 0) / 100,
                Minor: parseFloat(cls.minorWeight || 0) / 100,
                Quiz: parseFloat(cls.quizWeight || 0) / 100,
                Homework: parseFloat(cls.homeworkWeight || 0) / 100,
            };

            const classAssignments = assignments.filter(assign => assign.classId === cls.id);

            // Group assignments by weightageType
            const assignmentsByType = classAssignments.reduce((acc, assign) => {
                if (!acc[assign.weightageType]) {
                    acc[assign.weightageType] = [];
                }
                acc[assign.weightageType].push(assign);
                return acc;
            }, {});

            let hasAssignmentsWithScores = false;

            for (const type in classWeights) {
                const weight = classWeights[type];
                if (weight > 0 && assignmentsByType[type] && assignmentsByType[type].length > 0) {
                    let typeTotalScore = 0;
                    let typeMaxScore = 0;
                    let typeAssignmentsCount = 0;

                    assignmentsByType[type].forEach(assign => {
                        const score = parseFloat(assign.score);
                        const maxScore = parseFloat(assign.maxScore);

                        if (!isNaN(score) && !isNaN(maxScore) && maxScore > 0) {
                            typeTotalScore += score;
                            typeMaxScore += maxScore;
                            typeAssignmentsCount++;
                        }
                    });

                    if (typeAssignmentsCount > 0) { // Only consider types with actual scored assignments
                        const typeAverage = (typeTotalScore / typeMaxScore); // This is a percentage (0-1)
                        classOverallPercentage += typeAverage * weight;
                        totalWeightProvided += weight;
                        hasAssignmentsWithScores = true;
                    }
                }
            }

            let finalClassPercentage = 0;
            if (hasAssignmentsWithScores && totalWeightProvided > 0) {
                // Normalize the overall percentage if totalWeightProvided is less than 1 (100%)
                finalClassPercentage = (classOverallPercentage / totalWeightProvided) * 100;
            } else {
                // Fallback to manually entered class grade if no weighted assignments
                const storedGrade = cls.grade;
                if (UTD_GRADE_POINTS.hasOwnProperty(storedGrade)) {
                    // This is a rough conversion from GPA points to a percentage for display
                    // Assuming a standard A=93, B=83 etc. for percentage calculation
                    if (storedGrade === 'A+' || storedGrade === 'A') finalClassPercentage = 95;
                    else if (storedGrade === 'A-') finalClassPercentage = 91;
                    else if (storedGrade === 'B+') finalClassPercentage = 88;
                    else if (storedGrade === 'B') finalClassPercentage = 85;
                    else if (storedGrade === 'B-') finalClassPercentage = 81;
                    else if (storedGrade === 'C+') finalClassPercentage = 78;
                    else if (storedGrade === 'C') finalClassPercentage = 75;
                    else if (storedGrade === 'C-') finalClassPercentage = 71;
                    else if (storedGrade === 'D+') finalClassPercentage = 68;
                    else if (storedGrade === 'D') finalClassPercentage = 65;
                    else if (storedGrade === 'D-') finalClassPercentage = 61;
                    else finalClassPercentage = 50; // F
                } else {
                    finalClassPercentage = 0; // If no grade and no assignments
                }
            }

            // Convert finalClassPercentage to letter grade and GPA points
            let letterGrade = 'N/A';
            let classGpaPoints = 0;

            if (finalClassPercentage >= 97) { letterGrade = 'A+'; classGpaPoints = UTD_GRADE_POINTS['A+']; }
            else if (finalClassPercentage >= 93) { letterGrade = 'A'; classGpaPoints = UTD_GRADE_POINTS['A']; }
            else if (finalClassPercentage >= 90) { letterGrade = 'A-'; classGpaPoints = UTD_GRADE_POINTS['A-']; }
            else if (finalClassPercentage >= 87) { letterGrade = 'B+'; classGpaPoints = UTD_GRADE_POINTS['B+']; }
            else if (finalClassPercentage >= 83) { letterGrade = 'B'; classGpaPoints = UTD_GRADE_POINTS['B']; }
            else if (finalClassPercentage >= 80) { letterGrade = 'B-'; classGpaPoints = UTD_GRADE_POINTS['B-']; }
            else if (finalClassPercentage >= 77) { letterGrade = 'C+'; classGpaPoints = UTD_GRADE_POINTS['C+']; }
            else if (finalClassPercentage >= 73) { letterGrade = 'C'; classGpaPoints = UTD_GRADE_POINTS['C']; }
            else if (finalClassPercentage >= 70) { letterGrade = 'C-'; classGpaPoints = UTD_GRADE_POINTS['C-']; }
            else if (finalClassPercentage >= 67) { letterGrade = 'D+'; classGpaPoints = UTD_GRADE_POINTS['D+']; }
            else if (finalClassPercentage >= 63) { letterGrade = 'D'; classGpaPoints = UTD_GRADE_POINTS['D']; }
            else if (finalClassPercentage >= 60) { letterGrade = 'D-'; classGpaPoints = UTD_GRADE_POINTS['D-']; }
            else { letterGrade = 'F'; classGpaPoints = UTD_GRADE_POINTS['F']; }

            newClassGrades[cls.id] = {
                finalScore: finalClassPercentage.toFixed(2),
                letterGrade: letterGrade,
                gpaPoints: classGpaPoints
            };

            totalGradePoints += classGpaPoints * classCreditHours;
            totalCreditHours += classCreditHours;
        });

        if (totalCreditHours === 0) {
            setGpa('N/A');
        } else {
            setGpa((totalGradePoints / totalCreditHours).toFixed(2));
        }
        setClassGrades(newClassGrades);
    }, [classes, assignments, UTD_GRADE_POINTS]); // UTD_GRADE_POINTS is a constant, but included for clarity of dependency

    // --- Effect Hook to Load Data on Component Mount ---
    useEffect(() => {
        loadClassesFromLocalStorage();
        loadAssignmentsFromLocalStorage();
        loadSkillsFromLocalStorage();
        loadTodoItemsFromLocalStorage(); // Consistent naming
        loadReferencesFromLocalStorage(); // From initial
        loadAdditionalResourcesFromLocalStorage(); // Added from final
        loadExtracurricularsFromLocalStorage();
        loadInternshipsFromLocalStorage();
        loadSkillsToGainFromLocalStorage();
        loadApplicationsFromLocalStorage();
        loadContactsFromLocalStorage();
    }, [loadClassesFromLocalStorage, loadAssignmentsFromLocalStorage,
        loadSkillsFromLocalStorage, loadTodoItemsFromLocalStorage, loadReferencesFromLocalStorage, // From initial
        loadAdditionalResourcesFromLocalStorage, // Added from final
        loadExtracurricularsFromLocalStorage, loadInternshipsFromLocalStorage, loadSkillsToGainFromLocalStorage,
        loadApplicationsFromLocalStorage, loadContactsFromLocalStorage
    ]);

    // Recalculate GPA whenever classes or assignments change
    useEffect(() => {
        calculateGPA();
    }, [classes, assignments, calculateGPA]);

    // --- Message Display Logic ---
    const showMessage = useCallback((msg) => {
        setMessage(msg);
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = setTimeout(() => {
            setMessage('');
        }, 3000); // Message disappears after 3 seconds
    }, []);

    // --- Form Handlers (for adding/editing data) ---
    // Handle Class Form Submission
    const handleClassSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const classData = Object.fromEntries(formData.entries());
        // Handle days checkbox array
        const selectedDays = e.target.querySelectorAll('input[name="days"]:checked');
        classData.days = Array.from(selectedDays).map(cb => cb.value);

        // Ensure times are stored correctly
        classData.startTime = classData.startTime || '';
        classData.endTime = classData.endTime || '';

        // Parse weightages as numbers
        classData.majorWeight = parseFloat(classData.majorWeight) || 0;
        classData.minorWeight = parseFloat(classData.minorWeight) || 0;
        classData.quizWeight = parseFloat(classData.quizWeight) || 0;
        classData.homeworkWeight = parseFloat(classData.homeworkWeight) || 0;


        if (editingClass) {
            updateClassInLocalStorage(editingClass.id, classData);
            showMessage('Class updated successfully!');
            setEditingClass(null);
        } else {
            addClassToLocalStorage(classData);
            showMessage('Class added successfully!');
        }
        e.target.reset(); // Clear form
        setShowAddClassForm(false);
    };

    // Handle Assignment Form Submission
    const handleAssignmentSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const assignmentData = Object.fromEntries(formData.entries());

        // Parse score and maxScore as numbers
        assignmentData.score = parseFloat(assignmentData.score);
        assignmentData.maxScore = parseFloat(assignmentData.maxScore);

        if (editingAssignment) {
            updateAssignmentInLocalStorage(editingAssignment.id, assignmentData);
            showMessage('Assignment updated successfully!');
            setEditingAssignment(null);
        } else {
            addAssignmentToLocalStorage(assignmentData);
            showMessage('Assignment added successfully!');
        }
        e.target.reset();
        setShowAddAssignmentForm(false);
    };

    // Handle Skill Form Submission
    const handleSkillSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const skillData = Object.fromEntries(formData.entries());
        if (editingSkill) {
            updateSkillInLocalStorage(editingSkill.id, skillData);
            showMessage('Skill updated successfully!');
            setEditingSkill(null);
        } else {
            addSkillToLocalStorage(skillData);
            showMessage('Skill added successfully!');
        }
        e.target.reset();
        setShowAddSkillForm(false);
    };

    // Handle Todo Form Submission
    const handleTodoSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const todoData = { ...Object.fromEntries(formData.entries()), completed: false };
        if (editingTodo) {
            updateTodoItemInLocalStorage(editingTodo.id, todoData);
            showMessage('Todo item updated successfully!');
            setEditingTodo(null);
        } else {
            addTodoItemToLocalStorage(todoData);
            showMessage('Todo item added successfully!');
        }
        e.target.reset();
        setShowAddTodoForm(false);
    };

    // Handle Reference Form Submission (from initial)
    const handleReferenceSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const refData = Object.fromEntries(formData.entries());
        if (editingReference) {
            updateReferenceInLocalStorage(editingReference.id, refData);
            showMessage('Reference updated successfully!');
            setEditingReference(null);
        } else {
            addReferenceToLocalStorage(refData);
            showMessage('Reference added successfully!');
        }
        e.target.reset();
        setShowAddReferenceForm(false);
    };

    // Handle Resource Form Submission (from final)
    const handleResourceSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const resourceData = Object.fromEntries(formData.entries());
        if (editingResource) {
            updateResourceInLocalStorage(editingResource.id, resourceData);
            showMessage('Resource updated successfully!');
            setEditingResource(null);
        } else {
            addResourceToLocalStorage(resourceData);
            showMessage('Resource added successfully!');
        }
        e.target.reset();
        setShowAddResourceForm(false);
    };

    // Handle Extracurricular Form Submission
    const handleExtracurricularSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const ecData = Object.fromEntries(formData.entries());
        if (editingExtracurricular) {
            updateExtracurricularInLocalStorage(editingExtracurricular.id, ecData);
            showMessage('Extracurricular updated successfully!');
            setEditingExtracurricular(null);
        } else {
            addExtracurricularToLocalStorage(ecData);
            showMessage('Extracurricular added successfully!');
        }
        e.target.reset();
        setShowAddExtracurricularForm(false);
    };

    // Handle Internship Form Submission
    const handleInternshipSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const internshipData = Object.fromEntries(formData.entries());
        if (editingInternship) {
            updateInternshipInLocalStorage(editingInternship.id, internshipData);
            showMessage('Internship updated successfully!');
            setEditingInternship(null);
        } else {
            addInternshipToLocalStorage(internshipData);
            showMessage('Internship added successfully!');
        }
        e.target.reset();
        setShowAddInternshipForm(false);
    };

    // Handle Skill to Gain Form Submission
    const handleSkillToGainSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const skillData = Object.fromEntries(formData.entries());
        if (editingSkillToGain) {
            updateSkillToGainInLocalStorage(editingSkillToGain.id, skillData);
            showMessage('Skill to gain updated successfully!');
            setEditingSkillToGain(null);
        } else {
            addSkillToGainToLocalStorage(skillData);
            showMessage('Skill to gain added successfully!');
        }
        e.target.reset();
        setShowAddSkillToGainForm(false);
    };

    // Handle Application Form Submission
    const handleApplicationSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appData = Object.fromEntries(formData.entries());
        if (editingApplication) {
            updateApplicationInLocalStorage(editingApplication.id, appData);
            showMessage('Application updated successfully!');
            setEditingApplication(null);
        } else {
            addApplicationToLocalStorage(appData);
            showMessage('Application added successfully!');
        }
        e.target.reset();
        setShowAddApplicationForm(false);
    };

    // Handle Contact Form Submission
    const handleContactSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const contactData = Object.fromEntries(formData.entries());
        if (editingContact) {
            updateContactInLocalStorage(editingContact.id, contactData);
            showMessage('Contact updated successfully!');
            setEditingContact(null);
        } else {
            addContactToLocalStorage(contactData);
            showMessage('Contact added successfully!');
        }
        e.target.reset();
        setShowAddContactForm(false);
    };

    // --- Render Functions for UI Components (Forms) ---
    const renderAddClassForm = () => (
        <form onSubmit={handleClassSubmit} className="form-grid">
            <h3>{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
            <div className="form-group">
                <label htmlFor="className">Class Name:</label>
                <input type="text" id="className" name="className"
                    defaultValue={editingClass?.className || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="classCode">Class Code:</label>
                <input type="text" id="classCode" name="classCode"
                    defaultValue={editingClass?.classCode || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="professor">Professor:</label>
                <input type="text" id="professor" name="professor" defaultValue={editingClass?.professor
                    || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="creditHours">Credit Hours:</label>
                <input type="number" id="creditHours" name="creditHours" step="0.1"
                    defaultValue={editingClass?.creditHours || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="grade">Grade (Fallback for GPA, if no assignments):</label>
                <select id="grade" name="grade" defaultValue={editingClass?.grade || ''}>
                    <option value="">Select Grade</option>
                    {Object.keys(UTD_GRADE_POINTS).map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="syllabusUrl">Syllabus URL:</label>
                <input type="url" id="syllabusUrl" name="syllabusUrl"
                    defaultValue={editingClass?.syllabusUrl || ''} />
            </div>
            {/* New Fields for Schedule */}
            <div className="form-group full-width">
                <label>Days:</label>
                <div className="days-checkbox-group">
                    {Object.keys(dayMapping).map(abbr => (
                        <label key={abbr}>
                            <input
                                type="checkbox"
                                name="days"
                                value={abbr}
                                defaultChecked={editingClass?.days?.includes(abbr) || false}
                            />
                            {abbr}
                        </label>
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="startTime">Start Time:</label>
                <input type="time" id="startTime" name="startTime" defaultValue={editingClass?.startTime
                    || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="endTime">End Time:</label>
                <input type="time" id="endTime" name="endTime" defaultValue={editingClass?.endTime ||
                    ''} />
            </div>
            <div className="form-group">
                <label htmlFor="classLocation">Location:</label>
                <input type="text" id="classLocation" name="classLocation"
                    defaultValue={editingClass?.classLocation || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="officeHours">Office Hours:</label>
                <input type="text" id="officeHours" name="officeHours" placeholder="e.g., TTh 1:00 PM -
2:00 PM" defaultValue={editingClass?.officeHours || ''} />
            </div>

            {/* New Fields for Assignment Weightages */}
            <h4 className="full-width">Assignment Category Weightages (%)</h4>
            <div className="form-group">
                <label htmlFor="majorWeight">Major Assignments (%):</label>
                <input type="number" id="majorWeight" name="majorWeight" step="1" min="0" max="100"
                    defaultValue={editingClass?.majorWeight || 0} />
            </div>
            <div className="form-group">
                <label htmlFor="minorWeight">Minor Assignments (%):</label>
                <input type="number" id="minorWeight" name="minorWeight" step="1" min="0" max="100"
                    defaultValue={editingClass?.minorWeight || 0} />
            </div>
            <div className="form-group">
                <label htmlFor="quizWeight">Quizzes (%):</label>
                <input type="number" id="quizWeight" name="quizWeight" step="1" min="0" max="100"
                    defaultValue={editingClass?.quizWeight || 0} />
            </div>
            <div className="form-group">
                <label htmlFor="homeworkWeight">Homework (%):</label>
                <input type="number" id="homeworkWeight" name="homeworkWeight" step="1" min="0" max="100"
                    defaultValue={editingClass?.homeworkWeight || 0} />
            </div>


            <div className="form-group checkbox-group full-width">
                <label htmlFor="isCurrentSchedule">
                    <input
                        type="checkbox"
                        id="isCurrentSchedule"
                        name="isCurrentSchedule"
                        defaultChecked={editingClass?.isCurrentSchedule || false}
                    />
                    Is this part of current schedule?
                </label>
            </div>
            <div className="form-actions full-width">
                <button type="submit" className="btn-primary">{editingClass ? 'Update Class' : 'Add Class'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddClassForm(false); setEditingClass(null);
                }}>Cancel</button>
            </div>
        </form>
    );

    const renderAddAssignmentForm = () => (
        <form onSubmit={handleAssignmentSubmit} className="form-grid">
            <h3>{editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}</h3>
            <div className="form-group">
                <label htmlFor="assignmentName">Assignment Name:</label>
                <input type="text" id="assignmentName" name="assignmentName"
                    defaultValue={editingAssignment?.assignmentName || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="classId">For Class:</label>
                <select id="classId" name="classId" defaultValue={editingAssignment?.classId || ''}
                    required>
                    <option value="">Select a Class</option>
                    {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.className} ({cls.classCode})</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="dueDate">Due Date:</label>
                <input type="date" id="dueDate" name="dueDate"
                    defaultValue={editingAssignment?.dueDate || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select id="status" name="status" defaultValue={editingAssignment?.status || 'Pending'}
                    required>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            {/* New fields for score and weightage */}
            <div className="form-group">
                <label htmlFor="score">Score Received:</label>
                <input type="number" id="score" name="score" step="0.1"
                    defaultValue={editingAssignment?.score || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="maxScore">Maximum Score:</label>
                <input type="number" id="maxScore" name="maxScore" step="0.1"
                    defaultValue={editingAssignment?.maxScore || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="weightageType">Weightage Type:</label>
                <select id="weightageType" name="weightageType" defaultValue={editingAssignment?.weightageType || ''}>
                    <option value="">Select Type</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Homework">Homework</option>
                </select>
            </div>
            <div className="form-group full-width">
                <label htmlFor="notes">Notes:</label>
                <textarea id="notes" name="notes" rows="3" defaultValue={editingAssignment?.notes ||
                    ''}></textarea>
            </div>
            <div className="form-actions full-width">
                <button type="submit" className="btn-primary">{editingAssignment ? 'Update Assignment' : 'Add Assignment'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddAssignmentForm(false); setEditingAssignment(null);
                }}>Cancel</button>
            </div>
        </form>
    );
    const renderAddSkillForm = () => (
        <form onSubmit={handleSkillSubmit} className="form-grid">
            <h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
            <div className="form-group">
                <label htmlFor="skillName">Skill Name:</label>
                <input type="text" id="skillName" name="skillName" defaultValue={editingSkill?.skillName ||
                    ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="proficiency">Proficiency:</label>
                <select id="proficiency" name="proficiency" defaultValue={editingSkill?.proficiency ||
                    'Beginner'} required>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="category">Category:</label>
                <input type="text" id="category" name="category" defaultValue={editingSkill?.category || ''}
                    placeholder="e.g., Programming, Design" />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingSkill ? 'Update Skill' : 'Add Skill'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddSkillForm(false); setEditingSkill(null);
                }}>Cancel</button>
            </div>
        </form>
    );
    const renderAddTodoForm = () => (
        <form onSubmit={handleTodoSubmit} className="form-grid">
            <h3>{editingTodo ? 'Edit To-Do Item' : 'Add New To-Do Item'}</h3>
            <div className="form-group">
                <label htmlFor="todoDescription">Description:</label>
                <input type="text" id="todoDescription" name="todoDescription"
                    defaultValue={editingTodo?.todoDescription || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="todoDueDate">Due Date (Optional):</label>
                <input type="date" id="todoDueDate" name="todoDueDate"
                    defaultValue={editingTodo?.todoDueDate || ''} />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingTodo ? 'Update To-Do' : 'Add To-Do'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddTodoForm(false); setEditingTodo(null);
                }}>Cancel</button>
            </div>
        </form>
    );
    const renderAddReferenceForm = () => (
        <form onSubmit={handleReferenceSubmit} className="form-grid">
            <h3>{editingReference ? 'Edit Reference' : 'Add New Reference'}</h3>
            <div className="form-group">
                <label htmlFor="referenceName">Name:</label>
                <input type="text" id="referenceName" name="referenceName"
                    defaultValue={editingReference?.referenceName || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="relationship">Relationship:</label>
                <input type="text" id="relationship" name="relationship"
                    defaultValue={editingReference?.relationship || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="referenceEmail">Email:</label>
                <input type="email" id="referenceEmail" name="referenceEmail"
                    defaultValue={editingReference?.referenceEmail || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="referencePhone">Phone:</label>
                <input type="tel" id="referencePhone" name="referencePhone"
                    defaultValue={editingReference?.referencePhone || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="referenceCompany">Company:</label>
                <input type="text" id="referenceCompany" name="referenceCompany"
                    defaultValue={editingReference?.referenceCompany || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="referenceTitle">Title:</label>
                <input type="text" id="referenceTitle" name="referenceTitle"
                    defaultValue={editingReference?.referenceTitle || ''} />
            </div>
            <div className="form-group full-width">
                <label htmlFor="referenceNotes">Notes:</label>
                <textarea id="referenceNotes" name="referenceNotes" rows="3"
                    defaultValue={editingReference?.referenceNotes || ''}></textarea>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingReference ? 'Update Reference' : 'Add Reference'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddReferenceForm(false); setEditingReference(null);
                }}>Cancel</button>
            </div>
        </form>
    );

    // Render form for Additional Resources (from final)
    const renderAddResourceForm = () => (
        <form onSubmit={handleResourceSubmit} className="form-grid">
            <h3>{editingResource ? 'Edit Resource' : 'Add New Resource'}</h3>
            <div className="form-group">
                <label htmlFor="resourceName">Resource Name:</label>
                <input type="text" id="resourceName" name="resourceName"
                    defaultValue={editingResource?.resourceName || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="resourceLink">Resource Link:</label>
                <input type="url" id="resourceLink" name="resourceLink"
                    defaultValue={editingResource?.resourceLink || ''} required />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingResource ? 'Update Resource' : 'Add Resource'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddResourceForm(false); setEditingResource(null);
                }}>Cancel</button>
            </div>
        </form>
    );

    const renderAddExtracurricularForm = () => (
        <form onSubmit={handleExtracurricularSubmit} className="form-grid">
            <h3>{editingExtracurricular ? 'Edit Extracurricular' : 'Add New Extracurricular'}</h3>
            <div className="form-group">
                <label htmlFor="ecActivity">Activity Name:</label>
                <input type="text" id="ecActivity" name="ecActivity"
                    defaultValue={editingExtracurricular?.ecActivity || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="ecRole">Role:</label>
                <input type="text" id="ecRole" name="ecRole"
                    defaultValue={editingExtracurricular?.ecRole || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="ecOrganization">Organization:</label>
                <input type="text" id="ecOrganization" name="ecOrganization"
                    defaultValue={editingExtracurricular?.ecOrganization || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="ecStartDate">Start Date:</label>
                <input type="date" id="ecStartDate" name="ecStartDate"
                    defaultValue={editingExtracurricular?.ecStartDate || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="ecEndDate">End Date (Optional):</label>
                <input type="date" id="ecEndDate" name="ecEndDate"
                    defaultValue={editingExtracurricular?.ecEndDate || ''} />
            </div>
            <div className="form-group full-width">
                <label htmlFor="ecDescription">Description:</label>
                <textarea id="ecDescription" name="ecDescription" rows="3"
                    defaultValue={editingExtracurricular?.ecDescription || ''}></textarea>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingExtracurricular ? 'Update Extracurricular' : 'Add Extracurricular'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddExtracurricularForm(false); setEditingExtracurricular(null);
                }}>Cancel</button>
            </div>
        </form>
    );
    const renderAddInternshipForm = () => (
        <form onSubmit={handleInternshipSubmit} className="form-grid">
            <h3>{editingInternship ? 'Edit Internship' : 'Add New Internship'}</h3>
            <div className="form-group">
                <label htmlFor="internshipCompany">Company:</label>
                <input type="text" id="internshipCompany" name="internshipCompany"
                    defaultValue={editingInternship?.internshipCompany || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="internshipRole">Role:</label>
                <input type="text" id="internshipRole" name="internshipRole"
                    defaultValue={editingInternship?.internshipRole || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="internshipStartDate">Start Date:</label>
                <input type="date" id="internshipStartDate" name="internshipStartDate"
                    defaultValue={editingInternship?.internshipStartDate || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="internshipEndDate">End Date (Optional):</label>
                <input type="date" id="internshipEndDate" name="internshipEndDate"
                    defaultValue={editingInternship?.internshipEndDate || ''} />
            </div>
            <div className="form-group full-width">
                <label htmlFor="internshipDescription">Description:</label>
                <textarea id="internshipDescription" name="internshipDescription" rows="3"
                    defaultValue={editingInternship?.internshipDescription || ''}></textarea>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingInternship ? 'Update Internship' : 'Add Internship'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddInternshipForm(false); setEditingInternship(null);
                }}>Cancel</button>
            </div>
        </form>
    );
    const renderAddSkillToGainForm = () => (
        <form onSubmit={handleSkillToGainSubmit} className="form-grid">
            <h3>{editingSkillToGain ? 'Edit Skill to Gain' : 'Add New Skill to Gain'}</h3>
            <div className="form-group">
                <label htmlFor="skillToGainName">Skill Name:</label>
                <input type="text" id="skillToGainName" name="skillToGainName"
                    defaultValue={editingSkillToGain?.skillToGainName || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="resource">Resource (e.g., Coursera link):</label>
                <input type="url" id="resource" name="resource"
                    defaultValue={editingSkillToGain?.resource || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="targetDate">Target Date (Optional):</label>
                <input type="date" id="targetDate" name="targetDate"
                    defaultValue={editingSkillToGain?.targetDate || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="progress">Progress:</label>
                <select id="progress" name="progress" defaultValue={editingSkillToGain?.progress || "Not Started"}>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingSkillToGain ? 'Update Skill' : 'Add Skill'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddSkillToGainForm(false); setEditingSkillToGain(null);
                }}>Cancel</button>
            </div>
        </form>
    );
    const renderAddApplicationForm = () => (
        <form onSubmit={handleApplicationSubmit} className="form-grid">
            <h3>{editingApplication ? 'Edit Application' : 'Add New Application'}</h3>
            <div className="form-group">
                <label htmlFor="jobTitle">Job Title:</label>
                <input type="text" id="jobTitle" name="jobTitle" defaultValue={editingApplication?.jobTitle ||
                    ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="companyName">Company:</label>
                <input type="text" id="companyName" name="companyName"
                    defaultValue={editingApplication?.companyName || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="applicationDate">Application Date:</label>
                <input type="date" id="applicationDate" name="applicationDate"
                    defaultValue={editingApplication?.applicationDate || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="applicationStatus">Status:</label>
                <select id="applicationStatus" name="applicationStatus"
                    defaultValue={editingApplication?.applicationStatus || 'Applied'}>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="applicationLink">Job Link:</label>
                <input type="url" id="applicationLink" name="applicationLink"
                    defaultValue={editingApplication?.applicationLink || ''} />
            </div>
            <div className="form-group full-width">
                <label htmlFor="applicationNotes">Notes:</label>
                <textarea id="applicationNotes" name="applicationNotes" rows="3"
                    defaultValue={editingApplication?.applicationNotes || ''}></textarea>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingApplication ? 'Update Application'
                    : 'Add Application'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddApplicationForm(false); setEditingApplication(null);
                }}>Cancel</button>
            </div>
        </form>
    );
    const renderAddContactForm = () => (
        <form onSubmit={handleContactSubmit} className="form-grid">
            <h3>{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>
            <div className="form-group">
                <label htmlFor="contactName">Name:</label>
                <input type="text" id="contactName" name="contactName"
                    defaultValue={editingContact?.contactName || ''} required />
            </div>
            <div className="form-group">
                <label htmlFor="contactEmail">Email:</label>
                <input type="email" id="contactEmail" name="contactEmail"
                    defaultValue={editingContact?.contactEmail || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="contactPhone">Phone:</label>
                <input type="tel" id="contactPhone" name="contactPhone"
                    defaultValue={editingContact?.contactPhone || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="contactLinkedIn">LinkedIn Profile:</label>
                <input type="url" id="contactLinkedIn" name="contactLinkedIn"
                    defaultValue={editingContact?.contactLinkedIn || ''} />
            </div>
            <div className="form-group">
                <label htmlFor="contactRelationship">Relationship:</label>
                <input type="text" id="contactRelationship" name="contactRelationship"
                    defaultValue={editingContact?.contactRelationship || ''} />
            </div>
            <div className="form-group full-width">
                <label htmlFor="contactNotes">Notes:</label>
                <textarea id="contactNotes" name="contactNotes" rows="3"
                    defaultValue={editingContact?.contactNotes || ''}></textarea>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{editingContact ? 'Update Contact' : 'Add Contact'}</button>
                <button type="button" className="btn-secondary" onClick={() => {
                    setShowAddContactForm(false); setEditingContact(null);
                }}>Cancel</button>
            </div>
        </form>
    );

    // --- Render Functions for Pages/Sections ---
    const renderClassesAndGpaPage = () => (
        <section className="section-content">
            <h2 className="section-title">Classes & GPA</h2>
            <div className="summary-cards">
                <div className="card">
                    <h3>Overall GPA (Current Schedule)</h3>
                    <p className="gpa-display">{gpa}</p>
                </div>
            </div>
            {!showAddClassForm && !editingClass && (
                <button className="btn-primary mt-4" onClick={() => setShowAddClassForm(true)}>Add
                    New Class</button>
            )}
            {showAddClassForm && renderAddClassForm()}
            {editingClass && renderAddClassForm()}
            <h3 className="mt-4">All Classes</h3>
            <div className="list-container mt-4">
                {classes.length === 0 ? (
                    <p>No classes added yet.</p>
                ) : (
                    <div className="class-grid">
                        {classes.map(cls => (
                            <div key={cls.id} className="data-card class-item">
                                <h4>{cls.className} ({cls.classCode})</h4>
                                <p><strong>Professor:</strong> {cls.professor}</p>
                                <p><strong>Credit Hours:</strong> {cls.creditHours}</p>
                                <p><strong>Assigned Grade:</strong> {cls.grade || 'N/A'}</p>
                                {cls.syllabusUrl && <p><a href={cls.syllabusUrl} target="_blank" rel="noopener
                                    noreferrer">Syllabus</a></p>}
                                {cls.days && cls.days.length > 0 && cls.startTime && cls.endTime &&
                                    <p><strong>Time:</strong> {cls.days.map(day => dayMapping[day]).join(', ')}
                                        {cls.startTime} - {cls.endTime}</p>
                                }
                                {cls.classLocation && <p><strong>Location:</strong> {cls.classLocation}</p>}
                                {cls.officeHours && <p><strong>Office Hours:</strong> {cls.officeHours}</p>}
                                <p><strong>Major Weight:</strong> {cls.majorWeight || 0}%</p>
                                <p><strong>Minor Weight:</strong> {cls.minorWeight || 0}%</p>
                                <p><strong>Quiz Weight:</strong> {cls.quizWeight || 0}%</p>
                                <p><strong>Homework Weight:</strong> {cls.homeworkWeight || 0}%</p>
                                <div className="card-actions">
                                    <label className="current-schedule-toggle">
                                        <input
                                            type="checkbox"
                                            checked={cls.isCurrentSchedule || false}
                                            onChange={() => toggleCurrentSchedule(cls.id)}
                                        />
                                        Current Schedule
                                    </label>
                                    <button className="btn-edit" onClick={() => {
                                        setEditingClass(cls);
                                        setShowAddClassForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteClassFromLocalStorage(cls.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );

    const renderGpaDetailsPage = () => (
        <section className="section-content">
            <h2 className="section-title">GPA Details</h2>
            <div className="summary-cards">
                <div className="card">
                    <h3>Overall GPA</h3>
                    <p className="gpa-display">{gpa}</p>
                </div>
            </div>

            <h3 className="mt-4">Current Schedule Class Grades</h3>
            <div className="list-container mt-4">
                {classes.filter(cls => cls.isCurrentSchedule).length === 0 ? (
                    <p>No classes marked for current schedule to calculate detailed GPA.</p>
                ) : (
                    <div className="class-grid">
                        {classes.filter(cls => cls.isCurrentSchedule).map(cls => {
                            const gradeInfo = classGrades[cls.id] || { finalScore: 'N/A', letterGrade: 'N/A', gpaPoints: 'N/A' };
                            return (
                                <div key={cls.id} className="data-card class-item">
                                    <h4>{cls.className} ({cls.classCode})</h4>
                                    <p><strong>Credit Hours:</strong> {cls.creditHours}</p>
                                    <p><strong>Calculated Score:</strong> {gradeInfo.finalScore}%</p>
                                    <p><strong>Calculated Grade:</strong> {gradeInfo.letterGrade}</p>
                                    <p><strong>GPA Points:</strong> {gradeInfo.gpaPoints}</p>
                                    <h5 className="mt-3">Assignments:</h5>
                                    {assignments.filter(assign => assign.classId === cls.id).length === 0 ? (
                                        <p>No assignments added for this class.</p>
                                    ) : (
                                        <ul className="assignment-list">
                                            {assignments.filter(assign => assign.classId === cls.id).map(assign => (
                                                <li key={assign.id}>
                                                    {assign.assignmentName} ({assign.weightageType || 'N/A'}): {assign.score || 'N/A'} / {assign.maxScore || 'N/A'}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );


    const renderSchedulePage = () => {
        // Filter classes for the current schedule and sort by time and day
        const currentSchedule = classes
            .filter(cls => cls.isCurrentSchedule && cls.days && cls.days.length > 0 && cls.startTime &&
                cls.endTime)
            .sort((a, b) => {
                const dayA = daysOfWeekOrder.indexOf(dayMapping[a.days[0]]);
                const dayB = daysOfWeekOrder.indexOf(dayMapping[b.days[0]]);
                if (dayA !== dayB) return dayA - dayB;
                return a.startTime.localeCompare(b.startTime);
            });
        const scheduleByDay = daysOfWeekOrder.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {});
        currentSchedule.forEach(cls => {
            cls.days.forEach(dayAbbr => {
                const fullDayName = dayMapping[dayAbbr];
                if (scheduleByDay[fullDayName]) {
                    scheduleByDay[fullDayName].push(cls);
                }
            });
        });
        return (
            <section className="section-content">
                <h2 className="section-title">Current Schedule</h2>
                {currentSchedule.length === 0 ? (
                    <p>No classes marked for the current schedule or missing time/day information. Please
                        add classes and mark them as part of the "current schedule" to see them here.</p>
                ) : (
                    <div className="schedule-grid">
                        {daysOfWeekOrder.map(day => (
                            <div key={day} className="schedule-day-column">
                                <h3>{day}</h3>
                                {scheduleByDay[day].length === 0 ? (
                                    <p className="no-classes-day">No classes</p>
                                ) : (
                                    scheduleByDay[day].map(cls => (
                                        <div key={cls.id} className="schedule-class-item data-card">
                                            <h4>{cls.className} ({cls.classCode})</h4>
                                            <p><strong>Time:</strong> {cls.startTime} - {cls.endTime}</p>
                                            <p><strong>Location:</strong> {cls.classLocation}</p>
                                            <p><strong>Professor:</strong> {cls.professor}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        );
    };
    const renderAssignmentsPage = () => (
        <section className="section-content">
            <h2 className="section-title">Assignments</h2>
            {!showAddAssignmentForm && !editingAssignment && (
                <button className="btn-primary mt-4" onClick={() =>
                    setShowAddAssignmentForm(true)}>Add New Assignment</button>
            )}
            {showAddAssignmentForm && renderAddAssignmentForm()}
            {editingAssignment && renderAddAssignmentForm()}
            <div className="list-container mt-4">
                {assignments.length === 0 ? (
                    <p>No assignments added yet.</p>
                ) : (
                    <div className="assignment-grid">
                        {assignments.map(assign => (
                            <div key={assign.id} className="data-card assignment-item">
                                <h4>{assign.assignmentName}</h4>
                                <p><strong>Class:</strong> {classes.find(cls => cls.id ===
                                    assign.classId)?.className || 'N/A'}</p>
                                <p><strong>Due Date:</strong> {assign.dueDate}</p>
                                <p><strong>Status:</strong> {assign.status}</p>
                                <p><strong>Score:</strong> {assign.score || 'N/A'} / {assign.maxScore || 'N/A'}</p>
                                <p><strong>Type:</strong> {assign.weightageType || 'N/A'}</p>
                                {assign.notes && <p className="assignment-notes">{assign.notes}</p>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingAssignment(assign);
                                        setShowAddAssignmentForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteAssignmentFromLocalStorage(assign.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
    const renderSkillsPage = () => (
        <section className="section-content">
            <h2 className="section-title">Skills</h2>
            {!showAddSkillForm && !editingSkill && (
                <button className="btn-primary mt-4" onClick={() => setShowAddSkillForm(true)}>Add
                    New Skill</button>
            )}
            {showAddSkillForm && renderAddSkillForm()}
            {editingSkill && renderAddSkillForm()}
            <div className="list-container mt-4">
                {skills.length === 0 ? (
                    <p>No skills added yet.</p>
                ) : (
                    <div className="skills-grid">
                        {skills.map(skill => (
                            <div key={skill.id} className="data-card skill-item">
                                <h4>{skill.skillName}</h4>
                                <p><strong>Proficiency:</strong> {skill.proficiency}</p>
                                {skill.category && <p><strong>Category:</strong> {skill.category}</p>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingSkill(skill);
                                        setShowAddSkillForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteSkillFromLocalStorage(skill.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
    const renderTodoPage = () => (
        <section className="section-content">
            <h2 className="section-title">To-Do List</h2>
            {!showAddTodoForm && !editingTodo && (
                <button className="btn-primary mt-4" onClick={() => setShowAddTodoForm(true)}>Add
                    New To-Do Item</button>
            )}
            {showAddTodoForm && renderAddTodoForm()}
            {editingTodo && renderAddTodoForm()}
            <div className="list-container mt-4">
                {todoItems.length === 0 ? (
                    <p>No to-do items added yet.</p>
                ) : (
                    <div className="todo-list">
                        {todoItems.map(item => (
                            <div key={item.id} className={`data-card todo-item ${item.completed ? 'completed' :
                                ''}`}>
                                <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={(e) => updateTodoItemInLocalStorage(item.id, {
                                        ...item, completed:
                                            e.target.checked
                                    })}
                                />
                                <span className="todo-description">{item.todoDescription}</span>
                                {item.todoDueDate && <span className="todo-due-date">Due:
                                    {item.todoDueDate}</span>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingTodo(item);
                                        setShowAddTodoForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteTodoItemFromLocalStorage(item.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
    const renderReferencesPage = () => (
        <section className="section-content">
            <h2 className="section-title">References</h2>
            {!showAddReferenceForm && !editingReference && (
                <button className="btn-primary mt-4" onClick={() =>
                    setShowAddReferenceForm(true)}>Add New Reference</button>
            )}
            {showAddReferenceForm && renderAddReferenceForm()}
            {editingReference && renderAddReferenceForm()}
            <div className="list-container mt-4">
                {references.length === 0 ? (
                    <p>No references added yet.</p>
                ) : (
                    <div className="references-grid">
                        {references.map(ref => (
                            <div key={ref.id} className="data-card reference-item">
                                <h4>{ref.referenceName}</h4>
                                <p><strong>Relationship:</strong> {ref.relationship}</p>
                                {ref.referenceEmail && <p><strong>Email:</strong> <a
                                    href={`mailto:${ref.referenceEmail}`}>{ref.referenceEmail}</a></p>}
                                {ref.referencePhone && <p><strong>Phone:</strong> {ref.referencePhone}</p>}
                                {ref.referenceCompany && <p><strong>Company:</strong>
                                    {ref.referenceCompany}</p>}
                                {ref.referenceTitle && <p><strong>Title:</strong> {ref.referenceTitle}</p>}
                                {ref.referenceNotes && <p className="reference-notes">{ref.referenceNotes}</p>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingReference(ref);
                                        setShowAddReferenceForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteReferenceFromLocalStorage(ref.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );

    // Render Additional Resources Page (from final)
    const renderAdditionalResourcesPage = () => (
        <section className="section-content">
            <h2 className="section-title">Additional Resources</h2>
            {!showAddResourceForm && !editingResource && (
                <button className="btn-primary mt-4" onClick={() =>
                    setShowAddResourceForm(true)}>Add New Resource</button>
            )}
            {showAddResourceForm && renderAddResourceForm()}
            {editingResource && renderAddResourceForm()}
            <div className="list-container mt-4">
                {additionalResources.length === 0 ? (
                    <p>No resources added yet.</p>
                ) : (
                    <div className="resources-grid">
                        {additionalResources.map(resource => (
                            <div key={resource.id} className="data-card resource-item">
                                <h4>{resource.resourceName}</h4>
                                <p><strong>Link:</strong> <a href={resource.resourceLink}
                                    target="_blank" rel="noopener noreferrer">{resource.resourceLink}</a></p>
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingResource(resource);
                                        setShowAddResourceForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteResourceFromLocalStorage(resource.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );

    const renderExtracurricularsPage = () => (
        <section className="section-content">
            <h2 className="section-title">Extracurricular Activities</h2>
            {!showAddExtracurricularForm && !editingExtracurricular && (
                <button className="btn-primary mt-4" onClick={() =>
                    setShowAddExtracurricularForm(true)}>Add New Extracurricular</button>
            )}
            {showAddExtracurricularForm && renderAddExtracurricularForm()}
            {editingExtracurricular && renderAddExtracurricularForm()}
            <div className="list-container mt-4">
                {extracurriculars.length === 0 ? (
                    <p>No extracurricular activities added yet.</p>
                ) : (
                    <div className="extracurriculars-grid">
                        {extracurriculars.map(ec => (
                            <div key={ec.id} className="data-card extracurricular-item">
                                <h4>{ec.ecActivity}</h4>
                                <p><strong>Role:</strong> {ec.ecRole}</p>
                                <p><strong>Organization:</strong> {ec.ecOrganization}</p>
                                <p><strong>Dates:</strong> {ec.ecStartDate} - {ec.ecEndDate || 'Present'}</p>
                                {ec.ecDescription && <p
                                    className="extracurricular-description">{ec.ecDescription}</p>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingExtracurricular(ec);
                                        setShowAddExtracurricularForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteExtracurricularFromLocalStorage(ec.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
    const renderInternshipsPage = () => (
        <section className="section-content">
            <h2 className="section-title">Internships</h2>
            {!showAddInternshipForm && !editingInternship && (
                <button className="btn-primary mt-4" onClick={() =>
                    setShowAddInternshipForm(true)}>Add New Internship</button>
            )}
            {showAddInternshipForm && renderAddInternshipForm()}
            {editingInternship && renderAddInternshipForm()}
            <div className="list-container mt-4">
                {internships.length === 0 ? (
                    <p>No internships added yet.</p>
                ) : (
                    <div className="internships-grid">
                        {internships.map(internship => (
                            <div key={internship.id} className="data-card internship-item">
                                <h4>{internship.internshipRole} at {internship.internshipCompany}</h4>
                                <p><strong>Dates:</strong> {internship.internshipStartDate} -
                                    {internship.internshipEndDate || 'Present'}</p>
                                {internship.internshipDescription && <p
                                    className="internship-description">{internship.internshipDescription}</p>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingInternship(internship);
                                        setShowAddInternshipForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteInternshipFromLocalStorage(internship.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
    const renderSkillsToGainPage = () => (
        <section className="section-content">
            <h2 className="section-title">Skills to Gain</h2>
            {!showAddSkillToGainForm && !editingSkillToGain && (
                <button className="btn-primary mt-4" onClick={() =>
                    setShowAddSkillToGainForm(true)}>Add New Skill to Gain</button>
            )}
            {showAddSkillToGainForm && renderAddSkillToGainForm()}
            {editingSkillToGain && renderAddSkillToGainForm()}
            <div className="list-container mt-4">
                {skillsToGain.length === 0 ? (
                    <p>No skills to gain added yet.</p>
                ) : (
                    <div className="skills-to-gain-grid">
                        {skillsToGain.map(skill => (
                            <div key={skill.id} className="data-card skill-to-gain-item">
                                <h4>{skill.skillToGainName}</h4>
                                <p><strong>Progress:</strong> {skill.progress}</p>
                                {skill.resource && <p><strong>Resource:</strong> <a href={skill.resource}
                                    target="_blank" rel="noopener noreferrer">{skill.resource}</a></p>}
                                {skill.targetDate && <p><strong>Target Date:</strong> {skill.targetDate}</p>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingSkillToGain(skill);
                                        setShowAddSkillToGainForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteSkillToGainFromLocalStorage(skill.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
    const renderApplicationsPage = () => (
        <section className="section-content">
            <h2 className="section-title">Job Applications</h2>
            {!showAddApplicationForm && !editingApplication && (
                <button className="btn-primary mt-4" onClick={() =>
                    setShowAddApplicationForm(true)}>Add New Application</button>
            )}
            {showAddApplicationForm && renderAddApplicationForm()}
            {editingApplication && renderAddApplicationForm()}
            <div className="list-container mt-4">
                {applications.length === 0 ? (
                    <p>No job applications added yet.</p>
                ) : (
                    <div className="applications-grid">
                        {applications.map(app => (
                            <div key={app.id} className="data-card application-item">
                                <h4>{app.jobTitle} at {app.companyName}</h4>
                                <p><strong>Application Date:</strong> {app.applicationDate}</p>
                                <p><strong>Status:</strong> {app.applicationStatus}</p>
                                {app.applicationLink && <p><strong>Link:</strong> <a href={app.applicationLink}
                                    target="_blank" rel="noopener noreferrer">View Application</a></p>}
                                {app.applicationNotes && <p
                                    className="application-notes">{app.applicationNotes}</p>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingApplication(app);
                                        setShowAddApplicationForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteApplicationFromLocalStorage(app.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
    const renderContactsPage = () => (
        <section className="section-content">
            <h2 className="section-title">Contacts</h2>
            {!showAddContactForm && !editingContact && (
                <button className="btn-primary mt-4" onClick={() =>
                    setShowAddContactForm(true)}>Add New Contact</button>
            )}
            {showAddContactForm && renderAddContactForm()}
            {editingContact && renderAddContactForm()}
            <div className="list-container mt-4">
                {contacts.length === 0 ? (
                    <p>No contacts added yet.</p>
                ) : (
                    <div className="contacts-grid">
                        {contacts.map(contact => (
                            <div key={contact.id} className="data-card contact-item">
                                <h4>{contact.contactName}</h4>
                                {contact.contactEmail && <p><strong>Email:</strong> <a
                                    href={`mailto:${contact.contactEmail}`}>{contact.contactEmail}</a></p>}
                                {contact.contactPhone && <p><strong>Phone:</strong> {contact.contactPhone}</p>}
                                {contact.contactLinkedIn && <p><strong>LinkedIn:</strong> <a
                                    href={contact.contactLinkedIn} target="_blank" rel="noopener
                                    noreferrer">{contact.contactLinkedIn}</a></p>}
                                {contact.contactRelationship && <p><strong>Relationship:</strong>
                                    {contact.contactRelationship}</p>}
                                {contact.contactNotes && <p
                                    className="contact-notes">{contact.contactNotes}</p>}
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditingContact(contact);
                                        setShowAddContactForm(false);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() =>
                                        deleteContactFromLocalStorage(contact.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
    // --- Main Render Section ---
    return (
        <div className="app-container">
            <h1 className="main-title">College Helper Dashboard</h1>
            {message && <div className="message">{message}</div>}
            <div className="nav-tabs">
                <div className={`nav-tab ${currentPage === 'classes' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('classes')}>Classes & GPA</div>
                <div className={`nav-tab ${currentPage === 'gpaDetails' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('gpaDetails')}>GPA Details</div> {/* New Tab */}
                <div className={`nav-tab ${currentPage === 'schedule' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('schedule')}>Schedule</div>
                <div className={`nav-tab ${currentPage === 'assignments' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('assignments')}>Assignments</div>
                <div className={`nav-tab ${currentPage === 'skills' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('skills')}>Skills</div>
                <div className={`nav-tab ${currentPage === 'todo' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('todo')}>To-Do List</div>
                <div className={`nav-tab ${currentPage === 'references' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('references')}>References</div>
                <div className={`nav-tab ${currentPage === 'resources' ? 'active' : ''}`} onClick={() => // Added from final
                    setCurrentPage('resources')}>Additional Resources</div>
                <div className={`nav-tab ${currentPage === 'extracurriculars' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('extracurriculars')}>Extracurriculars</div>
                <div className={`nav-tab ${currentPage === 'internships' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('internships')}>Internships</div>
                <div className={`nav-tab ${currentPage === 'skillsToGain' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('skillsToGain')}>Skills to Gain</div>
                <div className={`nav-tab ${currentPage === 'applications' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('applications')}>Applications</div>
                <div className={`nav-tab ${currentPage === 'contacts' ? 'active' : ''}`} onClick={() =>
                    setCurrentPage('contacts')}>Contacts</div>
            </div>
            <div className="page-content"> {/* Changed from tab-content to page-content */}
                {currentPage === 'classes' && renderClassesAndGpaPage()}
                {currentPage === 'gpaDetails' && renderGpaDetailsPage()} {/* New Page Render */}
                {currentPage === 'schedule' && renderSchedulePage()}
                {currentPage === 'assignments' && renderAssignmentsPage()}
                {currentPage === 'skills' && renderSkillsPage()}
                {currentPage === 'todo' && renderTodoPage()}
                {currentPage === 'references' && renderReferencesPage()}
                {currentPage === 'resources' && renderAdditionalResourcesPage()} {/* Added from final */}
                {currentPage === 'extracurriculars' && renderExtracurricularsPage()}
                {currentPage === 'internships' && renderInternshipsPage()}
                {currentPage === 'skillsToGain' && renderSkillsToGainPage()}
                {currentPage === 'applications' && renderApplicationsPage()}
                {currentPage === 'contacts' && renderContactsPage()}
            </div>
        </div>
    );
}
export default App;
