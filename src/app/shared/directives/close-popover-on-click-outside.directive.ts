import { Directive, Input, HostListener } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[closePopoverOnClickOutside]'
})
export class ClosePopoverOnClickOutsideDirective {

  constructor() { }
  private active = false;

  @Input('closePopoverOnClickOutside') private popover: NgbPopover;

  @HostListener('document:click', ['$event.target'])
  private docClicked(target): void {
    if (!this.popover.isOpen()) {
      this.active = false;
    } else {
      // Click that opens popover triggers this. Ignore first click.
      if (!this.active) {
        this.active = true;
      } else {

        let cancelClose = false;
        const popoverWindows = document.getElementsByTagName('ngb-popover-window');

        for (let i = 0; i < popoverWindows.length; i++) {
          cancelClose = cancelClose || popoverWindows[i].contains(target);
        }
        if (!cancelClose) {
          this.popover.close();
        }

        // Deactivate if something else closed popover
        this.active = this.popover.isOpen();
      }
    }
  }

}
