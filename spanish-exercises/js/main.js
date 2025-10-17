/**
 * Normalises user answers for comparison.
 * @param {string} value
 * @returns {string}
 */
function normaliseAnswer(value) {
  return value.trim().toLowerCase();
}

/**
 * Returns a list of valid answers from the data-answer attribute.
 * Supports multiple solutions separated by the pipe character.
 * @param {string} dataAnswer
 * @returns {string[]}
 */
function parseValidAnswers(dataAnswer) {
  return dataAnswer
    .split('|')
    .map(part => normaliseAnswer(part))
    .filter(Boolean);
}

/**
 * Checks exercises with text inputs and select dropdowns, with animations.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function checkExercise(exerciseId) {
  const exerciseContainer = document.getElementById(exerciseId);
  if (!exerciseContainer) return;

  const inputs = exerciseContainer.querySelectorAll('input[type="text"], textarea, select');
  const resultContainer = document.getElementById(`result-${exerciseId}`);
  if (!inputs.length || !resultContainer) return;

  let correctCount = 0;
  
  inputs.forEach((input, index) => {
    input.classList.remove('correct', 'incorrect');
    // We add a small delay to each input for a staggered animation effect
    setTimeout(() => {
        const dataAnswer = input.getAttribute('data-answer');
        const userAnswer = normaliseAnswer(input.value);
        const validAnswers = parseValidAnswers(dataAnswer || '');

        if (validAnswers.includes(userAnswer)) {
          input.classList.add('correct');
          correctCount++;
        } else {
          input.classList.add('incorrect');
        }

        // When the last input is animated, show the result
        if (index === inputs.length - 1) {
            const percentage = Math.round((correctCount / inputs.length) * 100);
            resultContainer.textContent = `Resultado: ${percentage}% correcto. (${correctCount} de ${inputs.length})`;
            resultContainer.style.color = percentage === 100 ? 'var(--color-correct)' : 'var(--color-incorrect)';
        }
    }, index * 50); // 50ms delay between each input check
  });
}

/**
 * Reveals the correct answers for the given exercise.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function showAnswers(exerciseId) {
  const exerciseContainer = document.getElementById(exerciseId);
  if (!exerciseContainer) {
    console.warn(`Exercise container with id "${exerciseId}" not found.`);
    return;
  }

  exerciseContainer.dataset.answersShown = 'true';

  const resultContainer = document.getElementById(`result-${exerciseId}`);

  const textInputs = exerciseContainer.querySelectorAll('input[type="text"], textarea');
  textInputs.forEach(input => {
    const dataAnswer = input.getAttribute('data-answer');
    if (!dataAnswer) {
      return;
    }

    const firstAnswer = dataAnswer.split('|')[0].trim();
    input.value = firstAnswer;
    input.classList.remove('incorrect');
    input.classList.add('correct');
  });

  const selectInputs = exerciseContainer.querySelectorAll('select');
  selectInputs.forEach(select => {
    const dataAnswer = select.getAttribute('data-answer');
    if (!dataAnswer) {
      return;
    }

    const firstAnswer = dataAnswer.split('|')[0].trim();
    if (firstAnswer) {
      select.value = firstAnswer;
    }
    select.classList.remove('incorrect');
    select.classList.add('correct');
  });

  const questionRows = exerciseContainer.querySelectorAll('tr[data-answer], .match-item[data-answer]');
  questionRows.forEach(row => {
    const correctAnswer = row.getAttribute('data-answer');
    const radioButtons = row.querySelectorAll('input[type="radio"]');
    const checkboxes = row.querySelectorAll('input[type="checkbox"]');

    if (radioButtons.length) {
      radioButtons.forEach(radio => {
        radio.checked = radio.value === correctAnswer;
      });
      row.classList.remove('incorrect');
      row.classList.add('correct');
    }

    if (checkboxes.length) {
      checkboxes.forEach(box => {
        box.checked = box.value === correctAnswer;
      });
      row.classList.remove('incorrect');
      row.classList.add('correct');
    }
  });

  const wordGroupCheckboxes = exerciseContainer.querySelectorAll('.word-group input[type="checkbox"]');
  wordGroupCheckboxes.forEach(checkbox => {
    const parentGroup = checkbox.closest('.word-group');
    if (checkbox.hasAttribute('data-answer')) {
      checkbox.checked = true;
      if (parentGroup) {
        parentGroup.classList.remove('incorrect');
        parentGroup.classList.add('correct');
      }
    } else {
      checkbox.checked = false;
      if (parentGroup) {
        parentGroup.classList.remove('correct', 'incorrect');
      }
    }
  });

  if (resultContainer) {
    resultContainer.textContent = 'Respuestas mostradas. ¡Repasa y vuelve a intentarlo cuando quieras!';
    resultContainer.style.color = '#6b4b2b';
  }

  const checkButton = exerciseContainer.querySelector('[data-role="check"]');
  if (checkButton) {
    checkButton.disabled = true;
  }
}

/**
 * Clears all answers and resets the exercise state with a fade-out animation.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function clearExercise(exerciseId) {
    const exerciseContainer = document.getElementById(exerciseId);
    if (!exerciseContainer) return;

    // Add a class to trigger the fade-out animation
    exerciseContainer.classList.add('clearing');

    setTimeout(() => {
        // Perform the reset after the animation
        delete exerciseContainer.dataset.answersShown;

        const resultContainer = document.getElementById(`result-${exerciseId}`);
        if (resultContainer) resultContainer.textContent = '';

        const inputs = exerciseContainer.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.remove('correct', 'incorrect');
            if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea') {
                input.value = '';
            } else if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = false;
            } else if (input.tagName.toLowerCase() === 'select') {
                input.selectedIndex = 0;
            }
        });

        // Re-enable the check button
        const checkButton = exerciseContainer.querySelector('[data-role="check"]');
        if (checkButton) checkButton.disabled = false;

        // Remove the animation class so it can be re-triggered
        exerciseContainer.classList.remove('clearing');
    }, 300); // Match this with the CSS animation duration
}

/**
 * Stores the initial values of inputs and selects for later resets.
 */
function cacheInitialValues() {
  const exercises = document.querySelectorAll('.exercise');
  exercises.forEach(exercise => {
    const textInputs = exercise.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
      if (!input.hasAttribute('data-initial-value')) {
        input.setAttribute('data-initial-value', input.value);
      }
    });

    const selectInputs = exercise.querySelectorAll('select');
    selectInputs.forEach(select => {
      if (!select.hasAttribute('data-initial-value')) {
        select.setAttribute('data-initial-value', select.value);
      }
    });

    const choiceInputs = exercise.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    choiceInputs.forEach(input => {
      if (!input.hasAttribute('data-initial-checked')) {
        input.setAttribute('data-initial-checked', input.checked ? 'true' : 'false');
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cacheInitialValues);
} else {
  cacheInitialValues();
}

/**
 * Checks exercises with radio buttons where the answer is on the parent container.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function checkRadioExercise(exerciseId) {
  const exerciseContainer = document.getElementById(exerciseId);
  if (!exerciseContainer) {
    console.warn(`Exercise container with id "${exerciseId}" not found.`);
    return;
  }

  if (exerciseContainer.dataset.answersShown === 'true') {
    const resultContainer = document.getElementById(`result-${exerciseId}`);
    if (resultContainer) {
      resultContainer.textContent = 'Por favor, borra tus respuestas antes de intentar corregir de nuevo.';
      resultContainer.style.color = '#e67e22';
    }
    return;
  }

  const questions = exerciseContainer.querySelectorAll('tr[data-answer], .match-item[data-answer]');
  const resultContainer = document.getElementById(`result-${exerciseId}`);

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
  if (!exerciseContainer) {
    console.warn(`Exercise container with id "${exerciseId}" not found.`);
    return;
  }

  if (exerciseContainer.dataset.answersShown === 'true') {
    const resultContainer = document.getElementById(`result-${exerciseId}`);
    if (resultContainer) {
      resultContainer.textContent = 'Por favor, borra tus respuestas antes de intentar corregir de nuevo.';
      resultContainer.style.color = '#e67e22';
    }
    return;
  }

  const questions = exerciseContainer.querySelectorAll('tr[data-answer]');
  const resultContainer = document.getElementById(`result-${exerciseId}`);

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

  if (exerciseContainer.dataset.answersShown === 'true') {
    const resultContainer = document.getElementById(`result-${exerciseId}`);
    if (resultContainer) {
      resultContainer.textContent = 'Por favor, borra tus respuestas antes de intentar corregir de nuevo.';
      resultContainer.style.color = '#e67e22';
    }
    return;
  }

  const wordGroups = exerciseContainer.querySelectorAll('.word-group');
  const resultContainer = document.getElementById(`result-${exerciseId}`);

  if (!wordGroups.length || !resultContainer) {
    console.error('Could not find word groups or result container for', exerciseId);
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
  resultContainer.style.color = percentage === 100 ? '#2ecc71' : '#e74c3c';
}

/**
 * Runs through all exercises and checks them.
 */
function checkAllExercises() {
  const exerciseContainers = document.querySelectorAll('.exercise');
  exerciseContainers.forEach(container => {
    if (container.id) {
      checkExercise(container.id);
    }
  });
}

/**
 * Sets up the Unidad 1 card navigation if present on the page.
 */
function initUnitNavigation() {
  const track = document.querySelector('.exercise-track');
  const cards = track ? Array.from(track.querySelectorAll('.exercise-card')) : [];
  if (!track || !cards.length) {
    return;
  }

  const carousel = document.querySelector('.exercise-carousel');
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');
  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const indexToggle = document.querySelector('.index-toggle');
  const indexPanel = document.getElementById('exercise-index');
  const indexClose = document.querySelector('.index-close');
  const indexButtons = indexPanel ? Array.from(indexPanel.querySelectorAll('button[data-target]')) : [];

  let currentIndex = 0;

  const focusActiveTab = () => {
    const activeTab = tabButtons[currentIndex];
    if (activeTab) {
      activeTab.focus({ preventScroll: true });
    }
  };

  const toggleIndexPanel = (show) => {
    if (!indexPanel || !indexToggle) {
      return;
    }
    const shouldShow = typeof show === 'boolean' ? show : indexPanel.getAttribute('aria-hidden') === 'true';
    indexPanel.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    indexToggle.setAttribute('aria-expanded', shouldShow ? 'true' : 'false');
    indexPanel.classList.toggle('is-open', shouldShow);
    if (!shouldShow && indexToggle) {
      indexToggle.focus({ preventScroll: true });
    }
  };

  const closeIndexPanel = () => toggleIndexPanel(false);

  const updateControls = () => {
    const activeExercise = cards[currentIndex];
    cards.forEach((card, idx) => {
      card.classList.toggle('active', idx === currentIndex);
    });

    if (carousel && activeExercise) {
      carousel.setAttribute('data-active', activeExercise.dataset.exercise || '');
    }

    tabButtons.forEach((button, idx) => {
      const isActive = idx === currentIndex;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    indexButtons.forEach(button => {
      const target = button.getAttribute('data-target');
      const isActive = activeExercise && target === activeExercise.dataset.exercise;
      button.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    if (prevButton) {
      prevButton.disabled = currentIndex === 0;
    }
    if (nextButton) {
      nextButton.disabled = currentIndex === cards.length - 1;
    }
  };

  const showExercise = (index) => {
    if (index < 0 || index >= cards.length) {
      return;
    }
    currentIndex = index;
    updateControls();
  };

  const showExerciseByNumber = (exerciseNumber) => {
    const targetIndex = cards.findIndex(card => card.dataset.exercise === exerciseNumber);
    if (targetIndex !== -1) {
      showExercise(targetIndex);
    }
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      showExercise(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      showExercise(currentIndex + 1);
    });
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showExercise(index);
    });
  });

  indexButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-target');
      showExerciseByNumber(target);
      closeIndexPanel();
      focusActiveTab();
    });
  });

  if (indexToggle) {
    indexToggle.addEventListener('click', () => {
      const isHidden = indexPanel && indexPanel.getAttribute('aria-hidden') === 'true';
      toggleIndexPanel(isHidden);
      if (isHidden && indexPanel) {
        indexPanel.querySelector('button[data-target]')?.focus();
      }
    });
  }

  if (indexClose) {
    indexClose.addEventListener('click', closeIndexPanel);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && indexPanel && indexPanel.classList.contains('is-open')) {
      closeIndexPanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }

    const target = event.target;
    const tagName = target && target.tagName ? target.tagName.toLowerCase() : '';
    const isFormField = tagName === 'input' || tagName === 'textarea' || tagName === 'select' || (target && target.isContentEditable);

    if (isFormField || (indexPanel && indexPanel.classList.contains('is-open'))) {
      return;
    }

    if (event.key === 'ArrowRight') {
      showExercise(Math.min(cards.length - 1, currentIndex + 1));
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      showExercise(Math.max(0, currentIndex - 1));
      event.preventDefault();
    }
  });

  // Initialise the first exercise as active.
  updateControls();
  showExercise(0);
}

// Initialise behaviours once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled');
  initUnitNavigation();
});

// Export functions for inline event handlers.
window.checkExercise = checkExercise;
window.checkRadioExercise = checkRadioExercise;
window.checkCheckboxExercise = checkCheckboxExercise;
window.checkSelectedWords = checkSelectedWords;
window.checkAllExercises = checkAllExercises;

/**
 * Resets an exercise to its initial state.
 * @param {string} exerciseId The ID of the exercise container div.
 */
function resetExercise(exerciseId) {
  const exerciseContainer = document.getElementById(exerciseId);
  if (!exerciseContainer) {
    console.warn(`Exercise container with id "${exerciseId}" not found.`);
    return;
  }

  // Reset all input fields
  const inputs = exerciseContainer.querySelectorAll('input[type="text"], input[type="radio"], input[type="checkbox"], select');
  inputs.forEach(input => {
    input.classList.remove('correct', 'incorrect');
    if (input.type === 'text') {
      input.value = '';
    } else if (input.type === 'radio' || input.type === 'checkbox') {
      input.checked = false;
    } else if (input.tagName.toLowerCase() === 'select') {
      input.selectedIndex = 0;
    }
  });

  // Reset parent containers for radio/checkbox exercises
  const itemContainers = exerciseContainer.querySelectorAll('tr[data-answer], .word-group');
  itemContainers.forEach(container => {
    container.classList.remove('correct', 'incorrect');
  });

  // Clear the result message
  const resultContainer = document.getElementById(`result-${exerciseId}`);
  if (resultContainer) {
    resultContainer.textContent = '';
  }
}

// Add the new function to the window object to make it accessible from HTML
window.resetExercise = resetExercise;

