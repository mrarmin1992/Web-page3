import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { DogadjajiService } from '../../../services/dogadjaji.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { MyImageService } from '../../../services/my-image.service';
import { ToolbarService, LinkService, ImageService,
   HtmlEditorService, RichTextEditorComponent, Image } from '@syncfusion/ej2-angular-richtexteditor';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';

import { Dogadjaj } from 'src/app/models/Dogadjaj';
import { KategorijaKurs } from '../../../models/KategorijaKurs';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-dogadjaj-add',
  templateUrl: './dogadjaj-add.component.html',
  styleUrls: ['./dogadjaj-add.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class DogadjajAddComponent implements OnInit {
  selectedFile: ImageSnippet;
  kategorije: KategorijaKurs[];
  selectedObj = 'Odaberite kategoriju';
  constructor(private cds: ComfirmationDialogService,
              private fm: FlashMessagesService,
              private imageService: MyImageService,
              private kategorijeKurseviService: KategorijeKurseviService,
              private dogadjajiService: DogadjajiService,
              private router: Router) { }
@ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
  dogadjaj: Dogadjaj = {
    Naslov: '',
    Opis: '',
    Kategorija: '',
    DatumObjave: new Date(),
    DatumPocetka: new Date(),
    VrijemePocetka: '',
    Objava: ''
  };
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];

    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }
    rteCreated(): void {
      this.rteEle.element.focus();
  }
  ngOnInit(): void {
    this.kategorijeKurseviService.getKategorijeKursevi().subscribe(kategorije => {
      this.kategorije = kategorije;
    });
  }
  onSubmit(form: NgForm): void {
    if (form.invalid || this.selectedObj === 'Odaberite kategoriju') {
      console.log(form.invalid);
      console.log(this.selectedObj);
      this.cds.alert('Validacija', 'Popunite sva tražena polja');

    } else {
      this.dogadjaj.Kategorija = this.selectedObj;
      this.dogadjaj.Opis = this.rteEle.value;
      this.dogadjajiService.dodajDogadjaj(this.dogadjaj);
      this.router.navigate([`dashboard/dogadjaji`]);
      if (this.selectedFile.file !== null) {
        this.imageService.uploadImage(this.selectedFile.file, this.dogadjaj.Naslov, 'Dogadjaji');
      }
      this.fm.show('Događaj je uspješno kreiran', {cssClass: 'alert-success', timeout: 3000});
    }
}
}
