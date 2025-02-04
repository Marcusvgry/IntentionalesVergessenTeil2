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

    // Hilfsfunktion zum Durchmischen
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

      // Kopie der Wörter
      let wordsToDisplay = trial.string_to_display.slice();
      if (trial.randomized) {
        wordsToDisplay = this.shuffleArray(wordsToDisplay);
      }

      // Zeigt nur die ersten 2 Buchstaben
      function getFirstTwoLetters(word) {
        return word.slice(0, 2);
      }

      // HTML-Layout
      //  - Button und Checkbox sind anfangs "invisible" (visibility: hidden),
      //    damit der Container nicht springt
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
                class="jspsych-input input-field cued-recall-line-input"
              />
            </div>
          </div>
          <form id="cued-recall-form" style="width: 100%;">
            <div class="recall-footer">
              <!-- Checkbox-Container, unsichtbar aber im Layout -->
              <div id="confirmation-checkbox-container" class="invisible-visibility">
                <input type="checkbox" id="confirmation-checkbox" />
                <label for="confirmation-checkbox" style="margin-left: 5px;">
                  Recall wirklich beenden
                </label>
              </div>
              <!-- Fertig-Button, unsichtbar aber im Layout -->
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

      // HTML einsetzen
      display_element.innerHTML = html;

      // Referenzen
      const inputElement = display_element.querySelector("#cued-recall-input");
      const wordElement = display_element.querySelector("#current-word");
      const formElement = display_element.querySelector("#cued-recall-form");
      const checkboxContainer = display_element.querySelector("#confirmation-checkbox-container");
      const confirmationCheckbox = display_element.querySelector("#confirmation-checkbox");
      const submitButton = display_element.querySelector("#cued-recall-submit");

      // Fokus aufs Eingabefeld
      inputElement.focus();

      // 2-Klick-Mechanismus
      let buttonClickedOnce = false;

      // Keydown-Listener: RT ab dem ersten Tastendruck, Enter zum nächsten Wort
      inputElement.addEventListener("keydown", (e) => {
        // RT ab erstem Tastendruck
        if (!firstKeypressTime && e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
          firstKeypressTime = performance.now();
        }

        // Enter -> nächstes Wort (nur, wenn wir nicht beim letzten Wort sind)
        if (e.key === "Enter") {
          e.preventDefault();
          if (currentWordIndex < wordsToDisplay.length - 1) {
            handleWordSubmission();
          }
        }
      });

      // Funktion: Wort + RT speichern, Index erhöhen
      function handleWordSubmission() {
        const value = inputElement.value.trim();
        if (!value) return;

        let rt = 0;
        if (firstKeypressTime) {
          rt = Math.round(firstKeypressTime - lastWordEndTime);
        }
        const currentWord = wordsToDisplay[currentWordIndex];
        responses.push({ antwort: value, rt: rt, wort: currentWord });

        // Nächstes Wort
        currentWordIndex++;
        if (currentWordIndex < wordsToDisplay.length) {
          wordElement.textContent = getFirstTwoLetters(wordsToDisplay[currentWordIndex]);
          lastWordEndTime = performance.now();
          firstKeypressTime = null;
          inputElement.value = "";
          inputElement.focus();
        }

        // Sobald wir JETZT am letzten Wort angekommen sind -> Nur Button sichtbar machen
        if (currentWordIndex === wordsToDisplay.length - 1) {
          makeVisible(submitButton);
          // NICHT: makeVisible(checkboxContainer); -> die Checkbox bleibt erstmal verborgen
        }
      }

      // Klick auf "Fertig"
      formElement.addEventListener("submit", (e) => {
        e.preventDefault();

        // Falls letztes Wort noch nicht abgesendet: jetzt speichern
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

        // 2-Klick-Mechanismus
        if (!buttonClickedOnce) {
          // Erster Klick -> Checkbox sichtbar machen (NICHT vorher)
          makeVisible(checkboxContainer);
          buttonClickedOnce = true;
          return;
        } else {
          // Zweiter Klick -> Beenden, nur wenn Checkbox angehakt
          if (!confirmationCheckbox.checked) {
            return;
          }
          // Trial beenden
          const trialdata = {
            responses: responses,
            randomized_order: wordsToDisplay,
            data: trial.data,
          };
          this.jsPsych.finishTrial(trialdata);
        }
      });

      // Kleine Hilfsfunktion, um 'visibility: hidden' zu entfernen
      function makeVisible(element) {
        element.classList.remove("invisible-visibility");
      }
    }
  }

  CuedRecallPlugin.info = info;
  return CuedRecallPlugin;
})(jsPsychModule);

/* -----------------------------------------
   Inline-CSS für das Plugin (Styling)
   ----------------------------------------- */
const styleCuedRecall = document.createElement("style");
styleCuedRecall.innerHTML = `
  /* Container: Wort + Input in einer Zeile */
  .jspsych-initial-words-container {
    display: inline-flex;     
    align-items: baseline;    
    justify-content: center;  
    margin-top: 10px; 
  }

  /* z.B. "13" */
  .jspsych-initial-words {
    font-size: 20px;
    margin: 0; 
    padding: 0;
    display: inline-block;
  }

  /* Eingabefeld nur mit unterer Linie */
  .cued-recall-line-input {
    border: none;
    border-bottom: 2px solid black;
    background: transparent;
    outline: none;
    font-size: 20px;
    padding: 2px 0;
    margin-left: 0;
    border-radius: 0;
    box-shadow: none;
    width: 120px;     
  }

  /* Container/Panel */
  .survey-container {
    background-color: #f1f1f1;
    padding: 25px 30px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;  
  }

  .prompt-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .jspsych-prompt {
    font-size: 23px; 
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }

  .recall-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end; 
    align-items: center;
    margin-top: 20px;
  }

  /* Unsichtbar, aber belegt Platz => Kasten springt nicht */
  .invisible-visibility {
    visibility: hidden;
  }

  #confirmation-checkbox-container {
    margin-right: 15px;
  }

  .jspsych-btn {
    padding: 12px 25px;
    font-size: 16px;
    background-color: #4caf50; 
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .jspsych-btn:hover {
    background-color: #45a049;
  }
`;
document.head.appendChild(styleCuedRecall);
