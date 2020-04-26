import ModalFunctionality from 'discourse/mixins/modal-functionality';
import AjaxLib from 'discourse/lib/ajax';

export default Ember.Controller.extend(ModalFunctionality, {
  modal_title: Ember.computed.oneWay('model.title'),
  title: Ember.computed.oneWay('model.title'),
  tag_groups_data: Ember.computed.oneWay('model.tag_groups_data'),
  selected_group_names: Discourse.SiteSettings.topic_curation_group_names.split('|'),
});