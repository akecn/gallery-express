$ = jQuery
$('#J_List').mixitup()
setTimeout(()->
  try
    document.domain="kissyui.com"
    parent = window.parent
    height = document.getElementById('J_List').scrollHeight+260;
    iframe = parent.document.getElementsByTagName('iframe')[0];
    iframe.height = height

  $('.J_SortNew').trigger('click')
,1000)

$search = $ '#J_Search'
$list = $ '#J_List'

$search.on 'keyup',(ev)->
  letter = $(ev.target).val()
  $listItem = $list.children 'li'
  if letter is ''
    $listItem.show()
    return true;
  $listItem.hide()
  $listItem.each(()->
    $item = $(this)
    data = [$item.attr('data-name'),$item.attr('data-desc'),$item.attr('data-author')]
    reg = new RegExp(letter)
    for d in data
      if reg.test d
        $item.show()
        return true
  )