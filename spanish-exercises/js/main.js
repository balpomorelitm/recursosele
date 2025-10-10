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
