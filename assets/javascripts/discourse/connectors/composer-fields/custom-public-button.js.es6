import showModal from "discourse/lib/show-modal";
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default {
  actions: {
    clickButton() {
    var show_selected_tags;
    var ajax_call = false;
    if (document.getElementById("show_selected_tags"))
    {
      show_selected_tags = document.getElementById("show_selected_tags").innerText;

      ajax_call = true;
      if (ajax_call){

      if (show_selected_tags.length == 0){
        show_selected_tags = []
      }
      else{
       show_selected_tags =  show_selected_tags.split(',')
      }
      ajax(`/tag_groups.json`).then(result => {
        var controller = showModal('curation-form', {  title: 'topic_curation_form_title', model: {
          tag_groups_data: result, show_selected_tags: show_selected_tags
          }}
        );
      }).catch(function(error) {
               popupAjaxError(error);
      });
      }
    }
    else
    {


    }
    
    }

  }
};
