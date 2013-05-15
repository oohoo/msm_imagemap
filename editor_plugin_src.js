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
                else if(type[1] == "imagemapper")
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
                if(ed.selection.getContent())
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
    var dialogwhole = document.createElement('div');
    var dialogForm = document.createElement('form');
    var dialogFormContainer = document.createElement('div');
    var selectedTextlabel = document.createElement('label');
    var selectedTextValue = document.createTextNode('Selected Text : ');
    var selectedTextInput = document.createElement('input');
    
    var selectTypeLabel = document.createElement('label');
    var selectTypeText = document.createTextNode('Imagemapper Type : ');
    var selectTypeMenu = document.createElement('select');
    
    var selectTypeOption1 = document.createElement('option');
    selectTypeOption1.value = "Information";
    var selectTypeOption1Value = document.createTextNode('Information');
    var selectTypeOption2 = document.createElement('option');
    selectTypeOption2.setAttribute("value", "External Link");
    var selectTypeOption2Value = document.createTextNode('External Link');
    var selectTypeOption3 = document.createElement('option');
    selectTypeOption3.setAttribute("value", "Internal Reference");
    var selectTypeOption3Value = document.createTextNode('Internal Reference');
    var selectTypeOption4 = document.createElement('option');
    selectTypeOption4.setAttribute("value", "External Reference");
    var selectTypeOption4Value = document.createTextNode('External Reference');
    
    var selectedNode = null;
    
    if($.browser.msie)
    {
        selectedNode = ed.selection.getNode().childNodes[0].tagName;
    }
    else
    {
        selectedNode = ed.selection.getNode().tagName;
    }
    
    selectTypeOption1.setAttribute("selected", "selected");
    
    selectTypeOption1.appendChild(selectTypeOption1Value);
    selectTypeOption2.appendChild(selectTypeOption2Value);
    selectTypeOption3.appendChild(selectTypeOption3Value);
    selectTypeOption4.appendChild(selectTypeOption4Value);
    
    var dialogContentForm = document.createElement('div');
    var dialogButtonContainer = document.createElement('div');
    var saveButton = document.createElement('input');
    var cancelButton = document.createElement('input');
    
    if(isSub != '')
    {
        if(selectedNode != 'A')
        {
            container = document.createElement("div");
            idNumber = isExistingIndex(idNumber+"-1");
            
            container.id = 'msm_imagemapper_container-'+idNumber;
            container.className = 'msm_imagemapper_containers';
             
            var parentDiv = findParentDiv(isSub);
            $(parentDiv).append(container);
        }
        else
        {
            var wordId = '';            
            if($.browser.msie)
            {
                wordId = ed.selection.getNode().childNodes[0].id;
            }
            else
            {
                wordId = ed.selection.getNode().id;
            }
            
            var pattern = /([A-Za-z]*?)(\d+)((?:-\d+)*)/;
            
            var editorIdInfo = ed.editorId.split("-");   
            
            var idReplacement = replaceIdEnding(ed, editorIdInfo);            
            
            var wordIdInfo = wordId.split("-");           
            var oldString = '';
            for(var i = 1; i < wordIdInfo.length-2; i++)
            {
                oldString += wordIdInfo[i]+"-";
            }  
            oldString += wordIdInfo[wordIdInfo.length-2];
            
            idNumber = oldString.replace(pattern, "$1"+idReplacement+"$3");   
            
            container = document.getElementById('msm_imagemapper_container-'+idNumber);
        }
    }
    else
    {
        container = document.getElementById('msm_imagemapper_container-'+idNumber);
    }    
            
    dialogwhole.id = 'msm_imagemapper-'+idNumber;
    container.setAttribute("title", "Create Imagemapper");
        
    dialogForm.id = 'msm_imagemapper_form-'+idNumber;
        
    dialogFormContainer.className = "msm_imagemapper_form_container";
        
    selectedTextlabel.setAttribute("for",'msm_imagemapper_highlighted-'+idNumber);
    selectedTextlabel.appendChild(selectedTextValue);
        
    selectedTextInput.id = 'msm_imagemapper_highlighted-'+idNumber;
    selectedTextInput.name = 'msm_imagemapper_highlighted-'+idNumber;
    selectedTextInput.setAttribute("disabled", "disabled");
        
    selectTypeLabel.setAttribute("for", 'msm_imagemapper_select-'+idNumber);
    selectTypeLabel.appendChild(selectTypeText);
        
    selectTypeMenu.id = 'msm_imagemapper_select-'+idNumber;
    selectTypeMenu.name = 'msm_imagemapper_select-'+idNumber;
    selectTypeMenu.onchange = function(event) {
        changeForm(event, ed, idNumber);
    };
        
    dialogContentForm.id = 'msm_imagemapper_content_form_container-'+idNumber;
    dialogContentForm.className = "msm_imagemapper_content_form_containers";
        
    dialogButtonContainer.className = 'msm_imagemapper_button_container';
        
    saveButton.setAttribute("type", "button");
    saveButton.id = 'msm_imagemapper_submit-'+idNumber;
    saveButton.className = 'msm_imagemapper_button';
    saveButton.setAttribute("value", "Save");
    saveButton.onclick = function() {
        submitSubForm(ed, idNumber, isSub);
    };
        
    cancelButton.setAttribute("type", "button");
    cancelButton.id = 'msm_imagemapper_cancel-'+idNumber;
    cancelButton.className = 'msm_imagemapper_button';
    cancelButton.setAttribute("value", "Cancel");
    cancelButton.onclick = function() {
        closeSubFormDialog(idNumber);
    };
    
    var infoForm = makeInfoForm(ed, idNumber);
    dialogContentForm.appendChild(infoForm);
    
    selectTypeMenu.appendChild(selectTypeOption1);
    selectTypeMenu.appendChild(selectTypeOption2);
    selectTypeMenu.appendChild(selectTypeOption3);
    selectTypeMenu.appendChild(selectTypeOption4);
        
    dialogButtonContainer.appendChild(saveButton);
    dialogButtonContainer.appendChild(cancelButton);
        
    dialogFormContainer.appendChild(selectedTextlabel);
    dialogFormContainer.appendChild(selectedTextInput);
    dialogFormContainer.appendChild(document.createElement('br'));
    dialogFormContainer.appendChild(document.createElement('br'));
    dialogFormContainer.appendChild(selectTypeLabel);
    dialogFormContainer.appendChild(selectTypeMenu);
    dialogFormContainer.appendChild(dialogContentForm);
        
    dialogForm.appendChild(dialogFormContainer);
    dialogForm.appendChild(document.createElement('br'));
    dialogForm.appendChild(document.createElement('br'));
    dialogForm.appendChild(dialogButtonContainer);
        
    dialogwhole.appendChild(dialogForm);
      
    // only append the new dialog form to div when it hasn't already been done
//    if(!container.hasChildNodes())
//    {
//        container.appendChild(dialogwhole);    
//    }
//    else
//    {
//        $('#msm_imagemapper_container-'+idNumber+" textarea").each(function() {
//            if(tinymce.getInstanceById($(this).attr("id")) != null)
//            {
//                tinymce.execCommand('mceFocus', false, $(this).attr("id"));
//                tinymce.execCommand('mceRemoveControl', false, $(this).attr("id"));
//            }
//        });
//        $('#msm_imagemapper_container-'+idNumber).empty();
//        container.appendChild(dialogwhole);
//    }
//    
//    if(selectedNode == "A")
//    {
//        changeSelectIndex(ed, idNumber);
//        loadPreviousData(ed, idNumber);
//    }
    
    createDialog(ed, idNumber);
    
}

