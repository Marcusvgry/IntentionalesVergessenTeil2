// Erste Instruktionen
const CBC_VPNNummer = {
  type: jsPsychSurveyHtmlForm,
  preamble: ``,
  html: `
    <div class="survey-container">
    <p>Probandennummer</p>
    <input type="number" id="Probandennummer" name="Probandennummer" required class="input-field"/>

    <p> Heutiges Datum</p>
    <input type="date" id="Heutiges-Datum" name="Heutiges-Datum" required class="input-field"/>

    <p> Name der Messperson</p>
    <input type="text" id="Name-der-Messperson" name="Name-der-Messperson" required class="input-field"/>

    <p>Wortliste Lernen</p>
    <div class="condition-radio">
  <input type="radio" id="Wortliste1" name="Wortliste" value="1" required class="condition-radio-input"/>
  <label for="Wortliste1" class="condition-label">1</label>

  <input type="radio" id="Wortliste2" name="Wortliste" value="2" required class="condition-radio-input"/>
  <label for="Wortliste2" class="condition-label">2</label>
</div>

  <p>Erinnert + Reaktiviert</p>
  <select name="Erinnert + Reaktiviert" id="Erinnert + Reaktiviert" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
    <option value="5">Sound 5</option>
  </select>

  <p>Vergessen + Reaktiviert</p>
  <select name="Vergessen + Reaktiviert" id="Vergessen + Reaktiviert" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
    <option value="5">Sound 5</option>
  </select>

  <p>Erinnert + Nicht-Reaktiviert</p>
  <select name="Erinnert + Nicht-Reaktiviert" id="Erinnert + Nicht-Reaktiviert" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
    <option value="5">Sound 5</option>
  </select>

  <p>Vergessen + Nicht-Reaktiviert</p>
  <select name="Vergessen + Nicht-Reaktiviert" id="Vergessen + Nicht-Reaktiviert" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
    <option value="5">Sound 5</option>
  </select>

  <p>Unasoziierter Ton</p>
  <select name="Unasoziierter Ton" id="Unasoziierter Ton" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
    <option value="5">Sound 5</option>
  </select>

  
</div>
    
`,
  on_finish: function (data) {
    const responses = data.response;
    selected_tmrsound = responses["Erinnert + Reaktiviert"];
    selected_tmfsound = responses["Vergessen + Reaktiviert"];
    selected_rsound = responses["Erinnert + Nicht-Reaktiviert"];
    selected_fsound = responses["Vergessen + Nicht-Reaktiviert"];
    selected_sound5 = responses["Unasoziierter Ton"];
    selectedCondition = responses["Wortliste"];
    settingsDone = true;
  },
};

const instructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <br> Wir werden Sie nun bitten, sich an die Wörter zu erinnern, die Sie gestern Abend gelernt haben</div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Weiter",
  allow_backward: false,
};

const instructions2 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p> Der Gedächtnistest wird so ähnlich ablaufen wie der Gedächtnistest, den Sie bereits im Übungsdurchgang gestern Abend absolviert haben. </p>
        <p>Im Folgenden werden Ihnen wieder eine Reihe von Wörtern präsentiert. Zunächst einmal bitten wir Sie, alle Wörter die Sie so viele der gelernten Wörter, frei aus dem Gedächtnis abzurufen. </p>
        <p>WICHTIG: Anders als in den Übungsdurchgängen möchten wir Sie diesmal bitten ALLE Wörter einzugeben, an die Sie sich noch erinnern. Dieser Test ist also unabhängig davon, ob dem Wort in der Lernphase ein EEE oder ein VVV gefolgt war</p>
        <p> Bitte schreiben Sie also auch die Wörter auf, die Sie vergessen sollten. </p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Gedächtnistest beginnen",
  allow_backward: false,
};

const Instructions_Teil3 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        In der vorherigen Lernphase hatten wir Ihnen 32 Wörter präsentiert, die Sie erinnern oder vergessen sollten. <br>
        Wir zeigen Ihnen von diesen Wörtern jetzt jeweils die ersten beiden Buchstaben und möchten Sie bitten, 
        das Wort dann entsprechend zu vervollständigen. <br> Auch hier ist es nicht relevant, ob das Wort erinnert
         oder vergessen werden sollte. <br> Es gilt außerdem wieder, auch wenn sie das Wort eben schon korrekt erinnert haben, soll
         Sie es trotzdem noch einmal in diesem Test vervollständigen</div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Vervollständigungsaufgabe beginnen",
  allow_backward: false,
};
