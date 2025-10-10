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

function checkSelectedWords(exerciseId) {
    const exerciseContainer = document.getElementById(exerciseId);
    if (!exerciseContainer) {
        console.warn(`Exercise container with id "${exerciseId}" not found.`);
        return;
    }

    const wordGroups = exerciseContainer.querySelectorAll('.word-group');
    const resultContainer = document.getElementById(`result-${exerciseId}`);

    if (!resultContainer) {
        console.warn(`Result container with id "result-${exerciseId}" not found.`);
        return;
    }

    let correctSelections = 0;
    let expectedSelections = 0;
    let incorrectSelections = 0;

    wordGroups.forEach(group => {
        group.classList.remove('correct', 'incorrect');
        const checkbox = group.querySelector('input[type="checkbox"]');
        if (!checkbox) {
            return;
        }

        const shouldBeChecked = checkbox.hasAttribute('data-answer');
        const isChecked = checkbox.checked;

        if (shouldBeChecked) {
            expectedSelections++;
        }

        if (shouldBeChecked && isChecked) {
            group.classList.add('correct');
            correctSelections++;
        } else if (shouldBeChecked && !isChecked) {
            group.classList.add('incorrect');
            incorrectSelections++;
        } else if (!shouldBeChecked && isChecked) {
            group.classList.add('incorrect');
            incorrectSelections++;
        }
    });

    const totalChecks = expectedSelections + incorrectSelections;
    const percentage = totalChecks > 0 ? Math.round((correctSelections / totalChecks) * 100) : 0;
    resultContainer.textContent = `Resultado: ${percentage}% correcto. (${correctSelections} de ${totalChecks})`;
}

function checkAllExercises() {
    const exerciseContainers = document.querySelectorAll('.exercise');
    exerciseContainers.forEach(container => {
        if (container.id) {
            checkExercise(container.id);
        }
    });
}
