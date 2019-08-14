# [Knowledge Base](../)
## Add Modified Filter

### **Problem**

Nach dem Feld "Modified" (Geändert) kann in Views nicht gefiltert werden

### **Ursache**

Das Feld "Modified" (Geändert) ist "hidden" (versteckt)

### **Lösung**

Feldeinstellungen so ändern, dass die Spalte sichtbar ist. Dazu:

Einstellung muss für alle Links wiederholt werden:

* https://dms.swissmedic.admin.ch/org/bw-pharmacopoeia/_layouts/15/ManageContentTypeField.aspx?ctype=0x010100181D5E1A4E8FEB499D40167AC0D7EDEE00B575678713A1FC40BEA94C5BFF138C07&Field=Modified
* https://dms.swissmedic.admin.ch/org/bw-pharmacopoeia/_layouts/15/ManageContentTypeField.aspx?ctype=0x010100181D5E1A4E8FEB499D40167AC0D7EDEE&Field=Modified





Schritt 1: Spalteneinstellung auf "Optional" (mittlere Einstellung) setzen. Danach Bestätigung mit "OK"

 

Schritt 2: Klick auf "Websitespalte bearbeiten"

 

Schritt 3: Gruppe "Basisspalten" im Dropdown "Vorhandene Gruppe:" auswählen. Anschliessend Bestätigung mit "OK"

 





Bei eventuellen Problemen wurden nicht alle Content-Types überarbeitet. In diesem Fall:

* https://dms.swissmedic.admin.ch/org/bw-pharmacopoeia/Documents/ öffnen
* "Listeneinstellung" im Ribbon öffnen
* Unter Inhaltstypen "Swissmedic PH Document" und "Swissmedic Document" öffnen. Geöffnet lassen.
* Auf den Inhaltstypen zusätzlich die Verwaltung der übergeordneten Inhaltstypen öffnen
* Für jeden der 4 Inhaltstypen die Bearbeitung eines sichtbaren Inhaltstyps öffnen, z.B. "Title"
* In der Adresszeile von rechts Zeichen entfernen bis "Field=" stehen bleibt, dann "Modified" tippen:
  * z.B. löschen von rechts: *Title&Fid={fa564e0f-0c70-4ab9-b863-0177e6ddd247}*
  * dann tippen: *Modified*
  * dann Enter-Taste drücken
  * Anleitung wiederholen