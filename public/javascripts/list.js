(function() {
  var S;

  S = KISSY;

  S.use('node,ajax', function(S, Node, io) {
    var $, $list, $listItem, $search, height, iframe, parent;
    $ = Node.all;
    $search = $('#J_Search');
    $list = $('#J_List');
    $listItem = $list.all('li');
    $search.on('keyup', function(ev) {
      var letter;
      letter = $(ev.target).val();
      if (letter === '') {
        $listItem.show();
        return true;
      }
      $listItem.hide();
      return $listItem.each(function($item) {
        var data, reg;
        data = [$item.attr('data-name'), $item.attr('data-desc'), $item.attr('data-author')];
        reg = new RegExp(letter);
        return S.each(data, function(d) {
          if (reg.test(d)) {
            $item.show();
            return true;
          }
        });
      });
    });
    document.domain = "kissyui.com";
    parent = window.parent;
    height = document.getElementById('J_List').scrollHeight + 260;
    iframe = parent.document.getElementsByTagName('iframe')[0];
    return iframe.height = height;
  });

}).call(this);
