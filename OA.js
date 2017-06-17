//LIU didi shi dashazi! danshiwo buxianqi ta
// Group event information if they have the same clients
function info_common_client_ids(sample_clients, sample_event_occurrences)
{
  var result = [];
  var temp = [];
  for (var i = 0; i < sample_clients.length; i++) {
    for (var j = 0; j < sample_event_occurrences.length; j++) {
      if (sample_event_occurrences[j].client_ids.includes(sample_clients[i].id)) {
        temp.push(
          {
          start: sample_event_occurrences[j].start, 
          end: sample_event_occurrences[j].end,
          event_id: sample_event_occurrences[j].id}
          );
      }
    }
    result.push({
      client_id: sample_clients[i].id,
      client_name: sample_clients[i].name,
      events: temp}
    );
    temp = [];
  }
  return result;
}

// return boolean - check if two events have time conflict
function intersection_time(start1, end1, start2)
{
  if (start1.slice(4,start1.length-20) === start2.slice(4,start2.length-20)) {
    var start1_number = parseInt(start1.slice(start1.length-19,start1.length-12).replace(":","0").replace(":","0"));
    var end1_number = parseInt(end1.slice(end1.length-19,end1.length-12).replace(":","0").replace(":","0"));
    var start2_number = parseInt(start2.slice(start2.length-19, start2.length-12).replace(":","0").replace(":","0"));
    if (start2_number < end1_number && start2_number >= start1_number) {
      return true;
    }
  }
  return false;
}

//Group the conflicting event_ids for each client
function find_rough_Conflicts(events)
{
  var result = [];
  for (var j = 0; j < events.length; j++) {
    for (var k = j+1; k < events.length; k++) {
      if (intersection_time(events[j].start, events[j].end, events[k].start)) {
        result.push([events[j].event_id, events[k].event_id]);
      }
    }
  }
  return result;
}

//check if two arrays are equal
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function arrayCopy(arr){return arr;}

//merge sub-arrays if they contain same element
function merge(arr){
  var input = arrayCopy(arr);
  if (arr.length >= 2) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = i+1; j < arr.length; j++) {
        var arr_new = arr[i].concat(arr[j]);
        var arr_merge = arr_new.filter(function (item, pos) {return arr_new.indexOf(item) == pos});
        if (arr_merge.length < arr_new.length) {
          arr.splice(arr.indexOf(arr[i]), 1, arr_merge);
          arr.splice(arr.indexOf(arr[j]),1);
          j--;
        }
      }   
    }
    if (!arraysEqual(input, arr)) {merge(arr)};
  }
  return arr;
}


function findSchedulingConflicts(sample_clients, sample_event_occurrences)
{
  var result = [];
  var info = info_common_client_ids(sample_clients, sample_event_occurrences);
  for (var i = 0; i < info.length; i++) {
    var events = merge(find_rough_Conflicts(info[i].events));
    result.push({
    client_id: info[i].client_id,
    client_name: info[i].client_name,
    conflicting_event_occurrence_ids: events}
    );
  }
  return result;
}
