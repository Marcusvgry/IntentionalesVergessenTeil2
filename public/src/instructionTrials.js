// Erste Instruktionen
const CBC_VPNNummer = {
  type: jsPsychSurveyHtmlForm,
  preamble: ``,
  html: `
        <div class="survey-container">
    <p>VPN-Nummer</p>
    <input type="number" id="VPN-Nummer" name="VPN-Nummer" required class="input-field"/>

    <p>Wortliste Lernen</p>
    <div class="condition-radio">
  <input type="radio" id="Wortliste1" name="Wortliste" value="1" required class="condition-radio-input"/>
  <label for="Wortliste1" class="condition-label">1</label>

  <input type="radio" id="Wortliste2" name="Wortliste" value="2" required class="condition-radio-input"/>
  <label for="Wortliste2" class="condition-label">2</label>
</div>

  <p>Auswahl sound 1</p>
  <select name="AuswahlSound1" id="AuswahlSound1" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
  </select>

  <p>Auswahl sound 2</p>
  <select name="AuswahlSound2" id="AuswahlSound2" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
  </select>

  <p>Auswahl sound 3</p>
  <select name="AuswahlSound3" id="AuswahlSound3" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
  </select>

  <p>Auswahl sound 4</p>
  <select name="AuswahlSound4" id="AuswahlSound4" required class="condition-select">
    <option value=""  –</option>
    <option value="1">Sound 1</option>
    <option value="2">Sound 2</option>
    <option value="3">Sound 3</option>
    <option value="4">Sound 4</option>
  </select>
</div>
    
`,
  on_finish: function (data) {
    const responses = data.response;
    selected_tmrsound = responses["AuswahlSound1"];
    selected_tmfsound = responses["AuswahlSound2"];
    selected_rsound = responses["AuswahlSound3"];
    selected_fsound = responses["AuswahlSound4"];
    selectedCondition = responses["Wortliste"];
    settingsDone = true;
  },
};

const breakInstructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
          Bitte wenden Sie sich an die Versuchsleitung
      </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Weiter",
  allow_backward: false,
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
        das Wort dann entsprechend zu vervollständigen. <br> Auch hier ist es wiederum nicht relevant ob das Wort erinnert
         oder vergessen werden sollte. <br> Es gilt wiederum, auch wenn sie das Wort eben schon korrekt erinnert haben, sollen 
         Sie es trotzdem noch einmal in diesem Test vervollständigen</div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Vervollständigungsaufgabe beginnen",
  allow_backward: false,
};
