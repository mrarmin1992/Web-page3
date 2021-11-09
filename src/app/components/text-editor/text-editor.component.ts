import { Component, OnInit, ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';

// tslint:disable-next-line: max-line-length
import { ToolbarService, LinkService, ImageService, HtmlEditorService, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class TextEditorComponent {
  @ViewChild('fromRTE')
  private rteEle: RichTextEditorComponent;
  public value: string = null;
    rteCreated(): void {
      this.rteEle.element.focus();
  }
  onSubmit(form: NgForm): void {
    console.log(this.value);
  }
  constructor() {
}
}
