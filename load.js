var data
var weekdaysStr
var offlinemode = false
var offline
var getting

var resetstring = JSON.stringify({"flop":[{"title":"inbox","text":"<span class=\"buffer\"></span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">Welcome to RiverBank!</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">RiverBank is a tool for storing and scheduling your tasks.</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">&nbsp;This is the Bank view, which is a \"bank\" of your unscheduled tasks and projects.</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\"><span class=\"bold\">Go over to the \"help\" at the bottom-left. Click the \"tutorial\" button to see the full tutorial!</span></span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">Tasks</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">create tasks<span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">subtasks</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• lists</span><span class=\"in note ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">- notes</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">deadlines (click to jump to date or task) <span class=\"deadline\" quickhelp=\"deadline (see help: dates)\">&gt;11/11/2222 </span></span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">links (click to search) <span class=\"link\">[[find me]]</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">find me!</span></span><span class=\"in ui-draggable-handle ui-droppable h2\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">subheadings</span><span class=\"in ui-draggable-handle ui-droppable h3\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">sub-sub-headings</span><span class=\"in h1 ui-draggable-handle ui-droppable folded\" style=\"\" folded=\"true\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">fold headings ...</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"display: none;\" quickhelp=\"task (see help: syntax)\">SURPRISE! :)</span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">Controls</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Use the asterisk button to change task types</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Use the <span class=\"weblink\" title=\"\" ...\"\"=\"\">\"...\"</span> button (top-right) for options</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Drag tasks anywhere you want! Try dragging this one.<span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Default: insert after target</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Command-drag: insert before target</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Option-drag: insert as subtask of target</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Type into the search bar to search</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Space: complete; Shift-Space: archive</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• try out the tutorial for the buttons!</span><span class=\"in h2 ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">Extras</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Consult the help for key commands</span><span class=\"buffer bottom\"></span>"},{"title":"create/edit/drag lists","text":"<span class=\"buffer\" style=\"height:var(--butheight)\"></span><span class=\"buffer bottom\" style=\"height:90%;\"></span>"}],"pop":"<span class=\"buffer\"></span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">This is the River view, where you can drag tasks to specific dates to schedule them. As you can see, today's date is automatically added.</span><span class=\"in h1 dateheading ui-droppable ui-droppable-active\" folded=\"false\" style=\"\" quickhelp=\"date (see help: dates)\">Thu 09/16/2021<span class=\"placeholder\" title=\"task (see help: syntax)\">-2w3d</span></span><span class=\"in event ui-draggable-handle ui-droppable complete\" style=\"\" draggable=\"true\" quickhelp=\"event (see help: syntax)\"><span class=\"timing\" quickhelp=\"time (click to adjust)\">10a-12p</span> events</span><span class=\"in h1 dateheading ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">U 10/3/21<span class=\"placeholder\" title=\"task (see help: syntax)\">today</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Use the timer (top-right) to time yourself!</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Just click \"play\" to start a stopwatch</span><span class=\"in ui-draggable-handle ui-droppable list ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Create new dates by searching \"d:\" and your date</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• You can also enter a date</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Dates in future: 0d, 1d, 1w</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Use shorthand: M/Mon/Monday</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">repeats ~1d</span><span class=\"in ui-draggable-handle ui-droppable list\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• examples: ~1d (daily), ~1w (weekly), ~M (every Monday), ~11 (11th of every month)</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• complete repeat to schedule next</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• click on time and drag to change</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• drag tasks into events</span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 10/4/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Tue 10/5/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Wed 10/6/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Thu 10/7/21<span class=\"placeholder\" title=\"task (see help: syntax)\">4d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Fri 10/8/21<span class=\"placeholder\" title=\"task (see help: syntax)\">5d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sat 10/9/21<span class=\"placeholder\" title=\"task (see help: syntax)\">6d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sun 10/10/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 10/11/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w1d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Tue 10/12/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w2d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Wed 10/13/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w3d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Thu 10/14/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w4d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Fri 10/15/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w5d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sat 10/16/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w6d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sun 10/17/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 10/18/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w1d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Tue 10/19/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w2d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Wed 10/20/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w3d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Thu 10/21/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w4d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Fri 10/22/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w5d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sat 10/23/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w6d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sun 10/24/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 10/25/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w1d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Tue 10/26/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w2d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Wed 10/27/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w3d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Thu 10/28/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w4d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Fri 10/29/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w5d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sat 10/30/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w6d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sun 10/31/21<span class=\"placeholder\" title=\"task (see help: syntax)\">4w</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 11/1/21<span class=\"placeholder\" title=\"task (see help: syntax)\">4w1d</span></span><span class=\"in h1 dateheading ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 11/11/22<span class=\"placeholder\" title=\"task (see help: syntax)\">1y1m<br>1w1d</span></span><span class=\"duedate\" title=\"duedate\" quickhelp=\"duedate (click to see task)\">&gt; deadlines (click to jump to date or task)  <span class=\"duedateBacklink\">Tasks</span></span><span class=\"buffer bottom\"></span>","hidebuts":"false","style":"default.css","dateSplit":"mm/dd/yyyy","weekdays":"Mon","help":"show","headingalign":"center","play":"true","futurepanes":"show","loadedlist":0})

function display(x) {
  console.log(x)
}

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
  if (!navigator.onLine || window.location.href.includes('file') ||
    window.parent.location.href.includes('welcome')) {
    if (!navigator.onLine) {
      alert('No connection detected; saving locally')
      offline = true
    }
    console.log('offline mode');
    if (window.location.href.includes('file')) {
      offlinemode = true;
    }
    // offline mode
    if (window.parent.location.href.includes('welcome')) {
      // welcome mode; set to demo
      console.log('yes');
      data = JSON.parse(resetstring)
    } else {
      try {
        data = JSON.parse(localStorage.getItem('data'))
      } catch (err) {
        localStorage.setItem('data', resetstring)
        data = JSON.parse(resetstring)
      }
    }
    if (data == null) {
      localStorage.setItem('data', resetstring)
      data = JSON.parse(resetstring)
    }
    $('head').append(
      $("<link rel='stylesheet' type='text/css' href='" +
      data.style + "' />")
    );
    if (data.weekdays == 'M') {
      weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
      6:'Sat'}
    }
    try {
      loadPage(false)
    } catch (err) {
      setTimeout(initialize, 500)
    }
    return
  }
  // try the current cookie (synchronous request)
  const fname = getCookie('fname')
  if (fname == '') {
    console.log('no user loaded');
    if (window.location != 'https://riverbank.app/welcome.html') {
      // no user loaded
      if (offlinemode) {
        window.location = window.location.href.replace(
          'index.html', 'welcome.html')
      } else {
        window.location = 'https://riverbank.app/welcome.html'
      }
    } else {
      data = resetstring
      initialize()
    }
    return
  }
  console.log('getting file', '/users/' + getCookie('fname') + '.json');
  $.get('users/' + getCookie('fname') + '.json',
    function (datastr, status, xhr) {
      if (xhr.responseText == '') { 
        console.log('get failed');
        // no file found
        if (offlinemode) {
          window.location = window.location.href.replace(
            'index.html', 'welcome.html')
        } else {
          window.location = 'https://riverbank.app/welcome.html'
        }
        clearInterval(getting)
        getting = undefined
        return
      } else {
        console.log('get succeeded');
        data = JSON.parse(xhr.responseText)
        clearInterval(getting)
        getting = undefined
        initialize()
      }
    }
  )
  getting = setInterval(function () {console.log('getting...')}, 1000)
  setTimeout(function() {
    if (getting) {
      display('get timed out, downloading from local')
      data = JSON.parse(localStorage.getItem('data'))
      while (!data.flop) {
        data = JSON.parse(data)
      }
      display('new data:', data)
      clearInterval(getting)
      getting = undefined
      initialize()
    }
  }, 7000)
}

function initialize() {
  // tries to load until it's actually loaded
  console.log('initializing...');
  try {
    loadPage(true)
  } catch (err) {
    console.log(err)
    setTimeout(initialize, 500)
  }
}

load()