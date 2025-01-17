var cuedRecall = (function (jspsych) {
    "use strict";
  
    const info = {
      name: "cuedRecall",
      version: "1.0.2",
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
        },
        string_to_display: {
          type: jspsych.ParameterType.ARRAY,
          default: [], // Array von Wörtern, die angezeigt werden sollen
        },
        randomized: {
          type: jspsych.ParameterType.BOOL,
          default: true, // Standardmäßig die Reihenfolge der Wörter randomisieren
        },
      },
    };
  
    class CuedRecallPlugin {
      constructor(jsPsych) {
        this.jsPsych = jsPsych;
      }
  
      // Funktion zum Mischen eines Arrays
      shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
  
      trial(display_element, trial) {
        let responses = []; // Liste für {antwort, rt, wort}
        let alle_antworten = []; // Liste für alle Antworten
        let alle_reaktionszeiten = []; // Liste für alle Reaktionszeiten
        let alle_woerter = []; // Liste für alle zufälligen Wörter
      
        let lastTime = performance.now(); // Startzeit des Trials
        let currentWordIndex = 0; // Index des aktuell angezeigten Wortes
      
        // Falls randomized aktiviert ist, mische die Reihenfolge der Wörter
        let wordsToDisplay = trial.string_to_display.slice(); // Kopiere das Array
        if (trial.randomized) {
          wordsToDisplay = this.shuffleArray(wordsToDisplay);
        }
      
        // Funktion, um nur die ersten zwei Buchstaben eines Wortes zu extrahieren
        const getFirstTwoLetters = (word) => {
          return word.slice(0, 2); // Extrahiert die ersten zwei Buchstaben
        };
      
        // HTML für den Trial
        // HTML für den Trial
let html = `
<div class="cued_recall_container_design">
  <div id="jspsych-cued-recall">
      <div class="prompt-container">
          <p class="jspsych-prompt">${trial.prompt}</p>
          <div class="jspsych-initial-words-container">
              <p class="jspsych-initial-words" id="current-word">${getFirstTwoLetters(wordsToDisplay[currentWordIndex])}</p>
              <input type="text" id="cued-recall-input" name="response" class="jspsych-input" size="10" />
          </div>
      </div>
      <button type="button" id="cued-recall-submit" class="jspsych-btn">${trial.button_label}</button>
  </div>
</div>
`;

display_element.innerHTML = html;

const inputElement = document.querySelector("#cued-recall-input");
const wordElement = document.querySelector("#current-word");
const submitButton = document.querySelector("#cued-recall-submit");

// Button unsichtbar setzen, aber Platz reservieren
submitButton.classList.remove("visible");

// Autofocus setzen, nachdem der Inhalt geladen wurde
inputElement.focus();

// Event Listener für "Enter"-Taste
inputElement.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Verhindert das Absenden des Formulars

    const value = inputElement.value.trim();
    const currentTime = performance.now();

    if (currentWordIndex === wordsToDisplay.length - 1) {
      // Wenn wir beim letzten Wort sind, deaktiviere die Enter-Taste
      return; // Beendet die Funktion
    }

    if (value) {
      const reactionTime = Math.round(currentTime - lastTime);
      const currentWord = wordsToDisplay[currentWordIndex];

      // Speichere die Antwort, Reaktionszeit und das Wort
      responses.push({ antwort: value, rt: reactionTime, wort: currentWord });
      alle_antworten.push(value); // Antwort zur Liste hinzufügen
      alle_reaktionszeiten.push(reactionTime); // Reaktionszeit hinzufügen
      alle_woerter.push(currentWord); // Wort hinzufügen

      inputElement.value = ""; // Eingabefeld leeren

      // Zeige das nächste Wort aus dem Array an (nur die ersten zwei Buchstaben)
      currentWordIndex++;
      if (currentWordIndex < wordsToDisplay.length) {
        wordElement.textContent = getFirstTwoLetters(wordsToDisplay[currentWordIndex]);
      }

      // Zeige den "Fertig"-Button, wenn das letzte Wort angezeigt wird
      if (currentWordIndex === wordsToDisplay.length - 1) {
        submitButton.classList.add("visible"); // Mache den Button sichtbar
      }
    }

    lastTime = currentTime; // Zeitstempel für das nächste Wort aktualisieren
  }
});

      
        // Event Listener für den "Fertig"-Button
        submitButton.addEventListener("click", (e) => {
          const value = inputElement.value.trim();
          const currentTime = performance.now();
      
          if (value) {
            const reactionTime = Math.round(currentTime - lastTime);
            const currentWord = wordsToDisplay[currentWordIndex];
      
            // Letzte Antwort speichern, falls vorhanden
            responses.push({ antwort: value, rt: reactionTime, wort: currentWord });
            alle_antworten.push(value);
            alle_reaktionszeiten.push(reactionTime);
            alle_woerter.push(currentWord);
          }
      
          // Daten für den Trial speichern
          const trialdata = {
            responses: responses, // Liste mit {antwort, rt, wort}
            alle_antworten: alle_antworten, // Alle Antworten
            alle_reaktionszeiten: alle_reaktionszeiten, // Alle Reaktionszeiten
            alle_woerter: alle_woerter, // Alle Wörter
            randomized_order: wordsToDisplay, // Speichere die zufällige Reihenfolge
            data: trial.data, // Füge hier das 'data' Feld hinzu
          };
      
          // Trial beenden und Daten speichern
          this.jsPsych.finishTrial(trialdata);
        });
      }
      
   

    }
  
    CuedRecallPlugin.info = info;
    return CuedRecallPlugin;
  })(jsPsychModule);
  
  // CSS-Stile direkt am Ende des Plugins eingefügt
  const styleCuedRecall = document.createElement('style');
  styleCuedRecall.innerHTML = `
    /* Container für den Prompt und das Eingabefeld */
    #jspsych-cued-recall .prompt-container {
        display: flex;
        flex-direction: column; /* Der Prompt ist oben und das Eingabefeld darunter */
        align-items: center; /* Zentriert alle Elemente horizontal */
        margin-top: 30px
    }
  
    /* Flexbox für die Buchstaben und das Eingabefeld auf einer Zeile */
    #jspsych-cued-recall .jspsych-initial-words-container {
        display: flex;
        align-items: center;  /* Elemente (Buchstaben und Eingabefeld) in der Mitte ausrichten */
        justify-content: center; /* Zentriert die Elemente auch horizontal */
        margin-top: -15px; /* Fügt etwas Abstand zum Prompt hinzu */
    }
  
    /* Stellt die Anfangsbuchstaben als Text dar */
    #jspsych-cued-recall .jspsych-initial-words {
        margin-right: 0px; /* Platz zwischen den Buchstaben und dem Eingabefeld */
        font-size: 20px; /* Größere Schrift für die ersten Buchstaben */
    }
  
    /* Eingabefeld als langen Unterstrich darstellen */
    /* Button wird ordentlich dargestellt */
    #jspsych-cued-recall .jspsych-btn {
        margin-top: 20px;
    }
  
    #cued-recall-input {
        border: 0; /* Entfernt alle Ränder */
        border-bottom: 1px solid black; /* Fügt nur eine untere Linie hinzu */
        border-radius: 0; /* Entfernt abgerundete Ecken */
        box-shadow: none; /* Entfernt Schatten */
        background-color: #ffffff; /* Optional: Entfernt farbliche Hintergründe */
        text-align: left; /* Zentriert den Text */
        font-size: 20px; /* Schriftgröße */
        height: 25px; /* Höhe des Eingabefelds */
        padding: 0; !important /* Keine Innenabstände */
        line-height: 1; /* Zeilenhöhe anpassen, damit die Schrift korrekt ausgerichtet ist */
        margin-top: 5px; /* Verschiebt das Feld nach unten, um die Linie korrekt auszurichten */
        vertical-align: bottom; /* Justiert die vertikale Ausrichtung */
        position: relative; /* Ermöglicht zusätzliche Feinanpassungen */
        top: 9.9px; /* Verschiebt die Linie weiter nach unten */
    }
  
    #cued-recall-input:focus {
        outline: none; /* Entfernt die Fokus-Kontur */
        box-shadow: none; /* Entfernt jeglichen Fokus-Schatten */
        border-bottom: 1px solid black; /* Beibehaltung der unteren Linie */
    }

.cued_recall_container_design {
  background-color: #f9f9f9; /* Slightly darker gray tone than the background */
  padding: 10px 90px 10px 90px; /* Pleasant spacing within the container */
  border-radius: 12px; /* Slight rounding of the corners */
  margin: 0 auto; 
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* etwas größere Box-Schatten */
}

/* Sicherstellen, dass der Button immer denselben Platz einnimmt */
#cued-recall-submit {
  visibility: hidden; /* Unsichtbar, aber nimmt Platz im Layout ein */
  display: inline-block; /* Button ist von Anfang an ein Inline-Block */
  margin-top: 20px; /* Genug Platz zum Eingabefeld */
}
#cued-recall-submit.visible {
  visibility: visible; /* Sichtbar machen, wenn der letzte Zustand erreicht ist */
}

  `;
  document.head.appendChild(styleCuedRecall); // Füge das CSS dem Dokument hinzu
  