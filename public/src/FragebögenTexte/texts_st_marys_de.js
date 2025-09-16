const st_marys_premable = `<div class="instructions" style="margin-top: 50px">
    Dieser Fragebogen bezieht sich auf deinen Schlaf innerhalb der letzten 24 Stunden.
</div>`;

const st_marys_text = `<div class="questions">
    
    <b>Zu welcher Uhrzeit bist du:</b><br><br>
    
    <table class="st-marys-table">
        <tr>
            <th>ins Bett gegangen?</th>
            <th>eingeschlafen?</th>
        </tr>
        <tr>
            <td>
            <input type="time" id="bedtime" class="large-time" name="bedtime" required />
            </td>
            <td>
            <input type="time" id="sleep-onset" class="large-time" name="sleep-onset" required />
            </td>
        </tr>
        <tr>
            <th>heute morgen endgültig aufgewacht?</th>
            <th>heute morgen aufgestanden?</th>
        </tr>
        <tr>
            <td>
            <input type="time" id="wake" class="large-time" name="wake" required />
            </td>
            <td>
            <input type="time" id="get-up" class="large-time" name="get-up" required />
            </td>
        </tr>
    </table>

    <hr><br>


    <b>War dein Schlaf:</b><br>
    <select class="large-select-padded-padded" id="sleep-depth" required="required" name="sleep-depth">
        <option value=""></option>
        <option value="1">sehr leicht</option>
        <option value="2">leicht</option>
        <option value="3">recht leicht</option>
        <option value="4">durchschnittlich leicht</option>
        <option value="5">durchschnittlich tief</option>
        <option value="6">recht tief</option>
        <option value="7">tief</option>
        <option value="8">sehr tief</option>
    </select>

    <br>
        
    <b>Wie oft bist du aufgewacht?</b><br>
    <select class="large-select-padded-padded" id="awakenings" required="required" name="awakenings">
        <option value=""></option>
        <option value="0">überhaupt nicht</option>
        <option value="1">ein Mal</option>
        <option value="2">zwei Mal</option>
        <option value="3">drei Mal</option>
        <option value="4">vier Mal</option>
        <option value="5">fünf Mal</option>
        <option value="6">sechs Mal</option>
        <option value="7">mehr als sechs Mal</option>
    </select>

    <br><hr><br>

    <b>Wie viel Schlaf hattest du:</b><br><br>

    <table>
        <tr>
            <td><b>letzte Nacht?</b></td>
            <td>
                <input class="large-input" name="sleep-night-h" type="number" required="required" 
                min="0" max="24" style="margin-left:40px; width: 3em"> h
                <input class="large-input" name="sleep-night-m" type="number" required="required" 
                min="0" max="59" style="margin-left:15px; width: 3em"> m
            </td>
        </tr>
        <tr>
            <td><b>tagsüber, gestern?</b></td>
            <td>
                <input class="large-input" name="sleep-day-h" type="number" required="required" 
                min="0" max="24" style="margin-left:40px; width: 3em"> h
                <input class="large-input" name="sleep-day-m" type="number" required="required" 
                min="0" max="59" style="margin-left:15px; width: 3em"> m
            </td>
        </tr>
    </table>

    <br><hr><br>
        
    <b>Wie gut hast du letzte Nacht geschlafen?</b><br>
    <select class="large-select-padded-padded" id="sleep-quality" required="required" name="sleep-quality" 
    onchange="checkOther(this.value, ['1','2','3'], 'trouble-div', 'trouble')">
        <option value=""></option>
        <option value="1">sehr schlecht</option>
        <option value="2">schlecht</option>
        <option value="3">recht schlecht</option>
        <option value="4">recht gut</option>
        <option value="5">gut</option>
        <option value="6">sehr gut</option>
    </select>

    <div name="trouble-div" id="trouble-div" style="display:none;">
        Wenn du nicht gut geschlafen hast, was war das Problem? (z. B. Ruhelosigkeit etc.)<br>
        <textarea name="trouble" id="trouble" class="small-text-field"></textarea>
    </div>

    <br>
        
    <b>Wie wach hast du dich heute Morgen nach dem Aufstehen gefühlt?</b><br>
    <select class="large-select-padded-padded" id="clear-head" required="required" name="clear-head">
        <option value=""></option>
        <option value="1">noch sehr schläfrig</option>
        <option value="2">noch recht schläfrig</option>
        <option value="3">noch etwas schläfrig</option>
        <option value="4">recht wach</option>
        <option value="5">wach</option>
        <option value="6">sehr wach</option>
    </select>

    <br>
        
    <b>Wie zufrieden warst du mit deinem Schlaf letzte Nacht?</b><br>
    <select class="large-select-padded-padded" id="sleep-satisfaction" required="required" name="sleep-satisfaction">
        <option value=""></option>
        <option value="1">sehr unzufrieden</option>
        <option value="2">recht unzufrieden</option>
        <option value="3">etwas unzufrieden</option>
        <option value="4">recht zufrieden</option>
        <option value="5">völlig zufrieden</option>
    </select>

    <br><hr><br>

    <b>Bist du vorzeitig aufgewacht und hattest Probleme, wieder einzuschlafen?</b><br>
    <label class="block"><input type="radio" name="early-wake" value="yes">ja</label>
    <label class="block"><input type="radio" name="early-wake" value="no">nein</label>

    <br><br>
        
    <b>Hattest du Schwierigkeiten, letzte Nacht einzuschlafen?</b><br>
    <select class="large-select-padded-padded" id="sleep-difficulty" required="required" name="sleep-difficulty">
        <option value=""></option>
        <option value="1">keine oder kaum</option>
        <option value="2">ein wenig</option>
        <option value="3">sehr</option>
        <option value="4">extreme Schwierigkeiten</option>
    </select>

    <br>

    <table>
        <tr>
            <td><b>Wie lange hat es gedauert, bis du letzte Nacht eingeschlafen bist?</b></td>
            <td>
                <input class="large-input" name="sleep-latency-h" type="number" required="required" 
                min="0" max="24" style="margin-left:40px; width: 3em"> h
                <input class="large-input" name="sleep-latency-m" type="number" required="required" 
                min="0" max="59" style="margin-left:15px; width: 3em"> m
            </td>
        </tr>
    </table>

</div>`;
