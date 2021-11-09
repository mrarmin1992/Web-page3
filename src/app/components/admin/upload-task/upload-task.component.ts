import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ToolbarService, LinkService, ImageService,
  HtmlEditorService, RichTextEditorComponent, Image } from '@syncfusion/ej2-angular-richtexteditor';
import { Router } from '@angular/router';

import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';
import { PublikacijeService } from '../../../services/publikacije.service';

import { Publikacija } from '../../../models/Publikacija';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class UploadTaskComponent implements OnInit {
  @ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
  pub: Publikacija = {
    Naziv: '',
    Opis: '',
    Path: '',
    Url: '',
    Autor: '',
    DatumObjavljivanja: new Date().toDateString()
  };
  putanja: string;

  @Input() file: File;
  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private pubService: PublikacijeService,
              private router: Router,
              private cds: ComfirmationDialogService) { }
  rteCreated(): void {
    this.rteEle.element.focus();
  }
  ngOnInit() {
  }
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      console.log(form.invalid);
      this.cds.alert('Validacija', 'Popunite sva tražena polja');

    } else {
      this.startUpload();
      this.pub.Opis = this.value;
      this.pub.Path = this.putanja;
      this.pubService.dodajPublikacija(this.pub);
    }
}
  startUpload() {
    // The storage path
    const path = `Publikacije/${Date.now()}_${this.file.name}`;
    this.putanja = path;
    // Reference to storage bucket
    const ref = this.storage.ref(path);
    // The main task
    this.task = this.storage.upload(path, this.file);
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async () =>  {
        this.pub.Url = await ref.getDownloadURL().toPromise();
        await this.router.navigate(['/dashboard/publikacije']);
      })
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }


}
