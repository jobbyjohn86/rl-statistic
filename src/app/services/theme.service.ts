import { currentTheme as currentVizTheme, refreshTheme } from 'devextreme/viz/themes';
import { current } from 'devextreme/ui/themes'
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

const themes = ['light', 'dark'] as const;

type Theme = typeof themes[number];

function getNextTheme(theme?: Theme) {
  return themes[themes.indexOf(theme) + 1] || themes[0];
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageKey = 'app-theme';
  private themeMarker = 'theme-';

  currentTheme: Theme = window.localStorage[this.storageKey] || getNextTheme();

  public isDark = new BehaviorSubject<boolean>(this.currentTheme === 'dark');

  private getThemeStyleSheets() {
    return Array.from(document.styleSheets).filter(
      (styleSheet) => styleSheet?.href?.includes(this.themeMarker)
    );
  }


  constructor(private datePipe: DatePipe) {
    this.updateTimeBoundTheme();
  }
  
  updateTimeBoundTheme(){
    const hour = new Date().getHours();
    this.currentTheme = (hour >= 7 && hour < 19) ? 'light' : 'dark';

    // const now = new Date();
    // const time = this.datePipe.transform(now, 'shortTime');
    // if (time >= '6:00 AM' && time <= '6:00 PM') {
    //   this.currentTheme = 'light';
    // } else {
    //   this.currentTheme = 'dark';
    // }
  }

  setAppTheme(theme = this.currentTheme) {

    this.getThemeStyleSheets().forEach((styleSheet) => {
      styleSheet.disabled = !styleSheet?.href?.includes(`${this.themeMarker}${theme}`);
    });

    this.currentTheme = theme;
    this.isDark.next(this.currentTheme === 'dark');

    const regTheme = this.isFluent() ? /\.[a-z]+$/ : /\.[a-z]+\.compact$/;
    const replaceTheme = this.isFluent() ? `.${theme}` : `.${theme}.compact`;
    currentVizTheme(currentVizTheme().replace(regTheme, replaceTheme));
    refreshTheme();
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  isFluent(): boolean {
    return current().includes('fluent');
  }

  switchTheme() {
    const newTheme = getNextTheme(this.currentTheme);
    this.setAppTheme(newTheme);
    window.localStorage[this.storageKey] = newTheme;
  }
}
