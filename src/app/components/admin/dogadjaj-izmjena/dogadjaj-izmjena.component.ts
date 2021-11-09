import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarService, LinkService, ImageService,
  HtmlEditorService, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';

import { DogadjajiService } from '../../../services/dogadjaji.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { MyImageService } from '../../../services/my-image.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';

import { Dogadjaj } from '../../../models/Dogadjaj';
import { KategorijaKurs } from 'src/app/models/KategorijaKurs';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-dogadjaj-izmjena',
  templateUrl: './dogadjaj-izmjena.component.html',
  styleUrls: ['./dogadjaj-izmjena.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class DogadjajIzmjenaComponent implements OnInit {
  @ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
  forma: FormGroup;
  id: string;
  category: string;
  selectedFile: ImageSnippet;
  dogadjaj: Dogadjaj;
  selectedObj: string;
  kategorije: KategorijaKurs[];
  constructor(private router: Router,
              private route: ActivatedRoute,
              private dogadjajiService: DogadjajiService,
              private storage: AngularFireStorage,
              private kategorijeService: KategorijeKurseviService,
              private imageService: MyImageService,
              private fm: FlashMessagesService,
              private cds: ComfirmationDialogService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.dogadjajiService.getDogadjaj(this.id).subscribe(dogadjaj => {
      this.dogadjaj = dogadjaj;
      this.selectedObj = dogadjaj.Kategorija;
      this.value = dogadjaj.Opis;
      const ref = this.storage.ref(`Dogadjaji/${this.dogadjaj.Naslov}`);
      this.dogadjaj.Slika = ref.getDownloadURL();
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
  onSubmit({value, valid}: {value: Dogadjaj, valid: boolean}) {
    if (!valid) {
      console.log(valid);
    } else {
        if (this.selectedFile === undefined) {
          this.dogadjaj.Kategorija = this.selectedObj;
          this.dogadjaj.Opis = this.value;
          this.dogadjajiService.updateDogadjaj(this.dogadjaj.Id, this.dogadjaj);
          this.router.navigate([`/dashboard/dogadjaji/`]);
          this.fm.show('Događaj je uspješno izmjenjen', {cssClass: 'alert-success', timeout: 3000});
        } else {
          this.dogadjaj.Kategorija = this.selectedObj;
          this.dogadjaj.Opis = this.value;
          this.dogadjajiService.updateDogadjaj(this.dogadjaj.Id, this.dogadjaj);
          this.imageService.deleteImage(this.dogadjaj.Naslov, 'Dogadjaji');
          this.imageService.uploadImage(this.selectedFile.file, this.dogadjaj.Naslov, 'Dogadjaji');
          this.router.navigate([`/dashboard/dogadjaji/`]);
          this.fm.show('Događaj je uspješno izmjenjen', {cssClass: 'alert-success', timeout: 3000});
        }
    }
  }
}
