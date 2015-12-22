(function($) {
  $.fn.treeSelect = function(options) {

    return this.each(function() {
      var self = $(this);
      var dropdown = $("<div class='dropdown-menu tree_select_dropdown ml15 pl10'></div>");
      var treeview = $("<div class='tree_view'>");
      dropdown.append(treeview).insertAfter(self);
      var field_name = self.prop('name').replace(/_name\]/, "_id]");
      var hidden_field = $("<input type='hidden' name='" + field_name + "'>");
      hidden_field.val(self.data('value'));
      hidden_field.insertAfter(self);
      $.getJSON(options.url, function(data) {
          treeview.tree({
              data: data,
              autoOpen: true,onCreateLi: function(node, $li) {
                  $li.find('.jqtree-title').attr("id", node.id);
              }
          });
      });

      treeview.on('click', '.jqtree-title', function(){
         var _dept_node = $(this).attr("id");
         var _dept_text = $(this).text();
         if(_dept_node){
           self.val(_dept_text);
           hidden_field.val(_dept_node);
         }
         dropdown.hide();
      });  
      
      self.focus(function(){
        dropdown.show();
      });  

      $(window).mousedown(function(e){
        e = window.event || e; 
        obj = $(e.srcElement || e.target);
        if (!$(obj).is(".tree_select_dropdown, .tree_select_dropdown *")) { 
          dropdown.hide();
        } 
      });              
    })
  }
})(jQuery)