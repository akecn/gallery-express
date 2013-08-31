$ = jQuery
$('#J_List').mixitup()
setTimeout(()->
  try
    document.domain="kissyui.com"
    parent = window.parent
    height = document.getElementById('J_List').scrollHeight+400;
    iframe = parent.document.getElementsByTagName('iframe')[0];
    iframe.height = height

  $('.J_SortNew').trigger('click')
,1000)

$search = $ '#J_Search'
$list = $ '#J_List'
$listItem = $list.children 'li'

$search.on 'keyup',(ev)->
  letter = $(ev.target).val()
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
#点击标签
$tag = $ '.J_Tag'
$tag.on 'click',(ev)->
  $tag.removeClass 'tag-current'
  $target = $(ev.target)
  $target.addClass 'tag-current'
  #标签下的组件
  coms = $target.attr 'data-coms'
  $listItem.hide()
  $listItem.each(()->
    $item = $ this
    name = $item.attr 'data-name'
    reg = new RegExp(name)
    if reg.test coms
      $item.fadeIn "normal"
  )