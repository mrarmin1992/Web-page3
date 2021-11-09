import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarService, LinkService, ImageService,
  HtmlEditorService, RichTextEditorComponent, Image } from '@syncfusion/ej2-angular-richtexteditor';

import { PublikacijeService } from '../../../services/publikacije.service';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { Publikacija } from '../../../models/Publikacija';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-publikacija-izmjena',
  templateUrl: './publikacija-izmjena.component.html',
  styleUrls: ['./publikacija-izmjena.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class PublikacijaIzmjenaComponent implements OnInit {
  @ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
  id: string;
  publikacija: Publikacija;

  constructor(private publikacijeService: PublikacijeService,
              private route: ActivatedRoute,
              private router: Router,
              private cds: ComfirmationDialogService,
              private fm: FlashMessagesService) { }

  rteCreated(): void {
    this.rteEle.element.focus();
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.publikacijeService.getPublikacija(this.id).subscribe(publikacija => {
      this.publikacija = publikacija;
      this.value = publikacija.Opis;
    });
  }
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      console.log(form.invalid);
      this.cds.alert('Validacija', 'Popunite sva tražena polja');

    } else {
      this.publikacija.Opis = this.value;
      console.log(this.id, this.publikacija);
      this.publikacijeService.updatePublikacija(this.id, this.publikacija);
      this.router.navigate(['/dashboard/publikacije']);
      this.fm.show('Publikacija je uspješno izmjenjena', {cssClass: 'alert-success', timeout: 3000});
    }
}
}
