import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  private isOpen = false;
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('click')
  public toggleOpen() {
    if (this.isOpen){
      this.renderer.removeClass(this.elementRef.nativeElement, 'open')
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, 'open')
    }
    this.isOpen = !this.isOpen;
  }
}
