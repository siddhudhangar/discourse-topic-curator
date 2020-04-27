# name: discourse-topic-curator
# about: adds custom button named curate in the editor of discourse, visible only to staff or admin users or logged in users.
# version: 1.0
# authors: Siddhu Dhangar,Mahesh Tirthakar
# url: https://github.com/siddhudhangar/discourse-topic-curator

enabled_site_setting :topic_curation_enabled

PLUGIN_NAME ||= "discourse_topic_organizer".freeze

register_asset 'stylesheets/custom_public_button.css'

after_initialize do
  add_to_serializer(:current_user, :can_see_topic_group_button?) do
    return true if scope.is_staff?
    group = Group.find_by("lower(name) = ?", SiteSetting.topic_curation_allowed_group.downcase)
    return true if group && GroupUser.where(user_id: scope.user.id, group_id: group.id).exists?
  end
end
