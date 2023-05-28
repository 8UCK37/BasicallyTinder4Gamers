import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import axios from 'axios';
import { QuillEditorComponent } from "ngx-quill";

import "quill-mention";
import { UtilsServiceService } from '../utils-service.service';

@Component({
  selector: 'app-mention-text-input',
  templateUrl: './mention-text-input.component.html',
  styleUrls: ['./mention-text-input.component.css']
})
export class MentionTextInputComponent implements OnInit {
  searchResults: any[] = [];

  name = "Angular ";
  @Output() editorChange:EventEmitter<any> =new EventEmitter();
  @Input() data:any;
  @ViewChild(QuillEditorComponent, { static: true })
  editor?: QuillEditorComponent;

  obj:any = {
    ops: [
      { insert: "3+" },
      {
        insert: {
          mention: {
            denotationChar: "",
            id: "1",
            value: "hahahaha",
            index: 1
          }
        }
      },
      { insert: "54" }
    ]
  };

  modules = {
    toolbar: false,
    mention: {
      mentionListClass: "ql-mention-list mat-elevation-z8",
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      showDenotationChar: true,
      spaceAfterInsert: false,

      source: (searchTerm:any, renderList:any) => {
        const values = [];

          if (searchTerm.length != 0) {
          const matches:any = [];
          // values.forEach(entry => {
          //   if (
          //     entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
          //   ) {
          //     matches.push(entry);
          //   }
          // });
          this.getUsers(searchTerm).then(data=>{
            if(data.length>5){
              data.splice(5)
            }
            data.forEach((user: any) => {
              matches.push({id:user.id,value:user.name,user:user})
            });
            renderList(matches, searchTerm);
          })
          console.log(matches)
        }
      },
      renderItem : (item:any, searchTerm:any) =>{
        console.log(item)
        return `<img src=${item?.user.profilePicture} height=30px><span>${item.value}</span>`;
      },
    }
  };

  content = "";

  constructor(private utilsServiceService : UtilsServiceService) {

    this.utilsServiceService.postModalObj.subscribe((modalData:any)=>{
      console.log(modalData)
      if(modalData.data){
        // this.desc=  modalData.data.description
        console.log(modalData.data.raw)
        const waitForEditorAndSetText = () => {
          if (this.editor != null) {
            this.editor.quillEditor.setContents(JSON.parse( modalData.data.raw));

          } else {
            setTimeout(waitForEditorAndSetText.bind(this), 100); // Wait 100 milliseconds and check again
          }
        }

        waitForEditorAndSetText();

      }
    })

  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');

  }



  update() {
    this.editorChange.emit({content: this.editor?.quillEditor.getContents() ,raw: this.editor?.quillEditor.root.innerHTML});
    console.log(this.editor?.quillEditor.root.innerHTML)
  }
  getText() {
    console.log(this.editor?.quillEditor.getContents());
    // const { ops } = this.editor?.quillEditor.getContents();
    // const result = ops.reduce((acc:any, { insert }) => {
    //   if (typeof insert === "string") {
    //     acc += insert;
    //   } else {
    //     acc += insert.mention.value;
    //   }

    //   return acc;
    // }, "");

    // console.log({ result });
  }

  async getUsers(name:any){
    let searchResults:any=[];
    if(name?.length!=0){
      await axios.post('searchFriend',{searchTerm: name}).then(res=>{
        searchResults=res.data;
      }).catch(err=>console.log(err))
    }
    console.log(searchResults)
    return searchResults
  }

}
