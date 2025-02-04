var freeRecall = (function (jspsych) {
  "use strict";

  const info = {
    name: "freeRecall",
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
      }
    },
  };

  class FreeRecallPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      // Variablen zur Speicherung
      let words = [];                   // Eingegebene Wörter
      let reaction_times = [];          // Reaktionszeiten pro Wort
      let all_responses_free_recall = []; // Array mit { word, reaction_time }

      // Zeitpunkte
      let lastWordEndTime = performance.now();  // Wann das letzte Wort bestätigt wurde
      let firstKeypressTime = null;             // Wann der Nutzer das erste Mal tippt (für aktuelles Wort)

      // HTML-Layout:
      // .survey-container => dein Haupt-Container (zentriert, mit Rand, etc.)
      // .recall-footer    => sorgt dafür, dass Button + ggf. Checkbox am rechten Rand stehen
      let html = `
        <div id="jspsych-free-recall" class="survey-container">
          <div class="prompt-container">
            <p class="jspsych-prompt">${trial.prompt}</p>
          </div>
          <form id="jspsych-free-recall-form" style="width: 100%;">
            <!-- Eingabefeld ohne size-Attribut -->
            <input
              type="text"
              id="free-recall-input"
              name="response"
              class="jspsych-input input-field"
              autofocus
            />
            <div class="recall-footer">
              <!-- Checkbox-Container (zunächst unsichtbar) -->
              <div id="confirmation-checkbox-container" style="display: none;">
                <input type="checkbox" id="confirmation-checkbox" />
                <label for="confirmation-checkbox" style="margin-left: 5px;">
                  Beenden bestätigen
                </label>
              </div>
              <!-- Fertig-Button -->
              <button
                type="submit"
                id="free-recall-submit"
                class="jspsych-btn"
              >
                ${trial.button_label}
              </button>
            </div>
          </form>
        </div>
      `;

      // Setze das HTML in das Display-Element
      display_element.innerHTML = html;

      // Referenzen auf Input und Button
      const inputElement = display_element.querySelector("#free-recall-input");
      const formElement = display_element.querySelector("#jspsych-free-recall-form");
      const submitButton = display_element.querySelector("#free-recall-submit");
      const checkboxContainer = display_element.querySelector("#confirmation-checkbox-container");
      const confirmationCheckbox = display_element.querySelector("#confirmation-checkbox");

      // Flag, das steuert, ob wir schon einmal geklickt haben
      let buttonClickedOnce = false;

      // 1) Key-Listener für das Input-Feld
      inputElement.addEventListener("keydown", (e) => {
        // Erfassen, wann das erste Zeichen getippt wurde
        // (e.key.length === 1) bedeutet "normales Zeichen"
        if (!firstKeypressTime && e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
          firstKeypressTime = performance.now();
        }

        // Wenn der Benutzer Enter drückt, wird das Wort gespeichert
        if (e.key === "Enter") {
          e.preventDefault(); // Verhindert das Form-Submit

          const value = inputElement.value.trim();
          if (value) {
            // Berechne die Reaktionszeit ab erstem Tastendruck
            let rt = 0;
            if (firstKeypressTime) {
              rt = Math.round(firstKeypressTime - lastWordEndTime);
            }
            words.push(value);
            reaction_times.push(rt);
            all_responses_free_recall.push({ word: value, reaction_time: rt });

            // Reset
            lastWordEndTime = performance.now();
            firstKeypressTime = null;
            inputElement.value = "";
          }
        }
      });

      // 2) "Fertig"-Button: Beim ersten Klick -> Checkbox anzeigen, beim zweiten Klick -> Check Abfrage
      formElement.addEventListener("submit", (e) => {
        e.preventDefault();

        // Falls der Benutzer das letzte Wort eingetippt, aber nicht Enter gedrückt hat
        const value = inputElement.value.trim();
        if (value) {
          let rt = 0;
          if (firstKeypressTime) {
            rt = Math.round(firstKeypressTime - lastWordEndTime);
          }
          words.push(value);
          reaction_times.push(rt);
          all_responses_free_recall.push({ word: value, reaction_time: rt });

          lastWordEndTime = performance.now();
          firstKeypressTime = null;
          inputElement.value = "";
        }

        // Logik für Checkbox
        if (!buttonClickedOnce) {
          // Zeige Checkbox
          checkboxContainer.style.display = "flex"; // oder "inline-flex"
          buttonClickedOnce = true;
          // Der Trial ist aber noch NICHT beendet
          return;
        } else {
          // Zweiter Klick: Prüfen, ob die Checkbox angehakt ist

          // Checkbox ist angehakt => Trial beenden
          const trialdata = {
            words: words,
            reaction_times: reaction_times,
            all_responses_free_recall: all_responses_free_recall,
            data: trial.data,
          };
          this.jsPsych.finishTrial(trialdata);
        }
      });
    }
  }

  FreeRecallPlugin.info = info;
  return FreeRecallPlugin;
})(jsPsychModule);
