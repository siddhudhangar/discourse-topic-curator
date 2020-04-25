discourse-topic-curator
=======================

Adds custom button in the topic editor of the discourse platform, visible only to staff or admin users or logged in users.

Configuration
=====

From Admin > Site Settings > Plugin, modify `topic_curation_title`, `topic_curation_label`, `topic_curation_allowed_group`, `topic_curation_form_title`.

Installation
============

* Add the plugin's repo url to your container's `app.yml` file

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/siddhudhangar/discourse-topic-curation.git
```

* Rebuild the container

```
cd /var/docker
git pull
./launcher rebuild app
```

License
=======
MIT
