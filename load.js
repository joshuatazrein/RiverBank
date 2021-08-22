var data;
var weekdaysStr;
var weekdaysNum;
var worked = false;

function fileNotFound() {
  // file not found
  const newuser = confirm(
    'This user is not recognized. Create a new user? ' + 
    '(Press Cancel to re-enter username & password)'
  )
  if (newuser) {
    worked = true
    data = JSON.parse(JSON.stringify({'flop': [{'title': 'inbox', 'text': '<span class="in h1" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">Welcome to RiverBank!</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">RiverBank is a tool for storing and scheduling tasks.</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">This is the Bank view, where you can bank unscheduled tasks and projects.</span><span class="in h1" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">tutorial</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">right-click to see all options (double-tap on mobile)</span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Select and edit tasks<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) press alt-enter to create a new task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press enter (or double-click) to save/edit</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) create subtasks with alt-shift-enter</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">5) delete tasks with delete</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Create a new project<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) select "tutorial" by clicking on it ^^</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press alt-enter to create a new task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) type "# " to make it a heading</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) press enter to save your heading</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">5) select a heading or task and press "[" or "]" to fold/unfold</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Create a new list<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">Lists are areas that store related tasks and projects</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) Right click on the "LISTS" area &lt;--</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) select "new"</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) enter the list name</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) click on a list\'s title to select it</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Schedule &amp; move tasks<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) enter "d:t+1d" in the search bar (top left) for tomorrow</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) drag your task onto the new heading to schedule it --&gt;</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) alt-drag: add as subtask</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) cmd-drag: insert before</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• format tasks<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) [[links]] will search when you click on them</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) **bold**, *italic*, and **bold-italic**</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) weblink will automatically collapse</span></span><span class="in h2" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">extras</span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• search<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) type into the searchbar (top left)</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press enter to search</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) click on options to select them</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) press esc to clear search</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Search for dates<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) enter "d:" to start date search</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) enter "t" for today</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) enter weekday to search weekdays (ex: "d:Mon"</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) enter modifiers after that to move forward/back: (+ or -)(number)(d/w/m/y)<span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">•&nbsp;ex: Mon+1d, Mon-1d, Mon+3w, Mon+1m+2w</span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">•&nbsp;Search will find the first weekday which matches and create a heading if it doesn\'t already exist</span></span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• set a timer<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) enter minutes into "timer" (top left)</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press enter to start, space to stop, and esc to clear</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="false" style="">3) 25, 15, 5: set minutes</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) +2, -2: add/subtract 2 minutes</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• customize settings: click on options (top left)<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) change date between dd.mm.yyyy, mm/dd/yyyy, and yyyy-mm-dd</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) change weekdays between long (Mon) and short (M)</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) change color themes</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) hide/show buttons</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">5) hide/show help</span></span>'}],'pop': '<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">This is the River view, where you can drag tasks to specific dates to schedule them.</span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Complete tasks<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) select the task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press space to complete in place</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) OR press shift-space to archive (moves to "completed" for today</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">•&nbsp;create events<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) create a new task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) enter "@ " to make an event and save</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) drag tasks onto the event to schedule them for that block of time</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• create deadlines<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) create a new task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) enter "&gt;" and a date or weekday</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) enter the task name and save</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) a red heading is displayed under the due date (see below)</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">5) click on due date or deadline to navigate between them</span></span>', 'hidebuts':'false', 'style':'default.css', 'dateSplit':'mm/dd/yyyy', 'weekdays':'Mon', 'help':'show', 'loadedlist':'0'}))
  } else {
    // reset cookies and try again
    const inaweek = new Date()
    inaweek.setTime(inaweek.getTime() + 604800000)
    const past = new Date()
    past.setTime(past.getTime() - 86400000)
    const username = prompt('re-enter username: ')
    const password = prompt('enter password: ')
    document.cookie = 'username=; expires=' + past.toUTCString()
    document.cookie = 'username=' + username + '_' + password + 
    '; expires=' + inaweek.toUTCString()
  }
}

function load() {
  try {
    const xml = new XMLHttpRequest()
    xml.open(
      'GET', 
      'users/testfile.json', 
      false
    )
    xml.send()
  } catch (err) {
    console.log('testfile failed');
    // offline mode
    data = JSON.parse(localStorage.getItem('data'))
    $('head').append(
      $("<link rel='stylesheet' type='text/css' href='" +
      data.style + "' />")
    );
    if (data.weekdays == 'M') {
      weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
      weekdaysNum = {'U':0, 'M':1, 'T':2, 'W':3, 'R':4, 'F':5, 'S':6}
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
      6:'Sat'}
      weekdaysNum = {'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 
      'Sat':6}
    }
    return
  }
  if (document.cookie === '') {
    var inaweek = new Date();
    inaweek.setTime(inaweek.getTime() + 604800000);
    const username = prompt('enter username (or create new user): ');
    const password = prompt('enter password (or create new password): ');
    document.cookie = 'username=' + username + '_' + password + 
    '; expires=' + inaweek.toUTCString();
  }
  while (worked === false) {
    const test = new XMLHttpRequest();
    test.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status != 200) {
          fileNotFound()
        } else {
          // file found
          worked = true
          data = JSON.parse(this.responseText)
        }
      }
    }
    test.open(
      'GET', 
      'users/' + document.cookie.split(';')[0].split('=')[1] + '.json', 
      false
    )
    try {
      test.send()
    } catch (err) {
      console.log(err)
      fileNotFound()
    }
  }
  $('head').append(
    $("<link rel='stylesheet' type='text/css' href='" +
    data.style + "' />")
  );
  if (data.weekdays == 'M') {
    weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
    weekdaysNum = {'U':0, 'M':1, 'T':2, 'W':3, 'R':4, 'F':5, 'S':6}
  } else if (data.weekdays == 'Mon') {
    weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
    6:'Sat'}
    weekdaysNum = {'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 
    'Sat':6}
  }
  localStorage.setItem('data', JSON.stringify(data))
}

load();