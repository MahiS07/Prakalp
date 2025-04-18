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
        const timetableGrid = document.createElement('div');
        timetableGrid.className = 'timetable-grid';

        // Get dates for the next 7 days
        const dates = getNextSevenDays();

        // Create schedule for each date
        dates.forEach(date => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'timetable-day';
            dayDiv.innerHTML = `<h3 class="text-lg font-semibold mb-4">${formatDate(date)}</h3>`;

            // Add time slots for the day
            timeSlots.forEach((slot, index) => {
                const slotDiv = document.createElement('div');
                slotDiv.className = 'timetable-slot';
                slotDiv.innerHTML = `
                    <div class="font-medium mb-2">Time Slot ${index + 1}: ${slot.startTime} - ${slot.endTime}</div>
                `;

                // Add subjects for this time slot
                const subjectsForSlot = distributeSubjectsForSlot(studyPlan, slot);
                subjectsForSlot.forEach(subject => {
                    const subjectDiv = document.createElement('div');
                    subjectDiv.className = 'ml-4 text-indigo-400';
                    subjectDiv.textContent = `${subject.name} - ${subject.hours} hours`;
                    slotDiv.appendChild(subjectDiv);
                });

                dayDiv.appendChild(slotDiv);
            });

            timetableGrid.appendChild(dayDiv);
        });

        studyPlanSection.querySelector('#timetable').innerHTML = '';
        studyPlanSection.querySelector('#timetable').appendChild(timetableGrid);
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