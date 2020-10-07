import { Directive, HostListener, ElementRef, OnInit } from "@angular/core";

const PADDING = "000000";

@Directive({ selector: "[numberFormatter]" })
export class NumberFormatterDirective implements OnInit {

  private el: HTMLInputElement;
  private DECIMAL_SEPARATOR: string = ".";
  private THOUSANDS_SEPARATOR: string = ",";

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.transform(this.el.value);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.parse(value); // opossite of transform
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.transform(value);
  }

  transform(value: number | string, fractionSize: number = 2): string {
    let [ integer, fraction = "" ] = (value || "").toString().split(this.DECIMAL_SEPARATOR);
    fraction = fractionSize>0? this.DECIMAL_SEPARATOR+(fraction + PADDING).substring(0, fractionSize): "";
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);
    if(integer=='' || integer=='0'){
      return '';
    } else {
      return integer + fraction;
    }
  }

  parse(value: string, fractionSize: number = 2): string {
    let [ integer, fraction = "" ] = (value || "").split(this.DECIMAL_SEPARATOR);
    integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");
    fraction = parseInt(fraction, 10)>0 && fractionSize>0? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize): "";
    return integer + fraction;
  }

}