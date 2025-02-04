var cuedRecall = (function (jspsych) {
  "use strict";

  const info = {
    name: "cuedRecall",
    version: "1.1.0",
    parameters: {
      prompt: {
        type: jspsych.ParameterType.STRING,
        default: "Bitte geben Sie ein Wort ein und drücken Sie Enter.",
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Fertig",
      },
      data: {
        type: jspsych.ParameterType.OBJECT,
        default: {},
      },
      string_to_display: {
        type: jspsych.ParameterType.ARRAY,
        default: [],
      },
      randomized: {
        type: jspsych.ParameterType.BOOL,
        default: true,
      },
    },
  };

  class CuedRecallPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    // Hilfsfunktion zum Durchmischen des Arrays
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    trial(display_element, trial) {
      // Variablen
      let responses = []; // Liste: { antwort, rt, wort }
      let lastWordEndTime = performance.now();
      let firstKeypressTime = null;
      let currentWordIndex = 0;

      // Kopie der Wörter anlegen
      let wordsToDisplay = trial.string_to_display.slice();
      if (trial.randomized) {
        wordsToDisplay = this.shuffleArray(wordsToDisplay);
      }

      // Nur die ersten 2 Buchstaben anzeigen
      function getFirstTwoLetters(word) {
        return word.slice(0, 2);
      }

      // HTML-Aufbau
      let html = `
        <div id="jspsych-cued-recall" class="survey-container">
          <div class="prompt-container">
            <p class="jspsych-prompt">${trial.prompt}</p>
            <div class="jspsych-initial-words-container">
              <p class="jspsych-initial-words" id="current-word">
                ${getFirstTwoLetters(wordsToDisplay[currentWordIndex])}
              </p>
              <input
                type="text"
                id="cued-recall-input"
                name="response"
                class="jspsych-input input-field"
                size="10"
              />
            </div>
          </div>
          <form id="cued-recall-form" style="width: 100%;">
            <div class="recall-footer">
              <!-- Checkbox-Container -->
              <div id="confirmation-checkbox-container">
                <input type="checkbox" id="confirmation-checkbox" />
                <label for="confirmation-checkbox" style="margin-left: 5px;">
                  Recall wirklich beenden
                </label>
              </div>
              <!-- Fertig-Button -->
              <button
                type="submit"
                id="cued-recall-submit"
                class="jspsych-btn"
              >
                ${trial.button_label}
              </button>
            </div>
          </form>
        </div>
      `;

      display_element.innerHTML = html;

      const inputElement = display_element.querySelector("#cued-recall-input");
      const wordElement = display_element.querySelector("#current-word");
      const formElement = display_element.querySelector("#cued-recall-form");
      const submitButton = display_element.querySelector("#cued-recall-submit");
      const checkboxContainer = display_element.querySelector("#confirmation-checkbox-container");
      const confirmationCheckbox = display_element.querySelector("#confirmation-checkbox");

      // Anfangs Checkbox unsichtbar:
      checkboxContainer.style.display = "none";

      let buttonClickedOnce = false;

      // Fokus auf das Eingabefeld
      inputElement.focus();

      // Keydown-Listener für erstes Tastenanschlagen
      inputElement.addEventListener("keydown", (e) => {
        if (!firstKeypressTime && e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
          firstKeypressTime = performance.now();
        }
        // ENTER -> Wort abspeichern und weitermachen
        if (e.key === "Enter") {
          e.preventDefault();
          handleWordSubmission();
        }
      });

      // Funktion: Wort speichern, Index erhöhen
      function handleWordSubmission() {
        const value = inputElement.value.trim();
        if (!value) {
          // wenn nichts eingetippt -> abbrechen
          return;
        }
        const currentTime = performance.now();
        let rt = 0;
        if (firstKeypressTime) {
          rt = Math.round(firstKeypressTime - lastWordEndTime);
        }
        const currentWord = wordsToDisplay[currentWordIndex];

        // Speichere
        responses.push({ antwort: value, rt: rt, wort: currentWord });

        // Nächstes Wort
        currentWordIndex++;
        if (currentWordIndex < wordsToDisplay.length) {
          wordElement.textContent = getFirstTwoLetters(wordsToDisplay[currentWordIndex]);
        }

        // Zeit neu setzen
        lastWordEndTime = performance.now();
        firstKeypressTime = null;
        inputElement.value = "";

        // Ist das jetzt schon das letzte Wort?
        if (currentWordIndex === wordsToDisplay.length) {
          // Alle "Cue-Wörter" sind durch -> wir zeigen den Button, Checkbox
          checkboxContainer.style.display = "flex";
        }
      }

      // Form-Submit (Klick auf "Fertig")
      formElement.addEventListener("submit", (e) => {
        e.preventDefault();

        // Falls noch etwas im Input steht -> letztes Wort abspeichern
        if (inputElement.value.trim()) {
          handleWordSubmission();
        }

        // Logik: Button-Click -> zuerst Checkbox anzeigen, dann Abfrage
        if (!buttonClickedOnce) {
          // Zeige Checkbox (falls sie noch nicht sichtbar ist)
          checkboxContainer.style.display = "flex";
          buttonClickedOnce = true;
          return;
        } else {
          // Jetzt prüfen wir, ob die Checkbox angehakt ist
          if (!confirmationCheckbox.checked) {
            alert("Bitte bestätigen Sie erst, dass Sie den Recall beenden möchten.");
            return;
          }
          // Checkbox ist angehakt: Trial beenden
          const trialdata = {
            responses: responses,
            randomized_order: wordsToDisplay,
            data: trial.data,
          };
          this.jsPsych.finishTrial(trialdata);
        }
      });
    }
  }

  CuedRecallPlugin.info = info;
  return CuedRecallPlugin;
})(jsPsychModule);
