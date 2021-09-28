// # DRAGGING

function dragList(ev) {
  //start drag
  loadedlistobj = ev.target
  //set data - sets drag data
  ev.dataTransfer.setData('text/plain', ev.target.value)
  //specify allowed transfer
  ev.dataTransfer.effectAllowed = 'move'
}

function dropList(ev) {
  //drop
  ev.preventDefault()
  ev.stopPropagation()
  //update data
  loads = Array.from($('#loads').children())
  // swap positions in array
  if (selected != undefined) {
    // move task to new list
    const index = $(ev.target).parent().children().toArray().indexOf(
      $(ev.target)[0])
    const children = getHeadingChildren(selected)
    $('#test').html(data.flop[index].text); // update test p with html
    $('#test').append(selected)
    for (i = children.length - 1; i >= 0; i--) {
      // append each child after
      selected.after(children[i])
    }
    data.flop[index].text = $('#test').html()
    save('0')
    loadedlist = Number(index)
    loadList()
    return
  }
  data.flop.splice(loads.indexOf(ev.target) + 1, 0,
    data.flop[loads.indexOf(loadedlistobj)])
  // take out old item
  if (loads.indexOf(loadedlistobj) > loads.indexOf(ev.target)) {
    data.flop.splice(loads.indexOf(loadedlistobj) + 1, 1)
    loadedlist = loads.indexOf(ev.target) + 1
  } else {
    data.flop.splice(loads.indexOf(loadedlistobj), 1)
    loadedlist = loads.indexOf(ev.target)
  }
  for (let i = 0; i < loads.length; i++) {
    loads[i].value = data.flop[i].title
    $(loads[i]).removeClass('sublist')
    if ($(loads[i]).val().slice(0, 2) == '- ') $(loads[i]).addClass('sublist')
  }
  $(':focus').blur()
  loadList()
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

function newlist(title, text, saving) {
  // create a new list
  let savetitle
  if (!title) {
    savetitle = ''
  } else {
    savetitle = title
  }
  let savetext
  if (!text) {
    savetext = ''
  } else {
    savetext = text
  }
  const newobj = {
    'title': savetitle,
    'text': savetext
  }
  if (!title) {
    data.flop.push(newobj) //add to main list of lists only if it's new
  }
  const newthing = $('<textarea></textarea>')
  newthing.val(newobj.title)
  newthing.addClass('unselected listtitle')
  newthing.on('click', loadThis)
  if (dragsenabled == 'true') {
    newthing.attr('draggable', 'true')
  }
  newthing.attr('ondragstart', 'dragList(event)')
  newthing.attr('ondragover', 'draggingOver(event)')
  newthing.attr('ondrop', 'dropList(event)')
  $('#loads').append(newthing)
  loadedlist = $('#loads').children().length - 1
  loadList(saving); // load last element in list
  if (saving != false) {
    try { $('#loads').children()[loadedlist].focus() }
    catch (err) { display([err, 'loadedlist is ' + loadedlist]) }
  }
  if ($($('#loads').children()[loadedlist]).val().slice(0, 2) == '- ') {
    $($('#loads').children()[loadedlist]).addClass('sublist')
  } else {
    $($('#loads').children()[loadedlist]).removeClass('sublist')
  }
  dragsOff(saving)
}

function deletelist() {
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

function loadList(saving) { 
  // load the current loadedlist into Flop
  if (loadedlist === undefined) {
    display('no loaded list')
    return
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
  if (saving != false) {
    save('L')
  } else {
    $(loads[loadedlist]).blur()
  }
  $('#flop').scrollTop(0)
  if (mobileTest() && !$('#leftcol').hasClass('collapsed') && saving) {
    // collapse menu again
    toggleCollapse(true)
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