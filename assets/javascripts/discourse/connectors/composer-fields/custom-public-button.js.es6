import showModal from "discourse/lib/show-modal";

export default {
  actions: {
    clickButton() {
      showModal('curation-form');
    }
  }
};
