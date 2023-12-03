import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsServiceService {
  countries: string[] = [
    "Afghanistan","Albania","Algeria",
    "American Samoa","Andorra","Angola","Anguilla","Antarctica",
    "Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan",
    "Bahamas (the)","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda",
    "Bhutan","Bolivia (Plurinational State of)","Bonaire, Sint Eustatius and Saba","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil",
    "British Indian Ocean Territory (the)","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cabo Verde",
    "Cambodia","Cameroon","Canada","Cayman Islands (the)","Central African Republic (the)",
    "Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands (the)","Colombia",
    "Comoros (the)","Congo (the Democratic Republic of the)","Congo (the)","Cook Islands (the)",
    "Costa Rica","Croatia","Cuba","Curaçao","Cyprus","Czechia","Côte d'Ivoire","Denmark","Djibouti",
    "Dominica","Dominican Republic (the)","Ecuador","Egypt","El Salvador","Equatorial Guinea",
    "Eritrea","Estonia","Eswatini","Ethiopia","Falkland Islands (the) [Malvinas]",
    "Faroe Islands (the)","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories (the)","Gabon",
    "Gambia (the)","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada",
    "Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands",
    "Holy See (the)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia",
    "Iran (Islamic Republic of)","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan",
    "Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea (the Democratic People's Republic of)","Korea (the Republic of)","Kuwait","Kyrgyzstan",
    "Lao People's Democratic Republic (the)","Latvia","Lebanon","Lesotho","Liberia",
    "Libya","Liechtenstein","Lithuania","Luxembourg","Macao","Madagascar",
    "Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands (the)","Martinique","Mauritania","Mauritius","Mayotte","Mexico",
    "Micronesia (Federated States of)","Moldova (the Republic of)","Monaco","Mongolia","Montenegro",
    "Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal",
    "Netherlands (the)","New Caledonia","New Zealand","Nicaragua","Niger (the)","Nigeria",
    "Niue","Norfolk Island","Northern Mariana Islands (the)","Norway","Oman","Pakistan",
    "Palau","Palestine, State of","Panama","Papua New Guinea","Paraguay","Peru",
    "Philippines (the)","Pitcairn","Poland","Portugal","Puerto Rico","Qatar",
    "Republic of North Macedonia","Romania","Russian Federation (the)","Rwanda","Réunion",
    "Saint Barthélemy","Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis","Saint Lucia","Saint Martin (French part)","Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe",
    "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
    "Sint Maarten (Dutch part)","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa",
    "South Georgia and the South Sandwich Islands","South Sudan","Spain","Sri Lanka","Sudan (the)","Suriname","Svalbard and Jan Mayen",
    "Sweden","Switzerland","Syrian Arab Republic","Taiwan","Tajikistan","Tanzania, United Republic of",
    "Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands (the)", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates (the)","United Kingdom of Great Britain and Northern Ireland (the)",
    "United States Minor Outlying Islands (the)", "United States of America (the)", "Uruguay", "Uzbekistan",
    "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Virgin Islands (British)", "Virgin Islands (U.S.)",
    "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe", "Åland Islands"
  ];
  postModalObjSource = new BehaviorSubject<any>({});
  postModalObj = this.postModalObjSource.asObservable();

  linkedAccountObjSource = new BehaviorSubject<any>({});
  linkedAccountObj = this.linkedAccountObjSource.asObservable();

  friendAccountObjSource = new BehaviorSubject<any>({});
  friendAccountObj = this.friendAccountObjSource.asObservable();

  private preferredGamesObjSource = new BehaviorSubject<any>([]);
  preferredGamesObj$ = this.preferredGamesObjSource.asObservable();

  public languages: Array<{ label: string; id: number }> = [
    { label: 'Arabic', id: 1 },
    { label: 'Bengali', id: 2 },
    { label: 'ChineseMandarin', id: 3 },
    { label: 'English', id: 4 },
    { label: 'French', id: 5 },
    { label: 'German', id: 6 },
    { label: 'Gujarati', id: 7 },
    { label: 'Hausa', id: 8 },
    { label: 'Hindi', id: 9 },
    { label: 'Italian', id: 10 },
    { label: 'Japanese', id: 11 },
    { label: 'Javanese', id: 12 },
    { label: 'Kannada', id: 13 },
    { label: 'Korean', id: 14 },
    { label: 'Malayalam', id: 15 },
    { label: 'Marathi', id: 16 },
    { label: 'Oriya', id: 17 },
    { label: 'Portuguese', id: 18 },
    { label: 'Punjabi', id: 19 },
    { label: 'Russian', id: 20 },
    { label: 'Spanish', id: 21 },
    { label: 'Swahili', id: 22 },
    { label: 'Tamil', id: 23 },
    { label: 'Telugu', id: 24 },
    { label: 'Urdu', id: 25 },
    { label: 'Turkish', id: 26 },
  ];


constructor() { }
  setlinkedAccountObj(obj: any) {
    this.linkedAccountObjSource.next(obj);
  }

  getCountries(){
    return this.countries;
  }

  setFriendAccountObj(obj: any) {
    this.friendAccountObjSource.next(obj);
  }

  setPreferredGamesObj(obj: any) {
    this.preferredGamesObjSource.next(obj);
  }

}
