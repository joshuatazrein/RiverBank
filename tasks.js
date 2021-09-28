// # TASK MODES

function archiveComplete() {
  // archive all complete tasks under current heading
  let list
  if (isHeading(selected)) {
    list = getHeadingChildren(selected)
  } else if (selected && getHeading(selected)) {
    list = getHeadingChildren($getHeading(selected))
  } else {
    list = $('#flop').find('span.in.complete').toArray()
  } 
  list.forEach((x) => {
    if ($(x).hasClass('complete')) {
      // archive task
      select(x)
      archiveTask(false)
    } else {
      // archive subtasks
      for (task of $(x).find('span.in.complete')) {
        select(task)
        archiveTask(false)
      }
    }
  })
  playPop()
}

function archiveTask(play) {
  // complete and move task to "completed ..." heading of today
  if (selected.hasClass('dateheading')) { 
    alert("can't archive dates")
    return 
  }
  if (!selected.hasClass('complete') && play != false) {
    toggleComplete(selected)
    playPop()
  }
  let taskabove = taskBelow()
  if (taskabove[0] == selected[0]) { taskabove = getFrame(selected) }
  // archives the selected Flop to the current day
  let heading
  const day = $(dateToHeading(stringToDate('0d')))
  const childText = getHeadingChildren(day).map((x) => {
    return stripChildren($(x))
  })
  if (
    !(childText.includes('completed') ||
      childText.includes('completed ...'))
  ) {
    // add in an extra heading
    heading = $('<span class=\'in h2\' folded=\'false\'>' +
      'completed ...</span>')
    heading.attr('folded', 'true')
    if (getHeadingChildren(day).length >= 1) {
      getHeadingChildren(day)[
        getHeadingChildren(day).length - 1].after(heading)
    } else {
      day.after(heading)
    }
  } else {
    // select completed heading
    heading = getHeadingChildren(day).find((x) => {
      if (['completed', 'completed ...'].includes($(x).text())) {
        return true
      }
    })
  }
  heading.after(selected)
  // formatting
  if (heading.attr('folded') == 'true') {
    selected.hide()
  }
  const oldselect = selected.clone()
  select(taskabove)
  save('-', oldselect)
}

function toggleComplete(task, saving) {
  // toggle complete on selected task
  // "task" is for autocompleting yesterday's events
  let completetask
  if (!task) {
    completetask = selected
    if (selected && selected[0].tagName == 'P') {
      return
    }
    if (!completetask.hasClass('complete') && data.play == 'true') {
      // pop!
      playPop()
    }
  }
  else completetask = $(task)
  const text = stripChildren(completetask).split(' ')
  if (!completetask.hasClass('complete') &&
    /^~/.test(text[text.length - 2])) {
    if (stringToDate(text[text.length - 2].slice(1)) == 'Invalid Date') {
      alert('invalid repeat date')
      completetask.text(text.slice(0, text.length - 2) +
        getChildren(completetask))
    } else {
      const date = stringToDate(text[text.length - 2].slice(1), false, true)
      if (task) {
        date.setDate(date.getDate() - 1)
      }
      // save so it doesn't immediately delete
      const heading = dateToHeading(date, false)
      const newtask = completetask.clone()
      newtask.removeClass('complete')
      newtask.removeClass('taskselect')
      if (!getHeadingChildren($(heading)).map((x) => {
          return $(x).text()
        }).includes(completetask.text())) {
        $(heading).after(newtask)
        save('+', newtask)
      }
    }
  }
  completetask.toggleClass('complete')
  if (!task || saving != false) {
    save('+', selected)
  }
}

function toggleImportant() {
  // toggle important mode on task
  if (selected[0].tagName == 'SPAN') {
    selected.removeClass('maybe')
    selected.toggleClass('important')
    save('i', selected)
  }
}

function toggleMaybe() {
  // toggle maybe mode on selected task
  if (selected[0].tagName == 'SPAN') {
    selected.removeClass('important')
    selected.toggleClass('maybe')
    save('i', selected)
  }
}

function moveToList() {
  // prepare for next clicked list to suck task in
  movetolist = true
}

function setTask(type) {
  // set type of selected task
  if (!selected || selected.hasClass('dateheading')) return
  const list = stripChildren(selected).split(' ').filter((x) => {
    return x != ''
  })
  if (type == 'deadline') {
    if (!/\>/.test(list[list.length - 1])) {
      selected.html(stripChildren(selected) + ' >' +
        getChildren(selected))
    } else {
      selected.html(
        list.slice(0, list.length - 1).join(' ') + ' >' +
        getChildren(selected))
    }
    editTask()
  } else if (type == 'repeat') {
    if (!/~/.test(list[list.length - 1])) {
      selected.html(stripChildren(selected) + ' ~' + getChildren(selected))
    } else {
      selected.html(
        list.slice(0, list.length - 1).join(' ') + ' ~' + getChildren(selected))
    }
    editTask()
  } else {
    selected.attr('class', 'in ' + type)
    if (['-', '•'].includes(selected.text().charAt(0))) {
      // remove bullet or list
      $('.taskselect > .mobhandle').remove() // removes handle
      selected.html(selected.html().slice(1))
      if (selected.text().charAt(0) == ' ') {
        selected.html(selected.html().slice(1))
      }
    }
    if (type == 'list') {
      selected.html('• ' + selected.html())
    } else if (type == 'note') {
      selected.html('- ' + selected.html())
    }
    save('0')
  }
}

// # DRAGGING

function dragTask(ev) {
  // begin the drag
  select(ev.target)
  draggingtask = true
  save('-', selected)
  if (mobileTest()) {
    $('.nav').hide()
    return
  }
  //start drag
  if (selected[0].tagName == 'TEXTAREA') {
    return; // stops from dragging edited subtasks
  } else if (selected.hasClass('dateheading')) {
    return; // stops from reordering dates
  }
  const oldselect = selected
  // copy into test if first list
  const selectindex = getFrame(selected).find('span.in').toArray()
    .indexOf(selected[0])
  $('#test').empty()
  $('#test').html(getFrame(selected).html())
  selected = $($('#test').find('span.in').toArray()[selectindex])
  // clear current select
  if (isHeading(oldselect)) {
    for (child of getHeadingChildren(oldselect)) {
      $(child).remove()
    }
  }
  $('.taskselect').removeClass('taskselect')
  selected.addClass('taskselect')
  oldselect.remove()
}

function dropTask(ev) {
  // drops selected task onto target
  // logs that drop succeeded so you can check for revert (jQuery hack)
  if ((isHeading(selected) && isSubtask($(ev.target))) ||
    isHeading(selected) && ev.altKey) {
    // can't drop headings as subtasks
    return
  }
  justdropped = true
  setTimeout(function () { justdropped = false }, 300)
  // ev: event, obj: selected
  if (!draggingtask) return
  // drops selected task
  $('#listcontainer > span').hide()
  draggingtask = false
  let children = []
  const el = $(ev.target)
  if (selected.hasClass('h1') || selected.hasClass('h2') ||
    selected.hasClass('h3')) {
    // drop all the tasks
    children = getHeadingChildren(selected)
  }
  if ($(el).attr('folded') == 'true') {
    // unfold
    toggleFold($(el))
    if (getHeadingChildren($(el)).length == 0) {
      // no children
      $(el).after(selected)
    } else {
      // add after last child
      getHeadingChildren($(el))[
        getHeadingChildren($(el)).length - 1].after(selected)
    }
  } 
  // dropping task (according to key commands)
  if (ev.altKey && $(ev.target).parent()[0].tagName != 'SPAN' &&
    !isHeading($(ev.target))) {
    if (ev.metaKey) {
      const subtasks = $(el).children().toArray().filter(
        (x) => {
          if (isSubtask($(x))) return true
        }
      )
      if (subtasks.length == 0) {
        $(el).append(selected)
      } else {
        $(subtasks[0]).before(selected)
      }
    } else {
      $(el).append(selected)
    }
  } else {
    if (ev.metaKey) {
      $(el).before(selected)
    } else {
      $(el).after(selected)
    }
  }
  for (i = children.length - 1; i >= 0; i--) {
    // append each child after for headings
    selected.after(children[i])
  }
  if (window.innerWidth < 600) {
    if (flopscrollsave) {
      $('#flop').scrollTop(flopscrollsave)
    }
    if (popscrollsave) {
      $('#pop').scrollTop(popscrollsave)
    }
    flopscrollsave = undefined
    $('#flop').removeClass('greyedout')
    popscrollsave = undefined
    $('#pop').removeClass('greyedout')
  }
  save('>', selected)
  updateSpanDrags()
}

function dragTaskOver(event) {
  // dragging task over other one; for desktop
  resetDoc()
  const boxright = $('#listcontainer').offset().left
  if (event.pageX < boxright) {
    $('#flop').find('span.in').toArray().forEach((x) => {
      $(x).removeClass('drop-hover')
      $(x).removeClass('taskselect')
    })
    $('#listcontainer > span').addClass('small')
    // load the dragged-over list
    let i = 0
    const loads = $('#loads').children().toArray()
    for (list of loads) {
      const boxtop = $(list).offset().top
      if (event.pageY > boxtop && event.pageY < boxtop + $(list).height() &&
        $(list).hasClass('unselected')) {
        $(loads[loadedlist]).removeClass('selected')
        $(loads[loadedlist]).addClass('unselected')
        data.flop[loadedlist].text = $('#flop').html()
        if (flopscrollsave) {
          $('#flop').scrollTop(flopscrollsave)
        }
        if (popscrollsave) {
          $('#pop').scrollTop(popscrollsave)
        }
        flopscrollsave = undefined
        popscrollsave = undefined
        $('#flop, #pop').removeClass('greyedout')
        loadedlist = i
        $('#flop').empty()
        $('#flop').html(data.flop[loadedlist].text)
        $(list).removeClass('unselected')
        $(list).addClass('selected')
        updateSpanDrags()
        return
      }
      i++
    }
  } else {
    $('#listcontainer > span').removeClass('small')
    const timertime = 3
    const offsetwidth = 50
    const scrollChange = 2
    const flopoffset = $('#flop').offset().top
    const flopheight = $('#flop').height()
    const popoffset = $('#pop').offset().top
    const popheight = $('#pop').height()
    const popleft = $('#pop').offset().left
    clearTimeout(dragtimer)
    dragtimer = setTimeout(dragTaskOver, timertime, event)
    if (flopoffset + flopheight - offsetwidth < event.pageY &&
      event.pageY < flopoffset + flopheight &&
      event.pageX < popleft) {
      // scroll down
      $('#flop').scrollTop($('#flop').scrollTop() + scrollChange)
    } else if (flopoffset < event.pageY &&
      event.pageY < flopoffset + offsetwidth &&
      event.pageX < popleft) {
      // scroll up
      $('#flop').scrollTop($('#flop').scrollTop() - scrollChange)
    } else if (popoffset + popheight - offsetwidth < event.pageY &&
      event.pageY < popoffset + popheight &&
      event.pageX > popleft) {
      // scroll down
      $('#pop').scrollTop($('#pop').scrollTop() + scrollChange)
    } else if (popoffset < event.pageY &&
      event.pageY < popoffset + offsetwidth &&
      event.pageX > popleft) {
      // scroll up
      $('#pop').scrollTop($('#pop').scrollTop() - scrollChange)
    } else {
      clearTimeout(dragtimer)
    }
  }
}

function mobileDragOver(event) {
  // dragging selected task; for mobile
  const boxright = $('#listcontainer').offset().left
  if (event.pageX < boxright) {
    // load the dragged-over list
    let i = 0
    const loads = $('#loads').children().toArray()
    for (list of loads) {
      const boxtop = $(list).offset().top
      if (event.pageY > boxtop && event.pageY < boxtop + $(list).height() &&
        $(list).hasClass('unselected')) {
        $(loads[loadedlist]).removeClass('selected')
        $(loads[loadedlist]).addClass('unselected')
        selected.detach()
        data.flop[loadedlist].text = $('#flop').html()
        if (flopscrollsave) {
          $('#flop').scrollTop(flopscrollsave)
        }
        if (popscrollsave) {
          $('#pop').scrollTop(popscrollsave)
        }
        flopscrollsave = undefined
        popscrollsave = undefined
        $('#flop, #pop').removeClass('greyedout')
        $('.drop-hover').removeClass('.drop-hover')
        loadedlist = i
        $('#flop').empty()
        $('#flop').html(data.flop[loadedlist].text)
        $(list).removeClass('unselected')
        $(list).addClass('selected')
        updateSpanDrags()
        return
      }
      i++
    }
  } else {
    const timertime = 3
    const offsetwidth = 30
    const scrollChange = 1
    const flopoffset = $('#flop').offset().top
    const flopheight = $('#flop').height()
    const popoffset = $('#pop').offset().top
    const popheight = $('#pop').height()
    clearTimeout(dragtimer)
    dragtimer = setTimeout(mobileDragOver, timertime, event)
    if (
      flopoffset + flopheight - offsetwidth < event.pageY &&
      event.pageY < flopoffset + flopheight
    ) {
      // scroll down
      $('#flop').scrollTop($('#flop').scrollTop() + scrollChange)
    } else if (
      flopoffset < event.pageY &&
      event.pageY < flopoffset + offsetwidth
    ) {
      // scroll up
      $('#flop').scrollTop($('#flop').scrollTop() - scrollChange)
    } else if (
      popoffset + popheight - offsetwidth < event.pageY &&
      event.pageY < popoffset + popheight
    ) {
      // scroll down
      $('#pop').scrollTop($('#pop').scrollTop() + scrollChange)
    } else if (
      popoffset < event.pageY &&
      event.pageY < popoffset + offsetwidth
    ) {
      // scroll up
      $('#pop').scrollTop($('#pop').scrollTop() - scrollChange)
    } else {
      clearTimeout(dragtimer)
    }
    if (mobileTest() &&
      event.pageY > popoffset && !flopscrollsave) {
      // scroll flop to end
      if (popscrollsave) {
        $('#pop').scrollTop(popscrollsave)
      }
      $('#pop').removeClass('greyedout')
      popscrollsave = undefined
      flopscrollsave = $('#flop').scrollTop()
      $('#flop').addClass('greyedout')
      if ($('#flop').children().length < 2) {
        $('#flop').scrollTop($('#flop').height())
      } else {
        const flopchild = $($('#flop').children()[
          $('#flop').children().length - 1])
        $('#flop').scrollTop($('#flop').scrollTop() + flopchild.position().top +
          flopheight)
      }
    } else if (mobileTest() &&
      event.pageY < popoffset && !popscrollsave) {
      // scroll pop to beginning
      if (flopscrollsave) {
        $('#flop').scrollTop(flopscrollsave)
      }
      $('#flop').removeClass('greyedout')
      flopscrollsave = undefined
      popscrollsave = $('#pop').scrollTop()
      $('#pop').scrollTop(0)
      $('#pop').addClass('greyedout')
    }
  }
}

function updateSpanDrags(task) {
  // add handles for drags on mobile, or enable jQuery drags on desktop
  let selector
  if (!task) {
    selector = 'span.in:not(.dateheading)'
  } else if (task == 'flop') {
    selector = 'flop span.in:not(.dateheading)'
  } else {
    selector = $(task)[0]
  }
  if (mobileTest()) {
    if (!task) {
      $('.mobhandle').remove()
      $(span.in).prepend(
        '<span class="mobhandle"></span>')
      $(span.in).attr('draggable', 'false')
    }
    $(selector).draggable({
      handle: '.mobhandle',
      containment: 'window',
      axis: 'y',
      revert: true,
      appendTo: $('#listcontainer'),
      helper: 'clone',
      cursorAt: {right: 0, top: 0},
      refreshPositions: true,
      zIndex: 1,
      distance: 20,
      addClasses: false,
      start: function (event) {
        // $(this).hide()
        dragTask(event, $(this))
      },
      drag: function (event) {
        mobileDragOver(event)
        $('#listcontainer > span').removeClass('in')
      },
    })
    if (!task) {
      $('.ui-draggable-handle').removeClass('ui-draggable-handle')
      $('.ui-droppable').removeClass('ui-droppable')
    } else {
      $(task).removeClass('ui-draggable-handle')
      $(task).removeClass('ui-droppable')
    }
  } else {
    $('.mobhandle').remove()
    $(selector).draggable({
      containment: 'window',
      revert: true,
      appendTo: $('#listcontainer'),
      distance: 20,
      helper: 'clone',
      cursorAt: {left: 0, top: 0},
      refreshPositions: true,
      zIndex: 1,
      addClasses: false,
      start: function (event) {
        dragTask(event, $(this))
      },
      drag: function (event) {
        dragTaskOver(event)
        $('#listcontainer > span').removeClass('in')
      },
    })
    $('span.in').attr('draggable', 'true')
  }
  // reset drops
  if (!task) {
    $('span.in').droppable({
      accept: 'span.in',
      hoverClass: 'drop-hover',
      greedy: true,
      drop: function (event) {
        dropTask(event)
      }
    })
  } else {
    $(task).droppable({
      accept: 'span.in',
      hoverClass: 'drop-hover',
      greedy: true,
      drop: function (event) {
        dropTask(event)
      }
    })
  }
}

// # FOLDING

function collapseAll() {
  // collapse all selected headings
  if (selected.hasClass('dateheading')) {
    alert("try in Bank; folds are automatic in River")
    return
  }
  // collapse all headings at same level as selected
  let hclass
  if (selected.hasClass('h2')) {
    hclass = 'h2'
  } else if (selected.hasClass('h3')) {
    hclass = 'h3'
  }
  let collapselist
  if (!selected || !getHeading(selected) || !hclass) {
    // toggle all primaey hs in flop
    collapselist = $('#flop').children().toArray().filter((x) => {
      return isHeading($(x)) && !getHeading($(x))
    })
  } else {
    // if it has heading
    collapselist = getHeadingChildren($(getHeading($(selected))))
      .filter((x) => { return $(x).hasClass(hclass) })
  }
  let fold
  if (collapselist.length == 0) return
  if ($(collapselist[0]).attr('folded') == 'true') { fold = 'true' }
  else { fold = 'false' }
  collapselist.forEach((x) => {
    if ($(x).attr('folded') == fold) { toggleFold($(x)) }
  })
  setTimeout(function () { select(selected, true) }, 350)
}

function toggleFold(el, saving) {
  // hide or show everything underneath
  const keepfolded = []
  for (child of getHeadingChildren(el)) {
    // fold everything
    if (el.attr('folded') == 'false') {
      if (saving === undefined) child.hide(300)
      else child.hide()
    } else {
      // if unfolding, keep folded headings folded
      if (child.attr('folded') == 'true') {
        keepfolded.push(child)
      }
      if (saving === undefined) {
        child.show(300)
      } else if (saving == false) child.show()
    }
  }
  if (el.attr('folded') == 'true') {
    for (heading of keepfolded) {
      // keep folded headings folded
      getHeadingChildren($(heading)).forEach((x) => {
        $(x).stop(true)
        $(x).hide()
      })
    }
  }
  // update folded attr
  if (el.attr('folded') == 'false') {
    el.attr('folded', 'true')
    el.addClass('folded')
    if (stripChildren(el).slice(-4) != ' ...') {
      el.html(stripChildren(el) + ' ...' + getChildren(el))
    }
  } else {
    el.attr('folded', 'false')
    el.removeClass('folded')
    if (stripChildren(el).slice(-4) == ' ...') {
      el.html(stripChildren(el).slice(0, -4) + getChildren(el))
    }
  }
  if (saving === undefined) {
    setTimeout(save, 600)
  }
}

function toggleSubtasks() {
  // fold a task's subtasks, or if a heading toggleFold it
  if (selected.hasClass('h1') || selected.hasClass('h2') ||
    selected.hasClass('h3')) {
    toggleFold(selected)
  } else {
    if (getChildren(selected) != '') {
      // hide subitems
      if (selected.hasClass('folded')) {
        selected.children().toArray().forEach((x) => {
          $(x).show()
        })
        selected.html(stripChildren(selected, 'html').slice(0, -4) + getChildren(selected))
     } else if (!selected.hasClass('folded')) {
        selected.children().toArray().forEach((x) => {
          $(x).hide()
        })
        selected.html(stripChildren(selected, 'html') + ' ...' + getChildren(selected))
      }
      selected.toggleClass('folded')
    }
    save()
  }
}

function indentTask(indent) {
  // indent selected
  if (selected.parent()[0].tagName == 'SPAN' && indent == false) {
     selected.parent().after(selected)
   } else if (indent && !isHeading(taskAbove())) {
     taskAbove().append(selected)
   }
}

// # SAVING

function deleteTask() {
  // delete selected
  if (!selected || selected[0].tagName == 'P' ||
    selected.hasClass('dateheading')) {
    return
  }
  let newselect = selected.next()
  if (!selected.next()[0] || !selected.next().hasClass('in')) {
    newselect = taskAbove()
  }
  if (selected.attr('folded') == 'true') {
    // unfold deleted headings before deleting
    toggleFold(selected)
    setTimeout(deleteTask, 500)
    return
  }
  const oldselect = selected.clone()
  selected.remove()
  select(newselect)
  save('-', oldselect)
}

function saveTask() {
  // save currently open task
  const savetask = selected.prev() // looks at item before it
  savetask.attr('class', 'in')
  selected.next().remove() // removes appended children
  if (['', '• ', '- ', '# ', '## ', '### ', '@', '@ '
  ].includes(selected.val()) ||
  /^•\s$/.test(selected.val())) {
    selected.remove()
    savetask.remove()
    return
  }
  if (selected.val() == '---') {
    // add in a hr
    savetask.before('<span class=\'in horizline\'>   </span>')
    savetask.remove()
    selected.remove()
    return
  }
  if (selected.val().slice(0, 2) == '# ' &&
    savetask.parents().filter('#pop').length != 0) {
    $('#searchbar').val('d: ' + selected.val().slice(2))
    selected.remove()
    savetask.remove()
    $('#searchbar').focus()
    const date = dateToHeading(
      stringToDate($('#searchbar').val().slice(2)), false, true)
    select(date, true)
    $('#searchbar').val('')
    $('#searchbar').blur()
    // makes new date
    return
  }
  // fixes leading or hanging indents
  while (selected.val().charAt(0) == '\n') {
    selected.val(selected.val().slice(1))
  }
  while (selected.val().charAt(-1) == '\n') {
    selected.val(selected.val().slice(0, -1))
  }
  if (selected.val().slice(0, 2) == '  ') {
    // move as subtask of previous item
    selected.val(selected.val().slice(2))
    savetask.prev().append(savetask)
  }
  if (selected.val().includes('>')) {
    // analyze the string as a search string + replace the date
    // find the start and end points
    const index = selected.val().search('>')
    let endindex = selected.val().slice(index).search(' ')
    let addspace = false
    if (endindex == -1) {
      endindex = selected.val().length
      addspace = true
    } else endindex += index
    if (stringToDate(selected.val().slice(index + 1, endindex)) ==
      'Invalid Date') {
      alert('invalid date entered')
      selected.val(
        selected.val().slice(0, index) +
        selected.val().slice(endindex)
      )
    } else {
      selected.val(
        selected.val().slice(0, index) +
        '>' +
        dateToString(stringToDate(selected.val().slice(index + 1, endindex))) +
        selected.val().slice(endindex)
      )
      if (addspace) {
        // add space at end
        selected.val(selected.val() + ' ')
      }
    }
  }
  const length = selected.val().length - 1
  if (selected.val().charAt(length) == '!') {
    savetask.addClass('important')
    selected.val(selected.val().slice(0, length))
  } else if (selected.val().charAt(length) == '?') {
    savetask.addClass('maybe')
    selected.val(selected.val().slice(0, length))
  }
  for (linestart of Object.keys(linestarts)) {
    // test each for a match
    if (selected.val().slice(0, linestart.length) == linestart) {
      // add the class
      savetask.addClass(linestarts[linestart])
      break
    }
  }
  if (selected.val().charAt(selected.val().length - 1) != ' ') {
    selected.val(selected.val() + ' ')
  }
  newstr = selected.val()
    .replace(/\*(.*)\*/g, ' <span class="bold">$1</span> ')
    .replace(/_(.*)_/g, ' <span class="italic">$1</span> ')
    .replace(/_\*(.*)\*_/g, 
    ' <span class="bold-italic">$1</span> ')
    .replace(/\s\>(.*)\s/g, ' <span class="deadline">>$1</span> ')
    .replace(/\s\[\[(.*)\]\]\s/g, 
    ' <span class="link">[[$1]]</span> ')
    .replace(/\n/g, '<br>').replace(/\s/g, ' ')
  newstr += getChildren(el)
  if (selected.val().charAt(0) == '@') {
    // process event signs
    const list = newstr.split(' ')
    if (/@\d(.*)/.test(list[0])) {
      // replace with timing object with times
      const timing = $('<span class="timing"></span>')
      timing.text(list[0].slice(1))
      list[0] = timing[0].outerHTML
      newstr = list.join(' ')
    } else if (list[0].length > 1) {
      const timing = $('<span class="faketiming"></span>')
      timing.text(list[0].slice(1))
      list[0] = timing[0].outerHTML
      newstr = list.join(' ')
    } else {
      newstr = newstr.slice(1)
    }
  }
  newstr = newstr.replace(/\_(.*)\_/, "$1")
    .replace(/\*(.*)\*/, "$1")
    .replace(/\_*(.*)\*_/, "$1")
  savetask.html(newstr)
  try {
    // fixing weird glitch
    const wordlist = stripChildren(savetask).split(' ')
    for (word in wordlist) {
      // add in weblinks
      if (wordlist[word].slice(1, wordlist[word].length - 2).includes('.') &&
        stringToDate(wordlist[word]) == 'Invalid Date' && 
        !/\.\./.test(wordlist[word]) && 
        !/(i\.e\.|e\.g\.)/.test(wordlist[word])) {
        let match = false
        for (patt of [/^\.+$/, /\d+\.\d+/]) {
          if (patt.test(wordlist[word])) {
            match = true
          }
        }
       if (!match) {
          wordlist[word] = '<span class="weblink" title="' + wordlist[word] +
            '">' + wordlist[word] + '</span>'
        }
        savetask.html(wordlist.join(' '))
      }
    }
  } catch (err) {
    // skip it if it doesn't work    return
  }
  // take away hashtags
  if (savetask.hasClass('h1')) {
    savetask.html(savetask.html().slice(2))
  } else if (savetask.hasClass('h2')) {
    savetask.html(savetask.html().slice(3))
  }
  if (savetask.hasClass('h3')) {
    savetask.html(savetask.html().slice(4))
  }
  if (isHeading(savetask) && savetask.attr('folded') != 'true')
    savetask.attr('folded', 'false') // sets heading folds
  selected.remove()
  savetask.show()
  select(savetask, true)
  let parent = selected.parent()
  while (parent[0].tagName == 'SPAN') {
    // disable drags
    parent.attr('draggable', 'true')
    parent = parent.parent()
  }
  save('+', selected)
}

function editTask() {
  // edit selected task
  el = selected
  if (selected.hasClass('dateheading')) return
  if (selected != undefined) {
    $('#context-menu').hide()
    el.removeClass('taskselect')
    const classes = selected.attr('class') // for processing placeholder
    const newelt = $('<textarea class=\'in edit\'></textarea>')
    newelt.css('font', selected.css('font'))
    el.after(newelt)
    el.hide()
    if (isHeading(selected)) { select(newelt) }
    else { select(newelt, true) }
    let parent = selected.parent()
    while (parent[0].tagName == 'SPAN') {
      // disable drags
      parent.attr('draggable', 'false')
      parent = parent.parent()
    }
    selected.focus()
    if (getChildren(el) == '') {
      selected.after('<span style="display:none;"></span>')
    } else {
      // appends children after
      selected.after('<span class="edit ' + classes + '">' + 
        getChildren(el) + '</span>')
    }
    // (el).html()
    el.html(el.html()
      .replace(/<span class="italic">(.*)<\/span>/,
      '<span class="italic">_$1_</span>')
      .replace(/<span class="bold">(.*)<\/span>/,
      '<span class="bold">*$1*</span>')
      .replace(/<span class="bold-italic">(.*)<\/span>/,
      '<span class="bold-italic">_*$1*_</span>'))
    selected.val(stripChildren(el))
    const val = selected.val()
    if (val.charAt(val.length - 1) == ' ') {
      selected.val(val.slice(0, val.length - 1))
    }
    if (el.hasClass('important')) {
      selected.val(selected.val() + ' !')
    } else if (el.hasClass('maybe')) {
      selected.val(selected.val() + ' ?')
    }
    // add back hashtags
    if (el.hasClass('h1')) {
      selected.val('# ' + selected.val())
      el.removeClass('h1')
    } else if (el.hasClass('h2')) {
      selected.val('## ' + selected.val())
      el.removeClass('h2')
    } else if (el.hasClass('h3')) {
      selected.val('### ' + selected.val())
      el.removeClass('h3')
    } else if (el.hasClass('event')) {
      selected.val(('@') + selected.val())
      el.removeClass('event')
    }
    while (selected.val().charAt(0) == '\n') {
      selected.val(selected.val().slice(1))
    }
    while (selected.val().charAt(selected.val().length - 1) == '\n') {
      selected.val(selected.val().slice(0, selected.val().length - 1))
    }
    if (selected.prev().prev().text().charAt(0) == '•' &&
      selected.val() == '' ||
      (isHeading(selected.prev().prev()) &&
      selected.next().next().text().charAt(0) == '•' &&
      selected.val() == '')) {
      // continue lists
      selected.val('• ' + selected.val())
    }
    updateHeight()
    selected.click(function (e) { 
      $(this).focus() 
    });
    if (selected.val().includes('#')) {
      // scroll to headings manually
      let scrollto = getFrame(selected).scrollTop() + 
        selected.offset().top - getFrame(selected).offset().top -
        Number($(':root').css('--butheight')
        .slice(0, $(':root').css('--butheight').length - 2))
      getFrame(selected).animate({
        scrollTop: scrollto
      }, 500)
    }
  }
}

function createBlankTask() {
  // create new blank task
  const savetask = $('<span class="in"></span>')
  return savetask
}

function newTask(subtask, prepend) {
  // create new task
  console.trace()
  if (loadedlist == undefined || loadedlist > data.flop.length - 1) {
    alert('no list selected; create or select a list first')
    return
  }
  $('#context-menu').hide()
  const newspan = createBlankTask()
  if (selected == undefined) return; // prevents glitches
  if (selected.attr('folded') == 'true') {
    toggleFold(selected)
    setTimeout(function() {
      newTask(subtask, prepend)
    }, 610)
    return
  }
  if (selected[0].tagName == 'P' && selected.hasClass('in')) {
    // blank before buffer
    $(selected.children()[selected.children().length - 1]).before(newspan)
  } else if (selected[0].tagName == 'SPAN' && subtask && 
    !isHeading(selected)) {
    // subtask
    if (prepend) {
      selected.html(stripChildren(selected, 'html') + newspan[0].outerHTML + getChildren(selected))
      select(selected.find('span.in')[0])
      editTask()
      return
    } else {
      selected.append(newspan)
    }
  } else if (['SPAN'].includes(selected[0].tagName)) {
    // regular task
    selected.after(newspan)
  }
  if (selected.hasClass('dateheading')) {
    updateDeadlines()
  }
  select(newspan)
  editTask()
}