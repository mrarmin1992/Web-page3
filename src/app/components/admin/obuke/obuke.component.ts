import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PrakticnaObukaService } from '../../../services/prakticna-obuka.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';

import { Prakticne } from 'src/app/models/Prakticne';
import { KategorijaKurs } from 'src/app/models/KategorijaKurs';

@Component({
  selector: 'app-obuke',
  templateUrl: './obuke.component.html',
  styleUrls: ['./obuke.component.css']
})
export class ObukeComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<Prakticne>;
  pretraga = '';
  selected = 'Sve praktične obuke';
  filter: Prakticne[] = [];
  obuke: Prakticne[];
  kategorije: KategorijaKurs[];

  constructor(private cds: ComfirmationDialogService,
              private fm: FlashMessagesService,
              private obukeService: PrakticnaObukaService,
              private kategorijeService: KategorijeKurseviService) { }

  ngOnInit(): void {
    this.obukeService.getObuke().subscribe(obuke => {
      this.obuke = obuke;
    });
    this.kategorijeService.getKategorijeKursevi().subscribe(kategorije => {
      this.kategorije = kategorije;
    })
  }
  onChange() {
    this.obukeService.getByKategorija(this.selected).subscribe(obuke => {
      this.obuke = obuke;
    });
  }
  pretrazi() {
    if (this.pretraga === '') {this.obukeService.getObuke().subscribe(obuke => {
      this.obuke = obuke;
    }); } else {
      this.obukeService.getObuke().subscribe(obuke => {
        this.obuke = obuke;
        this.filter = this.obuke.filter((obuka: Prakticne) => obuka.Naslov.toLowerCase().includes(this.pretraga.toLowerCase()));
        this.obuke = this.filter;
      });
    }
  }
  onDeleteClick(obuka: Prakticne) {
    this.cds.confirm('Pažnja', `Jeste li sigurni da želite obrisati praktičnu obuku ${obuka.Naslov} ?`)
    .then(confirmed => {
      if (confirmed === false) {
        this.fm.show('Praktična obuka je uspješno obrisana', {cssClass: 'alert-success', timeout: 3000});
        this.obukeService.deleteObuka(obuka);
      }
    });
  }
  checkValue(id: string, aktivan: boolean) {
    this.itemDoc = this.obukeService.getObukaValue(id);
    this.itemDoc.update({Aktivan: aktivan})
    .then(() => {
      console.log('Document successfully updated!');
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
  }
}
