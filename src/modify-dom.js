var nos = document.getElementsByClassName("zahlensuche_nr");
var pick = document.getElementsByClassName("zahlensuche_zahl");
var dates = document.getElementsByClassName("zahlensuche_datum");
var zz = document.getElementsByClassName("zahlensuche_zz");

for (var i = 0; i < nos.length; i++) {
    nos[i].textContent += '; ';
}
for (var i = 0; i < pick.length; i++) {
    pick[i].textContent += ',';
}
for (var i = 0; i < dates.length; i++) {
    dates[i].textContent += ';'  ;
}
for (var i = 0; i < zz.length; i++) {
    zz[i].textContent = ';' + zz[i].textContent  ;
}
