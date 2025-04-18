document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fileInput = document.getElementById('timetable-upload');
    const freeSlotsInput = document.getElementById('free-slots');
    const decreaseSlotsBtn = document.getElementById('decrease-slots');
    const increaseSlotsBtn = document.getElementById('increase-slots');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const generateButton = document.getElementById('generate-plan');
    const downloadButton = document.getElementById('download-plan');
    const studyPlanSection = document.getElementById('study-plan');
    const progressBar = document.querySelector('.progress-bar');

    // State
    let difficultyRatings = {};
    let currentStudyPlan = null;
    let timeSlots = [];

    // Initialize radio button handlers
    function initializeRadioButtons() {
        const radioGroups = {
            'physics-difficulty': 'Physics',
            'math-difficulty': 'Mathematics',
            'chem-difficulty': 'Chemistry',
            'bio-difficulty': 'Biology',
            'eng-difficulty': 'English'
        };

        Object.entries(radioGroups).forEach(([groupName, subject]) => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        difficultyRatings[subject] = radio.value;
                        updateProgress();
                    }
                });
            });
            // Set initial difficulty rating to neutral
            difficultyRatings[subject] = 'neutral';
        });
    }

    // Handle slot counter buttons
    decreaseSlotsBtn.addEventListener('click', () => {
        const currentValue = parseInt(freeSlotsInput.value);
        if (currentValue > 0) {
            freeSlotsInput.value = currentValue - 1;
            updateTimeSlots();
        }
    });

    increaseSlotsBtn.addEventListener('click', () => {
        const currentValue = parseInt(freeSlotsInput.value);
        if (currentValue < 5) {
            freeSlotsInput.value = currentValue + 1;
            updateTimeSlots();
        }
    });

    // Update time slots based on input value
    function updateTimeSlots() {
        const numSlots = parseInt(freeSlotsInput.value);
        timeSlotsContainer.innerHTML = '';
        timeSlots = [];

        for (let i = 0; i < numSlots; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'bg-[#151515] p-4 rounded-lg';
            slotDiv.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">Time Slot ${i + 1}</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-400 mb-1">Start Time</label>
                        <input type="time" class="slot-start w-full bg-[#1a1a1a] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                        <label class="block text-gray-400 mb-1">End Time</label>
                        <input type="time" class="slot-end w-full bg-[#1a1a1a] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                </div>
            `;
            timeSlotsContainer.appendChild(slotDiv);
        }
    }

    // Initialize time slots
    updateTimeSlots();

    // File upload handler
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            updateProgress();
        } else {
            alert('Please upload a valid PDF file');
        }
    });

    // Generate study plan
    generateButton.addEventListener('click', () => {
        if (!validateInputs()) return;

        // Collect time slots
        timeSlots = Array.from(timeSlotsContainer.children).map(slotDiv => {
            const startTime = slotDiv.querySelector('.slot-start').value;
            const endTime = slotDiv.querySelector('.slot-end').value;
            return { startTime, endTime };
        });

        // Use dummy total hours instead of calculating
        const totalHours = 35; // Dummy value for a week
        currentStudyPlan = generateStudyPlan(totalHours);
        displayStudyPlan(currentStudyPlan);
    });

    // Download study plan as PDF
    downloadButton.addEventListener('click', () => {
        if (!currentStudyPlan) {
            alert('Please generate a study plan first');
            return;
        }

        // Create PDF content
        const dates = getNextSevenDays();
        let pdfContent = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .date { font-weight: bold; margin-top: 15px; }
                        .time-slot { margin-left: 20px; }
                        .subject { margin-left: 40px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Your Personalized Study Plan</h1>
                        <p>Generated on ${new Date().toLocaleDateString()}</p>
                    </div>
        `;

        dates.forEach(date => {
            pdfContent += `<div class="date">${formatDate(date)}</div>`;
            timeSlots.forEach((slot, index) => {
                pdfContent += `<div class="time-slot">Time Slot ${index + 1}: ${slot.startTime} - ${slot.endTime}</div>`;
                const subjectsForSlot = distributeSubjectsForSlot(currentStudyPlan, slot);
                subjectsForSlot.forEach(subject => {
                    pdfContent += `<div class="subject">${subject.name} - ${subject.hours} hours</div>`;
                });
            });
        });

        pdfContent += '</body></html>';

        // Create and download PDF
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(pdfContent));
        element.setAttribute('download', 'study-plan.pdf');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    });

    // Validate inputs
    function validateInputs() {
        if (!freeSlotsInput.value) {
            alert('Please enter the number of free slots per day');
            return false;
        }

        const slots = timeSlotsContainer.querySelectorAll('.slot-start, .slot-end');
        for (const slot of slots) {
            if (!slot.value) {
                alert('Please fill in all time slots');
                return false;
            }
        }

        const subjects = ['Physics', 'Mathematics', 'Chemistry', 'Biology', 'English'];
        const ratedSubjects = Object.keys(difficultyRatings).length;
        if (ratedSubjects !== subjects.length) {
            alert('Please rate the difficulty for all subjects');
            return false;
        }

        return true;
    }

    // Generate study plan based on difficulty ratings
    function generateStudyPlan(totalHours) {
        const difficultyWeights = {
            'easy': 1,
            'neutral': 1.5,
            'hard': 2
        };

        // Calculate total weight
        let totalWeight = 0;
        Object.values(difficultyRatings).forEach(difficulty => {
            totalWeight += difficultyWeights[difficulty];
        });

        // Distribute hours based on weights
        const studyPlan = {};
        Object.entries(difficultyRatings).forEach(([subject, difficulty]) => {
            const weight = difficultyWeights[difficulty];
            const hours = Math.round((weight / totalWeight) * totalHours);
            studyPlan[subject] = hours;
        });

        return studyPlan;
    }

    // Get dates for the next 7 days
    function getNextSevenDays() {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        return dates;
    }

    // Format date as "Month Day, Year"
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Distribute subjects for a time slot
    function distributeSubjectsForSlot(studyPlan, timeSlot) {
        // Use dummy hours instead of calculating from time slot
        const slotHours = 2; // Dummy value for each slot
        
        let remainingHours = slotHours;
        const subjectsForSlot = [];
        const remainingStudyPlan = { ...studyPlan };

        while (remainingHours > 0 && Object.keys(remainingStudyPlan).length > 0) {
            const subjects = Object.keys(remainingStudyPlan);
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const hours = Math.min(2, remainingHours, remainingStudyPlan[subject]);
            
            if (hours > 0) {
                subjectsForSlot.push({ name: subject, hours });
                remainingStudyPlan[subject] -= hours;
                remainingHours -= hours;
            }
            
            if (remainingStudyPlan[subject] <= 0) {
                delete remainingStudyPlan[subject];
            }
        }

        return subjectsForSlot;
    }

    // Display the generated study plan
    function displayStudyPlan(studyPlan) {
        studyPlanSection.classList.remove('hidden');
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';

        // Get current date and set up month view
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Update month header
        document.getElementById('current-month').textContent = 
            currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Get first day of month and last day of month
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // Get starting day of week (0-6, where 0 is Sunday)
        let startingDay = firstDay.getDay();
        
        // Add empty cells for days before the first of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'h-40 bg-[#151515] rounded-lg';
            calendarGrid.appendChild(emptyCell);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day bg-[#151515] rounded-lg p-3 min-h-[10rem] cursor-pointer hover:bg-[#1a1a1a] transition-colors';
            
            // Get subjects for this day
            const subjectsForDay = getSubjectsForDay(studyPlan, date);
            
            dayDiv.innerHTML = `
                <div class="text-center mb-2">
                    <div class="text-lg font-bold">${day}</div>
                </div>
                <div class="space-y-2">
                    ${subjectsForDay.map(subject => `
                        <div class="subject-item flex items-center bg-[#1a1a1a] p-2 rounded text-sm cursor-pointer hover:bg-[#222222] transition-colors" 
                             data-subject="${subject.name}" 
                             data-date="${formatDate(date)}"
                             data-time="${subject.timeSlot}"
                             data-duration="${subject.hours} hours"
                             data-difficulty="${subject.difficulty}">
                            <div class="w-2 h-2 rounded-full ${getDifficultyColor(subject.difficulty)} mr-2"></div>
                            <span class="truncate">${subject.name}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            // Add click handlers for subject items
            dayDiv.querySelectorAll('.subject-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSubjectDetails(item.dataset);
                });
            });

            calendarGrid.appendChild(dayDiv);
        }

        // Add month navigation handlers
        document.getElementById('prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            displayStudyPlan(studyPlan);
        });

        document.getElementById('next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            displayStudyPlan(studyPlan);
        });
    }

    // Get subjects for a specific day with dummy time slots
    function getSubjectsForDay(studyPlan, date) {
        const subjects = [];
        const timeSlots = [
            { start: '09:00', end: '11:00' },
            { start: '14:00', end: '16:00' },
            { start: '18:00', end: '20:00' }
        ];

        const remainingStudyPlan = { ...studyPlan };
        const availableSlots = [...timeSlots];

        while (availableSlots.length > 0 && Object.keys(remainingStudyPlan).length > 0) {
            const subjectNames = Object.keys(remainingStudyPlan);
            const subject = subjectNames[Math.floor(Math.random() * subjectNames.length)];
            const slot = availableSlots.shift();

            subjects.push({
                name: subject,
                hours: 2,
                difficulty: difficultyRatings[subject],
                timeSlot: `${slot.start} - ${slot.end}`
            });

            remainingStudyPlan[subject] -= 2;
            if (remainingStudyPlan[subject] <= 0) {
                delete remainingStudyPlan[subject];
            }
        }

        return subjects;
    }

    // Show subject details modal
    function showSubjectDetails(data) {
        const modal = document.getElementById('subject-modal');
        const modalSubject = document.getElementById('modal-subject');
        const modalContent = document.getElementById('subject-modal-content');

        modalSubject.textContent = data.subject;
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div class="bg-[#151515] rounded-lg p-4">
                    <h4 class="text-lg font-semibold mb-2">Schedule Details</h4>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Date:</span>
                            <span>${data.date}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Time Slot:</span>
                            <span>${data.time}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Duration:</span>
                            <span>${data.duration}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Difficulty:</span>
                            <span class="flex items-center">
                                <span class="w-2 h-2 rounded-full ${getDifficultyColor(data.difficulty)} mr-2"></span>
                                ${getDifficultyText(data.difficulty)}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="bg-[#151515] rounded-lg p-4">
                    <h4 class="text-lg font-semibold mb-2">Study Tips</h4>
                    <ul class="list-disc list-inside space-y-2 text-gray-300">
                        <li>Review previous day's notes before starting</li>
                        <li>Take short breaks every 45 minutes</li>
                        <li>Practice with sample questions</li>
                        <li>Make summary notes after each session</li>
                    </ul>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Add close modal handler
        document.getElementById('close-subject-modal').addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }

    // Get difficulty text
    function getDifficultyText(difficulty) {
        switch(difficulty) {
            case 'easy': return 'Easy';
            case 'neutral': return 'Neutral';
            case 'hard': return 'Hard';
            default: return '';
        }
    }

    // Get color based on difficulty
    function getDifficultyColor(difficulty) {
        switch(difficulty) {
            case 'easy': return 'bg-green-500';
            case 'neutral': return 'bg-yellow-500';
            case 'hard': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    }

    // Update progress bar
    function updateProgress() {
        const totalSteps = 2; // File upload and difficulty ratings
        let completedSteps = 0;

        if (fileInput.files.length > 0) completedSteps++;
        if (Object.keys(difficultyRatings).length === 5) completedSteps++; // 5 subjects

        const progress = (completedSteps / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Initialize the radio buttons
    initializeRadioButtons();

    // Add progress update listeners
    [fileInput, freeSlotsInput].forEach(input => {
        input.addEventListener('change', updateProgress);
    });
}); 