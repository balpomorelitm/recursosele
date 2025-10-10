function checkExercise(exerciseId) {
    const exerciseContainer = document.getElementById(exerciseId);
    if (!exerciseContainer) {
        console.warn(`Exercise container with id "${exerciseId}" not found.`);
        return;
    }

    const inputs = exerciseContainer.querySelectorAll('input[data-answer], select[data-answer]');
    const resultContainer = document.getElementById(`result-${exerciseId}`);

    if (!resultContainer) {
        console.warn(`Result container with id "result-${exerciseId}" not found.`);
        return;
    }

    let correctCount = 0;

    inputs.forEach(input => {
        input.classList.remove('correct', 'incorrect');
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.getAttribute('data-answer');

        if (!correctAnswer) {
            return;
        }

        const acceptableAnswers = correctAnswer
            .split('|')
            .map(answer => answer.trim().toLowerCase());

        if (acceptableAnswers.includes(userAnswer)) {
            input.classList.add('correct');
            correctCount++;
        } else {
            input.classList.add('incorrect');
        }
    });

    const total = inputs.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    resultContainer.textContent = `Resultado: ${percentage}% correcto. (${correctCount} de ${total})`;
}

function checkAllExercises() {
    const exerciseContainers = document.querySelectorAll('.exercise');
    exerciseContainers.forEach(container => {
        if (container.id) {
            checkExercise(container.id);
        }
    });
}

/**
 * Checks exercises with checkboxes where the answer is on the parent row.
 * A row is correct if the user checks the correct box and ONLY the correct box.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function checkCheckboxExercise(exerciseId) {
    const exerciseContainer = document.getElementById(exerciseId);
    const questions = exerciseContainer.querySelectorAll('tr[data-answer]');
    const resultContainer = document.getElementById('result-' + exerciseId);

    if (!questions.length || !resultContainer) {
        console.error("Could not find questions or result container for", exerciseId);
        return;
    }

    let correctCount = 0;

    questions.forEach(questionRow => {
        questionRow.classList.remove('correct', 'incorrect');
        const correctAnswer = questionRow.getAttribute('data-answer');
        const checkboxes = questionRow.querySelectorAll('input[type="checkbox"]');
        
        let checkedValue = null;
        let checkedCount = 0;

        checkboxes.forEach(box => {
            if (box.checked) {
                checkedValue = box.value;
                checkedCount++;
            }
        });

        // A row is correct if exactly one box is checked and its value is the correct answer.
        if (checkedCount === 1 && checkedValue === correctAnswer) {
            questionRow.classList.add('correct');
            correctCount++;
        } else {
            questionRow.classList.add('incorrect');
        }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    resultContainer.textContent = `Resultado: ${percentage}% correcto. (${correctCount} de ${questions.length})`;
    resultContainer.style.color = percentage === 100 ? '#2ecc71' : '#e74c3c';
}
