var freeRecall = (function (jspsych) {
  "use strict";

  const info = {
    name: "freeRecall",
    version: "1.0.0",
    parameters: {
      prompt: {
        type: jspsych.ParameterType.STRING,
        default: "Bitte geben Sie ein Wort ein und drücken Sie Enter oder klicken Sie auf 'Fertig'.",
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Fertig",
      },
      data: {
        type: jspsych.ParameterType.OBJECT,
        default: {}, // Standardwert für die 'data' Eigenschaft
      }
    },
  };

  class FreeRecallPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      let words = []; // Liste der eingegebenen Wörter
      let reaction_times = []; // Liste der Reaktionszeiten
      let all_responses_free_recall = []; // Array für Wörter und Reaktionszeiten
      let lastTime = performance.now(); // Startzeit des Trials
      let lastEnterTime = null; // Zeitstempel für das letzte Drücken von "Enter"

      // HTML für den Trial
      let html = `
        <div id="jspsych-free-recall">
          <div class="prompt-container">
            <p class="jspsych-prompt">${trial.prompt}</p>
          </div>
          <form id="jspsych-free-recall-form">
            <input type="text" id="free-recall-input" name="response" class="jspsych-input" size="40" autofocus />
            <button type="submit" id="free-recall-submit" class="jspsych-btn">${trial.button_label}</button>
          </form>
        </div>
      `;

      display_element.innerHTML = html;

      const inputElement = document.querySelector("#free-recall-input");

      // Event Listener für "Enter"-Taste
      inputElement.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Verhindert das Absenden des Formulars

          const value = inputElement.value.trim();
          const currentTime = performance.now();

          if (value) {
            const reactionTime = Math.round(currentTime - lastTime); // Reaktionszeit seit der letzten Eingabe
            words.push(value); // Wort zur Liste hinzufügen
            reaction_times.push(reactionTime); // Reaktionszeit zur Liste hinzufügen
            all_responses_free_recall.push({ word: value, reaction_time: reactionTime }); // Hinzufügen zum Array
            inputElement.value = ""; // Eingabefeld leeren
          }

          lastTime = currentTime; // Zeitstempel für das nächste Wort aktualisieren
          lastEnterTime = currentTime; // Zeit des letzten "Enter"-Drückens speichern
        }
      });

      // Event Listener für den "Fertig"-Button
      display_element.querySelector("#jspsych-free-recall-form").addEventListener("submit", (e) => {
        e.preventDefault(); // Verhindert das Standard-Submit-Verhalten

        const value = inputElement.value.trim();
        const currentTime = performance.now();

        if (value) {
          const reactionTime = Math.round(currentTime - lastTime); // Reaktionszeit des letzten Wortes
          words.push(value); // Letztes Wort hinzufügen, falls vorhanden
          reaction_times.push(reactionTime); // Reaktionszeit zur Liste hinzufügen
          all_responses_free_recall.push({ word: value, reaction_time: reactionTime }); // Hinzufügen zum 2D-Array
        }

        // Wenn der Benutzer nie "Enter" gedrückt hat, setzen wir lastEnterTime auf die aktuelle Zeit
        if (lastEnterTime === null) {
          lastEnterTime = currentTime;
        }

        // Berechne die Zeit von der letzten "Enter"-Eingabe bis zum "Fertig"-Klick
        const totalTime = Math.round(currentTime - lastEnterTime); // Zeit vom letzten "Enter"-Drücken bis "Fertig"

        // Daten für den Trial speichern
        const trialdata = {
          rt: totalTime, // Zeit vom letzten "Enter"-Drücken bis zum Klick auf "Fertig"
          words: words, // Liste der eingegebenen Wörter
          reaction_times: reaction_times, // Liste der Reaktionszeiten für jedes Wort
          all_responses_free_recall: all_responses_free_recall, // 2D-Array mit Wort und Reaktionszeit
          data: trial.data, // Füge hier das 'data' Feld hinzu
        };

        // Trial beenden und Daten speichern
        this.jsPsych.finishTrial(trialdata);
      });
    }
  }

  FreeRecallPlugin.info = info;
  return FreeRecallPlugin;
})(jsPsychModule);


// Füge die folgenden CSS-Stile hinzu:
const style = document.createElement('style');
style.innerHTML = `
 #jspsych-free-recall {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 90px 10px 90px;
  background-color: #f9f9f9;
  border-radius: 12px; /* 20% größer als 10px */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* etwas größere Box-Schatten */
  max-width: 550px; /* 20% größer als 400px */
  margin: 0 auto;
}

.jspsych-input {
  padding: 12px; /* Größerer Abstand für mehr Platz im Eingabefeld */
  font-size: 20px !important; 
  border-radius: 6px; /* 20% größer als 5px */
  border: 1px solid #ddd;
  width: 30%; 
  max-width: 175px; /* Maximal 300px breit */
  height: 50px; /* Höhe des Eingabefeldes erhöhen */
  margin-bottom: 24px; 
  box-sizing: border-box;
 
}



#jspsych-free-recall-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Volle Breite */
}

.jspsych-btn {
  padding: 12px 24px; 
  font-size: 19.2px; 
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px; 
}

.jspsych-btn:hover {
  background-color: #45a049;
}

.jspsych-btn:active {
  background-color: #388e3c;
}

`;

document.head.appendChild(style);
