import ModalFunctionality from 'discourse/mixins/modal-functionality';
import AjaxLib from 'discourse/lib/ajax';

export default Ember.Controller.extend(ModalFunctionality, {
  modal_title: Ember.computed.oneWay('model.title'),
  title: Ember.computed.oneWay('model.title'),
  tag_groups_data: Ember.computed.oneWay('model.tag_groups_data'),
  selected_group_names: Discourse.SiteSettings.topic_curation_group_names.split('|'),
  show_selected_tags: Ember.computed.oneWay('model.show_selected_tags'),
  tag_groups_to_render_textboxes: Ember.computed.oneWay('model.tag_groups_to_render_textboxes'),

  actions: {
    SelectedGroupsTags(tags) {
      //console.log("SelectedGroupsTags");
      //console.log(tags);
      var items=document.getElementsByClassName('selected-tags-in-curation-form');
    	var tags_array = [];
      $("#show_selected_tags").empty();

		  for(var i=0; i<items.length; i++){
			if (items[i].checked==true || items[i].type=="text"){

        //$("#show_selected_tags").append(items[i].value+",");
        if (items[i].value){
				tags_array.push(items[i].value);
        }
			}
      else if(items[i].innerText){
        var splited_text = items[i].innerText.split(',')
        items[i].innerText.split(',')
        for(var m=0;m < splited_text.length-1; m++ ){
          tags_array.push(splited_text[m]);
        }
      }
		  }
      if (tags && tags.length > 0){
        tags_array = tags_array.concat(tags);
      }
      var uniqueTags = tags_array.filter((v, i, a) => a.indexOf(v) === i);

      for(var j=0; j<uniqueTags.length; j++){
          $("#show_selected_tags").append('<span class="tag-class-selected">' + uniqueTags[j] + '<span class="comma-color">,</span></span>' );
      }
      
      if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
          localStorage.setItem("tags", uniqueTags);
          //console.log(localStorage.tags);
      } else {
        alert("sorry! Web Storage is not supported by browser")
      }


    },
    removeTags(){
      //console.log("removeTags");
      //console.log(this);
      var tag_class_selected = document.getElementsByClassName("tag-class-selected");
      //this.parentNode.removeChild(this);
      for(var n=0;n < tag_class_selected.length;n++){
        tag_class_selected[n].addEventListener("click",function(){
        this.parentNode.removeChild(this);
      });
      }
    },
    SearchText(tag_group){
      //console.log(tag_group.name);
      var search_text=""
      var arr = []
      arr = tag_group.tag_names;
      search_text = document.getElementById("tag_group_"+tag_group.id);
      var currentFocus;
      var selected_tags = ""

      currentFocus = -1;
      search_text.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {

        /*check if the item starts with the same letters as the text field value:*/
        //if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        if (val && arr && arr[i].search(new RegExp(val, "i")) != -1) {

          var pos = arr[i].toUpperCase().indexOf(val.toUpperCase());

          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = arr[i].substr(0, pos);
          b.innerHTML += "<strong>" + arr[i].substr(pos, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(pos + val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";


          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              //search_text.value = this.getElementsByTagName("input")[0].value;
              
              selected_tags = document.getElementById("selected_tags_from_tag_group_"+tag_group.id);

              if (selected_tags.innerText.length == 0 ){
                selected_tags.innerHTML += '<span class="tag-class-selected">'+this.getElementsByTagName("input")[0].value+'<span class="comma-color">,</span></span>';
              }
              else if (selected_tags.innerText && selected_tags.innerText.search(this.getElementsByTagName("input")[0].value) == -1)
              {
                selected_tags.innerHTML += '<span class="tag-class-selected">'+this.getElementsByTagName("input")[0].value+'<span class="comma-color">,</span></span>';
              }
              //console.log(document.getElementsByClassName("tag-class-selected"));
              var tag_class_selected = document.getElementsByClassName("tag-class-selected");
              for(var n=0;n < tag_class_selected.length;n++){
                tag_class_selected[n].addEventListener("click",function(){
                this.parentNode.removeChild(this);
              });              
              }

              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }

      });

      /*execute a function presses a key on the keyboard:*/
    search_text.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != search_text) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});

      }

  },


});