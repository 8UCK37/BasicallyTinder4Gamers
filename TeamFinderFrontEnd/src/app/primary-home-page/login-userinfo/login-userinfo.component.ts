import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService } from '../../login/user.service';
import axios from 'axios';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TitleStrategy } from '@angular/router';

interface Sexy {
  name: string;
  code: string;
}
@Component({
  selector: 'app-login-userinfo',
  templateUrl: './login-userinfo.component.html',
  styleUrls: ['./login-userinfo.component.css']
})
export class LoginUserinfoComponent implements OnInit {
  modalRef: BsModalRef<unknown> | undefined;
  @Output() childEvent = new EventEmitter();

  @ViewChild("template")
  templateref?: any

  public cardStyle?: any;

  public cardStyle2?: any;
  public modalState?: boolean
  country?: string;
  language?: string;
  genderSelect?: string;
  inpmodel: any;
  public indianStates: string[] = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas (the)",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory (the)",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands (the)",
    "Central African Republic (the)",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands (the)",
    "Colombia",
    "Comoros (the)",
    "Congo (the Democratic Republic of the)",
    "Congo (the)",
    "Cook Islands (the)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic (the)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands (the) [Malvinas]",
    "Faroe Islands (the)",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories (the)",
    "Gabon",
    "Gambia (the)",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See (the)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic (the)",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands (the)",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (the Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands (the)",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger (the)",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands (the)",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines (the)",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation (the)",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan (the)",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands (the)",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates (the)",
    "United Kingdom of Great Britain and Northern Ireland (the)",
    "United States Minor Outlying Islands (the)",
    "United States of America (the)",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands"
  ];
  public languages: string[] = ["Bengali", "Hindi", "English"]
  constructor(private modalService: BsModalService, private _elementRef: ElementRef, private auth: AngularFireAuth, private userService: UserService) {

  }
  sex: Sexy[]=[];

  selectedSex: Sexy | undefined;

  ngOnInit() {
      this.sex = [
          { name: 'Male', code: 'M' },
          { name: 'Female', code: 'F' },
          { name: 'Golu', code: 'G',}
      ];

    this.userService.userCast.subscribe(usr => {
      //console.log(usr)

      if (usr && usr.userInfoId == null) {
        // this.openModal(this.templateref)
      }
    })

  }
  ngAfterViewInit() {

  }
  openModal(template: TemplateRef<any>) {
    if (this.modalState) return
    // console.log("open")
    this.modalState = true
    this.modalRef = this.modalService.show(template);
  }
  focus(e: any, index: number) {
    console.log(index)
    if (index == 1) {
      this.cardStyle2 = []
      if (e) this.cardStyle = ["inc"]
      // else
    } else {
      this.cardStyle = []
      if (e) this.cardStyle2 = ["inc"]
      // else
    }

  }
  countrySelect(index: number) {
    // console.log(index)
    // console.log(this.states[index])
    this.country = this.indianStates[index]
    this.cardStyle2 = []
    this.cardStyle = []
  }
  userLanguageSelect(index: number) {
    this.language = this.languages[index]
    this.cardStyle = []
    this.cardStyle2 = []

  }
  closeAll(e: any) {
    // console.log("all close act" , e)
    this.cardStyle2 = []
    this.cardStyle = []
  }
  submit() {
    this.genderSelect=this.selectedSex?.name;
    console.log("close")
    this.modalState = false
    console.log(this.country, this.language, this.genderSelect)
    if (this.country == undefined || this.language == undefined || this.genderSelect == undefined) return;
    axios.post('/user/welcomepageinfo',{ data:{Gender: this.genderSelect, Country: this.country, Language: this.language}}).then(res=>{
      if(res.status==200)
      {
  this.triggerCustomEvent();
      }
    }).catch(error=> console.log(error))
    this.modalService.hide()
  }

  triggerCustomEvent() {
    console.log("hello darkness my old friend")
    this.childEvent.emit();
  }
}


