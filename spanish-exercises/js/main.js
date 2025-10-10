/**
 * Checks exercises with text inputs and select dropdowns.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function checkExercise(exerciseId) {
    const exerciseContainer = document.getElementById(exerciseId);
    if (!exerciseContainer) {
        console.warn(`Exercise container with id "${exerciseId}" not found.`);
        return;
    }

    const wordGroups = exerciseContainer.querySelectorAll('.word-group');
    if (wordGroups.length) {
        checkSelectedWords(exerciseId);
        return;
    }

    const inputs = exerciseContainer.querySelectorAll('input[type="text"], select');
    const resultContainer = document.getElementById('result-' + exerciseId);

    if (!inputs.length || !resultContainer) {
        console.error('Could not find inputs or result container for', exerciseId);
        return;
    }

    let correctCount = 0;

    inputs.forEach(input => {
        input.classList.remove('correct', 'incorrect');
        const dataAnswer = input.getAttribute('data-answer');

        if (!dataAnswer) {
            input.classList.add('incorrect');
            return;
        }

        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = dataAnswer.trim().toLowerCase();

        if (userAnswer === correctAnswer) {
            input.classList.add('correct');
            correctCount++;
        } else {
            input.classList.add('incorrect');
        }
    });

    const percentage = Math.round((correctCount / inputs.length) * 100);
    resultContainer.textContent = `Resultado: ${percentage}% correcto. (${correctCount} de ${inputs.length})`;
    resultContainer.style.color = percentage === 100 ? '#2ecc71' : '#e74c3c';
}

/**
 * Checks exercises with radio buttons where the answer is on the parent container.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function checkRadioExercise(exerciseId) {
    const exerciseContainer = document.getElementById(exerciseId);
    const questions = exerciseContainer ? exerciseContainer.querySelectorAll('.match-item[data-answer]') : [];
    const resultContainer = document.getElementById('result-' + exerciseId);

    if (!questions.length || !resultContainer) {
        console.error('Could not find questions or result container for', exerciseId);
        return;
    }

    let correctCount = 0;

    questions.forEach(question => {
        question.classList.remove('correct', 'incorrect');
        const correctAnswer = question.getAttribute('data-answer');
        const selectedRadio = question.querySelector('input[type="radio"]:checked');

        if (selectedRadio && selectedRadio.value === correctAnswer) {
            question.classList.add('correct');
            correctCount++;
        } else {
            question.classList.add('incorrect');
        }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    resultContainer.textContent = `Resultado: ${percentage}% correcto. (${correctCount} de ${questions.length})`;
    resultContainer.style.color = percentage === 100 ? '#2ecc71' : '#e74c3c';
}

/**
 * Checks exercises with checkboxes where the answer is on the parent row.
 * A row is correct if the user checks the correct box and ONLY the correct box.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function checkCheckboxExercise(exerciseId) {
    const exerciseContainer = document.getElementById(exerciseId);
    const questions = exerciseContainer ? exerciseContainer.querySelectorAll('tr[data-answer]') : [];
    const resultContainer = document.getElementById('result-' + exerciseId);

    if (!questions.length || !resultContainer) {
        console.error('Could not find questions or result container for', exerciseId);
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

/**
 * Checks exercises where the user selects (checks) words from a group.
 * Assumes the correct word has a data-answer attribute on its checkbox.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function checkSelectedWords(exerciseId) {
    const exerciseContainer = document.getElementById(exerciseId);
    if (!exerciseContainer) {
        console.warn(`Exercise container with id "${exerciseId}" not found.`);
        return;
    }

    const wordGroups = exerciseContainer.querySelectorAll('.word-group');
    const resultContainer = document.getElementById('result-' + exerciseId);

    if (!wordGroups.length || !resultContainer) {
        console.error('Could not find word groups or result container for', exerciseId);
        return;
    }

    let correctSelections = 0;
    let totalGroups = 0;

    wordGroups.forEach(group => {
        const checkboxesInGroup = group.querySelectorAll('input[type="checkbox"]');
        let hasDataAnswer = false;
        checkboxesInGroup.forEach(cb => {
            if (cb.hasAttribute('data-answer')) {
                hasDataAnswer = true;
            }
        });
        if (hasDataAnswer) {
            totalGroups++;
        }
    });

    wordGroups.forEach(group => {
        group.classList.remove('correct', 'incorrect');
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        let groupIsCorrect = true;

        checkboxes.forEach(checkbox => {
            const isCorrectOption = checkbox.hasAttribute('data-answer');

            if (checkbox.checked && !isCorrectOption) {
                groupIsCorrect = false;
            } else if (!checkbox.checked && isCorrectOption) {
                groupIsCorrect = false;
            }
        });

        if (groupIsCorrect) {
            group.classList.add('correct');
            group.classList.remove('incorrect');
            correctSelections++;
        } else {
            group.classList.add('incorrect');
            group.classList.remove('correct');
        }
    });

    const percentage = Math.round((correctSelections / totalGroups) * 100);
    resultContainer.textContent = `Resultado: ${percentage}% correcto. (${correctSelections} de ${totalGroups})`;
    resultContainer.style.color = percentage === 100 ? '#2ecc71' : '#e74c3c';
}

function checkAllExercises() {
    const exerciseContainers = document.querySelectorAll('.exercise');
    exerciseContainers.forEach(container => {
        if (container.id) {
            checkExercise(container.id);
        }
    });
}
