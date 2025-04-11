var cuedRecall = (function (jspsych) {
  "use strict";

  const info = {
    name: "cuedRecall",
    version: "1.2.3",
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

    // Hilfsfunktion zum Durchmischen eines Arrays
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    trial(display_element, trial) {
      // Variablen für die Eingaben
      let responses = []; // Liste mit { antwort, rt, wort }
      let lastWordEndTime = performance.now();
      let firstKeypressTime = null;
      let currentWordIndex = 0;

      // Kopie der Wörter (optional randomisiert)
      let wordsToDisplay = trial.string_to_display.slice();
      if (trial.randomized) {
        wordsToDisplay = this.shuffleArray(wordsToDisplay);
      }

      // Funktion: Zeigt nur die ersten 2 Buchstaben eines Wortes
      function getFirstTwoLetters(word) {
        return word.slice(0, 2);
      }

      // HTML-Layout:
      // - Verwendung der globalen Klasse "survey-container" (für den grauen Kasten)
      // - Aneinanderreihung von <p> (Initial-Buchstaben) und <input> ohne Leerzeichen/Zeilenumbrüche,
      //   damit der getippte Text nahtlos an die vorangestellten Buchstaben anschließt.
      let html = `
        <div id="jspsych-cued-recall" class="survey-container">
          <div class="prompt-container">
            <p class="jspsych-prompt">${trial.prompt}</p>
            <div class="jspsych-initial-words-container">
              <p class="jspsych-initial-words" id="current-word">${getFirstTwoLetters(wordsToDisplay[currentWordIndex])}</p><input
                type="text"
                id="cued-recall-input"
                name="response"
                class="jspsych-input cued-recall-line-input"
              />
            </div>
          </div>
          <form id="cued-recall-form" style="width: 100%;">
            <div class="recall-footer">
              <!-- Checkbox-Container, zunächst unsichtbar -->
              <div id="confirmation-checkbox-container" class="invisible-visibility">
                <input type="checkbox" id="confirmation-checkbox" />
                <label for="confirmation-checkbox" style="margin-left: 5px;">
                  Recall wirklich beenden
                </label>
              </div>
              <!-- Fertig-Button, zunächst unsichtbar -->
              <button
                type="submit"
                id="cued-recall-submit"
                class="jspsych-btn invisible-visibility"
              >
                ${trial.button_label}
              </button>
            </div>
          </form>
        </div>
      `;

      // HTML in das Display-Element einsetzen
      display_element.innerHTML = html;

      // Referenzen zu den Elementen
      const inputElement = display_element.querySelector("#cued-recall-input");
      const wordElement = display_element.querySelector("#current-word");
      const formElement = display_element.querySelector("#cued-recall-form");
      const checkboxContainer = display_element.querySelector("#confirmation-checkbox-container");
      const confirmationCheckbox = display_element.querySelector("#confirmation-checkbox");
      const submitButton = display_element.querySelector("#cued-recall-submit");

      // Eingabefeld fokussieren
      inputElement.focus();

      // 2-Klick-Mechanismus: Zuerst erscheint die Checkbox, anschließend erfolgt der Trialabschluss
      let buttonClickedOnce = false;

      // Keydown-Listener: Erfassung der Reaktionszeit ab dem ersten Tastendruck und
      // bei Enter zum Wechseln zum nächsten Wort
      inputElement.addEventListener("keydown", (e) => {
        if (!firstKeypressTime && e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
          firstKeypressTime = performance.now();
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (currentWordIndex < wordsToDisplay.length - 1) {
            handleWordSubmission();
          }
        }
      });

      // Funktion: Aktuelles Wort mitsamt RT speichern und zum nächsten Wort wechseln
      function handleWordSubmission() {
        const value = inputElement.value.trim();
        if (!value) return;

        let rt = 0;
        if (firstKeypressTime) {
          rt = Math.round(firstKeypressTime - lastWordEndTime);
        }
        const currentWord = wordsToDisplay[currentWordIndex];
        responses.push({ antwort: value, rt: rt, wort: currentWord });

        // Zum nächsten Wort wechseln
        currentWordIndex++;
        if (currentWordIndex < wordsToDisplay.length) {
          wordElement.textContent = getFirstTwoLetters(wordsToDisplay[currentWordIndex]);
          lastWordEndTime = performance.now();
          firstKeypressTime = null;
          inputElement.value = "";
          inputElement.focus();
        }

        // Erscheinen des "Fertig"-Buttons beim letzten Wort
        if (currentWordIndex === wordsToDisplay.length - 1) {
          makeVisible(submitButton);
        }
      }

      // Formular-Submit: Beim Klick auf "Fertig"
      formElement.addEventListener("submit", (e) => {
        e.preventDefault();

        // Beim letzten Wort evtl. noch Eingabe speichern
        if (currentWordIndex === wordsToDisplay.length - 1) {
          const value = inputElement.value.trim();
          if (value) {
            let rt = 0;
            if (firstKeypressTime) {
              rt = Math.round(firstKeypressTime - lastWordEndTime);
            }
            const currentWord = wordsToDisplay[currentWordIndex];
            responses.push({ antwort: value, rt: rt, wort: currentWord });
          }
        }

        // 2-Klick-Mechanismus: Erst Checkbox anzeigen, dann mit bestätigt beenden
        if (!buttonClickedOnce) {
          makeVisible(checkboxContainer);
          buttonClickedOnce = true;
          return;
        } else {
          if (!confirmationCheckbox.checked) {
            return;
          }
          const trialdata = {
            responses: responses,
            randomized_order: wordsToDisplay,
            data: trial.data,
          };
          this.jsPsych.finishTrial(trialdata);
        }
      });

      // Hilfsfunktion: Entfernt die Klasse, die das Element unsichtbar macht
      function makeVisible(element) {
        element.classList.remove("invisible-visibility");
      }
    }
  }

  CuedRecallPlugin.info = info;
  return CuedRecallPlugin;
})(jsPsychModule);

/* -----------------------------------------
   PLUGIN-SPEZIFISCHES CSS (inklusive Schriftgröße)
----------------------------------------- */
const styleCuedRecall = document.createElement("style");
styleCuedRecall.innerHTML = `
  /* Unsichtbar, aber belegt Platz */
  .invisible-visibility {
    visibility: hidden;
  }

  /* Container für Wort + Input in einer Zeile */
  .jspsych-initial-words-container {
    display: inline-flex;
    align-items: baseline;
    justify-content: center;
    margin-top: 10px;
  }

  /* Gleiche Font-Einstellungen für vorangestellte Buchstaben und Eingabefeld */
  .jspsych-initial-words,
  .cued-recall-line-input {
    font-size: 24px !important;   /* Wunschgröße – anpassbar */
    line-height: 1.2 !important;
    font-family: inherit !important;
    font-weight: normal !important;
  }

  /* Darstellung der vorangestellten Buchstaben */
  .jspsych-initial-words {
    margin: 0;
    padding: 0;
    display: inline-block;
    vertical-align: baseline;
  }

  /* Eingabefeld: Nahtlos, nur untere Linie sichtbar */
  .cued-recall-line-input {
    border: none;
    border-bottom: 2px solid black;
    background: transparent;
    outline: none;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
    width: auto;
    line-height: 1;
    box-sizing: content-box;
  }

  /* Footer-Bereich: Zentriert Checkbox und Button */
  .recall-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
  }
`;
document.head.appendChild(styleCuedRecall);
