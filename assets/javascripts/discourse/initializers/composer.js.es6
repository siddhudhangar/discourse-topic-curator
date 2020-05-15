import { withPluginApi } from 'discourse/lib/plugin-api';
import Composer from "discourse/models/composer";
import DiscourseURL from 'discourse/lib/url';

function initializePlugin(api) {
  // do stuff with plugin API!
   localStorage.setItem("tags", "")
   //console.log("initializePlugin method called");
}

export default {
  name: 'composer-editor',
  initialize() {
     withPluginApi('0.1', api => {       
       api.onPageChange((url, title) => {
        //console.log('the page changed');
        localStorage.setItem("tags", "");
      }),

       initializePlugin(api),

	    api.modifyClass('controller:composer', {
	      actions: {
	       save(force) {
	       		//console.log("localStorage.tags");
	       		//console.log(localStorage.tags);
	       		//console.log("save method called");

	       		    if (this.disableSubmit) return;

    // Clear the warning state if we're not showing the checkbox anymore
    if (!this.showWarning) {
      this.set("model.isWarning", false);
    }

    const composer = this.model;
    console.log("composer");
    console.log(composer);

    if (composer.cantSubmitPost) {
      this.set("lastValidatedAt", Date.now());
      return;
    }

    composer.set("disableDrafts", true);
	console.log(localStorage.tags.split(","));
	composer.set("tags", localStorage.tags.split(","));
	//composer.setProperties({ tags: localStorage.tags.split(",") });

    // for now handle a very narrow use case
    // if we are replying to a topic AND not on the topic pop the window up
    if (!force && composer.replyingToTopic) {
      const currentTopic = this.topicModel;

      if (!currentTopic) {
        this.save(true);
        return;
      }

      if (currentTopic.id !== composer.get("topic.id")) {
        const message = I18n.t("composer.posting_not_on_topic");

        let buttons = [
          {
            label: I18n.t("composer.cancel"),
            class: "d-modal-cancel",
            link: true
          }
        ];

        buttons.push({
          label:
            I18n.t("composer.reply_here") +
            "<br/><div class='topic-title overflow-ellipsis'>" +
            currentTopic.get("fancyTitle") +
            "</div>",
          class: "btn btn-reply-here",
          callback: () => {
            composer.setProperties({ topic: currentTopic, post: null });
            this.save(true);
          }
        });

        buttons.push({
          label:
            I18n.t("composer.reply_original") +
            "<br/><div class='topic-title overflow-ellipsis'>" +
            this.get("model.topic.fancyTitle") +
            "</div>",
          class: "btn-primary btn-reply-on-original",
          callback: () => this.save(true)
        });

        bootbox.dialog(message, buttons, { classes: "reply-where-modal" });
        return;
      }
    }

    var staged = false;

    // TODO: This should not happen in model
    const imageSizes = {};
    $("#reply-control .d-editor-preview img").each((i, e) => {
      const $img = $(e);
      const src = $img.prop("src");

      if (src && src.length) {
        imageSizes[src] = { width: $img.width(), height: $img.height() };
      }
    });

    const promise = composer
      .save({ imageSizes, editReason: this.editReason })
      .then(result => {
        if (result.responseJson.action === "enqueued") {
          this.send("postWasEnqueued", result.responseJson);
          if (result.responseJson.pending_post) {
            let pendingPosts = this.get("topicController.model.pending_posts");
            if (pendingPosts) {
              pendingPosts.pushObject(result.responseJson.pending_post);
            }
          }

          return this.destroyDraft().then(() => {
            this.close();
            this.appEvents.trigger("post-stream:refresh");
            return result;
          });
        }

        if (this.get("model.editingPost")) {
          this.appEvents.trigger("post-stream:refresh", {
            id: parseInt(result.responseJson.id, 10)
          });
          if (result.responseJson.post.post_number === 1) {
            this.appEvents.trigger("header:update-topic", composer.topic);
          }
        } else {
          this.appEvents.trigger("post-stream:refresh");
        }

        if (result.responseJson.action === "create_post") {
          this.appEvents.trigger("post:highlight", result.payload.post_number);
        }

        if (result.responseJson.route_to) {
          this.destroyDraft();
          if (result.responseJson.message) {
            return bootbox.alert(result.responseJson.message, () => {
              DiscourseURL.routeTo(result.responseJson.route_to);
            });
          }
          return DiscourseURL.routeTo(result.responseJson.route_to);
        }

        this.close();

        const currentUser = this.currentUser;
        if (composer.creatingTopic) {
          currentUser.set("topic_count", currentUser.topic_count + 1);
        } else {
          currentUser.set("reply_count", currentUser.reply_count + 1);
        }

        const post = result.target;
        if (post && !staged) {
          DiscourseURL.routeTo(post.url, { skipIfOnScreen: true });
        }
      })
      .catch(error => {
        composer.set("disableDrafts", false);
        if (error) {
          this.appEvents.one("composer:will-open", () => bootbox.alert(error));
        }
      });

    if (
      this.router.currentRouteName.split(".")[0] === "topic" &&
      composer.get("topic.id") === this.get("topicModel.id")
    ) {
      staged = composer.get("stagedPost");
    }

    this.appEvents.trigger("post-stream:posted", staged);

    this.messageBus.pause();
    promise.finally(() => this.messageBus.resume());

    return promise;
	        }
	      }
	    }); //composer controller ended here

      api.modifyClass('controller:topic', {
      actions: {
        editPost(post) {
          //alert("edit post method");
          console.log("edit post method");

      if (!this.currentUser) {
        return bootbox.alert(I18n.t("post.controls.edit_anonymous"));
      } else if (!post.can_edit) {
        return false;
      }

      const composer = this.composer;
      let topic = this.model;
      //console.log(topic);
      //console.log(composer);

      const composerModel = composer.get("model");
      let editingFirst =
        composerModel &&
        (post.get("firstPost") || composerModel.get("editingFirstPost"));

      let editingSharedDraft = false;
      let draftsCategoryId = this.get("site.shared_drafts_category_id");
      if (draftsCategoryId && draftsCategoryId === topic.get("category.id")) {
        editingSharedDraft = post.get("firstPost");
      }

      const opts = {
        post,
        action: editingSharedDraft ? Composer.EDIT_SHARED_DRAFT : Composer.EDIT,
        draftKey: post.get("topic.draft_key"),
        draftSequence: post.get("topic.draft_sequence")
      };

      if (editingSharedDraft) {
        opts.destinationCategoryId = topic.get("destination_category_id");
      }

      // Cancel and reopen the composer for the first post
      if (editingFirst) {
        composer.cancelComposer().then(() => composer.open(opts));
      } else {
        composer.open(opts);
      }
        }
      }
      }); // topic controller ended here
     });

  }
}
