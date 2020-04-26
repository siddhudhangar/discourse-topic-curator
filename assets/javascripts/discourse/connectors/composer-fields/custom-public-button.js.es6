import showModal from "discourse/lib/show-modal";
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default {
  actions: {
    clickButton() {

    ajax(`/tag_groups.json`).then(result => {
        var controller = showModal('curation-form', {  title: 'topic_curation_form_title', model: {
          tag_groups_data: result,
          }}
        );
      }).catch(function(error) {
               popupAjaxError(error);
      });
    }

  }
};
