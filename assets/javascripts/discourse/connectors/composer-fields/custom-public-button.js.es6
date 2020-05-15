import showModal from "discourse/lib/show-modal";
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default {
  
  actions: {
    clickButton() {
    var group_names = Discourse.SiteSettings.topic_curation_group_names_to_render_textboxes.split('|');
    console.log(group_names);
    var show_selected_tags;
    var ajax_call = false;
    var other_keyword_tags=[];
    var tag_groups = []
    var temp_storage_for_tag_groups1 = []
    var temp_storage_for_tag_groups2 = []
    var temp = []

    function removeAllElements(array, elem) {
      var index = array.indexOf(elem);
      while (index > -1) {
          array.splice(index, 1);
          //index = array.indexOf(elem);
      }
    }

    if (document.getElementById("show_selected_tags"))
    {
      show_selected_tags = document.getElementById("show_selected_tags").innerText;

      ajax_call = true;
      if(show_selected_tags){
        show_selected_tags = show_selected_tags.substring(0,show_selected_tags.length - 1)
      }
      if (ajax_call)
      {
      if (show_selected_tags.length == 0)
      {
        show_selected_tags = []
      }
      else
      {
        show_selected_tags =  show_selected_tags.split(',')
        console.log(show_selected_tags);
        other_keyword_tags = show_selected_tags;
      }
      ajax(`/tag_groups.json`).then(result => {
        for(var k=0;k < result.tag_groups.length; k++ ){
          if(other_keyword_tags.length > 0 && other_keyword_tags.filter(x => !result.tag_groups[k].tag_names.includes(x)))
          {
           other_keyword_tags = other_keyword_tags.filter(x => !result.tag_groups[k].tag_names.includes(x))
          }
          //console.log(other_keyword_tags);

          if (  group_names.indexOf(result.tag_groups[k].name) != -1)
          {
            if(show_selected_tags!=0){
              temp = result.tag_groups[k];

              temp["tags"] = show_selected_tags.filter(x => result.tag_groups[k].tag_names.includes(x))
              console.log(temp);
              temp_storage_for_tag_groups2.push(temp);

              temp = []
            }
            else{
              temp_storage_for_tag_groups2.push(result.tag_groups[k]);
            }
          }
          else
          {
            temp_storage_for_tag_groups1.push(result.tag_groups[k]);
          }
        }
          //console.log(temp_storage_for_tag_groups1);
          //console.log(temp_storage_for_tag_groups2);

        var controller = showModal('curation-form', {  title: 'topic_curation_form_title', model: {
          tag_groups_data: temp_storage_for_tag_groups1, show_selected_tags: show_selected_tags, tags: other_keyword_tags, tag_groups_to_render_textboxes: temp_storage_for_tag_groups2
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
