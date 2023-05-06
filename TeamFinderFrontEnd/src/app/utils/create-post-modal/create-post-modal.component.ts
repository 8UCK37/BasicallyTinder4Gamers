import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';
import { UtilsServiceService } from '../utils-service.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { first} from 'rxjs/internal/operators/first';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.css']
})
export class CreatePostModalComponent implements OnInit {
  public userInfo:any;
  public userparsed:any;
  public imageBlobs:any[]=[];
  public imageSrcs: string[] = [];
  public formData: any;
  public tagList = [];
  public modalRef?: BsModalRef;
  selectImage:any;
  modalData?:any;

  @ViewChild('imageInput') imageInput!:ElementRef;
  @ViewChild('textInput') textInput!:ElementRef;
  @ViewChild('modal') modal!:TemplateRef<any>;
  isOpen:boolean = false;
  desc: any;
  textObj: any;

  constructor(private modalService: BsModalService , public userService: UserService , public utilsServiceService : UtilsServiceService) { }

  ngOnInit() {
    this.userService.userCast.subscribe((usr:any)=>{
      //console.log("user data" , usr)
      this.userparsed = usr;
      this.userInfo = usr;
      if(this.userparsed!=null){
      }

    })

    this.modalService.onHide.pipe(take(1)).subscribe(()=>{
      // alert("close")
      // this.utilsServiceService.modalObjSource.next({open:false })
      this.isOpen = false
    })

    this.utilsServiceService.modalObj.subscribe((modalData:any)=>{
      if(modalData.data){
        this.modalData =  modalData.data
        this.desc=  modalData.data.description
        this.imageSrcs=modalData.data.photoUrlArr
        console.log(this.imageSrcs)
        console.log(modalData, this.modalData)
      }

      if( modalData.open){
        this.openModal(this.modal )
        this.isOpen = true
      }
    })


  }
  ngAfterViewInit(){
    console.log(this.imageInput)
 }

  adjustHeight(e:any){
    e.target.style.height = "5px";
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

  onFileSelected(event: any): void {
    const files: File[] = event.target.files;
    console.log(this.imageSrcs , files)

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        this.imageBlobs.push(files[i])
        reader.onload = e => this.imageSrcs.push(reader.result as string);
        reader.readAsDataURL(files[i]);
      }
    }
    event.target.value = ''
  }

  clearImages(): void {
    this.imageSrcs = [];
    this.imageBlobs = [];
    // this.imageInput.nativeElement.value ='';
  }

  removeImage(index: number): void {
    this.imageSrcs.splice(index, 1);
    this.imageBlobs.splice(index, 1);
    // this.imageInput.nativeElement.value ='';
  }

  uploadPostFile(){
    // console.error("click"  ,this.imageInput)
    this.formData = new FormData();
    if(this.imageSrcs && this.imageSrcs.length != 0){
      //console.log("not null")
      // let type = this.imageInput.nativeElement.files[0].type
    // if(type != "image/jpeg" && type != "image/jpg"){
    //   alert("wrong image type please upload jpg or Jpeg")
    //   return
    // }
    }
    // const textareaElement = document.getElementById("message-text") as HTMLTextAreaElement;
    // const text = textareaElement.value;
    //console.log(this.input.nativeElement.files);
    for(let i=0;i< this.imageBlobs.length;i++){
      this.formData.append("post", this.imageBlobs[i]);

    }
    //console.log(this.imageBlobs)
    this.formData.append("data" , JSON.stringify({data : this.tagList,desc: this.textObj}))
    axios.post('/createPost', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
    }).catch(err =>console.log(err))
    //console.log(this.input)
    //console.log(this.formData.data)
    this.tagList = [];
    //console.log(this.tagList)
    this.clearImages()
    this.isOpen = false
    // textareaElement.value=''
    this.utilsServiceService.modalObjSource.next({open:false})
    this.closeModal(this.modal)
    // this.ngOnInit()
    this.imageBlobs=[]
    setTimeout(() => {
      // this.fetchLatestPost();
    }, 1500);
  }
  openModal(template: TemplateRef<any>) {
    console.log("open")
    this.modalRef = this.modalService.show(template,
      //  Object.assign({}, { class: 'gray modal-xl' })
      );
  }

  closeModal(template: TemplateRef<any>){
    this.modalService.hide()
    this.isOpen = false
  }

  update(data:any){
    console.log(data)
    this.textObj = data
  }
}
