(function ($) {

    //签入 签出 置忙 置闲 保持 取消保持 二次呼叫 挂机 外呼 小休 结束休息 结束整理 转接 咨询 结束咨询
    var BUTTON_STATUSES = {
       'online'               : "0,2,1,0,1,0,0,0,1,1,0,1,1,1,0",
       'busy'                 : "0,1,0,2,1,0,0,0,2,2,0,1,1,1,0",
       'ready'                : "0,2,2,0,1,0,0,0,1,2,0,1,1,1,0",
       'offering'             : "0,1,1,0,1,0,0,2,0,1,0,1,1,1,0",
       'ring'                 : "0,1,1,0,1,0,0,2,0,1,0,1,1,1,0",
       'lock'                 : "0,1,1,0,1,0,0,1,0,1,0,1,1,1,0",
       'connect'              : "0,1,1,0,2,0,2,2,0,2,0,1,2,2,0",
       'hold'                 : "0,1,1,0,0,2,1,2,0,1,0,1,1,1,0",
       'dialing'              : "0,1,0,1,1,0,2,2,0,1,0,1,1,1,0",
       'rest'                 : "0,2,1,0,1,0,0,0,1,0,2,1,1,1,0",
       'after_work'           : "0,1,1,0,1,0,0,0,1,1,0,2,1,1,0",
       'prepare_call'         : "0,1,1,0,1,0,0,0,1,1,0,1,1,1,0",
       'call_standby'         : "0,1,1,0,1,0,0,0,1,1,0,1,1,1,0",
       'consulting'           : "0,1,1,0,1,0,2,1,0,1,0,1,1,0,2",
       'consult_connect'      : "0,1,1,0,1,0,2,1,0,2,0,1,2,0,2",
       'consulted_offering'   : "0,1,1,0,1,0,2,2,0,1,0,1,1,1,0",
       'consulted_ring'       : "0,1,1,0,1,0,2,2,0,1,0,1,1,1,0",
       'consulted_connect'    : "0,1,1,0,1,0,2,2,0,2,0,1,1,1,0",
       'wait_retrieve_connect': "0,1,1,0,1,0,2,2,0,1,0,1,1,0,2",
       'offline'              : "2,0,1,0,1,0,0,0,1,1,0,1,1,1,0"
    };      

    function button_request_ajax(action, base_url, params, callback){
        $.get(base_url + action, params, function(data) {
          if (callback) callback(data);
        }, "jsonp");
    }    

    function change_button_status(status){
        //(签入 签出) (置忙 置闲) (保持 取消保持) 二次外呼 (挂机 外呼) (小休 结束休息) 结束整理 转接 (咨询 结束咨询)
        var basic_status = "hidden,disabled,show";
        $.each(BUTTON_STATUSES[status].split(","), function(index, elm){
          $(".seat_btn_group button").eq(index).removeClass("hidden  disabled  ready").addClass(basic_status.split(",")[elm]);
        });
    }   

    function change_keypad_status(status) {
        if (status == "dialing"){
          $(".call_menu_input").val('');
          $(".show_call").removeClass('show').addClass('hide');
        }        
    }

    function subscribe_agent_event(e, event_socket, job_code) {
        var settings = e.data('softphone');
        var socket = io(event_socket);
        socket.emit("subscribe", {job_code: job_code, type: "event"});
        socket.emit("subscribe", {topics:[{tid: 120, item: job_code}],type:'monitor'});
        socket.on('data', function (data) {
            var event = data.event;
            console.log(data);
            if(event){
                if (event == 'dialing'){
                    settings["call_id"] = data.call_id;
                } else if (event == 'offering') {
                    settings["call_id"] = data.call_id;
                } else if (event == 'status_changed') {
                    settings["status"] = data.status;
                    change_button_status(data.status);
                    change_keypad_status(data.status);
                }
                e.data('softphone', settings);
                if (event) {
                    e.trigger(event, data);
                }
            }else{
                var data = jQuery.parseJSON(data);
                var call_time = data.content;
                call_time["publish_at"] = data.publish_at;
                if(data.content){
                    if(data.topic==120){
                        e.trigger("agent_call_time", call_time);
                    }
                }
            }
        });
        socket.on('warn', function(data){
            $(".logout_lay").show();
        });
    }      

    // 显示技能组树
    function show_skillgroup_tree(action) {
        $(".seat_panel").removeClass("hide");
        $(".seat_panel").addClass("show");
    }
 
    var methods = {
        init: function(options) {
            return this.each(function() {
                var settings = $(this).data('softphone');
                if (typeof(settings) == 'undefined') {
                    var settings = $.extend({}, {
                        'answer_mode': 'ring',
                        'after_hangup': 'ready',
                        'after_work_timeout': 30000,
                        'call_id': null                 
                    }, options);
                    $(this).data('softphone', settings);
                } else {
                    settings = $.extend({}, settings, options);                    
                    $(this).data('softphone', settings);
                }
                $this = $(this);
                $.getScript(settings["event_socket"] + "/socket.io/socket.io.js").done(function() {
                    $.get('/softphone', function(data) {
                        $this.html(data);
                        $('.seat_btn_group button').click(function() {
                            methods[$(this).data("action")].apply($this);                                
                        });
                        $('.call_button_menu').click(function() {
                            var call = $(".seat_btn_group button").eq(6).attr("class");
                            if(call.indexOf("show")>=0 && call.indexOf("hidden")<0){
                                methods[$(this).data("action")].apply($this, [$(this).text()]);                                
                            }
                        });
                        $("button[name='btn-make-call']").click(function() {
                            var dnis = $(".call_menu_input").val();
                            methods["make_call"].apply($this, [dnis]);
                        }); 

                        $("button[name='external-btn-make-call']").click(function() {
                            var dnis = $(".external_call_menu_input").val();
                            methods["transfer"].apply($this, ['external', dnis]);
                        });

                        $(".call_skill_group_tree").on("click", ".jqtree-title", function() {
                            var code = $(this).data("code");
                            var call_type = $(this).data("type");
                            if (settings["consult_action"] == 'transfer') {
                                methods["transfer"].apply($this, [call_type, code]);
                            } else if(settings["consult_action"] == 'consult') {
                                methods["consult"].apply($this, [call_type, code]);
                            }
                            $(".seat_panel").removeClass("show");
                            $(".seat_panel").addClass("hide");
                        });
                        $(".close_skillgroup_tree").click(function(){
                            $(".seat_panel").removeClass("show");
                            $(".seat_panel").addClass("hide");
                        });
                        $(".close_sofrphone_keypad").click(function(){
                            $(".call_menu_input").val('');
                            $(".show_call").removeClass('show').addClass('hide');
                        });
                        console.log("fsdfadfasdfasdfasdf");
                        methods.reset_status.apply($this);
                        subscribe_agent_event($this, settings["event_socket"], settings["job_code"]);  
                    });
                });
            });
        },
        
        destroy: function(options) {
            return this.each(function() {
                $(this).removeData('softphone');
            });
        },

        // 登录
        login: function() {
            var self = this;
            var settings = self.data('softphone');
            button_request_ajax('login', settings["base_url"], {
                job_code: settings["job_code"],
                queues: settings["queues"],
                device_no: settings["device_no"],
                default_ani: settings["ani"],
                device_type: settings['device_type'],
                answer_mode: settings["answer_mode"],
                after_hangup: settings["after_hangup"],
                after_work_timeout: settings["after_work_timeout"],
                extra: settings["extra"]
            }, function(data) {
                settings["login_id"] = data["login_id"];
                $(self).data('softphone', settings);
            });
        },  

        //签出
        logout: function(){
            var self = this;
            var settings = self.data('softphone');
            button_request_ajax('logout', settings["base_url"], {login_id: settings["login_id"]}, function() {
                settings["login_id"] = null;
                $(self).data('softphone', settings);
            });
        },        

        //挂机
        hangup: function() {
            var self = this;
            var settings = self.data('softphone');
            button_request_ajax('hangup', settings["base_url"], {login_id: settings["login_id"], call_id: settings["call_id"]});
            settings["call_id"] = null;
            $(self).data('softphone', settings);
        },
        //小休
        rest: function(){
            var settings = $(this).data('softphone');
            button_request_ajax('rest', settings["base_url"], {login_id: settings["login_id"]});
        },
         //结束休息
        unrest: function(){
            var settings = $(this).data('softphone');
            button_request_ajax('unrest', settings["base_url"], {login_id: settings["login_id"]});
        },
        //置忙
        set_busy: function(){
            var settings = $(this).data('softphone');
            button_request_ajax('set_busy', settings["base_url"], {login_id: settings["login_id"]});
        },
        //置闲
        set_ready: function(){
            var settings = $(this).data('softphone');
            button_request_ajax('set_ready', settings["base_url"], {login_id: settings["login_id"]});
        },
        //保持
        hold: function(){
            var settings = $(this).data('softphone');
            button_request_ajax('hold', settings["base_url"], {login_id: settings["login_id"]});
        },
        //取保持
        unhold: function(){
            var settings = $(this).data('softphone');
            button_request_ajax('unhold', settings["base_url"], {login_id: settings["login_id"]});
        },
        //结束整理
        to_work: function(){
            var settings = $(this).data('softphone');
            button_request_ajax('to_work', settings["base_url"], {login_id: settings["login_id"]});
        }, 
        //结束咨询
        stop_consult: function(){
            var settings = $(this).data('softphone');
            button_request_ajax('stop_consult', settings["base_url"], {login_id:  settings["login_id"]});
        },

        //发送dtmf
        send_dtmf: function(digit){
            var settings = $(this).data('softphone');
            button_request_ajax('send_dtmf', settings["base_url"], {login_id: settings["login_id"], digit: digit});
        },

        //外呼
        make_call: function(dnis, extra){
            var self = this;
            var settings = self.data('softphone');            
            button_request_ajax('make_call', settings["base_url"], {
              login_id: settings["login_id"],
              ani: settings["ani"],
              mode: 'external',
              dnis: dnis,
              extra: extra || settings["extra"],
            });
        },

        // 显示拨号盘
        show_keypad: function() {
            $(".call_menu_input").val('');
            $(".show_call").toggleClass('hide');
        },    

        show_transfer: function() {
            var self = this;
            var settings = self.data('softphone');
            show_skillgroup_tree();
            settings["consult_action"] = "transfer";
            $(self).data('softphone', settings);
        },
          
        show_consult: function() {
            var self = this;
            var settings = self.data('softphone');
            show_skillgroup_tree();
            settings["consult_action"] = "consult";
            $(self).data('softphone', settings);
        },

        transfer: function(mode, dest_no, status) {
            var self = this;
            var settings = self.data('softphone');
            if (settings["status"] == "connect") {
                button_request_ajax('transfer', settings["base_url"], {login_id: settings["login_id"], dest_no: dest_no, mode: mode, extra: settings["extra"]});
            } else if (settings["status"] == "consult_connect") {
                button_request_ajax('to_transfer', settings["base_url"], {login_id: settings["login_id"], mode: mode});
            }
        },

        consult: function(mode, dest_no) {
            var self = this;
            var settings = self.data('softphone');              
            button_request_ajax('consult', settings["base_url"], {login_id: settings["login_id"], dest_no: dest_no, mode: mode, extra: settings["extra"]});
        },

        reset_status: function() {
            var self = this;
            var settings = self.data('softphone');            
            $.get(settings["base_url"] + "status", {job_code: settings["job_code"]}, 
              function(data) {
                settings["login_id"] = data["login_id"];
                settings["call_id"] = data["call_id"];        
                settings["status"] = data['status'];        
                change_button_status(data['status']);
                $(self).data('softphone', settings);
            }, "jsonp");
        }      
    };
 
    $.fn.softphone = function(method) {
        // 方法调用
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method' + method + 'does not exist on jQuery.tooltip');
        }
    };

})(jQuery);