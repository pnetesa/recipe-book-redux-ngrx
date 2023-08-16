import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown2]'
})
export class Dropdown2Directive {
  @HostBinding('class.open')
  public isOpen = false;

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  public toggleOpen(event: Event) {
    this.isOpen = this.elementRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
}
