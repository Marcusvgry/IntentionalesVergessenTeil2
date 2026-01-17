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
      },
    },
  };

  class FreeRecallPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      let words = []; // Eingegebene Wörter
      let reaction_times = []; // Reaktionszeiten pro Wort
      let all_responses_free_recall = []; // Array mit { word, reaction_time }

      let lastWordEndTime = performance.now(); // Wann das letzte Wort bestätigt wurde
      let firstKeypressTime = null; // Wann VPNdas erste Mal tippt (für aktuelles Wort)

      let html = `
        <div id="jspsych-free-recall" class="free-recall-layout">
          <div class="survey-container free-recall-box">
          <div class="prompt-container">
            <p class="jspsych-prompt">${trial.prompt}</p>
          </div>
          <form id="jspsych-free-recall-form" class="free-recall-form">
            <!-- Eingabefeld -->
            <input
              type="text"
              id="free-recall-input"
              name="response"
              class="jspsych-input input-field free-recall-input"
              autofocus
            />
            <div class="recall-footer">
              <!-- Checkbox-Container -->
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
          <div id="free-recall-word-list" class="free-recall-word-list" aria-live="polite"></div>
        </div>
      `;

      display_element.innerHTML = html;
      display_element.classList.add("free-recall-display");

      const boxElement = display_element.querySelector(".free-recall-box");
      const inputElement = display_element.querySelector("#free-recall-input");
      const formElement = display_element.querySelector(
        "#jspsych-free-recall-form"
      );
      const submitButton = display_element.querySelector("#free-recall-submit");
      const checkboxContainer = display_element.querySelector(
        "#confirmation-checkbox-container"
      );
      const confirmationCheckbox = display_element.querySelector(
        "#confirmation-checkbox"
      );
      const wordListElement = display_element.querySelector(
        "#free-recall-word-list"
      );

      const updateListOffset = () => {
        if (!boxElement || !wordListElement) return;
        const boxRect = boxElement.getBoundingClientRect();
        const offset = Math.ceil(boxRect.bottom + 18);
        wordListElement.style.marginTop = `${offset}px`;
      };

      updateListOffset();
      window.addEventListener("resize", updateListOffset);

      let buttonClickedOnce = false;

      const renderWordList = () => {
        wordListElement.innerHTML = "";
        const fragment = document.createDocumentFragment();
        words.forEach((word) => {
          const wordItem = document.createElement("span");
          wordItem.className = "free-recall-word";
          wordItem.textContent = word;
          fragment.appendChild(wordItem);
        });
        wordListElement.appendChild(fragment);
      };

      inputElement.addEventListener("keydown", (e) => {
        if (
          !firstKeypressTime &&
          e.key.length === 1 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          firstKeypressTime = performance.now();
        }

        if (e.key === "Enter") {
          e.preventDefault();

          const value = inputElement.value.trim();
          if (value) {
            let rt = 0;
            if (firstKeypressTime) {
              rt = Math.round(firstKeypressTime - lastWordEndTime);
            }
            words.push(value);
            reaction_times.push(rt);
            all_responses_free_recall.push({ word: value, reaction_time: rt });
            renderWordList();

            lastWordEndTime = performance.now();
            firstKeypressTime = null;
            inputElement.value = "";
          }
        }
      });

      formElement.addEventListener("submit", (e) => {
        e.preventDefault();

        const value = inputElement.value.trim();
        if (value) {
          let rt = 0;
          if (firstKeypressTime) {
            rt = Math.round(firstKeypressTime - lastWordEndTime);
          }
          words.push(value);
          reaction_times.push(rt);
          all_responses_free_recall.push({ word: value, reaction_time: rt });
          renderWordList();

          lastWordEndTime = performance.now();
          firstKeypressTime = null;
          inputElement.value = "";
        }

        if (!buttonClickedOnce) {
          checkboxContainer.style.display = "flex";
          updateListOffset();
          buttonClickedOnce = true;
          return;
        } else {
          if (!confirmationCheckbox.checked) {
            return;
          }
          const trialdata = {
            words: words,
            reaction_times: reaction_times,
            all_responses_free_recall: all_responses_free_recall,
            data: trial.data,
          };
          window.removeEventListener("resize", updateListOffset);
          display_element.classList.remove("free-recall-display");
          this.jsPsych.finishTrial(trialdata);
        }
      });
    }
  }

  FreeRecallPlugin.info = info;
  return FreeRecallPlugin;
})(jsPsychModule);

/* -----------------------------------------
   PLUGIN-SPECIFIC CSS
----------------------------------------- */
const styleFreeRecall = document.createElement("style");
styleFreeRecall.innerHTML = `
  .free-recall-display .jspsych-content-wrapper {
    margin: 0;
    align-items: stretch;
    justify-content: flex-start;
  }

  .free-recall-display .jspsych-content {
    width: 100%;
    margin: 0;
    height: 100%;
  }

  #jspsych-free-recall.free-recall-layout {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 40px;
  }

  #jspsych-free-recall .free-recall-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 360px;
    z-index: 2;
  }

  #jspsych-free-recall .free-recall-form {
    width: 100%;
  }

  #jspsych-free-recall .free-recall-word-list {
    margin-top: 18px;
    width: 90vw;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px 16px;
  }

  #jspsych-free-recall .free-recall-word {
    display: inline-block;
  }
`;
document.head.appendChild(styleFreeRecall);
