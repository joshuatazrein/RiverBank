// # DATES

function datesToRelative(a, b) {
  // converts two dates into the relation between them as a string
  let returnstring = ''
  if (a.getFullYear() == b.getFullYear() &&
    a.getMonth() == b.getMonth() &&
    a.getDate() == b.getDate()) {
    return 'today'
  }
  let years = 0
  let months = 0
  let weeks = 0
  let days = 0
  const target = new Date(a.getTime()) // target moves with changes
  if (a.getTime() < b.getTime()) {
    target.setDate(target.getDate() - 1)
    // future test
    const oneyear = new Date(b.getTime())
    oneyear.setFullYear(oneyear.getFullYear() - 1)
    while (target.getTime() < oneyear.getTime()) {
      // more than a year off in stated direction
      target.setFullYear(target.getFullYear() + 1)
      years += 1
    }
    if (years != 0) returnstring += years + 'y'
    const onemonth = new Date(b.getTime())
    onemonth.setMonth(b.getMonth() - 1) // one month threshold
    while (target.getTime() < onemonth.getTime()) {
      // more than a year off in stated direction
      target.setMonth(target.getMonth() + 1)
      months += 1
    }
    if (months != 0) returnstring += months + 'm'
    const oneweek = new Date(b.getTime())
    oneweek.setDate(b.getDate() - 7) // one month threshold
    while (target.getTime() < oneweek.getTime()) {
      // more than a year off in stated direction
      target.setDate(target.getDate() + 7)
      weeks += 1
    }
    if (weeks != 0) returnstring += weeks + 'w'
    while (target.getTime() < b.getTime() - 
      (1000 * 60 * 60 * 24)) {
      // more than a year off in stated direction
      target.setDate(target.getDate() + 1)
      days += 1
    }
    if (days != 0) returnstring += days + 'd'
  } else if (a.getTime() > b.getTime()) {
    target.setDate(target.getDate() + 1)
    // past test
    returnstring = '-'
    const oneyear = new Date(b.getTime())
    oneyear.setFullYear(oneyear.getFullYear() + 1)
    while (target.getTime() > oneyear.getTime()) {
      // more than a year off in stated direction
      target.setFullYear(target.getFullYear() - 1)
      years += 1
    }
    if (years != 0) returnstring += years + 'y'
    const onemonth = new Date(b.getTime())
    onemonth.setMonth(b.getMonth() + 1) // one month threshold
    while (target.getTime() > onemonth.getTime()) {
      // more than a year off in stated direction
      target.setMonth(target.getMonth() - 1)
      months += 1
    }
    if (months != 0) returnstring += months + 'm'
    const oneweek = new Date(b.getTime())
    oneweek.setDate(b.getDate() + 7) // one month threshold
    while (target.getTime() > oneweek.getTime()) {
      // more than a year off in stated direction
      target.setDate(target.getDate() - 7)
      weeks += 1
    }
    if (weeks != 0) returnstring += weeks + 'w'
    while (target.getTime() > b.getTime() + 
      (1000 * 60 * 60 * 24)) {
      // more than a year off in stated direction
      target.setDate(target.getDate() - 1)
      days += 1
    }
    if (days != 0) returnstring += days + 'd'
  }
  const matches = returnstring.match(/[\d+]\D/g)
  if (matches && matches.length > 2) {
    matches.splice(2, 0, '<br>')
    if (returnstring.charAt(0) == '-') returnstring = '-' + matches.join('')
    else returnstring = matches.join('')
  }
  return returnstring
}

function dateToString(date, weekday) {
  // date to formatted string
  let datestr = ''
  if (weekday) {
    // add in weekday
    datestr += weekdaysStr[date.getDay()] + ' '
  }
  if (data.dateSplit == 'dd.mm.yyyy') {
    datestr += String(date.getDate()) + '.' +
      String(Number(date.getMonth()) + 1) + '.' +
      String(date.getFullYear()).slice(2)
  } else if (data.dateSplit == 'mm/dd/yyyy') {
    datestr += String(Number(date.getMonth() + 1)) +
      '/' + String(date.getDate()) + '/' +
      String(date.getFullYear()).slice(2)
  } else if (data.dateSplit == 'yyyy-mm-dd') {
    datestr += String(date.getFullYear()).slice(2) + '-' +
      String(Number(date.getMonth() + 1)) + '-' +
      String(date.getDate())
  }
  return datestr
}

function stringToDate(string, weekday, future) {
  // maps a date-search string to a specific date heading
  if (string == 'today' || string == '0d') {
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }
  if (weekday) {
    // chop off weekday
    string = string.split(' ').slice(1).join(' ')
  } else {
    weekday = false
  }
  let logging
  if (string.includes('...')) logging = true
  string = string.replace(/\s*\.\.\./, '')
  if (string.charAt(0) == ' ') {
    string = string.slice(1)
  }
  let date = new Date()
  if (future) {
    date.setDate(date.getDate() + 1)
  }
  if (Object.keys(weekdaysNum).includes(string.split(/(\+|-|\s)/)[0])) {
    // analyze as a weekday string
    weekday = weekdaysNum[string.split(/(\+|-|\s)/)[0]]
    while (date.getDay() != weekday) {
      date.setDate(date.getDate() + 1)
    }
  } else {
    // analyze as a date string
    let datestring
    if (string.match(/[\+-]*\d+[wmyd]/) != null) {
      datestring = string.slice(0,
        string.search(/[\+-]*\d+[wmyd]/))
      // compensates for no t
      if (datestring == '') datestring = String(date.getDate())
    } else {
      datestring = string
    }
    const today = new Date(date.getTime())
    if (data.dateSplit == 'dd.mm.yyyy') {
      const list = datestring.split('.')
      date.setDate(list[0])
      if (date.getDate() < today.getDate()) {
        // goes to earliest future occurrence
        date.setMonth(date.getMonth() + 1)
      }
      if (list.length >= 2) {
        date.setMonth(list[1] - 1)
      }
      if (list.length == 3) {
        if (list[2].length == 2) {
          date.setFullYear(Number('20' + list[2]))
        } else if (list[2].length == 4) {
          date.setFullYear(list[2])
        }
      }
    } else if (data.dateSplit == 'mm/dd/yyyy') {
      const list = datestring.split('/')
      if (list.length == 1) {
        date.setDate(list[0])
        if (date.getDate() < today.getDate()) {
          // goes to earliest future occurrence
          date.setMonth(date.getMonth() + 1)
        }
      } else {
        date.setMonth(list[0] - 1)
        date.setDate(list[1])
        if (list.length == 3) {
          if (list[2].length == 2) {
            date.setFullYear(Number('20' + list[2]))
          } else {
            date.setFullYear(list[2])
          }
        }
      }
    } else if (data.dateSplit == 'yyyy-mm-dd') {
      const list = datestring.split('-')
      if (list.length == 1) {
        date.setDate(list[0])
        if (date.getDate() < today.getDate()) {
          // goes to earliest future occurrence
          date.setMonth(date.getMonth() + 1)
        }
      } else if (list.length == 2) {
        date.setDate(list[1])
        date.setMonth(list[0] - 1)
      } else if (list.length == 3) {
        date.setDate(list[2])
        date.setMonth(list[1] - 1)
        if (list[0].length == 2) {
          date.setFullYear(Number('20' + list[0]))
        } else if (list[0].length == 4) {
          date.setFullYear(list[0])
        }
      }
    }
  }
  // analyze for addition of stuff
  if (string.match(/[\+-]*\d+[wmyd]/g) != null) {
    const matches = string.match(/[\+-]*\d+[wmyd]/g); // regexp
    for (match of matches) {
      if (match.charAt(match.length - 1) == 'd') {
        date.setDate(Number(date.getDate()) +
          Number(match.slice(0, -1)))
      } else if (match.charAt(match.length - 1) == 'w') {
        date.setDate(Number(date.getDate()) + (match.slice(0, -1) * 7))
      } else if (match.charAt(match.length - 1) == 'm') {
        // find first weekday of month
        date.setMonth(Number(date.getMonth()) +
          Number(match.slice(0, -1)))
        if (weekday != false) {
          date.setDate(1)
          while (date.getDay() != weekday) {
            date.setDate(date.getDate() + 1)
          }
        }
      } else if (match.charAt(match.length - 1) == 'y') {
        // find first weekday of year
        date.setFullYear(Number(date.getFullYear()) +
          Number(match.slice(0, -1)))
        if (weekday != false) {
          date.setDate(1)
          date.setMonth(0)
          while (date.getDay() != weekday) {
            date.setDate(date.getDate() + 1)
          }
        }
      }
    }
  }
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

function dateToHeading(date, saving) {
  // find or create the dateheading corresponding to the given date
  if (date === undefined) return
  if (dateToString(date).includes('NaN')) return
  // find the matching date, or create if not
  // sort date headings to be correct
  let headingslist = $('#pop .dateheading').toArray()
  const now = new Date()
  if (date.getTime() > now.getTime()) {
    // if after today, start at today for search
    headingslist = headingslist.slice(headingslist.findIndex((x) => {
      return stripChildren($(x)).includes(dateToString(now))
    }))
  }
  let heading1 = headingslist.find((x) => {
    return stringToDate(stripChildren($(x)), true).getTime() ==
      stringToDate(dateToString(date)).getTime()
  })
  if (!heading1) {
    // insert elt where it should go
    const heading2 = $('<span class="in h1 dateheading" quickhelp="date" folded="false" ' +
      'draggable="false">' + 
      dateToString(date, true) + '</span>')
    let headingafter = headingslist.find((x) => {
      return stringToDate(stripChildren($(x)), true).getTime() >
        stringToDate(stripChildren($(heading2)), true).getTime()
    })
    if (!headingafter) {
      // insert before buffer
      $($('#pop').children()[$('#pop').children().length - 1]).before(heading2)
    } else {
      $(headingafter).before(heading2)
    }
    const today = new Date()
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0)
    // add in relative dates underneath
    const newdate = stringToDate(dateToString(date))
    const newelt = $('<span class="placeholder">' + datesToRelative(today,
      newdate) + '</span>')
    $(heading2).append(newelt)
    if (saving != false) {
      select(heading2)
      save('+', selected)
    }
    if (newdate.getTime() < today) {
      heading2.addClass('complete')
    }
    if (saving) $(heading2).show()
    return heading2
  } else {
    if (saving) $(heading1).show()
    return heading1
  }
}

// # HIERARCHY

function isSubtask(el) {
  // tests inline spans until it gets one, otherwise returns true
  for (lineinner of ['link', 'italic', 'bold', 'bold-italic', 'deadline', 
    'weblink', 'timing', 'mobhandle', 'faketiming', 'placeholder',
    'repeat']) {
    if (el.hasClass(lineinner)) {
      return false
    }
  }
  return true
}

function isHeading(el) {
  // finds if el is heading
  if (el.hasClass('h1') || el.hasClass('h2') ||
    el.hasClass('h3')) {
    return true
  } else {
    return false
  }
}

function getFrame(task) {
  // gets flop or pop of current task
  if (task.attr('id') == 'flop') return $('#flop')
  else if (task.attr('id') == 'pop') return $('#pop')
  const parents = task.parents().toArray()
  if (parents.includes($('#flop')[0])) return $('#flop')
  else if (parents.includes($('#pop')[0])) return $('#pop')
}

function getMainHeading(el) {
  heading = el.prev()
  while (heading[0] && !heading.hasClass('h1')) {
    heading = heading.prev()
  }
  return heading
}

function  getHeading(el) {
  // gets the heading
  if (!el) return
  el = $(el)
  try {
    while (el.parent()[0].tagName != 'P') el = el.parent()
  } catch (err) { return }
  let hclasses = ['h1', 'h2', 'h3']
  if (isHeading(el)) {
    if (el.hasClass('h1')) return // h1s don't have headings
    else if (el.hasClass('h2')) hclasses = ['h1']
    else if (el.hasClass('h3')) hclasses = ['h2', 'h1']
  }
  let heading = el.prev()
  while (heading[0] && !hierarchyCheck(heading, hclasses)) {
    heading = $(heading).prev()
  }
  if ($(heading)[0]) return $(heading)
}

function getHeadingChildren(el) {
  // gets all children of a heading
  // headings to stop folding at
  const folds = {
    'h1': ['h1'],
    'h2': ['h2', 'h1'],
    'h3': ['h3', 'h2', 'h1']
  }
  el = $(el)
  let thisclass
  if (el.hasClass('h1')) {
    thisclass = 'h1'
  } else if (el.hasClass('h2')) {
    thisclass = 'h2'
  } else if (el.hasClass('h3')) {
    thisclass = 'h3'
  }
  const children = el.parent().children()
    .filter(':not(.buffer)')
  const start = children.toArray().indexOf(el[0]) + 1
  for (let i = start; i < children.length; i++) {
    let toggle = true
    for (fold of folds[thisclass]) {
      if ($(children[i]).hasClass(fold)) {
        toggle = false
      }
    }
   if (!toggle) {
      return children.toArray().slice(start, i).map((x) => {
        return $(x)
      })
    }
  }
  return children.toArray().slice(start).map((x) => {
    return $(x)
  })
}

function hierarchyCheck(task, headings) {
  // returns true if the task is above the current one in the hierarchy
  for (heading of headings) {
    if ($(task).hasClass(heading)) return true
  }
  return false
}

function getChildren(el) {
  // returns the children's HTML
  let newstr = ''
  let children = el.children()
  for (let child of children) {
    if (isSubtask($(child))) {
      children = children.slice(children.toArray().indexOf(child))
      for (let child of children) {
        // append all subtasks to tasks
        newstr += child.outerHTML
      }
      break
    }
  }
  while (newstr.slice(0, 4) == '<br>') newstr = newstr.slice(4)
  return newstr
}

function stripChildren(el, mode) {
  if ($(el).hasClass('dateheading') || $(el).hasClass('futuredate') ||
    $(el).hasClass('duedate')) {
    // dateheadings just filter our their subspans
    const newelt = $(el).clone()
    newelt.find('span').remove()
    return newelt.text()
  }
  // retrieve text from only the parent span and any of its formatting
  const testelt = el.clone()
  try {
    testelt.html(testelt.html().replace(/<br>/g, '\n'))
  } catch (err) {
    return ''
  }
  for (child of testelt.children()) {
    // strip the subtasks
    if (isSubtask($(child))) {
      $(child).remove()
    } else if ($(child).hasClass('weblink')) {
      $(child).html($($(child).children()[0]).attr('href'))
    }
  }
  while (testelt.text().charAt(testelt.text().length - 1) == '\n') {
    testelt.text(testelt.text().slice(0, testelt.text().length - 1))
  }
  if (mode == undefined) {
    return testelt.text()
  } else if (mode == 'html') {
    return testelt.html()
  }
}

// # ORDER

function taskAbove() {
  // returns task above
  let returntask
  if ((selected.prev()[0] == undefined || !selected.prev().hasClass('in')) &&
    selected.parent()[0].tagName == 'SPAN') {
    returntask = selected.parent()
  } else if (selected.prev()[0] != undefined) {
    returntask = selected.prev()
  } // nonedisplays are not selected
  while (returntask[0] && !returntask.hasClass('in')) {
    returntask = returntask.prev()
  }
  if (returntask[0] && !returntask.is(':visible')) {
    // while invisible
    select(returntask, false)
    return taskAbove()
 } else if (!returntask[0] || !returntask.hasClass('in')) {
    return selected
  } else {
    return returntask
  }
}

function taskBelow() {
  // returns task below
  let returntask
  if (getChildren(selected) != '') {
    // subtasks
    let child = false
    for (child of selected.children()) {
      if (isSubtask($(child))) {
        returntask = $(child)
        child = true
        break
      }
    }
    if (!child) {
      // if no subtasks, regular next task
      returntask = selected.next()
    }
  } else if (selected.next()[0] == undefined) {
    // end of parent item
    const parents = selected.parents().toArray()
    returntask = $(parents[0]).next()
    let i = 0
    while (!returntask[0]) {
      i += 1
      if (['flop', 'pop'].includes($(parents[i]).attr('id'))) return
      if (!(parents[i])) return
      else returntask = $(parents[i]).next()
    }
  } else if (selected.next()[0] != undefined) {
    // regular next task
    returntask = selected.next()
  }
 while (returntask[0] != undefined && !returntask.hasClass('in')) {
    returntask = returntask.next()
  }
  if (returntask[0] != undefined && !returntask.is(':visible')) {
    // while invisible
    select(returntask, false)
    return taskBelow()
  } else if (returntask[0] == undefined || !returntask.hasClass('in')) {
    return selected
  } else {
    return returntask
  }
}

function moveTask(direction) {
  // move task above or below
  if (!selected) return
  if (selected.hasClass('dateheading')) return
  if (direction == 'pop') {
    $('#searchbar').val('d:')
    $('#searchbar').focus()
    movetask = selected
  } else if (direction == 'flop' &&
    getFrame(selected).attr('id') == 'pop') {
    $('#flop').append(selected)
  } else if (direction == 'down') {
    // move the task down
    if (selected.next()[0]) selected.next().after(selected)
    else select(selected, false)
  } else if (direction == 'up') {
    // move the task up
    if (taskAbove()) taskAbove().before(selected)
    else select(selected, false)
  }
  save('>', selected)
  if (selected.is(':visible')) { select(selected, true) }
  else select()
}

// # SEARCHING

function unFilter() {
  // show everything which is filtered
  if (filtered) {
    filteredlist.forEach((x) => { $(x).show() })
    filtered = false
    filteredlist = []
    if (update != false) {
      updateDeadlines()
    }
    $('#searchbar').val('')
  }
}

function goToSearch(el) {
  // load the list and scroll to the found element
  let focusarea
  if (el.attr('title') == 'pop') {
    // load pop
    focusarea = $('#pop')
  } else {
    // load flop and switch lists
    focusarea = $('#flop')
    loadedlist = Number(data.flop.map((x) => {
      return x.title
    }).indexOf(
      el.attr('title')))
    loadList()
  }
  // find the matching element
  const focused = $(focusarea.find('span.in')[el.attr('index')])
  select(focused, true)
  $('#searchbar').val('')
  $('#searchbar-results').hide()
  $('#searchbar').blur()
}

function search(skiplinks, deadline) {
  // find all matches with the searchtext
  while (/\s/.test($('#searchbar').val()
    .charAt($('#searchbar').val().length - 1))) {
    // chop off end spaces
    const val = $('#searchbar').val()
    $('#searchbar').val(val.slice(0, val.length - 1))
  }
  let searchtext = $('#searchbar').val()
  if (searchtext == '') return
  searchexptext = searchtext
    .replace(/\s\s/, '\\s')
    .replace(/\s/g, '\\s')
    .replace(/([\*\+\?\.\|\[\]\(\)\{\}\^\$])/g, '\\$1')
  const searchexp = new RegExp(searchexptext, 'gi')
  const searches = data.flop.concat([{
    'title': 'pop',
    'text': data.pop
  }])
  const matches = []
  let children
  for (let search of searches) {
    // search all lists for matches
    $('#test').html(search.text)
    children = $('#test').find('span.in').toArray()
    for (let child of children) {
      // if it's a match, add to matches
      if (searchexp.test(stripChildren($(child)))) {
        // add to matches
        if (skiplinks == true &&
          $(child).text().includes('[[' + searchtext)) {
          // test for links
          continue
        } else if (skiplinks == 'deadline' &&
          !$(child).text().includes(deadline)) {
          // finds only deadlines with exact match to text and date
          continue
        } else {
          if (skiplinks != 'complete' && $(child).hasClass('complete')) {
            continue
          } else {
            // add it
            matches.push({
              'title': search.title,
              'text': stripChildren($(child)),
              'index': children.indexOf(child)
            })
          }
        }
      }
    }
  }
  $('#searchbar-results').empty()
  for (let match of matches) {
    // create search results
    $('#searchbar-results').append(
      '<p class=\'dropdown-item\' onclick=' +
      '\'goToSearch($(this))\' title=\'' + match.title + '\' index=\'' +
      match.index + '\'>' + match.text + '</p>'
    )
  }
  $('#searchbar-results').show()
  if ($('#searchbar-results').children().length == 1) {
    // go automatically to first item if that works
    goToSearch($($('#searchbar-results').children()[0]))
  }
}

// # SELECTING

function selectRandom() {
  // select a random task in the current scope
  let headinglist
  // get children
  if (selected != undefined && isHeading(selected)) {
    headinglist = getHeadingChildren(selected)
  } else if (selected != undefined && getChildren(selected).length > 0) {
    headinglist = selected.children().filter((x) => {
      return isSubtask($(x))
    })
  } else if (selected == undefined ||
    selected.hasClass('in')) {
    headinglist = $('#flop').children().toArray()
  }
  if (headinglist.length > 0) {
    headinglist = headinglist.filter((x) => {
     if (!$(x).hasClass('complete') &&
       !$(x).hasClass('taskselect')) return true
    })
    if (headinglist.length > 0) {
      select($(headinglist[
        Math.floor(Math.random() * (headinglist.length))
      ]), true)
    }
  }
}

function select(el, scroll, animate) {
  // select the given element
  if (el &&
    $(el)[0].tagName == 'SPAN' && !isSubtask($(el))) el = $(el).parent()
  if ($(el).hasClass('buffer')) {
    select(getFrame($(el)), scroll)
    return
  }
  // switch selection
  if (selected != undefined) {
    $('.taskselect').removeClass('taskselect')
  }
  if (el != undefined && $(el).hasClass('in')) {
    selected = $(el)
    selected.addClass('taskselect')
    let parent
    if (getFrame(selected)) {
      parent = getFrame(selected)
    } else {
      parent = $(el)
    }
    if (selected != undefined) {
      try {
        parent.find(":not(span)").addBack().contents().filter(
          function () {
            return this.nodeType == 3;
          }).remove();
      } catch (err) { }
    }
    if (window.focused) {
      // shows right frames on focus
      if (getFrame(selected).attr('id') == 'pop') {
        $('#floplist').hide()
        $('#poplist').show()
        $('#switch').text('<')
      } else if (getFrame(selected).attr('id') == 'flop') {
        $('#poplist').hide()
        $('#floplist').show()
        $('#switch').text('>')
      }
    }
    if (scroll) {
      if (!selected.is(':visible') && getHeading(selected)) {
        heading = $(getHeading(selected))
        while (!heading.is(':visible')) {
          // finds currently folded heading to unfold
          if (heading.hasClass('folded')) {
            toggleFold(heading, false)
          }
          heading = $(getHeading(heading))
        }
        toggleFold(heading)
      }
      let scrollheading = $(getHeading(selected))
      while (!scrollheading.hasClass('h1') && getHeading(scrollheading)) {
        // finds currently folded heading to unfold
        scrollheading = $(getHeading(scrollheading))
      }
      if (getFrame(selected)) {
        // only execute if not clicked
        parent = getFrame(selected)
        let butheight = $(':root').css('--butheight')
        const oldscroll = parent.scrollTop() -
          Number(butheight.slice(0, butheight.length - 2))
        let scrolltime
        if (animate != false) {
          scrolltime = 300
        } else {
          scrolltime = 0
        }
        parent.stop(true) // clear queue
        if (selected.hasClass('h1') || !getHeading(selected)) {
          const scrolllocation = Number(
            oldscroll +
            selected.offset().top) -
            Number(getFrame(selected).offset().top)
          parent.animate({
            scrollTop: scrolllocation
          }, scrolltime)
        } else {
          if (scrollheading.offset() &&
            Number(scrollheading.offset().top) + parent.height() / 2 >
            Number(selected.offset().top)) {
            // scroll to heading
            const scrolllocation = Number(
              oldscroll +
              scrollheading.offset().top) -
              Number(getFrame(selected).offset().top)
            parent.animate({
              scrollTop: scrolllocation
            }, scrolltime)
          } else {
            // if more than halfway down the page
            const scrolllocation = Number(
              oldscroll +
              selected.offset().top) -
              Number(parent.offset().top) -
              parent.height() / 2
            parent.animate({
              scrollTop: scrolllocation
            }, scrolltime)
          }
        }
      }
    }
  } else if ($(el).parent().attr('id') == 'context-menu') {
    // do nothing (context)
  } else {
    selected = undefined
  }
}