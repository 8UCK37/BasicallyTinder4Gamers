import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { QuillEditorComponent } from "ngx-quill";

import "quill-mention";

@Component({
  selector: 'app-mention-text-input',
  templateUrl: './mention-text-input.component.html',
  styleUrls: ['./mention-text-input.component.css']
})
export class MentionTextInputComponent implements OnInit {
  name = "Angular ";
  @Output() editorChange:EventEmitter<any> =new EventEmitter();
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
        const values = [
          { id: 1, value: "Fredrik Sundqvist", age: 5 },
          { id: 2, value: "Patrik Sjölin", age: 20 }
        ];

        
        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches:any = [];

          values.forEach(entry => {
            if (
              entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              matches.push(entry);
            }
          });
          renderList(matches, searchTerm);
        }
      },
      renderItem : (item:any, searchTerm:any) =>{
        console.log(item)
        return `<img src='https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg' height=30px><span>${item.value}</span>`;
      },
    }
  };

  content = "";

  constructor() {
    
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
   
  }

 

  update() {
    this.editorChange.emit(this.editor?.quillEditor.getContents());
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


}
