var reports = [];
var history = [];
var nextId = 1, sel = null;

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function $(id){return document.getElementById(id);}

function show(which){
  $("reporter").style.display = (which == "reporter") ? "block" : "none";
  $("reviewer").style.display = (which == "reviewer") ? "block" : "none";
  render();
}

function render(){
  // reporter: only my reports
  var me = $("me").value.trim().toLowerCase();
  var m = "<tr><th>ID</th><th>Sender</th><th>Subject</th><th>Status</th><th>Verdict</th><th>Priority</th><th>Next step</th></tr>";
  var count = 0;
  for (var i=0;i<reports.length;i++){
    var r = reports[i];
    if (me != "" && r.who.toLowerCase() == me){
      count++;
      m += "<tr><td>"+r.id+"</td><td>"+esc(r.sender)+"</td><td>"+esc(r.subj)+"</td><td>"+r.status+"</td><td>"+r.verdict+"</td><td>"+r.priority+"</td><td>"+r.step+"</td></tr>";
    }
  }
  if (me == "") m += "<tr><td colspan='7'>type your name above first</td></tr>";
  else if (count == 0) m += "<tr><td colspan='7'>no reports yet</td></tr>";
  $("myq").innerHTML = m;

  // reviewer: everything
  var q = "<tr><th>ID</th><th>Reported by</th><th>Sender</th><th>Subject</th><th>Verdict</th><th>Priority</th><th>Next step</th><th>Status</th><th>Action</th></tr>";
  var open = 0, high = 0;
  for (var j=0;j<reports.length;j++){
    var x = reports[j];
    if (x.status != "Closed") open++;
    if (x.priority == "High") high++;
    q += "<tr><td>"+x.id+"</td><td>"+esc(x.who)+"</td><td>"+esc(x.sender)+"</td><td>"+esc(x.subj)+"</td><td>"+x.verdict+"</td><td>"+x.priority+"</td><td>"+x.step+"</td><td>"+x.status+"</td><td><button onclick='pick("+x.id+")'>Review</button></td></tr>";
  }
  $("queue").innerHTML = q;
  $("stats").innerHTML = "Total reports: <b>"+reports.length+"</b> | Open: <b>"+open+"</b> | High priority: <b>"+high+"</b>";

  var h = "<tr><th>#</th><th>What happened</th></tr>";
  for (var k=history.length-1;k>=0;k--) h += "<tr><td>"+(k+1)+"</td><td>"+esc(history[k])+"</td></tr>";
  $("history").innerHTML = h;
}

function addReport(){
  var who = $("me").value.trim();
  if (who == ""){ alert("type your name first"); return; }
  var s = $("sender").value, t = $("subj").value;
  if (!s && !t){ alert("fill something in please"); return; }
  reports.push({id:nextId, who:who, sender:s, subj:t, desc:$("desc").value, verdict:"Not reviewed", priority:"Low", step:"None yet", status:"New"});
  history.push("#"+nextId+" reported by "+who);
  nextId++;
  $("sender").value = ""; $("subj").value = ""; $("desc").value = "";
  render();
}

function pick(id){
  sel = id;
  for (var i=0;i<reports.length;i++) if (reports[i].id == id){
    var r = reports[i];
    $("selected").innerHTML = "<b>Report #"+r.id+"</b>: "+esc(r.subj)+" from "+esc(r.sender)+"<br><i>"+esc(r.desc)+"</i>";
    $("verdict").value = r.verdict;
    $("priority").value = r.priority;
    $("step").value = r.step;
    $("status").value = r.status;
  }
}

function saveReview(){
  if (sel == null){ alert("pick a report first"); return; }
  for (var i=0;i<reports.length;i++) if (reports[i].id == sel){
    var r = reports[i];
    r.verdict = $("verdict").value;
    r.priority = $("priority").value;
    r.step = $("step").value;
    r.status = $("status").value;
    var rv = $("reviewer_name").value || "someone";
    history.push("#"+r.id+" updated by "+rv+": "+r.status+" / "+r.verdict+" / "+r.priority+" / "+r.step);
  }
  render();
}
render();