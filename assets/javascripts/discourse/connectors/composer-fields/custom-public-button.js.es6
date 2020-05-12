import showModal from "discourse/lib/show-modal";
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default {
  actions: {
    clickButton() {
    var show_selected_tags;
    var ajax_call = false;
    var other_keyword_tags=[];
    if (document.getElementById("show_selected_tags"))
    {
      show_selected_tags = document.getElementById("show_selected_tags").innerText;

      ajax_call = true;
      if (ajax_call)
      {
      if (show_selected_tags.length == 0)
      {
        show_selected_tags = []
      }
      else
      {
        show_selected_tags =  show_selected_tags.split(',')
        other_keyword_tags = show_selected_tags;
      }
      ajax(`/tag_groups.json`).then(result => {
        console.log(result);
        for(var k=0;k < result.tag_groups.length; k++ ){
          if(other_keyword_tags.length > 0 && other_keyword_tags.filter(x => !result.tag_groups[k].tag_names.includes(x)))
          {
           other_keyword_tags = other_keyword_tags.filter(x => !result.tag_groups[k].tag_names.includes(x))
          }
        }
        var controller = showModal('curation-form', {  title: 'topic_curation_form_title', model: {
          tag_groups_data: result, show_selected_tags: show_selected_tags, tags: other_keyword_tags
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
