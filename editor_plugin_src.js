/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function() {
    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('imagemapper');

    tinymce.create('tinymce.plugins.ImagemapperPlugin', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init : function(ed, url) {
            // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceImagemapper');
                       
            ed.addCommand('mceImagemapper', function() {
                var idNumber;
                var indexNumber;
                var lasttype;
                var subFlag = ''; // to determine if the imagemapper plugin was activated by another imagemapper plugin editor
                
                var type = ed.editorId.split("_");
                
                idNumber= ed.editorId.split("-");
                
                if(type[1] == "theorem")
                {
                    if(type[2] == "content")
                    {
                        indexNumber = "statementtheoremcontent"
                    }
                    else if(type[2] == "part")
                    {
                        indexNumber = "parttheoremcontent"
                    }
                }
                else if(type[1] == "info")
                {
                    indexNumber = "infocontent";
                }
                else if(type[1] == "subordinate")
                {
                    var tempString = '';
                    for(var i=1; i < idNumber.length-1; i++)
                    {
                        tempString += idNumber[i] + "-";
                    }
                    
                    tempString += idNumber[idNumber.length-1];
                    
                    subFlag = tempString;
                    
                    lasttype = type[2].split("-");

                    indexNumber = type[1]+lasttype[0];
                }
                    
                else
                {
                    lasttype = type[2].split("-");

                    indexNumber = type[1]+lasttype[0];
                }
                                
                for(var i=1; i < idNumber.length-1; i++)
                {
                    indexNumber += idNumber[i] + "-";
                }
                    
                indexNumber += idNumber[idNumber.length-1];
                                
                makeImagemapperDialog(ed, indexNumber, subFlag);
               
            });

            // Add a node change handler, when no content is selected, the button is disabled,
            // otherwise, the button is enabled.
            ed.onNodeChange.add(function(ed, cm, n) {
                var selected = ed.selection.getNode().tagName;                
                
                if(selected == "IMG")
                {
                    cm.setDisabled('imagemapper', false);
                }
                else
                {
                    cm.setActive('imagemapper', false);
                    cm.setDisabled('imagemapper', true);
                }             
            });
            
            // Register imagemapper button
            ed.addButton('imagemapper', {
                title : 'imagemapper.desc',
                cmd : 'mceImagemapper',
                image : url + '/img/imagemapper.png'
            });
            
        },

        /**
         * Creates control instances based in the incomming name. This method is normally not
         * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
         * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
         * method can be used to create those.
         *
         * @param {String} n Name of the control to create.
         * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
         * @return {tinymce.ui.Control} New control instance or null if no control was created.
         */
        createControl : function(n, cm) {
            return null;
        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo : function() {
            return {
                longname : 'Imagemapper plugin',
                author : 'Ga Young Kim',
                authorurl : 'http://ualberta.ca ',
                infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/imagemapper',
                version : "1.0"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('imagemapper', tinymce.plugins.ImagemapperPlugin);
})();

function makeImagemapperDialog(ed, idNumber, isSub)
{
    var container = null;
    
    var selected = null;
    
    if($.browser.msie)
    {
        selected = ed.selection.getNode().childNodes[0];
    }
    else
    {
        selected = ed.selection.getNode();
    }
   
    container = document.getElementById('msm_imagemapper_container-'+idNumber);
    
    if(container)
    {
        $('#msm_imagemapper_container-'+idNumber+" textarea").each(function() {
            if(tinymce.getInstanceById($(this).attr("id")) != null)
            {
                tinymce.execCommand('mceFocus', false, $(this).attr("id"));
                tinymce.execCommand('mceRemoveControl', false, $(this).attr("id"));
            }
        });
        
        $("#msm_imagemapper_container-"+idNumber).empty().remove();     
    }
    
    var  parent = findImgParentDiv(idNumber);
            
    container = $("<div id='msm_imagemapper_container-"+idNumber+"' class='msm_imagemapper_containers'></div>");
            
    $(container).attr("title", "Create Imagemapper");
    
    var imageMapForm = $("<form id='msm_imagemap_form'></form>");
    
    var imageDiv = $("<div id='msm_image_div-"+idNumber+"' class='msm_image_divs'></div>");
    
    var imageAccordion = $("<div id='msm_image_accordiondiv-"+idNumber+"' class='msm_image_accordiondivs'></div>");
    
    $(selected).clone().appendTo(imageDiv);  
   
    
    $(imageMapForm).append(imageDiv);
    $(imageMapForm).append(imageAccordion);
    $(container).append(imageMapForm);
     
    $(parent).append(container); 
    
    $("#msm_image_inline"+idNumber).change(function() {
        if(this.checked)
        {
            $("#msm_image_align_selection-"+idNumber).removeAttr("disabled");
        }
        else
        {
            $("#msm_image_align_selection-"+idNumber).attr("disabled", "disabled");
        }
    });
    
    makeAccordion(selected, idNumber);
    addImgButton(idNumber);

    createImgDialog(ed, idNumber);

    
}

