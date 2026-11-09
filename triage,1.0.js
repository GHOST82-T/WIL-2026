var reports = [];
var history = [];
var nextId = 1, sel = null;

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

function render(){
  var q = "<tr><th>ID</th><th>Sender</th><th>Subject</th><th>Verdict</th><th>Priority</th><th>Next step</th><th>Status</th><th>Action</th></tr>";
  var open = 0, high = 0;
  for (var i=0;i<reports.length;i++){
    var r = reports[i];
    if (r.status != "Closed") open++;
    if (r.priority == "High") high++;
    q += "<tr><td>"+r.id+"</td><td>"+esc(r.sender)+"</td><td>"+esc(r.subj)+"</td><td>"+r.verdict+"</td><td>"+r.priority+"</td><td>"+r.step+"</td><td>"+r.status+"</td><td><button onclick='pick("+r.id+")'>Review</button></td></tr>";
  }
  document.getElementById("queue").innerHTML = q;
  var h = "<tr><th>#</th><th>What happened</th></tr>";
  for (var j=history.length-1;j>=0;j--) h += "<tr><td>"+(j+1)+"</td><td>"+esc(history[j])+"</td></tr>";
  document.getElementById("history").innerHTML = h;
  document.getElementById("stats").innerHTML = "Total reports: <b>"+reports.length+"</b> | Open: <b>"+open+"</b> | High priority: <b>"+high+"</b>";
}

function addReport(){
  var s = document.getElementById("sender").value, t = document.getElementById("subj").value;
  if (!s && !t){ alert("fill something in please"); return; }
  var who = document.getElementById("who").value || "anonymous";
  reports.push({id:nextId, who:who, sender:s, subj:t, desc:document.getElementById("desc").value, verdict:"Not reviewed", priority:"Low", step:"None yet", status:"New"});
  history.push("#"+nextId+" reported by "+who);
  nextId++;
  document.getElementById("sender").value = ""; document.getElementById("subj").value = ""; document.getElementById("desc").value = "";
  render();
}

function pick(id){
  sel = id;
  for (var i=0;i<reports.length;i++) if (reports[i].id == id){
    var r = reports[i];
    document.getElementById("selected").innerHTML = "<b>Report #"+r.id+"</b>: "+esc(r.subj)+" from "+esc(r.sender)+"<br><i>"+esc(r.desc)+"</i>";
    document.getElementById("verdict").value = r.verdict;
    document.getElementById("priority").value = r.priority;
    document.getElementById("step").value = r.step;
  }
}

function saveReview(){
  if (sel == null){ alert("pick a report first"); return; }
  for (var i=0;i<reports.length;i++) if (reports[i].id == sel){
    var r = reports[i];
    r.verdict = document.getElementById("verdict").value;
    r.priority = document.getElementById("priority").value;
    r.step = document.getElementById("step").value;
    r.status = (r.verdict == "Not reviewed") ? "New" : (r.step == "None yet" ? "In review" : "Closed");
    var rv = document.getElementById("reviewer").value || "someone";
    history.push("#"+r.id+" reviewed by "+rv+": "+r.verdict+" / "+r.priority+" / "+r.step);
  }
  render();
}
render();