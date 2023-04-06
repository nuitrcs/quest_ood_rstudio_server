'use strict'

/**
 *   Toggle the visibility of a form group
 *  
 *   @param      {string}    form_id  The form identifier
 *   @param      {boolean}   show     Whether to show or hide
 */
function toggle_visibility_of_form_group(form_id, show) {
  let form_element = $(form_id);
  let parent = form_element.parent();

  if(show) {
    parent.show();
  } else {
    form_element.val('');
    parent.hide();
  }
}

function get_associations() {
  const raw_data = $('#batch_connect_session_context_raw_data').val();
  const assocs = [];
  for (const assoc of raw_data.split(" ").filter(x => x)) {
    const [account, qos_list] = assoc.split("|");
    if (qos_list.includes("normal")) {
        assocs.push({ partition: 'short', account});
        assocs.push({ partition: 'normal', account});
        assocs.push({ partition: 'long', account});
        assocs.push({ partition: 'gengpu', account});
        assocs.push({ partition: 'genhimem', account});
    } else if (qos_list.includes("buyin") && !account.includes("b1042") && !account.includes("b1094") && !account.includes("b1095") && !account.includes("b1119") && !account.includes("b1026")) {
        assocs.push({ partition: account, account });
    }
    if (account.includes("a9009")) {
        assocs.push({ partition: "all", account });
    } else if (account.includes("b1042")) {
        assocs.push({ partition: "genomics", account });
        assocs.push({ partition: "genomicslong", account });
        assocs.push({ partition: "genomics-gpu", account });
        assocs.push({ partition: "genomics-himem", account });
    } else if (account.includes("b1026")) {
        assocs.push({ partition: "cosmoshimem", account });  
        assocs.push({ partition: "cosmoscompute", account });
    } else if (account.includes("b1094")) { 
        assocs.push({ partition: "ciera-std", account }); 
        assocs.push({ partition: "ciera-gpu", account });
        assocs.push({ partition: "ciera-specialist", account });
        assocs.push({ partition: "ciera-himem", account });
    } else if (account.includes("b1095")) { 
        assocs.push({ partition: "grail-std", account });
        assocs.push({ partition: "grail-ligo", account });
        assocs.push({ partition: "grail-specialist", account });
    } else if (account.includes("b1119")) { 
        assocs.push({ partition: "posydon-std", account }); 
        assocs.push({ partition: "posydon-priority", account });
        assocs.push({ partition: "posydon-long", account });
    }
  }
  return assocs;
}

function replace_options($select, new_options) {
  const old_selection = $select.val();
  $select.empty();
  new_options.sort().map(option => $select.append($("<option></option>").attr("value", option).text(option)));
  if (new_options.includes(old_selection)) {
    $select.val(old_selection);
  }
}

/**
 *  Toggle the visibility of the GRES Value field
 */
function toggle_gres_value_field_visibility() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  let gpu_partitions = [
    'gengpu',
    'gpu-benchmark',
    'b1028',
    'b1030',
    'genomics-gpu',
    'genomicsguest-gpu',
    'ciera-gpu',
    'b1105',
    'b1164',
    'b1171',
    'all'
  ];

  toggle_visibility_of_form_group(
    '#batch_connect_session_context_gres_value',
    gpu_partitions.includes(slurm_partition.val()));
}

function set_available_accounts() {
  let assocs = get_associations();
  const selected_partition = $("#batch_connect_session_context_slurm_partition").val();
  assocs = assocs.filter(({ partition }) => partition === selected_partition);
  const accounts = assocs.map(({ account }) => account);
  replace_options($("#batch_connect_session_context_slurm_account"), accounts);
}

function set_min_max() {
  const selected_partition = $("#batch_connect_session_context_slurm_partition").val();

  if (selected_partition.includes("short")) {
    $("#batch_connect_session_context_bc_num_hours").attr({
       "max" : 4,
       "min" : 1,
    });
  } else if (selected_partition.includes("normal")) {
    $("#batch_connect_session_context_bc_num_hours").attr({
       "max" : 48,
       "min" : 4,
    });
  } else if (selected_partition.includes("long")) {
    $("#batch_connect_session_context_bc_num_hours").attr({
       "max" : 168,
       "min" : 48,
    });
  } else if (selected_partition.includes("genhimem")) {
    $("#batch_connect_session_context_bc_num_hours").attr({
       "max" : 48,
       "min" : 1,
    });
  } else if (selected_partition.includes("gengpu")) {
    $("#batch_connect_session_context_bc_num_hours").attr({
       "max" : 48,
       "min" : 1,
    });
  } else {
    $("#batch_connect_session_context_bc_num_hours").attr({
       "max" : "",
       "min" : 1,
    });
  } 

  let himem_partitions = ['genhimem','cosmoscompute','cosmoshimem','b1041','genomics-himem','b1048','b1054','b1057','b1090','ciera-himem','b1132','b1134','b1140','b1167']

  if (himem_partitions.includes(selected_partition)) {
    $("#memory_per_node").attr({
       "max" : 1479,
       "min" : 1,
    });
  } else {
    $("#memory_per_node").attr({
       "max" : 243,
       "min" : 1,
    });
  }

}

function update_available_options() {
  set_available_accounts();
}

function update_min_max() {
  set_min_max();
}

/**
 * Sets the change handler for the slurm partition select.
 */
function set_slurm_partition_change_handler() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  slurm_partition.change(() => {
    toggle_gres_value_field_visibility();
    update_available_options();
    update_min_max();
  });
}

/**
 * Sets the change handler for the slurm account select.
 */
function set_slurm_account_change_handler() {
  const slurm_account = $("#batch_connect_session_context_slurm_account");
  slurm_account.change(() => {
    update_available_options();
  });
}

function set_available_partitions() {
  const assocs = get_associations();
  const allpartitions = [...new Set(assocs.map(({ partition }) => partition))];
  // Skip on partition value of cortex as that is an obsolete partition now
  const non_existent_partition = 'cortex';
  const partitions = allpartitions.filter(partition => partition !== non_existent_partition);
  replace_options($("#batch_connect_session_context_slurm_partition"), partitions);
}

/**
 *  Install event handlers
 */
$(document).ready(function() {
  set_available_partitions();
  // Ensure that fields are shown or hidden based on what was set in the last session
  toggle_gres_value_field_visibility();
  // Update available options appropriately
  update_available_options();
  set_slurm_partition_change_handler();
  set_slurm_account_change_handler();
});

