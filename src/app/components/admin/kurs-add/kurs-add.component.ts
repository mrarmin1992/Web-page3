import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { KursService } from '../../../services/kurs.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { MyImageService } from '../../../services/my-image.service';
import { ToolbarService, LinkService, ImageService,
   HtmlEditorService, RichTextEditorComponent, Image } from '@syncfusion/ej2-angular-richtexteditor';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';

import { Kurs } from 'src/app/models/Kurs';
import { KategorijaKurs } from '../../../models/KategorijaKurs';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-kurs-add',
  templateUrl: './kurs-add.component.html',
  styleUrls: ['./kurs-add.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class KursAddComponent implements OnInit {
  selectedFile: ImageSnippet;
  kategorije: KategorijaKurs[];
  selectedObj = 'Odaberite kategoriju';
  constructor(private cds: ComfirmationDialogService,
              private fm: FlashMessagesService,
              private imageService: MyImageService,
              private kategorijeKurseviService: KategorijeKurseviService,
              private kursService: KursService,
              private router: Router) { }
  @ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
  kurs: Kurs = {
    Naslov: '',
    Opis: '',
    Kategorija: '',
    DatumObjave: new Date(),
    DatumPocetka: new Date(),
    Cijena: 0,
    BrojPolaznika: 0,
    Trajanje: '-',
    Objava: '',
    Aktivan: true
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
      this.kurs.Kategorija = this.selectedObj;
      this.kurs.Opis = this.rteEle.value;
      this.kursService.dodajKurs(this.kurs);
      this.router.navigate([`dashboard/kursevi`]);
      if (this.selectedFile.file !== null) {
        this.imageService.uploadImage(this.selectedFile.file, this.kurs.Naslov, 'Kursevi');
      }
      this.fm.show('Kurs je uspješno kreiran', {cssClass: 'alert-success', timeout: 3000});
    }
}
}
