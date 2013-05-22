var _imgindex = 0;

function createImgDialog(ed, idNumber)
{
    // to fix the dialog window size to 80% of window size
    var wWidth = $(window).width();
    var wHeight = $(window).height();
                
    var dWidth = wWidth*0.6;
    var dHeight = wHeight*0.8;
                
    $('#msm_imagemapper_container-'+idNumber).dialog({
        open: function(event, ui) {
            $("#msm_image_div-"+idNumber).height(dHeight*0.30);  
            $("#msm_image_accordiondiv-"+idNumber).accordion({
                activate: function()
                {
                    initImgEditor(idNumber);
                },
                collapsible: true,
                header: "h3",
                heightStyle: "content"
            });
            $("#msm_imagemap_list-"+idNumber).menu({
                select: function(event, ui) {
                    if(ui.item[0].id == "msm_imagemap_add_trigger-"+idNumber)
                    {
                        $("#msm_image_accordiondiv-"+idNumber).hide();
                        var imagemapForm = makeNewImageMap(idNumber);
                        $(imagemapForm).show();
                    }
                }
            });
        },
        close: function() {
            if(tinymce.getInstanceById("msm_image_caption_input-"+idNumber) != null)
            {
                tinymce.execCommand('mceFocus', false, "msm_image_caption_input-"+idNumber);
                tinymce.execCommand('mceRemoveControl', false, "msm_image_caption_input-"+idNumber);
            }
        },
        modal:true,
        autoOpen: false,
        height: dHeight,
        width: dWidth
    });
    $('#msm_imagemapper_container-'+idNumber).dialog('open').css('display', 'block');
}

function findImgParentDiv(idEnding)
{
    //    console.log("findParentDiv idEnding: "+idEnding);
    
    var parent = null;
    var matchInfo = null;
    var typeId = null;
    
    var defPattern = /^\S*(defcontent\d+\S*)$/;
    var defrefPattern = /^\S*(defrefcontent\d+\S*)$/;
    var statementTheoremPattern = /^\S*(statementtheoremcontent\d+\S*)$/;
    var statementTheoremRefPattern = /^\S*(theoremrefcontent\d+\S*)$/;
    var partTheoremPattern = /^\S*(parttheoremcontent\d+\S*)$/;
    var partTheoremRefPattern = /^\S*(theoremrefpart\d+\S*)$/;
    var commentPattern = /^\S*(commentcontent\d+\S*)$/;
    var commentrefPattern = /^\S*(commentrefcontent\d+\S*)$/;
    var bodyPattern = /^\S*(bodycontent\d+\S*)$/;
    var introPattern = /^\S*(introcontent\d+\S*)$/;
    var introChildPattern = /^\S*(introchild\d+\S*)$/;
    var extraInfoPattern = /^\S*(extracontent\d+\S*)$/;
    var associatePattern = /^\S*(infocontent\d+\S*)$/;
    
    var defmatch = idEnding.match(defPattern);
    var defrefmatch = idEnding.match(defrefPattern);
    var statementmatch = idEnding.match(statementTheoremPattern);
    var statementrefmatch = idEnding.match(statementTheoremRefPattern);
    var partmatch = idEnding.match(partTheoremPattern);
    var partrefmatch = idEnding.match(partTheoremRefPattern);
    var commentmatch = idEnding.match(commentPattern);
    var commentrefmatch = idEnding.match(commentrefPattern);
    var bodymatch = idEnding.match(bodyPattern);
    var intromatch = idEnding.match(introPattern);
    var introchildmatch = idEnding.match(introChildPattern);
    var extracontentmatch = idEnding.match(extraInfoPattern);
    var associatematch = idEnding.match(associatePattern);
    
    // parent needs to be whatever div contains the object in 
    // msm_subordinate_result_containers class (usually the 
    // copied_msm_structural_elements class)
    
    if(defmatch)
    {
        matchInfo = defmatch[0].split("-");
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");
        parent = document.getElementById("copied_msm_def-"+typeId);
    }
    if(defrefmatch)
    {
        matchInfo = defrefmatch[0].split("-");    
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");  
        typeId += "-"+matchInfo[1]+"-"+matchInfo[2];
        
        parent = document.getElementById("copied_msm_defref-"+typeId);
    }
    else if(commentmatch)
    {
        matchInfo = commentmatch[0].split("-");        
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");       
        parent = document.getElementById("copied_msm_comment-"+typeId);
    }
    else if(commentrefmatch)
    {
        matchInfo = commentrefmatch[0].split("-");    
        typeId = matchInfo[0].replace(/([A-Za-z]*-?)(\d+)/, "$2");       
        typeId += "-"+matchInfo[1]+"-"+matchInfo[2];
        
        parent = document.getElementById("copied_msm_commentref-"+typeId);
    }
    else if(bodymatch)
    {
        matchInfo = bodymatch[0].split("-");            
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");        
        parent = document.getElementById("copied_msm_body-"+typeId);
    }
    else if(intromatch)
    {
        matchInfo = intromatch[0].split("-");        
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");        
        parent = document.getElementById("copied_msm_intro-"+typeId);
    }
    else if(introchildmatch)
    {        
        matchInfo = introchildmatch[0].split("-");        
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");        
        parent = document.getElementById("msm_intro_child_div-"+typeId);
    }
    else if(extracontentmatch)
    {
        matchInfo = extracontentmatch[0].split("-");        
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");        
        parent = document.getElementById("copied_msm_extra_info-"+typeId);
    }
    else if(associatematch)
    {
        matchInfo = associatematch[0].split("-");    
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");       
        typeId += "-"+matchInfo[1];
        
        parent = document.getElementById("msm_associate_childs-"+typeId);
    }
    else if (statementmatch)
    {
        matchInfo = statementmatch[0].split("-");        
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");     
        
        $(".copied_msm_structural_element").each(function() {
            var currentIdInfo = this.id.split("-");
            $(this).find(".msm_imagemapper_result_containers").each(function() {
                var resultIdInfo = this.id.split("-");
                
                var resultIdEnding = resultIdInfo[1].replace(/(statementtheoremcontent)(\d+)/, "$2");
                
                if(typeId == resultIdInfo[2])
                {    
                    if(currentIdInfo[1] == resultIdEnding)
                    {                            
                        typeId = resultIdEnding;
                    }
                }
            });
        });        
        
        parent = document.getElementById("copied_msm_theorem-"+typeId);
    }
    else if(statementrefmatch)
    {
        matchInfo = statementrefmatch[0].split("-"); 
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");    
        typeId += "-"+matchInfo[1]+"-"+matchInfo[2];
        parent = document.getElementById("copied_msm_theoremref-"+typeId);
    }
    else if(partmatch)
    {
        matchInfo = partmatch[0].split("-");   
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");   
        typeId += "-"+matchInfo[1];
        parent = document.getElementById("msm_theorem_statement_container-"+typeId);
    }
    else if(partrefmatch)
    {
        matchInfo = partrefmatch[0].split("-");   
        typeId = matchInfo[0].replace(/([A-Za-z]*?)(\d+)/, "$2");   
        typeId += "-"+matchInfo[1]+"-"+matchInfo[2]+"-"+matchInfo[3];
        
        parent = document.getElementById("msm_theoremref_statement_container-"+typeId);
    }
    
    return parent;
}

function makeAccordion(selectedNode, idNumber)
{    
    var imageInfoDivTitle = $("<h3> Current Image Information </h3>");    
    var imageInfoDiv = createCurrentImageInfoDiv(selectedNode, idNumber);
    
    var desCapTitle = $("<h3> Description and Caption </h3>");
    var desCapDiv = createDesCapDiv(idNumber);
    
    var mappingTitle = $("<h3> Image Maps </h3>");
    var mappingDiv = createImageMapMenu(idNumber);
    
    $("#msm_image_accordiondiv-"+idNumber).append(imageInfoDivTitle);
    $("#msm_image_accordiondiv-"+idNumber).append(imageInfoDiv);
    
    $("#msm_image_accordiondiv-"+idNumber).append(desCapTitle);
    $("#msm_image_accordiondiv-"+idNumber).append(desCapDiv);
    
    $("#msm_image_accordiondiv-"+idNumber).append(mappingTitle);
    $("#msm_image_accordiondiv-"+idNumber).append(mappingDiv);  
}

function createCurrentImageInfoDiv(selected, idEnding)
{
    var imageInfoTopDiv = $("<div id='msm_image_infodiv-"+idEnding+"' class='msm_image_infodivs'></div>");
    
    var widthLabel = $("<label for='msm_image_width_input-"+idEnding+"'>Width: </label>");
    var heightLabel = $("<label for='msm_image_height_input-"+idEnding+"'>Height: </label>");
    var widthInput = $("<input id='msm_image_width_input-"+idEnding+"' name='msm_image_width_input-"+idEnding+"' disabled='disabled'>");
    var heightInput = $("<input id='msm_image_height_input-"+idEnding+"' name='msm_image_height_input-"+idEnding+"' disabled='disabled'>");
    
    var imgWidth = $(selected).attr("width");
    var imgHeight = $(selected).attr("height");
    
    var inlinecheckbox = $("<input type='checkbox' name='msm_image_inline"+idEnding+"' id='msm_image_inline"+idEnding+"' value='inline'>");
    var inlinecheckboxlabel = $("<label for='msm_image_inline"+idEnding+"'> Inline</label>");
    var alginLabel = $("<label for='msm_image_align_selection-"+idEnding+"'>Alignment: </label>");
    var alignSelect = $("<select id='msm_image_align_selection-"+idEnding+"' name='msm_image_align_selection-"+idEnding+"' disabled='disabled'>\n\
                            <option value='centre'>Centre</option>\n\
                            <option value='top'>Top</option>\n\
                            <option value='bottom'>Bottom</option>\n\
                        </select>");
    
    $(widthInput).val(imgWidth);
    $(heightInput).val(imgHeight);
    
    $(imageInfoTopDiv).append(widthLabel);
    $(imageInfoTopDiv).append(widthInput);
    $(imageInfoTopDiv).append("<br />");
    $(imageInfoTopDiv).append("<br />");
    $(imageInfoTopDiv).append(heightLabel);
    $(imageInfoTopDiv).append(heightInput);
    $(imageInfoTopDiv).append("<br />");
    $(imageInfoTopDiv).append("<br />");
    $(imageInfoTopDiv).append(inlinecheckbox);
    $(imageInfoTopDiv).append(inlinecheckboxlabel);
    $(imageInfoTopDiv).append("<br />");
    $(imageInfoTopDiv).append("<br />");
    $(imageInfoTopDiv).append(alginLabel);
    $(imageInfoTopDiv).append(alignSelect);  
    $(imageInfoTopDiv).append("<br />");
    
    return imageInfoTopDiv;
}

function createDesCapDiv(idEnding)
{
    var desCapTopDiv = $("<div id='msm_image_descapdiv-"+idEnding+"' class='msm_image_descapdivs'></div>");
    
    var desLabel = $("<label for='msm_image_des_input-"+idEnding+"'>Description : </label>");
    var desInput = $("<input id='msm_image_des_input-"+idEnding+"' name='msm_image_des_input-"+idEnding+"' class='msm_image_des_inputs'>");
    var captionLabel = $("<label for='msm_image_caption_input-"+idEnding+"'>Caption for the Image : </label>");
    var captionText = $("<textarea id='msm_image_caption_input-"+idEnding+"' class='msm_image_caption_inputs'></textarea>");
    
    $(desCapTopDiv).append(desLabel);
    $(desCapTopDiv).append(desInput);
    $(desCapTopDiv).append("<br />");
    $(desCapTopDiv).append("<br />");
    $(desCapTopDiv).append(captionLabel);
    $(desCapTopDiv).append(captionText);
    
    return desCapTopDiv;
}

function createImageMapMenu(idEnding)
{
    var imagemapMenuDiv = $("<div id='msm_image_mappingdiv-"+idEnding+"' class='msm_image_mappingdivs'></div>");
    
    var imagemapMenuList = $("<ul id='msm_imagemap_list-"+idEnding+"'></ul>");
    var testlist = $("<li id='msm_testlist1'><a href='#'> Test item 1 </a></li>");
    var addMapButton = $("<li id='msm_imagemap_add_trigger-"+idEnding+"'><a href='#'> (+) Add more maps </a></li>");
    
    $(imagemapMenuList).append(testlist);    
    $(imagemapMenuList).append(addMapButton);    
    $(imagemapMenuDiv).append(imagemapMenuList);
    
    return imagemapMenuDiv;
}

function initImgEditor(id)
{
    var captionid = "msm_image_caption_input-"+id;
    
    YUI().use('editor_tinymce', function(Y) {
        M.editor_tinymce.init_editor(Y, captionid, {
            mode:"exact",
            elements: captionid,
            plugins:"safari,table,style,layer,advhr,advlink,emotions,inlinepopups,subordinate,searchreplace,paste,directionality,fullscreen,nonbreaking,contextmenu,insertdatetime,save,iespell,preview,print,noneditable,visualchars,xhtmlxtras,template,pagebreak,-dragmath,-moodlenolink,-spellchecker,-moodleimage,-moodlemedia",
            width: "100%",
            height: "70%",
            theme_advanced_font_sizes:"1,2,3,4,5,6,7",
            theme_advanced_layout_manager:"SimpleLayout",
            theme_advanced_toolbar_align:"left",
            theme_advanced_fonts:"Trebuchet=Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,times new roman,times,serif;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times,serif;Verdana=verdana,arial,helvetica,sans-serif;Impact=impact;Wingdings=wingdings",
            theme_advanced_resize_horizontal:true,
            theme_advanced_resizing:true,
            theme_advanced_resizing_min_height:30,
            min_height:30,
            theme_advanced_toolbar_location:"top",
            theme_advanced_statusbar_location:"bottom",
            language_load:false,
            langrev:-1,
            theme_advanced_buttons1:"fontselect,fontsizeselect,formatselect,|,undo,redo,|,search,replace,|,fullscreen",
            theme_advanced_buttons2:"bold,italic,underline,strikethrough,sub,sup,|,justifyleft,justifycenter,justifyright,|,cleanup,removeformat,pastetext,pasteword,|,forecolor,backcolor,|,ltr,rtl",
            theme_advanced_buttons3:"bullist,numlist,outdent,indent,|,link,unlink,moodlenolink,subordinate,|,dragmath,nonbreaking,charmap,table,|,code,spellchecker",
            moodle_init_plugins:"dragmath:loader.php/dragmath/-1/editor_plugin.js,moodlenolink:loader.php/moodlenolink/-1/editor_plugin.js,spellchecker:loader.php/spellchecker/-1/editor_plugin.js,moodleimage:loader.php/moodleimage/-1/editor_plugin.js,moodlemedia:loader.php/moodlemedia/-1/editor_plugin.js",
            file_browser_callback:"M.editor_tinymce.filepicker",
            moodle_plugin_base: M.cfg.wwwroot+"/lib/editor/tinymce/plugins/"
        })
        
        M.editor_tinymce.init_filepicker(Y, id, tinymce_filepicker_options);
    });
//    
//    YUI().use('editor_tinymce', function(Y) {
//        M.editor_tinymce.init_editor(Y, contentid, {
//            mode:"exact",
//            elements: contentid,
//            plugins:"safari,table,style,layer,advhr,advlink,emotions,inlinepopups,subordinate,searchreplace,paste,directionality,fullscreen,nonbreaking,contextmenu,insertdatetime,save,iespell,preview,print,noneditable,visualchars,xhtmlxtras,template,pagebreak,-dragmath,-moodlenolink,-spellchecker,-moodleimage,-moodlemedia",
//            width: "100%",
//            height: "70%",
//            theme_advanced_font_sizes:"1,2,3,4,5,6,7",
//            theme_advanced_layout_manager:"SimpleLayout",
//            theme_advanced_toolbar_align:"left",
//            theme_advanced_fonts:"Trebuchet=Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,times new roman,times,serif;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times,serif;Verdana=verdana,arial,helvetica,sans-serif;Impact=impact;Wingdings=wingdings",
//            theme_advanced_resize_horizontal:true,
//            theme_advanced_resizing:true,
//            theme_advanced_resizing_min_height:30,
//            min_height:30,
//            theme_advanced_toolbar_location:"top",
//            theme_advanced_statusbar_location:"bottom",
//            language_load:false,
//            langrev:-1,
//            theme_advanced_buttons1:"fontselect,fontsizeselect,formatselect,|,undo,redo,|,search,replace,|,fullscreen",
//            theme_advanced_buttons2:"bold,italic,underline,strikethrough,sub,sup,|,justifyleft,justifycenter,justifyright,|,cleanup,removeformat,pastetext,pasteword,|,forecolor,backcolor,|,ltr,rtl",
//            theme_advanced_buttons3:"bullist,numlist,outdent,indent,|,link,unlink,moodlenolink,subordinate,|,image,moodlemedia,dragmath,nonbreaking,charmap,table,|,code,spellchecker",
//            moodle_init_plugins:"dragmath:loader.php/dragmath/-1/editor_plugin.js,moodlenolink:loader.php/moodlenolink/-1/editor_plugin.js,spellchecker:loader.php/spellchecker/-1/editor_plugin.js,moodleimage:loader.php/moodleimage/-1/editor_plugin.js,moodlemedia:loader.php/moodlemedia/-1/editor_plugin.js",
//            file_browser_callback:"M.editor_tinymce.filepicker",
//            moodle_plugin_base: M.cfg.wwwroot+"/lib/editor/tinymce/plugins/"
//        })
//        
//        M.editor_tinymce.init_filepicker(Y, contentid, tinymce_filepicker_options);
//    });
}

function addImgButton(id)
{
    var buttonDiv = $("<div class='msm_img_button_divs'></div>");
    
    var saveButton = $("<input type='button' id='msm_img_saveButton-"+id+"' class='msm_img_saveButtons' value='Save'>");
    var cancelButton = $("<input type='button' id='msm_img_cancelButton-"+id+"' class='msm_img_cancelButtons' value='Cancel'>");
    
    $(buttonDiv).append(saveButton);
    $(buttonDiv).append(cancelButton);
    
    $("#msm_imagemapper_container-"+id).append(buttonDiv);
    
    //    $("#msm_img_saveButton-"+id).click(function() {
    //        });
    
    $("#msm_img_cancelButton-"+id).click(function() {  
        $("<div class='dialogs msm_check_dialogs' id='msm_check_dialog-"+id+"'> Are you sure you would like to close this window? </div>").appendTo("#msm_imagemapper_container-"+id);

        if(tinymce.getInstanceById("msm_image_caption_input-"+id) != null)
        {
            tinymce.execCommand('mceFocus', false, "msm_image_caption_input-"+id);
            tinymce.execCommand('mceRemoveControl', false, "msm_image_caption_input-"+id);
        }

        $("#msm_check_dialog-"+id).dialog({
            modal: false,
            resizable: false,
            height: 200,
            buttons: {
                Yes: function() {
                    $(this).dialog("close");
                    $("#msm_imagemapper_container-"+id).dialog("close");
                },
                No: function() {
                    initImgEditor(id);

                    $(this).dialog("close");            
                }
            }           
        }); 
                
    });
}

function makeNewImageMap(idEnding)
{
    _imgindex++;
    var imagemapEnding = idEnding + "-" + _imgindex;
    
    var imagemapDiv = $("<div id='msm_imagemap_formdiv-"+imagemapEnding+"' class='msm_imagemap_formdivs'></div>");
    
    var imagemapfielset = $("<fieldset style='border:1px solid black; padding: 2%;'><legend> Image Map "+_imgindex+"</legend></fieldset>");
    var imagemapselectlabel = $("<label for='msm_image_map_select-"+imagemapEnding+"'> Select Shape: </label>");
    var imagemapselect = $("<select id='msm_image_map_select-"+imagemapEnding+"'>\n\
                                <option value='Circle'>Circle</option>\n\
                                <option value='Polygon'>Polygon</option>\n\
                                <option value='Rectangle'>Rectangle</option>\n\
                            </select>");
    
    var imagemapchangableDiv = $("<div id='msm_imagemap_changeable-"+imagemapEnding+"' class='msm_imagemap_changeables'></div>"); 
        
    $(imagemapfielset).append(imagemapselectlabel);
    $(imagemapfielset).append(imagemapselect);
    $(imagemapfielset).append(imagemapchangableDiv);
    
    $(imagemapDiv).append(imagemapfielset); 
    $("#msm_imagemap_form").append(imagemapDiv);
    
    $("#msm_image_map_select-"+imagemapEnding).change(function() {
        $("#msm_imagemap_changeable-"+imagemapEnding).empty();
        var selectvalue = $(this).find(":selected").val(); 
       
        console.log(selectvalue)
       
        if(selectvalue == "Circle")
        {
            loadCircleForm(imagemapEnding);
        }
        else if(selectvalue == "Polygon")
        {
            loadPolyForm(imagemapEnding);   
        }
        else if(selectvalue == "Rectangle")
        {
            loadRecForm(imagemapEnding);
        }
    });
    
    loadCircleForm(imagemapEnding);   
    
    return imagemapDiv;
}

function loadCircleForm(id)
{
    var circleDiv = $("<div id='msm_imagemap_circlediv-"+id+"' class='msm_imagemap_circledivs'></div>");
    
    var circlecoordheader = $("<p><h4> Center Point Coordinate <span style='font-wight:normal !important; font-size: 10px !important;'> (Click on the image to define the center point.) </span></h4>");
    var circlexlabel = $("<label for='msm_imagemap_centerx-"+id+"'>X: </label>");
    var circlexinput = $("<input id='msm_imagemap_centerx-"+id+"' name='msm_imagemap_centerx-"+id+"' class='msm_imagemap_centerxs' disabled='disabled' placeholder='0'>");
    var circleylabel = $("<label for='msm_imagemap_centery-"+id+"'>Y: </label>");
    var circleyinput = $("<input id='msm_imagemap_centery-"+id+"' name='msm_imagemap_centery-"+id+"' class='msm_imagemap_centerys' disabled='disabled' placeholder='0'>");
    
    var circleradheader = $("<h4> Distance from the Center Point </h4>");
    var circleradinput = $("<input id='msm_imagemap_radius-"+id+"' name='msm_imagemap_radius-"+id+"' class='msm_imagemap_radiuss' placeholder='Click on the image to define the second point.' disabled='disabled'>");
    
    $(circleDiv).append("<br />");
    $(circleDiv).append(circlecoordheader);
    $(circleDiv).append(circlexlabel);
    $(circleDiv).append(circlexinput);
    $(circleDiv).append("<br />");
    $(circleDiv).append(circleylabel);
    $(circleDiv).append(circleyinput);
    
    $(circleDiv).append("<br />");
    
    $(circleDiv).append(circleradheader);
    $(circleDiv).append(circleradinput);
    
    
    $("#msm_imagemap_changeable-"+id).append(circleDiv);
}

function loadPolyForm(id)
{
    // need to auto generate point forms everytime user clicks for new point
}

function loadRecForm(id)
{
    var rectDiv = $("<div id='msm_imagemap_circlediv-"+id+"' class='msm_imagemap_circledivs'></div>");
    
    var recttlcoordheader = $("<p><h4> First Point Coordinate <span style='font-wight:normal !important; font-size: 10px !important;'> (Click on the image to define the top left corner point.) </span></h4>");
    var recttlxlabel = $("<label for='msm_imagemap_topleftx-"+id+"'>X: </label>");
    var recttlxinput = $("<input id='msm_imagemap_topleftx-"+id+"' name='msm_imagemap_topleftx-"+id+"' class='msm_imagemap_topleftxs' disabled='disabled' placeholder='0'>");
    var recttlylabel = $("<label for='msm_imagemap_toplefty-"+id+"'>Y: </label>");
    var recttlyinput = $("<input id='msm_imagemap_toplefty-"+id+"' name='msm_imagemap_toplefty-"+id+"' class='msm_imagemap_topleftys' disabled='disabled' placeholder='0'>");
    
    var rectbrcoordheader = $("<p><h4> Second Point Coordinate <span style='font-wight:normal !important; font-size: 10px !important;'> (Click on the image to define the bottom right corner point.) </span></h4>");
    var rectbrxlabel = $("<label for='msm_imagemap_bottomrightx-"+id+"'>X: </label>");
    var rectbrxinput = $("<input id='msm_imagemap_bottomrightx-"+id+"' name='msm_imagemap_bottomrightx-"+id+"' class='msm_imagemap_bottomrightxs' disabled='disabled' placeholder='0'>");
    var rectbrylabel = $("<label for='msm_imagemap_bottomrighty-"+id+"'>Y: </label>");
    var rectbryinput = $("<input id='msm_imagemap_bottomrighty-"+id+"' name='msm_imagemap_bottomrighty-"+id+"' class='msm_imagemap_bottomrightys' disabled='disabled' placeholder='0'>");
    
    $(rectDiv).append("<br />");
    $(rectDiv).append(recttlcoordheader);
    $(rectDiv).append(recttlxlabel);
    $(rectDiv).append(recttlxinput);
    $(rectDiv).append("<br />");
    $(rectDiv).append(recttlylabel);
    $(rectDiv).append(recttlyinput);
    
    $(rectDiv).append("<br />");
    
    $(rectDiv).append(rectbrcoordheader);
    $(rectDiv).append(rectbrxlabel);
    $(rectDiv).append(rectbrxinput);
    $(rectDiv).append("<br />");
    $(rectDiv).append(rectbrylabel);
    $(rectDiv).append(rectbryinput);
    
    
    $("#msm_imagemap_changeable-"+id).append(rectDiv);
}