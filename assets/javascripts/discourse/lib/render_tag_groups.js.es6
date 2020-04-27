
var radio_button_html_tags="";
var checkbox_html_tags="";

export default function(tag_group, selected_group_names) {
//  console.log(tag_group);
//  console.log(selected_group_names.selected_group_names.includes(tag_group.name));
//  console.log(selected_group_names.selected_group_names.length);

  if ( selected_group_names && selected_group_names.selected_group_names.length > 0 && selected_group_names.selected_group_names.includes(tag_group.name) ){
    radio_button_html_tags = ""
    for(let i = 0; i < tag_group.tag_names.length; i++ )
    {
      renderHTML(tag_group.name,true,tag_group.tag_names[i])
    }
    return radio_button_html_tags;
  }
  else
  {
    checkbox_html_tags=""
    for(let i = 0; i < tag_group.tag_names.length; i++ )
    {
      renderHTML(tag_group.name,false,tag_group.tag_names[i])
    }
    return checkbox_html_tags;
  }
}

function renderHTML(tag_group_name,bool,tag)
{
    console.log(bool);
    if(bool){
     radio_button_html_tags = radio_button_html_tags+"<input type='radio' name="+tag_group_name+" id="+tag+" ><label for="+tag+">"+tag+"</label>"
    }
    else{
     checkbox_html_tags = checkbox_html_tags+"<input type='checkbox' name="+tag_group_name+" id="+tag+" ><label for="+tag+">"+tag+"</label>"
    }
}