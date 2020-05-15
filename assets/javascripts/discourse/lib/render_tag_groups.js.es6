
var radio_button_html_tags="";
var checkbox_html_tags="";

export default function(tag_group, selected_group_names, show_selected_tags, class_name) {

  if ( selected_group_names && selected_group_names.length > 0 && selected_group_names.includes(tag_group.name) ){
    radio_button_html_tags = ""
    for(let i = 0; i < tag_group.tag_names.length; i++ )
    {
      renderHTML(tag_group.name,true,tag_group.tag_names[i],i,show_selected_tags,class_name.class_name)
    }
    return radio_button_html_tags;
  }
  else
  {
    checkbox_html_tags=""
    for(let i = 0; i < tag_group.tag_names.length; i++ )
    {
      renderHTML(tag_group.name,false,tag_group.tag_names[i],i,show_selected_tags,class_name.class_name)
    }
    return checkbox_html_tags;
  }
}

function renderHTML(tag_group_name,bool,tag,i,show_selected_tags,class_name)
{
    if(bool)
    {
      if(show_selected_tags.length > 0 && show_selected_tags.includes(tag))
      {
        radio_button_html_tags = radio_button_html_tags+"<label class='custom-radio'> <input class="+ class_name +" type='radio' name="+tag_group_name+" id="+tag+" value="+tag+" checked>"+tag+"</label>"
      }
      else if(show_selected_tags.length == 0)
      {
      if(i == 0)
      {
       radio_button_html_tags = radio_button_html_tags+"<label class='custom-radio'> <input class="+class_name+" type='radio' name="+tag_group_name+" id="+tag+" value="+tag+" checked>"+tag+"</label>"     
      }
      else
      {
       radio_button_html_tags = radio_button_html_tags+"<label class='custom-radio'> <input class="+class_name+" type='radio' name="+tag_group_name+" id="+tag+" value="+tag+">"+tag+"</label>"   
      }
      }
      else{
        radio_button_html_tags = radio_button_html_tags+"<label class='custom-radio'><input class="+class_name+" type='radio' name="+tag_group_name+" id="+tag+" value="+tag+" >"+tag+"</label>" 
      }

    }
    else
    {
      if(show_selected_tags.length > 0 && show_selected_tags.includes(tag))
      {
        checkbox_html_tags = checkbox_html_tags+"<label class='custom-checkbox'> <input class="+class_name+" type='checkbox' name="+tag_group_name+" id="+tag+" value="+tag+" checked>"+tag+"</label>"
      }
      else if(show_selected_tags.length == 0)
      {
        if(i==0)
        {
        checkbox_html_tags = checkbox_html_tags+"<label class='custom-checkbox'> <input class="+class_name+" type='checkbox' name="+tag_group_name+" id="+tag+" value="+tag+" checked>"+tag+"</label>"
        }
        else
        {
        checkbox_html_tags = checkbox_html_tags+"<label class='custom-checkbox'> <input class="+class_name+" type='checkbox' name="+tag_group_name+" id="+tag+" value="+tag+">"+tag+"</label>"
        }
      }
      else{
         checkbox_html_tags = checkbox_html_tags+"<label class='custom-checkbox'><input class="+class_name+" type='checkbox' name="+tag_group_name+" id="+tag+" value="+tag+" >"+tag+"</label>"
      }
    }
}