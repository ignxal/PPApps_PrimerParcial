import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor() {}

  private showOverlay = new BehaviorSubject(false);
  public currentOverlayState = this.showOverlay.asObservable();
  private showLoading = new BehaviorSubject(false);
  public currentLoadingState = this.showLoading.asObservable();

  updateOverlayState(state: boolean) {
    this.showOverlay.next(state);
  }

  updateLoadingState(state: boolean) {
    this.showLoading.next(state);
  }
}
