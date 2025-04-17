// Quiz questions and answers
const quizQuestions = [
    {
        question: "What is Machine Learning?",
        options: [
            "A type of computer hardware",
            "A subset of artificial intelligence that enables systems to learn from data",
            "A programming language",
            "A database management system"
        ],
        correctAnswer: 1,
        explanation: "Machine Learning is a subset of AI that focuses on developing systems that can learn from and make decisions based on data. It enables computers to improve their performance on a specific task through experience without being explicitly programmed."
    },
    {
        question: "Which of the following is a supervised learning algorithm?",
        options: [
            "K-means clustering",
            "Linear Regression",
            "Principal Component Analysis",
            "Apriori algorithm"
        ],
        correctAnswer: 1,
        explanation: "Linear Regression is a supervised learning algorithm used for predicting a continuous outcome variable based on one or more predictor variables. It establishes a linear relationship between the input variables and the output variable."
    },
    {
        question: "What is the purpose of cross-validation in machine learning?",
        options: [
            "To increase the model's accuracy",
            "To reduce the dataset size",
            "To evaluate model performance on unseen data",
            "To speed up the training process"
        ],
        correctAnswer: 2,
        explanation: "Cross-validation is a resampling procedure used to evaluate machine learning models on a limited data sample. It helps assess how the results of a statistical analysis will generalize to an independent data set, providing a more robust evaluation of model performance."
    },
    {
        question: "What is overfitting in machine learning?",
        options: [
            "When a model performs poorly on training data",
            "When a model learns the training data too well and performs poorly on new data",
            "When a model takes too long to train",
            "When a model has too few parameters"
        ],
        correctAnswer: 1,
        explanation: "Overfitting occurs when a model learns the detail and noise in the training data to the extent that it negatively impacts the performance of the model on new data. The model becomes too complex and captures the noise instead of the underlying pattern."
    },
    {
        question: "Which of the following is NOT a type of neural network?",
        options: [
            "Convolutional Neural Network (CNN)",
            "Recurrent Neural Network (RNN)",
            "Decision Tree Network",
            "Long Short-Term Memory (LSTM)"
        ],
        correctAnswer: 2,
        explanation: "Decision Tree is a supervised learning algorithm used for classification and regression, but it's not a type of neural network. Neural networks include architectures like CNN, RNN, and LSTM that are inspired by the human brain's structure and function."
    },
    {
        question: "What is the purpose of the activation function in a neural network?",
        options: [
            "To increase the number of parameters",
            "To introduce non-linearity into the network",
            "To reduce the model's complexity",
            "To speed up the training process"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the difference between classification and regression?",
        options: [
            "Classification predicts continuous values, regression predicts discrete values",
            "Classification predicts discrete values, regression predicts continuous values",
            "There is no difference between them",
            "Classification is faster than regression"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the purpose of regularization in machine learning?",
        options: [
            "To increase model complexity",
            "To prevent overfitting",
            "To speed up training",
            "To reduce the dataset size"
        ],
        correctAnswer: 1
    },
    {
        question: "Which of the following is a clustering algorithm?",
        options: [
            "Linear Regression",
            "Logistic Regression",
            "K-means",
            "Random Forest"
        ],
        correctAnswer: 2
    },
    {
        question: "What is the purpose of feature scaling in machine learning?",
        options: [
            "To reduce the number of features",
            "To make all features contribute equally to the model",
            "To increase model accuracy",
            "To speed up the training process"
        ],
        correctAnswer: 1
    }
];

// Quiz state
let userAnswers = new Array(quizQuestions.length).fill(null);

// DOM elements
const quizContainer = document.getElementById('quiz-container');
const scoreDisplay = document.getElementById('score');
const submitButton = document.getElementById('submit-btn');
const resultsSection = document.getElementById('results-section');
const finalScore = document.getElementById('final-score');
const scoreMessage = document.getElementById('score-message');
const solutionsContainer = document.getElementById('solutions-container');

// Initialize the quiz
function initQuiz() {
    displayQuestions();
}

// Display all questions
function displayQuestions() {
    let questionsHtml = '';
    quizQuestions.forEach((question, index) => {
        let optionsHtml = '';
        question.options.forEach((option, optionIndex) => {
            optionsHtml += `
                <label class="option-label flex items-center p-4 mb-2 bg-[#111111] rounded-lg shadow-sm cursor-pointer hover:bg-[#151515] transition-colors duration-300"
                       onclick="selectOption(${index}, ${optionIndex})">
                    <input type="radio" name="question${index}" class="option-radio" ${userAnswers[index] === optionIndex ? 'checked' : ''}>
                    <span class="ml-2">${option}</span>
                </label>
            `;
        });

        questionsHtml += `
            <div class="question-container bg-[#0A0A0A] p-6 rounded-xl shadow-lg">
                <h3 class="text-lg font-semibold mb-4">Question ${index + 1}</h3>
                <p class="text-xl mb-4">${question.question}</p>
                <div class="space-y-2">
                    ${optionsHtml}
                </div>
            </div>
        `;
    });

    quizContainer.innerHTML = questionsHtml;
}

// Handle option selection
function selectOption(questionIndex, optionIndex) {
    userAnswers[questionIndex] = optionIndex;
    displayQuestions(); // Refresh to update radio button states
}

// Calculate and show results
function showResults() {
    let score = 0;
    quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            score++;
        }
    });
    
    finalScore.textContent = `${score} out of ${quizQuestions.length}`;
    scoreDisplay.textContent = score;
    
    // Set score message based on performance
    if (score === quizQuestions.length) {
        scoreMessage.textContent = "Perfect score! Excellent work!";
    } else if (score >= quizQuestions.length * 0.8) {
        scoreMessage.textContent = "Great job! You have a solid understanding!";
    } else if (score >= quizQuestions.length * 0.6) {
        scoreMessage.textContent = "Good effort! Keep learning and practicing!";
    } else {
        scoreMessage.textContent = "Keep studying! You'll improve with practice!";
    }
    
    // Show results section and display solutions
    resultsSection.classList.remove('hidden');
    displaySolutions();
    
    // Scroll to results section
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Display solutions
function displaySolutions() {
    let solutionsHtml = '';
    
    quizQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        let optionsHtml = '';
        question.options.forEach((option, optionIndex) => {
            let optionClass = '';
            let icon = '';
            
            if (optionIndex === question.correctAnswer) {
                optionClass = 'bg-green-900/30 border-green-500';
                icon = '<i class="fas fa-check-circle text-green-500 ml-2"></i>';
            } else if (optionIndex === userAnswer && !isCorrect) {
                optionClass = 'bg-red-900/30 border-red-500';
                icon = '<i class="fas fa-times-circle text-red-500 ml-2"></i>';
            }
            
            optionsHtml += `
                <div class="p-4 mb-2 rounded-lg border ${optionClass} flex items-center justify-between">
                    <span>${option}</span>
                    ${icon}
                </div>
            `;
        });
        
        solutionsHtml += `
            <div class="bg-[#0A0A0A] p-6 rounded-xl shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">Question ${index + 1}</h3>
                    <span class="px-3 py-1 rounded-full ${isCorrect ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}">
                        ${isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                <p class="text-xl mb-4">${question.question}</p>
                <div class="space-y-2">
                    ${optionsHtml}
                </div>
                <div class="mt-4 p-4 bg-[#151515] rounded-lg">
                    <p class="font-medium mb-1">Explanation:</p>
                    <p class="text-gray-300">${question.explanation}</p>
                </div>
            </div>
        `;
    });
    
    solutionsContainer.innerHTML = solutionsHtml;
}

// Event Listeners
submitButton.addEventListener('click', showResults);

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz); 