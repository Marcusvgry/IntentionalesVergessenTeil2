// const cont_text = "weiter"; // Already defined in texts_demographics_de.js

// PVT timing constants
const lapse_time = 10000; // 10 seconds in milliseconds
const premature_time = 100; // 0.1 seconds in milliseconds

const pvt_start_p1 = `<div class="instructions"> 
    Die nächste Aufgabe testet deine Aufmerksamkeit.  
    Eine <b>Stoppuhr</b> in der Mitte des Bildschirms wird irgendwann beginnen, rasch hochzuzählen. 
    Wenn das passiert, ist es deine Aufgabe, so schnell wie möglich die <b>Leertaste zu drücken. 
    Bitte verwende deine dominante Hand</b> (die Hand, mit der du normalerweise schreibst). 
    Dann stoppt die Uhr, und deine Reaktionszeit wird für einen kurzen Moment angezeigt.
</div>`;

const pvt_start_p2 = `<div class="instructions"> 
    <b>Du musst die Uhr innerhalb von ${
      lapse_time / 1000
    } s stoppen</b>, aber "übermenschliche" 
    Reaktionszeiten unter ${
      premature_time / 1000
    } s zählen ebenfalls als Fehler.<br>
    Aber keine Sorge, wenn du die Leertaste drückst, sobald die Uhr beginnt hochzuzählen, 
    wirst du auf jeden Fall rechtzeitig genug reagieren.<br>
    Du kannst die Aufgabe nun kurz üben.
</div>`;

const pvt_feedback_text = (n_trials, n_lapses, n_prematures, responses_iti) =>
  `Du hast ${n_trials - n_lapses - n_prematures} 
von ${n_trials} Stoppuhren rechtzeitig gestoppt! 
${
  responses_iti > 0
    ? "<br><b>Hinweis:</b> Drücke keine Tasten, solange die Stoppuhr noch nicht hoch zählt!<br>"
    : ""
}
<br><br>`;

const pvt_praise = "<br>Gut gemacht!<br><br>";

const failed_pvt_feedback = () =>
  `<div class="instructions">
    Sorry, aber du musst mindestens <b>${practice_correct_threshold} von ${n_practice_trials}</b> Stoppuhren rechtzeitig stoppen!<br>
    Du musst jede Uhr innerhalb von ${
      lapse_time / 1000
    } Sekunden stoppen, aber implausible 
    Reaktionszeiten (< ${premature_time / 1000} s) zählen als Fehler! 
    Bitte versuche es noch einmal.
</div>`;

const pvt_main_instructions_text = () =>
  `<div class="instructions"> 
    Super, du bist bereit für die Aufgabe!<br>
    Drücke die Leertaste mit deiner dominanten Hand. 
    Wenn du auf "Weiter" klickst, beginnt die Aufgabe. 
    Sie wird ${pvt_time_limit / 60000} min in Anspruch nehmen.
</div>`;

const pvt_end_text = `<div class="instructions"> 
    Super, das war's mit der Stoppuhraufgabe!<br>
</div>`;
