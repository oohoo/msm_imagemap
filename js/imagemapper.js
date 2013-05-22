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
                collapsible: true,
                header: "h3",
                heightStyle: "content"
            });
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
    var mappingDiv = $("<div id='msm_image_mappingdiv-"+idNumber+"' class='msm_image_mappingdivs'></div>");
    
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
     $(desCapTopDiv).append("<br />");
    $(desCapTopDiv).append(captionText);
    
    return desCapTopDiv;
}
