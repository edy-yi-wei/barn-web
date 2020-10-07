import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { SettingsService } from '@core';
import { SessionStorageService, Constant } from '@shared';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  options = this.settings.getOptions();
  opened = false;
  userName = '';
  @Input() showToggle = true;
  @Input() showBranding = false;
  

  @Output() toggleSidenav = new EventEmitter<void>();
  // @Output() toggleSidenavNotice = new EventEmitter<void>();
  @Output() optionsEvent = new EventEmitter<object>();

  constructor(private settings: SettingsService, private sessionStorageService: SessionStorageService) {}

  ngOnInit() {
    this.userName = this.sessionStorageService.get('user-name');
  }

  openPanel() {
    this.opened = true;    
  }

  closePanel() {
    this.opened = false;
  }

  togglePanel() {
    this.opened = !this.opened;
  }

  sendOptions() {
    this.optionsEvent.emit(this.options);
  }

  logout() {
    this.sessionStorageService.clear();
    window.location.href = ''+Constant.loginUrl;
  }
}
