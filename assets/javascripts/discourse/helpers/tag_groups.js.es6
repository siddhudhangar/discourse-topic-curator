import { registerUnbound } from 'discourse-common/lib/helpers';
import renderTagGroups from "../lib/render_tag_groups";

export default registerUnbound("custom_helper_to_render_tag_groups", function(tag_group,selected_group_names,show_selected_tags) {
  return new Handlebars.SafeString(renderTagGroups(tag_group,selected_group_names,show_selected_tags));
});