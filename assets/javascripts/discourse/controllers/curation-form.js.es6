import ModalFunctionality from 'discourse/mixins/modal-functionality';
import AjaxLib from 'discourse/lib/ajax';

export default Ember.Controller.extend(ModalFunctionality, {
  modal_title: Ember.computed.oneWay('model.title'),
  title: Ember.computed.oneWay('model.title'),
  tag_groups_data: Ember.computed.oneWay('model.tag_groups_data'),
  selected_group_names: Discourse.SiteSettings.topic_curation_group_names.split('|'),
  actions: {
    SelectedGroupsTags() {

      var items=document.getElementsByClassName('selected-tags-in-curation-form');
    	var tags_array = [];
      $("#show_selected_tags").empty();
		  for(var i=0; i<items.length; i++){
			if (items[i].checked==true){

        $("#show_selected_tags").append(items[i].value+" ");
				tags_array.push(items[i].value);

			}
		  }
      if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
          localStorage.setItem("tags", tags_array);
          console.log(localStorage.tags);
      } else {
        alert("sorry! Web Storage is not supported by browser")
      }


  }

  }

});