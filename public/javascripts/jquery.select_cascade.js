(function($) {
  $.fn.cascadeSelect = function(options) {
    $(this).on('change', options.source, function(){
      var self = $(this);
      $.getJSON(options.url, {schedule_id: options.schedule_id, source: $("option:selected", self).val()}, function(data) {
        if(options.parent){
          options.sub_cascade = self.parent().next().find("select");
        }else{
          options.sub_cascade = $(options.sub_cascade);
        }
        if($("option:selected", self).val()!="System"){
          options.sub_cascade.html("<option>-- 请选择 --</option>");
        }else{
          options.sub_cascade.html("");
        }
        $.each(data, function(key, value) {
          var _option = $("<option></option>");
          _option.val(value[1]);
          _option.text(value[0]);
          options.sub_cascade.append(_option);
        });
      });
    });
  }
})(jQuery)