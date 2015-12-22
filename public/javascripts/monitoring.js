function monitoring_agent_status(status){
  // 签入 签出 置忙 置闲 保持 取消保持 挂机 外呼 小休 结束休息 结束整理 转接 咨询 结束咨询
  var agent_status =  {'online': '签入', 'busy': '置忙', 'ready': '置闲',
                       'offering': '分配', 'ring': '振铃中', 'lock': '锁定',
                       'connect': '通话中', 'dialing': '外呼振铃', 'rest': '小休',
                       'after_work': '整理中', 'prepare_call': '拨打电话',
                       'call_standby': '摘机', 'outbound_connect': '外呼电话连接中',
                       'consulting': '咨询中', 'consult_connect': '咨询通话中', 
                       'consulted_offering': '咨询分配', 'consulted_ring': '咨询被连接人振铃',
                       'consulted_connect': '咨询被连接人接听', 'wait_retrieve_connect': '等待咨询恢复',
                       'offline': '离线'
                      }
  return agent_status[status];
}

function monitoring_generate_info(data){
  var agent_info = "";
  $.each(data, function(index){
    var value = data[index]==undefined ? "" : data[index];
    agent_info = agent_info + "<td>" + value + "</td>";
  });
  return agent_info;
}

function monitoring_date_to_minute(data){
  if(data!=undefined){
    var millisecond = parseInt(data);
    var second = millisecond/1000;
    if(second>=3600){
      return monitoring_filling(parseInt(second/3600)) + ":" + monitoring_filling(parseInt(second%3600/60)) + ":" + monitoring_filling(second%3600%60);
    }else if(second>60){
      return "00:" + monitoring_filling(parseInt(second/60)) + ":" + monitoring_filling(second%60);
    }else if(second>=0){
      return "00:00:"+monitoring_filling(second);
    }else{
      return "00:00:00"
    }
  }else{
    return "00:00:00"
  }
}

function monitoring_filling(data){
  if(data<10){
    return "0" + data;
  }else{
    return data;
  }
}

function monitoring_time_and_today(time, today){
  time = time == undefined ? "0" : time;
  today = today == undefined ? "0" : today;
  return time + "/" + today;
}

function monitoring_datetime_to_minute(begin_at, end_at){
  if(begin_at==""){
    return "";
  }else{
    var begin_time = Date.parse(begin_at);
    var end_time = Date.parse(end_at);
    return monitoring_date_to_minute(end_time - begin_time);
  }
}