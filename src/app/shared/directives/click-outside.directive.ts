import { Directive, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<MouseEvent>();
  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const baseElement = this.elementRef.nativeElement as HTMLElement;
    if (targetElement && (baseElement.innerHTML.indexOf(targetElement.innerHTML) === -1)) {

      this.appClickOutside.emit(event);
    }
  }

}
