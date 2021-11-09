import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarService, LinkService, ImageService,
  HtmlEditorService, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';

import { PrakticnaObukaService } from '../../../services/prakticna-obuka.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { MyImageService } from '../../../services/my-image.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';

import { Prakticne } from '../../../models/Prakticne';
import { KategorijaKurs } from 'src/app/models/KategorijaKurs';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-obuka-izmjena',
  templateUrl: './obuka-izmjena.component.html',
  styleUrls: ['./obuka-izmjena.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class ObukaIzmjenaComponent implements OnInit {
  @ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
  forma: FormGroup;
  id: string;
  category: string;
  selectedFile: ImageSnippet;
  obuka: Prakticne;
  selectedObj: string;
  kategorije: KategorijaKurs[];
  constructor(private router: Router,
              private route: ActivatedRoute,
              private obukeService: PrakticnaObukaService,
              private storage: AngularFireStorage,
              private kategorijeService: KategorijeKurseviService,
              private imageService: MyImageService,
              private fm: FlashMessagesService,
              private cds: ComfirmationDialogService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.obukeService.getObuka(this.id).subscribe(obuka => {
      this.obuka = obuka;
      this.selectedObj = obuka.Kategorija;
      this.value = obuka.Opis;
      const ref = this.storage.ref(`Obuke/${this.obuka.Naslov}`);
      this.obuka.Slika = ref.getDownloadURL();
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
  onSubmit({value, valid}: {value: Prakticne, valid: boolean}) {
    if (!valid) {
      console.log(valid);
    } else {
        if (this.selectedFile === undefined) {
          this.obuka.Kategorija = this.selectedObj;
          this.obuka.Opis = this.value;
          this.obukeService.updateObuka(this.obuka.Id, this.obuka);
          this.router.navigate([`/dashboard/obuke/`]);
          this.fm.show('Praktična obuka je uspješno izmjenjena', {cssClass: 'alert-success', timeout: 3000});
        } else {
          this.obuka.Kategorija = this.selectedObj;
          this.obuka.Opis = this.value;
          this.obukeService.updateObuka(this.obuka.Id, this.obuka);
          this.imageService.deleteImage(this.obuka.Naslov, 'Obuke');
          this.imageService.uploadImage(this.selectedFile.file, this.obuka.Naslov, 'Obuke');
          this.router.navigate([`/dashboard/obuke/`]);
          this.fm.show('Praktična obuka je uspješno izmjenjena', {cssClass: 'alert-success', timeout: 3000});
        }
    }
  }

}
