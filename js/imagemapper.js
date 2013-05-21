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
            $("#msm_image_accordiondiv-"+idNumber).accordion();
//            $(".ui-dialog-titlebar-close").hide(); // disabling the close button
////            $("#msm_imagemapper_highlighted-"+idNumber).val(ed.selection.getContent({
////                format : 'text'
////            }));
////            initInfoEditor(idNumber);
        },
        modal:true,
        autoOpen: false,
        height: dHeight,
        width: dWidth,
        closeOnEscape: false
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
