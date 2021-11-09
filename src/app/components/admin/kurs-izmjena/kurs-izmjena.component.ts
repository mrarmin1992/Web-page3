import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarService, LinkService, ImageService,
  HtmlEditorService, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';

import { KursService } from '../../../services/kurs.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { MyImageService } from '../../../services/my-image.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';

import { Kurs } from '../../../models/Kurs';
import { KategorijaKurs } from 'src/app/models/KategorijaKurs';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-kurs-izmjena',
  templateUrl: './kurs-izmjena.component.html',
  styleUrls: ['./kurs-izmjena.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class KursIzmjenaComponent implements OnInit {
  @ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
  forma: FormGroup;
  url: 'https://console.firebase.google.com/u/2/project/obrazovanje-odraslih/storage/obrazovanje-odraslih.appspot.com/files~2FVijesti';
  id: string;
  category: string;
  selectedFile: ImageSnippet;
  kurs: Kurs;
  selectedObj: string;
  kategorije: KategorijaKurs[];
  constructor(private router: Router,
              private route: ActivatedRoute,
              private kursService: KursService,
              private storage: AngularFireStorage,
              private kategorijeService: KategorijeKurseviService,
              private imageService: MyImageService,
              private fm: FlashMessagesService,
              private cds: ComfirmationDialogService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.kursService.getKurs(this.id).subscribe(kurs => {
      this.kurs = kurs;
      this.selectedObj = kurs.Kategorija;
      this.value = kurs.Opis;
      const ref = this.storage.ref(`Kursevi/${this.kurs.Naslov}`);
      this.kurs.Slika = ref.getDownloadURL();
    });
    this.kategorijeService.getKategorijeKursevi().subscribe(kategorije => {
      this.kategorije = kategorije;
    });
  }
  rteCreated(): void {
    this.rteEle.element.focus();
  }
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);

  }
  onSubmit({value, valid}: {value: Kurs, valid: boolean}) {
    if (!valid) {
      console.log(valid);
    } else {
        if (this.selectedFile === undefined) {
          this.kurs.Kategorija = this.selectedObj;
          this.kurs.Opis = this.value;
          this.kursService.updateKurs(this.kurs.Id, this.kurs);
          this.router.navigate([`/dashboard/kursevi/`]);
          this.fm.show('Kurs je uspješno izmjenjen', {cssClass: 'alert-success', timeout: 3000});
        } else {
          this.kurs.Kategorija = this.selectedObj;
          this.kurs.Opis = this.value;
          this.kursService.updateKurs(this.kurs.Id, this.kurs);
          this.imageService.deleteImage(this.kurs.Naslov, 'Kursevi');
          this.imageService.uploadImage(this.selectedFile.file, this.kurs.Naslov, 'Kursevi');
          this.router.navigate([`/dashboard/kursevi/`]);
          this.fm.show('Kurs je uspješno izmjenjen', {cssClass: 'alert-success', timeout: 3000});
        }
    }
  }
}
