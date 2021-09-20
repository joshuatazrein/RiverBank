var data
var weekdaysStr
var offlinemode = false
var offline

var resetstring = JSON.stringify({"flop":[{"title":"inbox","text":"<span class=\"buffer\" style=\"height:var(--butheight)\"></span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\">Welcome to RiverBank!</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">RiverBank is a tool for storing and scheduling your tasks.</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">&nbsp;This is the Bank view, which is a \"bank\" of your unscheduled tasks and projects.</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\"><span class=\"bold\">Go over to the \"help\" at the bottom-left. Click the \"tutorial\" button to see the full tutorial!</span></span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" folded=\"false\">Tasks</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">create tasks<span class=\"in ui-draggable-handle ui-droppable\" style=\"\">subtasks</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• lists</span><span class=\"in note ui-draggable-handle ui-droppable\" style=\"\">- notes</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">deadlines (click to jump to date or task) <span class=\"deadline\">&gt;11/11/2222 </span></span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">links (click to search) <span class=\"link\">[[find me]]</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">find me!</span></span><span class=\"in ui-draggable-handle ui-droppable h2\" style=\"\" folded=\"false\">subheadings</span><span class=\"in ui-draggable-handle ui-droppable h3\" style=\"\" folded=\"false\">sub-sub-headings</span><span class=\"in h1 ui-draggable-handle ui-droppable folded\" style=\"\" folded=\"true\">fold headings ...</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"display: none;\">SURPRISE! :)</span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" folded=\"false\">Controls</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Use the asterisk button to change task types</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Use the <span class=\"weblink\" title=\"\" ...\"\"=\"\">\"...\"</span> button (top-right) for options</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Drag tasks anywhere you want! Try dragging this one.<span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Default: insert after target</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Command-drag: insert before target</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Option-drag: insert as subtask of target</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Type into the search bar to search</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• Space: complete; Shift-Space: archive</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• try out the tutorial for the buttons!</span><span class=\"in h2 ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" folded=\"false\">Extras</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• Consult the help for key commands</span><span class=\"buffer bottom\" style=\"height:90%;\"></span>"},{"title":"create/edit/drag lists","text":"<span class=\"buffer\" style=\"height:var(--butheight)\"></span><span class=\"buffer bottom\" style=\"height:90%;\"></span>"}],"pop":"<span class=\"in ui-draggable-handle ui-droppable\" style=\"\">This is the River view, where you can drag tasks to specific dates to schedule them. As you can see, today's date is automatically added.</span><span class=\"placeholder\">1d</span><span class=\"in h1 dateheading ui-droppable ui-droppable-active\" folded=\"false\" style=\"\">Thu 09/16/2021</span><span class=\"in event ui-draggable-handle ui-droppable\" style=\"\"><span class=\"timing\">10a-12p</span> events<span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• drag tasks into events</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• click on time and drag to change</span></span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">repeats ~1d<span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• complete repeat to schedule next</span><span class=\"in ui-draggable-handle ui-droppable list\" style=\"\">• examples: ~1d (daily), ~1w (weekly), ~M (every Monday), ~11 (11th of every month)</span></span><span class=\"in ui-draggable-handle ui-droppable list ui-droppable-active\" style=\"\">• Create new dates by searching \"d:\" and your date<span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• Use shorthand: M/Mon/Monday</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• Dates in future: 0d, 1d, 1w</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• You can also enter a date</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Use the timer (top-right) to time yourself!<span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Just click \"play\" to start a stopwatch</span></span><span class=\"placeholder\">201y1m3w5d</span><span class=\"in h1 dateheading ui-droppable ui-droppable-active\" folded=\"false\" style=\"\">Mon 11/11/2222</span><span class=\"duedate\">&gt; deadlines (click to jump to date or task)  </span><span class=\"buffer bottom\" style=\"height:90%\"></span>","hidebuts":"false","style":"default.css","dateSplit":"mm/dd/yyyy","weekdays":"Mon","help":"show","loadedlist":0,"headingalign":"center","play":"true"})

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function load() {
  // tries to load current cookie's data; if not, redirects to welcome
  if (!navigator.onLine || window.location.href.includes('file')) {
    if (!navigator.onLine) {
      alert('No connection detected; saving locally')
      offline = true
    }
    console.log('offline mode');
    if (window.location.href.includes('file')) {
      offlinemode = true;
    }
    // offline mode
    try {
      data = JSON.parse(localStorage.getItem('data'))
      $('head').append(
        $("<link rel='stylesheet' type='text/css' href='" +
        data.style + "' />")
      );
    } catch (err) {
      data = JSON.parse(JSON.stringify(resetstring))
      $('head').append(
        $("<link rel='stylesheet' type='text/css' href='" +
        data.style + "' />")
      );
    }
    if (data.weekdays == 'M') {
      weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
      6:'Sat'}
    }
    try {
      loadpage()
    } catch (err) {
      setTimeout(initialize, 500)
    }
    return
  }
  // try the current cookie (synchronous request)
  const fname = getCookie('fname')
  console.log(document.cookie);
  if (fname == '') {
    console.log('no user loaded');
    // no user loaded
    if (offlinemode) {
      window.location = window.location.href.replace(
        'index.html', 'welcome.html')
    } else {
      window.location = 'https://riverbank.app/welcome.html'
    }
    return
  }
  console.log('getting file', '/users/' + getCookie('fname') + '.json');
  $.get('users/' + getCookie('fname') + '.json',
    function (datastr, status, xhr) {
      console.log('success on get');
      if (xhr.responseText == '') { 
        console.log('get failed');
        // no file found
        if (offlinemode) {
          window.location = window.location.href.replace(
            'index.html', 'welcome.html')
        } else {
          window.location = 'https://riverbank.app/welcome.html'
        }
        return
      } else {
        console.log('get succeeded');
        data = JSON.parse(xhr.responseText)
        initialize()
      }
    }
  )
}

function initialize() {
  // tries to load until it's actually loaded
  try {
    loadpage()
  } catch (err) {
    console.log(err)
    setTimeout(initialize, 500)
  }
}

load()