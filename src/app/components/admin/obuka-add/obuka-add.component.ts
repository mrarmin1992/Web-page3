import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { PrakticnaObukaService } from '../../../services/prakticna-obuka.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { MyImageService } from '../../../services/my-image.service';
import { ToolbarService, LinkService, ImageService,
   HtmlEditorService, RichTextEditorComponent, Image } from '@syncfusion/ej2-angular-richtexteditor';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';

import { Prakticne } from 'src/app/models/Prakticne';
import { KategorijaKurs } from '../../../models/KategorijaKurs';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-obuka-add',
  templateUrl: './obuka-add.component.html',
  styleUrls: ['./obuka-add.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class ObukaAddComponent implements OnInit {
  selectedFile: ImageSnippet;
  kategorije: KategorijaKurs[];
  selectedObj = 'Odaberite kategoriju';
  constructor(private cds: ComfirmationDialogService,
              private fm: FlashMessagesService,
              private imageService: MyImageService,
              private kategorijeKurseviService: KategorijeKurseviService,
              private obukaService: PrakticnaObukaService,
              private router: Router) { }

  @ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
  obuka: Prakticne = {
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
      this.obuka.Kategorija = this.selectedObj;
      this.obuka.Opis = this.rteEle.value;
      this.obukaService.dodajObuku(this.obuka);
      this.router.navigate([`dashboard/obuke`]);
      if (this.selectedFile.file !== null) {
        this.imageService.uploadImage(this.selectedFile.file, this.obuka.Naslov, 'Obuke');
      }
      this.fm.show('Praktična obuka je uspješno kreirana', {cssClass: 'alert-success', timeout: 3000});
    }
}
}
