// # DRAGGING

function dragList(ev) {
  //start drag
  if ($(ev.target).hasClass('selected')) {
    loadedlistobj = $(ev.target)
  } else {
    loadedlist = $('#loads').children().toArray().indexOf(ev.target)
    loadList()
    loadedlistobj = $(ev.target)
  }
}

function dragListOver(ev) {
  ev.preventDefault();
  if (!$(ev.target).hasClass('drop-hover') && loadedlistobj) {
    $('.drop-hover').removeClass('drop-hover')
    $(ev.target).addClass('drop-hover')
  }
}

function dropList(ev) {
  //drop
  $('.drop-hover').removeClass('drop-hover')
  if ($(ev.target).hasClass('unselected')) {
    $(ev.target).after(loadedlistobj)
    // move new list to new position in data
    const loadsplice = JSON.parse(JSON.stringify(data.flop[loadedlist]))
    data.flop.splice(loadedlist, 1)
    const newplace = $('#loads').children().toArray().indexOf(loadedlistobj[0])
    data.flop.splice(newplace, 0, loadsplice)
    loadedlistobj = undefined
    loadedlist = newplace
    dragsOn(false)
    save()
  }
}

// # EDITING

function toggleDrags(saving) {
  // enable drags or disable to allow editing of selected list
  loads = $('#loads').children().toArray()
  if (dragsenabled === true) {
    loads.forEach((i) => {
      i.setAttribute('draggable', 'false')
    })
    dragsenabled = false
    const oldval = $(loads[loadedlist]).val()
    $(loads[loadedlist]).val('')
    $(loads[loadedlist]).val(oldval)
    if (saving != false) {
      save('0')
      setTimeout(function () { loads[loadedlist].focus() }, 300)
    } else {
      $('.selected').blur()
    }
  } else {
    loads.forEach((x) => {
      $(x).attr('draggable', 'true')
    })
    dragsenabled = true
    resetDoc(); // fixes weird shit
    if ($(loads[loadedlist]).val().slice(0, 2) == '- ') {
      $(loads[loadedlist]).addClass('sublist')
    } else {
      $(loads[loadedlist]).removeClass('sublist')
    }
    if (saving != false) save('0')
    $(':focus').blur()
    $('.selected').blur()
  }
  updateSizes()
}

function dragsOff(saving) {
  // turn off drags
  if (dragsenabled) {
    toggleDrags(saving)
  }
}

function dragsOn(saving) {
  // turn on drags
 if (!dragsenabled) {
    toggleDrags(saving)
  }
}

// # CREATION/DELETION

function newList(list) {
  let listthing = list
  // create a new list
  if (!list) {
    data.flop.push({title: '', text: ''})
    listthing = data.flop.length - 1
  }
  const newthing = $('<textarea class="listtitle unselected"></textarea>')
    newthing.on('dragstart', dragList)
    newthing.on('drop', dropList)
    newthing.on('dragover', dragListOver)
    newthing.on('click', loadThis)
    newthing.attr('draggable', 'true')
    newthing.val(data.flop[listthing].title)
    $('#loads').append(newthing)
  if (!list) {
    loadedlist = $('#loads').children().length - 1
    loadList(); // load last element in list
    try { $('#loads').children()[loadedlist].focus() }
    catch (err) { display([err, 'loadedlist is ' + loadedlist]) }
    if ($($('#loads').children()[loadedlist]).val().slice(0, 2) == '- ') {
      $($('#loads').children()[loadedlist]).addClass('sublist')
    } else {
      $($('#loads').children()[loadedlist]).removeClass('sublist')
    }
    dragsOff()
  }
}

function deleteList() {
  // delete selected list
  yes = confirm('are you sure you want to delete this list?')
  if (yes) {
    $('#loads').children()[loadedlist].remove()
    data.flop.splice(loadedlist, 1)
    $('#flop').empty()
    loadedlist = undefined
    save()
    if (data.flop.length > 0) {
      loadedlist = 0
      loadList()
    }
  }
}

// # FOLDING

function toggleFoldList(saving, list) {
  if (!list) list = loadedlist
  // fold/undold sublists
  let sublist = Number(list) + 1
  const children = $('#loads').children().toArray()
  if ($(children[sublist]).hasClass('sublist')) {
    // toggle folded and "..."
    $(children[list]).toggleClass('folded')
    const val = $(children[list]).val()
    if (
      $(children[list]).hasClass('folded') &&
      val.slice(val.length - 4, val.length) != ' ...'
    ) {
      $(children[list]).val(val + ' ...')
    } else if (
      !$(children[list]).hasClass('folded') &&
      val.slice(val.length - 4, val.length) == ' ...'
    ) {
      $(children[list]).val(val.slice(0, val.length - 4))
    }
  }
  while ($(children[sublist]).hasClass('sublist')) {
    // toggle shown
    if ($(children[sublist]).is(':visible')) {
      $(children[sublist]).hide()
    } else {
      $(children[sublist]).show()
    }
    sublist += 1

  }
  if (saving != false) save('0')
}

// # LOADING

function shareList() {
  let string = ''
  $('#flop').find('span.in').toArray().forEach((x) => {
    select($(x), false)
    if (selected.is(':visible') && selected.text().length > 0) {
      editTask()
      string += selected.val() + '\n'
      saveTask()
    }
  })
  var blob = new Blob([string], {
    type: 'text/plain;charset=utf-8'
  })
  const date = new Date()
  saveAs(blob, 
      data.flop[loadedlist].title + '-' + dateToString(date) + '.txt')
}

function startImport() {
  $('#imports').show()
  $('#imports').css('top', '13vh')
  $('#imports').css('left', '13vw')
  $('#imports textarea').focus()
}

function importTasks() {
  if (!selected) {
    select('#flop')
  }
  const vals = $('#imports textarea').val().match(/^.*((\r\n|\n|\r)|$)/gm);
  let i = 0
  for (value of vals) {
    newTask()
    selected.val(value.replace(/\n/g, ''))
    saveTask()
    try {
      if (vals[i - 1].slice(0, 2) == '  ') {
        indentTask(false)
        if (vals[i - 1].slice(0, 2) != '  ') {
          indentTask(false)
        }
      }
    } catch (err) {
    }
    i ++
  }
  $('#imports textarea').val('')
  $('#imports').hide()
}

function loadList(saving) { 
  // load the current loadedlist into Flop
  if (loadedlist === undefined) {
    display('no loaded list')
    return
  }
  if (window.focused) {
    $('#poplist').hide()
    $('#floplist').show()
    $('#switch').text(">")
  }
  unFilter()
  const loads = $('#loads').children().toArray()
  loads.forEach(function (i) {
    $(i).removeClass('selected')
    $(i).addClass('unselected')
  })
  $(loads[loadedlist]).removeClass('unselected')
  $(loads[loadedlist]).addClass('selected')
  $('#flop').html(data.flop[loadedlist].text)
  $('.taskselect').removeClass('taskselect')
  $('#flop').scrollTop(0)
  if (mobileTest() && !$('#leftcol').hasClass('collapsed') && saving) {
    // collapse menu again
    toggleCollapse(true)
  }
  if (saving != false) {
    save('L')
  } else {
    $(loads[loadedlist]).blur()
  }
}

function loadThis(ev) {
  const now = new Date().getTime()
  console.trace()
  // load the clicked on list
  let movetask
  if (movetolist) {
    movetask = selected.detach()
    movetolist = false
  }
  loads = Array.from($('#loads').children())
  loadedlist = loads.indexOf(this)
  loadList(this)
  if (movetask) {
    $('#flop > .buffer.bottom').before(movetask)
    save('>')
  }
}